import { useEffect, useState } from "react";
import styles from "./SecretPage.module.css";

// Configuration du voyage : modifier uniquement ces deux dates si besoin.
const DEPART = new Date("2026-06-18T09:25:00");
const RETOUR = new Date("2026-06-21T22:25:00");

const messages = [
  {
    jour: 1,
    titre: "Tu me manques déjà",
    texte:
      "Ce qui me manque, ce n'est pas seulement de te voir. C'est de pouvoir te raconter n'importe quoi, entendre ton rire et savoir que tu es juste là. J'aime tellement partager mes journées avec toi. J'en ai déjà marre de ce voyage avec mon père et mon frère, mais je me console en pensant à toi. Je t'aime. PS: ce que tu vois au-dessus, c'est la carte de mon trajet vers Bergen. PSS: regarde à gauche du classeur rouge dans ton armoire en face du lit, si tu ne l'as pas déjà vu.",
    image: "/images/secret/jour1.jpeg",
  },
  {
    jour: 2,
    titre: "Nos petits riens",
    texte:
      "Je pense à tous ces petits moments qui ne ressemblent à rien pour les autres, mais qui rendent mes journées plus belles avec toi. Un regard, une blague nulle, un câlin volé au passage. C'est fou comme les petits riens avec toi peuvent me manquer autant. Je t'aime.",
    image: "/images/secret/jour2.jpeg",
  },
  {
    jour: 3,
    titre: "Une envie de toi",
    texte:
      "Aujourd'hui, j'aurais juste aimé pouvoir te prendre dans mes bras sans raison particulière. Rester là quelques minutes, ne rien dire et profiter de toi. J'espère au moins voir de beaux paysages ici sinon je pète un câble. Bref... Alors considère ce message comme un câlin en attente de livraison. RAAAHHH je t'aime.",
    image: "/images/secret/jour3.jpeg",
  },
  {
    jour: 4,
    titre: "Bientôt toi",
    texte:
      "Je suis au bout de ma vie. Je me gratte sûrement les veines. Ton visage, ta voix, puis ce premier câlin que je compte bien faire durer beaucoup trop longtemps. Tu m'as manqué, Siloë, vraiment beaucoup. Je t'aime. On se revoit très bientôt. Fais vraiment attention à toi et profite bien de ta soirée !",
    image: "/images/secret/jour4.jpeg",
  },
];

// Suivi estimé côté client : l'avion avance entre les heures de départ et
// d'arrivée selon l'heure locale du téléphone, sans API ni backend.
const flightPlans = {
  1: {
    title: "Mon trajet vers Bergen",
    departureTime: "09:25",
    arrivalTime: "14:00",
    trackingStart: new Date("2026-06-18T09:25:00"),
    trackingEnd: new Date("2026-06-18T14:00:00"),
    mapPoints: [
      { x: 155, y: 128, label: "Nice" },
      { x: 174, y: 74, label: "Copenhague" },
      { x: 145, y: 48, label: "Bergen" },
    ],
  },
  4: {
    title: "Mon trajet vers Nice",
    departureTime: "17:40",
    arrivalTime: "22:25",
    trackingStart: new Date("2026-06-21T17:40:00"),
    trackingEnd: new Date("2026-06-21T22:25:00"),
    mapPoints: [
      { x: 145, y: 48, label: "Bergen" },
      { x: 174, y: 74, label: "Copenhague" },
      { x: 155, y: 128, label: "Nice" },
    ],
  },
};

const AVANT_DEPART =
  "Pour l'instant, le goat est encore joignable. Reviens au départ : cette page deviendra utile dès que j'aurai perdu le réseau et mes jambes. Je t'emmène avec moi dans mes pensées, mais je ne peux pas encore te montrer les paysages que je vais découvrir.";

const APRES_RETOUR =
  "Je suis rentré — ou vraiment tout près de toi. C'était sûrement superbe le voyage, mais rien ne vaut le moment de te retrouver.";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const getLocalDayTimestamp = (date) =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

const getCalendarDayDifference = (from, to) =>
  Math.floor((getLocalDayTimestamp(to) - getLocalDayTimestamp(from)) / DAY_IN_MS);

const getTimeParts = (milliseconds) => {
  const totalMinutes = Math.floor(Math.max(0, milliseconds) / (60 * 1000));

  return {
    jours: Math.floor(totalMinutes / (24 * 60)),
    heures: Math.floor((totalMinutes % (24 * 60)) / 60),
    minutes: totalMinutes % 60,
  };
};

const Countdown = ({ milliseconds, label, compact = false }) => {
  const time = getTimeParts(milliseconds);

  return (
    <section
      className={`${styles.countdown} ${compact ? styles.compactCountdown : ""}`}
      aria-label={label}
    >
      <p className={styles.countdownLabel}>{label}</p>
      <div className={styles.countdownGrid}>
        {Object.entries(time).map(([unit, value]) => (
          <div className={styles.countdownUnit} key={unit}>
            <strong>{String(value).padStart(2, "0")}</strong>
            <span>{unit}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const PhotoIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9" r="1.5" />
    <path d="m4 17 5-5 4 4 2-2 5 5" />
  </svg>
);

const getPlanePosition = (points, progress) => {
  const segmentCount = points.length - 1;
  const scaledProgress = Math.min(progress * segmentCount, segmentCount);
  const segmentIndex = Math.min(Math.floor(scaledProgress), segmentCount - 1);
  const segmentProgress = scaledProgress - segmentIndex;
  const start = points[segmentIndex];
  const end = points[segmentIndex + 1];

  return {
    x: start.x + (end.x - start.x) * segmentProgress,
    y: start.y + (end.y - start.y) * segmentProgress,
    angle: (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI,
  };
};

const FlightMap = ({ plan, now }) => {
  const flightDuration = plan.trackingEnd - plan.trackingStart;
  const progress = Math.min(
    1,
    Math.max(0, (now - plan.trackingStart) / flightDuration),
  );
  const plane = getPlanePosition(plan.mapPoints, progress);
  const route = plan.mapPoints.map(({ x, y }) => `${x},${y}`).join(" ");
  const status =
    now < plan.trackingStart
      ? "Départ à venir"
      : now > plan.trackingEnd
        ? "Trajet terminé"
        : "Trajet en cours";

  return (
    <div className={styles.flightMap}>
      <div className={styles.mapStatus}>
        <span className={styles.statusDot} />
        {status} · position estimée
      </div>
      <div className={styles.mapTimes} aria-label="Horaires du trajet">
        <span>
          <small>Départ</small>
          <strong>{plan.departureTime}</strong>
        </span>
        <i aria-hidden="true" />
        <span>
          <small>Arrivée</small>
          <strong>{plan.arrivalTime}</strong>
        </span>
      </div>
      <svg viewBox="0 0 320 190" role="img" aria-label="Trajet aérien estimé">
        <defs>
          <radialGradient id="globe-glow" cx="42%" cy="35%" r="68%">
            <stop offset="0" stopColor="#274d66" />
            <stop offset="1" stopColor="#101a36" />
          </radialGradient>
          <filter id="plane-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="160" cy="95" r="82" fill="url(#globe-glow)" />
        <g className={styles.globeGrid}>
          <ellipse cx="160" cy="95" rx="82" ry="31" />
          <ellipse cx="160" cy="95" rx="82" ry="59" />
          <ellipse cx="160" cy="95" rx="34" ry="82" />
          <ellipse cx="160" cy="95" rx="64" ry="82" />
          <path d="M78 95h164" />
        </g>
        <g className={styles.continents}>
          <path d="m82 63 17-24 31-15 21 8 6 17-13 11-7 24-21 10-18-9-10-10Z" />
          <path d="m128 107 24 5 11 22-9 33-16 4-8-27-13-19Z" />
          <path d="m164 42 22-17 42 18 17 25-12 17-27-3-14 14-22-8-8-22Z" />
          <path d="m195 105 25-8 18 15-7 18-21 8-17-14Z" />
        </g>

        <polyline className={styles.routeShadow} points={route} />
        <polyline className={styles.routeLine} points={route} />

        {plan.mapPoints.map((point) => (
          <g className={styles.mapStop} key={point.label}>
            <circle cx={point.x} cy={point.y} r="3" />
            <text x={point.x + 6} y={point.y - 5}>
              {point.label}
            </text>
          </g>
        ))}

        <g
          className={styles.planeMarker}
          transform={`translate(${plane.x} ${plane.y}) rotate(${plane.angle})`}
          filter="url(#plane-glow)"
        >
          <path d="M-8-3 9 0-8 3l3-3Z" />
        </g>
      </svg>
    </div>
  );
};

const FlightPanel = ({ plan, now }) => (
  <aside className={styles.flightPanel} aria-label={plan.title}>
    <FlightMap plan={plan} now={now} />
  </aside>
);

const FullscreenPhoto = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => setHasError(false), [src]);

  return (
    <div className={styles.photoLayer}>
      {!hasError && (
        <img src={src} alt={alt} onError={() => setHasError(true)} />
      )}
      {hasError && (
        <div className={styles.photoFallback} role="img" aria-label={alt}>
          <PhotoIcon />
          <span>Ajoute ta photo ici</span>
        </div>
      )}
    </div>
  );
};

const MountainSilhouette = () => (
  <svg
    className={styles.mountains}
    viewBox="0 0 1440 260"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path d="M0 214 125 108l72 55L348 48l139 137L636 79l113 111 102-76 82 58 165-137 176 153 86-65 80 68v69H0Z" />
    <path d="m0 238 181-83 123 65 161-92 152 93 133-53 165 63 190-99 136 80 199-57v105H0Z" />
  </svg>
);

const SecretPage = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Pour Siloë — quelque part en Norvège";
    window.scrollTo(0, 0);

    const timer = window.setInterval(() => setNow(new Date()), 30 * 1000);
    return () => {
      document.title = previousTitle;
      window.clearInterval(timer);
    };
  }, []);

  // Les trois phases reposent uniquement sur l'heure locale du navigateur.
  const isBeforeDeparture = now < DEPART;
  const isAfterReturn = now > RETOUR;
  const isAway = !isBeforeDeparture && !isAfterReturn;

  // Le jour 1 apparaît dès le départ jusqu'au prochain minuit local.
  // Ensuite, le message change chaque jour à minuit.
  const firstRefreshAtMidnight = new Date(DEPART);
  firstRefreshAtMidnight.setHours(24, 0, 0, 0);
  const dayAfterFirstRefresh = Math.min(
    messages.length,
    getCalendarDayDifference(firstRefreshAtMidnight, now) + 2,
  );
  const currentDay = isAway
    ? now < firstRefreshAtMidnight
      ? 1
      : dayAfterFirstRefresh
    : messages.length;
  const currentMessage = messages[currentDay - 1];
  const flightPlan = flightPlans[currentMessage.jour];

  if (isBeforeDeparture) {
    return (
      <main className={`${styles.page} ${styles.waitingPage}`}>
        <div className={styles.aurora} aria-hidden="true" />
        <div className={styles.stars} aria-hidden="true" />
        <section className={styles.waitingContent}>
          <p className={styles.eyebrow}>
            Opération Trolltunga · en préparation
          </p>
          <h1>Rien à signaler… encore</h1>
          <p className={styles.intro}>{AVANT_DEPART}</p>
          <Countdown
            milliseconds={DEPART - now}
            label="Perte du réseau (et de mes jambes) dans"
          />
        </section>
        <MountainSilhouette />
      </main>
    );
  }

  return (
    <main className={`${styles.page} ${styles.memoryPage}`}>
      <FullscreenPhoto
        src={currentMessage.image}
        alt={`Souvenir du jour ${currentMessage.jour}`}
      />
      <div className={styles.photoScrim} aria-hidden="true" />
      <div className={styles.aurora} aria-hidden="true" />

      <section className={styles.dailyContent}>
        <div className={styles.dailyTopline}>
          <p className={styles.eyebrow}>
            {isAfterReturn ? "De retour auprès de toi" : "Trolltunga · Norvège"}
          </p>
          <span className={styles.dayBadge}>
            {isAfterReturn ? "Notre souvenir" : `Jour ${currentMessage.jour}`}
          </span>
        </div>

        <div
          className={`${styles.dailyMain} ${flightPlan ? styles.dailyMainWithMap : ""}`}
        >
          <article className={styles.messageCard}>
            <span className={styles.heart} aria-hidden="true">
              ♡
            </span>
            <h1>{isAfterReturn ? "Enfin retrouvés" : currentMessage.titre}</h1>
            <p>{isAfterReturn ? APRES_RETOUR : currentMessage.texte}</p>
          </article>

          {flightPlan && <FlightPanel plan={flightPlan} now={now} />}
        </div>

        {isAway && (
          <Countdown
            milliseconds={RETOUR - now}
            label="Avant de se retrouver"
            compact
          />
        )}
      </section>
    </main>
  );
};

export default SecretPage;
