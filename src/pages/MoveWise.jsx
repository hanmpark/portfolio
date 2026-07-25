import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/useLanguage.js";
import "./MoveWise.css";

const cityFallbacks = {
  paris: { costIndex: 81, rent: 1450, internet: 31, coworking: 320 },
  lisbon: { costIndex: 58, rent: 980, internet: 28, coworking: 210 },
  seoul: { costIndex: 67, rent: 850, internet: 24, coworking: 260 },
  tokyo: { costIndex: 74, rent: 1080, internet: 32, coworking: 330 },
  "new york": { costIndex: 100, rent: 3100, internet: 68, coworking: 480 },
  berlin: { costIndex: 69, rent: 1280, internet: 36, coworking: 280 },
  london: { costIndex: 91, rent: 2350, internet: 39, coworking: 430 },
  montreal: { costIndex: 65, rent: 1120, internet: 54, coworking: 255 },
  barcelona: { costIndex: 62, rent: 1180, internet: 33, coworking: 245 },
  amsterdam: { costIndex: 84, rent: 1850, internet: 42, coworking: 360 },
};

const profiles = {
  remote: {
    label: "Remote",
    label_fr: "Remote",
    weights: { weather: 0.24, air: 0.26, affordability: 0.28, economy: 0.22 },
  },
  student: {
    label: "Student",
    label_fr: "Étudiant",
    weights: { weather: 0.18, air: 0.18, affordability: 0.46, economy: 0.18 },
  },
  local: {
    label: "Local",
    label_fr: "Local",
    weights: { weather: 0.28, air: 0.28, affordability: 0.32, economy: 0.12 },
  },
};

const rankingCities = [
  "Lisbon",
  "Berlin",
  "Montreal",
  "Barcelona",
  "Seoul",
  "Tokyo",
  "Amsterdam",
  "Paris",
];

const samplePairs = [
  ["Lisbon", "Seoul"],
  ["Paris", "Berlin"],
  ["Tokyo", "Montreal"],
];

const reportCache = new Map();

const copy = {
  en: {
    back: "Back to portfolio",
    eyebrow: "Public API city intelligence",
    title: "MoveWise",
    subtitle:
      "Explore relocation rankings, inspect a city, then compare two destinations with live public data.",
    tabs: {
      rankings: "Rankings",
      search: "City search",
      compare: "Compare",
    },
    cityA: "City A",
    cityB: "City B",
    profile: "Profile",
    compare: "Compare cities",
    comparing: "Comparing...",
    search: "Search city",
    searching: "Searching...",
    searchPlaceholder: "City name",
    rankingsTitle: "Best cities right now",
    rankingsNote:
      "Scores are recalculated from weather, air quality, affordability, and GDP signal.",
    rankLoading: "Loading live ranking...",
    winner: "Best fit",
    sources: "Data sources",
    metrics: "Decision matrix",
    cityMetrics: "City score",
    indicators: "How scores work",
    suggestionHint: "Select a suggestion to use the exact city returned by the API.",
    notes:
      "Rent is a rough monthly USD estimate for a small central apartment from a local demo table. Weather, air, country, and GDP values come from public APIs.",
    indicatorNotes: {
      weather: "Comfort around 21°C with a penalty for high rain probability.",
      air: "Based on live AQI; lower pollution means a higher score.",
      affordability: "Estimated cost model using monthly rent and local expense pressure.",
      economy: "GDP per capita signal from World Bank, useful as a proxy for economic opportunity.",
    },
    tooltips: {
      total: "Overall score out of 100, weighted by the selected profile.",
      weather:
        "Weather comfort rewards mild temperatures near 21°C and penalizes high rain probability.",
      air:
        "AQI means Air Quality Index. Lower AQI means cleaner air, so the score is higher.",
      affordability:
        "Budget comfort is derived from the local cost index. Lower estimated expenses score higher.",
      economy:
        "Economic signal uses GDP per capita from World Bank as a broad opportunity proxy.",
      temp: "Current temperature from Open-Meteo.",
      aqi: "Air Quality Index from Open-Meteo air quality data. Lower is better.",
      cost:
        "Demo cost index where 100 roughly represents a very expensive city baseline.",
      rent:
        "Rough monthly USD estimate for a small central apartment. It comes from a curated local demo table, not a live rent API.",
      gdp: "Latest available GDP per capita from World Bank.",
      currency: "Country code returned by Open-Meteo geocoding.",
      timezone: "Timezone returned by Open-Meteo geocoding.",
      population: "Population value returned by Open-Meteo geocoding when available.",
    },
    weather: "Weather comfort",
    air: "Air quality",
    affordability: "Budget comfort",
    economy: "Economic signal",
    temp: "Temperature",
    aqi: "AQI",
    cost: "Cost index",
    rent: "Est. rent / month",
    gdp: "GDP / capita",
    currency: "Country code",
    timezone: "Timezone",
    population: "Population",
    error: "Could not load this data. Try another spelling or a larger nearby city.",
  },
  fr: {
    back: "Retour au portfolio",
    eyebrow: "Analyse de villes via APIs publiques",
    title: "MoveWise",
    subtitle:
      "Explore des classements de villes, inspecte une ville précise, puis compare deux destinations avec des données publiques en direct.",
    tabs: {
      rankings: "Classements",
      search: "Recherche",
      compare: "Comparer",
    },
    cityA: "Ville A",
    cityB: "Ville B",
    profile: "Profil",
    compare: "Comparer",
    comparing: "Comparaison...",
    search: "Rechercher",
    searching: "Recherche...",
    searchPlaceholder: "Nom de ville",
    rankingsTitle: "Meilleures villes maintenant",
    rankingsNote:
      "Les scores sont recalculés avec la météo, la qualité de l'air, le budget et le signal PIB.",
    rankLoading: "Chargement du classement...",
    winner: "Meilleur choix",
    sources: "Sources de données",
    metrics: "Matrice de décision",
    cityMetrics: "Score de la ville",
    indicators: "Comment lire les scores",
    suggestionHint: "Sélectionne une suggestion pour utiliser le nom exact retourné par l'API.",
    notes:
      "Le loyer est une estimation mensuelle approximative en USD pour un petit appartement central, issue d'une table locale de démo. La météo, l'air, le pays et le PIB viennent d'APIs publiques.",
    indicatorNotes: {
      weather: "Confort autour de 21°C, avec une pénalité quand la probabilité de pluie est élevée.",
      air: "Basé sur l'AQI en direct ; moins de pollution donne un meilleur score.",
      affordability: "Estimation locale basée sur le loyer mensuel et la pression des dépenses courantes.",
      economy: "Signal PIB par habitant venant de World Bank, utile comme proxy d'opportunités économiques.",
    },
    tooltips: {
      total: "Score global sur 100, pondéré selon le profil sélectionné.",
      weather:
        "Le confort météo favorise les températures proches de 21°C et pénalise une forte probabilité de pluie.",
      air:
        "AQI signifie Air Quality Index, ou indice de qualité de l'air. Plus il est bas, plus l'air est propre.",
      affordability:
        "Le confort budget vient de l'indice de coût local. Des dépenses estimées plus basses donnent un meilleur score.",
      economy:
        "Le signal économique utilise le PIB par habitant de World Bank comme indicateur large d'opportunités.",
      temp: "Température actuelle fournie par Open-Meteo.",
      aqi: "Indice de qualité de l'air fourni par Open-Meteo. Plus bas est mieux.",
      cost:
        "Indice de coût de démo où 100 représente approximativement une ville très chère.",
      rent:
        "Estimation mensuelle approximative en USD pour un petit appartement central. Elle vient d'une table locale de démo, pas d'une API de loyers en direct.",
      gdp: "Dernier PIB par habitant disponible via World Bank.",
      currency: "Code pays retourné par le géocodage Open-Meteo.",
      timezone: "Fuseau horaire retourné par le géocodage Open-Meteo.",
      population: "Population retournée par le géocodage Open-Meteo quand disponible.",
    },
    weather: "Confort météo",
    air: "Qualité de l'air",
    affordability: "Confort budget",
    economy: "Signal économique",
    temp: "Température",
    aqi: "AQI",
    cost: "Indice coût",
    rent: "Loyer est. / mois",
    gdp: "PIB / habitant",
    currency: "Code pays",
    timezone: "Fuseau",
    population: "Population",
    error: "Impossible de charger ces données. Essaie une autre orthographe ou une grande ville proche.",
  },
};

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const formatNumber = (value) =>
  typeof value === "number" && Number.isFinite(value)
    ? new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(value)
    : "n/a";

const getFallbackCost = (cityName) =>
  cityFallbacks[cityName.trim().toLowerCase()] ?? {
    costIndex: 72,
    rent: 1200,
    internet: 38,
    coworking: 280,
  };

const safeJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
};

const getCity = async (query) => {
  const encoded = encodeURIComponent(query.trim());
  const data = await safeJson(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encoded}&count=1&language=en&format=json`,
  );
  const city = data.results?.[0];
  if (!city) throw new Error(`City not found: ${query}`);
  return city;
};

const getCitySuggestions = async (query) => {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];
  const encoded = encodeURIComponent(trimmed);
  const data = await safeJson(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encoded}&count=5&language=en&format=json`,
  );

  return (data.results ?? []).map((city) => ({
    id: `${city.id}-${city.latitude}-${city.longitude}`,
    name: city.name,
    country: city.country,
    admin: city.admin1,
    value: city.name,
  }));
};

const getWeather = async (city) =>
  safeJson(
    `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=precipitation_probability_max&timezone=auto&forecast_days=1`,
  );

const getAir = async (city) =>
  safeJson(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.latitude}&longitude=${city.longitude}&current=pm2_5,european_aqi,us_aqi`,
  );

const getGdp = async (countryCode) => {
  if (!countryCode) return null;
  const data = await safeJson(
    `https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.PCAP.CD?format=json&per_page=5&date=2022:2025`,
  );
  return data?.[1]?.find((item) => item.value)?.value ?? null;
};

const scoreCity = (city, profile) => {
  const temp = city.temperature ?? 18;
  const aqi = city.aqi ?? 60;
  const precipitation = city.precipitation ?? 25;
  const weather = clamp(100 - Math.abs(temp - 21) * 4 - precipitation * 0.22);
  const air = clamp(100 - aqi * 0.72);
  const affordability = clamp(112 - city.cost.costIndex);
  const economy = clamp(((city.gdpPerCapita ?? 38000) / 85000) * 100);
  const weights = profiles[profile].weights;
  const total =
    weather * weights.weather +
    air * weights.air +
    affordability * weights.affordability +
    economy * weights.economy;

  return {
    total: Math.round(total),
    weather: Math.round(weather),
    air: Math.round(air),
    affordability: Math.round(affordability),
    economy: Math.round(economy),
  };
};

const buildCityReport = async (query) => {
  const cacheKey = query.trim().toLowerCase();
  if (reportCache.has(cacheKey)) return reportCache.get(cacheKey);

  const city = await getCity(query);
  const [weatherRes, airRes, gdpRes] = await Promise.allSettled([
    getWeather(city),
    getAir(city),
    getGdp(city.country_code),
  ]);

  const weather = weatherRes.status === "fulfilled" ? weatherRes.value : null;
  const air = airRes.status === "fulfilled" ? airRes.value : null;
  const gdpPerCapita = gdpRes.status === "fulfilled" ? gdpRes.value : null;

  const report = {
    name: city.name,
    country: city.country,
    countryCode: city.country_code,
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: city.timezone,
    temperature: weather?.current?.temperature_2m ?? null,
    humidity: weather?.current?.relative_humidity_2m ?? null,
    precipitation: weather?.daily?.precipitation_probability_max?.[0] ?? 25,
    aqi: air?.current?.european_aqi ?? air?.current?.us_aqi ?? null,
    pm25: air?.current?.pm2_5 ?? null,
    currency: city.country_code,
    population: city.population ?? null,
    gdpPerCapita,
    cost: getFallbackCost(city.name),
  };

  reportCache.set(cacheKey, report);
  return report;
};

const TooltipLabel = ({ label, tip }) => (
  <span className="mw-tooltip-label">
    <span>{label}</span>
    {tip ? (
      <span className="mw-tip" tabIndex={0} aria-label={tip}>
        ?
        <span role="tooltip">{tip}</span>
      </span>
    ) : null}
  </span>
);

const MetricBar = ({ label, tip, left, right, leftName, rightName }) => (
  <div className="mw-metric">
    <div className="mw-metric-head">
      <TooltipLabel label={label} tip={tip} />
      <span>
        {leftName} {left} / {rightName} {right}
      </span>
    </div>
    <div className="mw-bars" aria-hidden="true">
      <span style={{ "--score": `${left}%` }} />
      <span style={{ "--score": `${right}%` }} />
    </div>
  </div>
);

const IndicatorGuide = ({ labels }) => {
  const rows = [
    [labels.weather, labels.indicatorNotes.weather],
    [labels.air, labels.indicatorNotes.air],
    [labels.affordability, labels.indicatorNotes.affordability],
    [labels.economy, labels.indicatorNotes.economy],
  ];

  return (
    <section className="mw-guide" aria-label={labels.indicators}>
      <p className="mw-eyebrow">{labels.indicators}</p>
      <div className="mw-guide-grid">
        {rows.map(([title, body]) => (
          <span key={title}>
            <b>{title}</b>
            <small>{body}</small>
          </span>
        ))}
      </div>
    </section>
  );
};

const ScoreBreakdown = ({ labels, score }) => {
  const rows = [
    [labels.weather, score.weather, labels.tooltips.weather],
    [labels.air, score.air, labels.tooltips.air],
    [labels.affordability, score.affordability, labels.tooltips.affordability],
    [labels.economy, score.economy, labels.tooltips.economy],
  ];

  return (
    <div className="mw-score-list">
      {rows.map(([label, value, tip]) => (
        <div className="mw-score-row" key={label}>
          <TooltipLabel label={label} tip={tip} />
          <b>{value}</b>
          <i style={{ "--score": `${value}%` }} />
        </div>
      ))}
    </div>
  );
};

const StatItem = ({ label, tip, value }) => (
  <span>
    <small>
      <TooltipLabel label={label} tip={tip} />
    </small>
    <b>{value}</b>
  </span>
);

const CityInput = ({
  label,
  value,
  placeholder,
  onChange,
  onSubmitSuggestion,
  resetKey,
}) => {
  const inputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);

  useEffect(() => {
    let active = true;
    if (!hasTyped) {
      setSuggestions([]);
      setOpen(false);
      return () => {
        active = false;
      };
    }

    const timeout = window.setTimeout(async () => {
      try {
        const nextSuggestions = await getCitySuggestions(value);
        if (active) {
          setSuggestions(nextSuggestions);
          setOpen(nextSuggestions.length > 0);
        }
      } catch {
        if (active) {
          setSuggestions([]);
          setOpen(false);
        }
      }
    }, 220);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [hasTyped, resetKey, value]);

  useEffect(() => {
    setSuggestions([]);
    setOpen(false);
    setHasTyped(false);
    inputRef.current?.blur();
  }, [resetKey]);

  const chooseSuggestion = (suggestion) => {
    onChange(suggestion.value);
    setOpen(false);
    setHasTyped(false);
    inputRef.current?.blur();
    onSubmitSuggestion?.(suggestion.value);
  };

  return (
    <label className="mw-city-input">
      <span>{label}</span>
      <input
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onChange={(e) => {
          setHasTyped(true);
          onChange(e.target.value);
        }}
        onFocus={() => {
          if (hasTyped && suggestions.length > 0) setOpen(true);
        }}
      />
      {open ? (
        <div className="mw-suggestion-list">
          {suggestions.map((suggestion) => (
            <button
              type="button"
              key={suggestion.id}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => chooseSuggestion(suggestion)}
            >
              <b>{suggestion.name}</b>
              <small>
                {[suggestion.admin, suggestion.country].filter(Boolean).join(", ")}
              </small>
            </button>
          ))}
        </div>
      ) : null}
    </label>
  );
};

const CityPanel = ({ city, score, labels }) => (
  <article className="mw-city-panel">
    <div className="mw-city-panel-head">
      <div>
        <h2>{city.name}</h2>
        <p>{city.country}</p>
      </div>
      <strong>{score.total}</strong>
    </div>
    <div className="mw-stat-grid">
      <StatItem
        label={labels.temp}
        tip={labels.tooltips.temp}
        value={city.temperature !== null ? `${Math.round(city.temperature)} °C` : "n/a"}
      />
      <StatItem label={labels.aqi} tip={labels.tooltips.aqi} value={city.aqi ?? "n/a"} />
      <StatItem
        label={labels.cost}
        tip={labels.tooltips.cost}
        value={city.cost.costIndex}
      />
      <StatItem
        label={labels.rent}
        tip={labels.tooltips.rent}
        value={`$${formatNumber(city.cost.rent)}`}
      />
      <StatItem
        label={labels.gdp}
        tip={labels.tooltips.gdp}
        value={`$${formatNumber(city.gdpPerCapita)}`}
      />
      <StatItem
        label={labels.currency}
        tip={labels.tooltips.currency}
        value={city.currency}
      />
      <StatItem
        label={labels.timezone}
        tip={labels.tooltips.timezone}
        value={city.timezone ?? "n/a"}
      />
      <StatItem
        label={labels.population}
        tip={labels.tooltips.population}
        value={formatNumber(city.population)}
      />
    </div>
  </article>
);

const MoveWise = () => {
  const { lang, l } = useLanguage();
  const labels = copy[lang] ?? copy.en;
  const [activeView, setActiveView] = useState("rankings");
  const [cityA, setCityA] = useState("Lisbon");
  const [cityB, setCityB] = useState("Seoul");
  const [searchCity, setSearchCity] = useState("");
  const [profile, setProfile] = useState("remote");
  const [rankings, setRankings] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(true);
  const [rankingError, setRankingError] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [compareLoading, setCompareLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [compareError, setCompareError] = useState("");
  const [inputResetKey, setInputResetKey] = useState(0);

  const selectedProfile = profiles[profile];
  const tabs = [
    ["rankings", labels.tabs.rankings],
    ["search", labels.tabs.search],
    ["compare", labels.tabs.compare],
  ];

  const rankedCities = useMemo(
    () =>
      rankings
        .map((city) => ({ city, score: scoreCity(city, profile) }))
        .sort((a, b) => b.score.total - a.score.total),
    [profile, rankings],
  );

  const searchScore = useMemo(
    () => (searchResult ? scoreCity(searchResult, profile) : null),
    [profile, searchResult],
  );

  const comparison = useMemo(() => {
    if (!comparisonResult) return null;
    const leftScore = scoreCity(comparisonResult.left, profile);
    const rightScore = scoreCity(comparisonResult.right, profile);
    return {
      leftScore,
      rightScore,
      winner:
        leftScore.total >= rightScore.total
          ? comparisonResult.left.name
          : comparisonResult.right.name,
    };
  }, [profile, comparisonResult]);

  const loadRankings = async () => {
    setRankingLoading(true);
    setRankingError("");
    const reports = await Promise.allSettled(
      rankingCities.map((city) => buildCityReport(city)),
    );
    const loaded = reports
      .filter((item) => item.status === "fulfilled")
      .map((item) => item.value);

    if (!loaded.length) setRankingError(labels.error);
    setRankings(loaded);
    setRankingLoading(false);
  };

  const search = async (event, nextCity = searchCity) => {
    event?.preventDefault();
    document.activeElement?.blur();
    setInputResetKey((key) => key + 1);
    if (!nextCity.trim()) return;
    setSearchLoading(true);
    setSearchError("");
    try {
      const city = await buildCityReport(nextCity);
      setSearchResult(city);
    } catch {
      setSearchError(labels.error);
    } finally {
      setSearchLoading(false);
    }
  };

  const compare = async (event, nextCityA = cityA, nextCityB = cityB) => {
    event?.preventDefault();
    document.activeElement?.blur();
    setInputResetKey((key) => key + 1);
    setCompareLoading(true);
    setCompareError("");
    try {
      const [left, right] = await Promise.all([
        buildCityReport(nextCityA),
        buildCityReport(nextCityB),
      ]);
      setComparisonResult({ left, right });
    } catch {
      setCompareError(labels.error);
    } finally {
      setCompareLoading(false);
    }
  };

  useEffect(() => {
    loadRankings();
    // Initial ranking only; profile/language changes reuse loaded city data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mw">
      <Link className="mw-back" to="/#work">
        {labels.back}
      </Link>

      <section className="mw-hero">
        <div className="mw-hero-copy">
          <p className="mw-eyebrow">{labels.eyebrow}</p>
          <h1>{labels.title}</h1>
          <p>{labels.subtitle}</p>
        </div>
        <div className="mw-toolbar">
          <div className="mw-tabs" role="tablist" aria-label="MoveWise views">
            {tabs.map(([key, label]) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeView === key}
                className={activeView === key ? "is-active" : ""}
                key={key}
                onClick={() => setActiveView(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="mw-profile-control">
            <span>{labels.profile}</span>
            <select value={profile} onChange={(e) => setProfile(e.target.value)}>
              {Object.entries(profiles).map(([key, item]) => (
                <option value={key} key={key}>
                  {l(item, "label")}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {activeView === "rankings" ? (
        <section className="mw-view">
          <div className="mw-section-head">
            <div>
              <p className="mw-eyebrow">{labels.rankingsTitle}</p>
              <p>{labels.rankingsNote}</p>
            </div>
            <p>{l(selectedProfile, "label")}</p>
          </div>

          {rankingLoading ? <p className="mw-error">{labels.rankLoading}</p> : null}
          {rankingError ? <p className="mw-error">{rankingError}</p> : null}

          <div className="mw-ranking-grid">
            {rankedCities.map(({ city, score }, index) => (
              <button
                type="button"
                className="mw-ranking-card"
                key={`${city.name}-${city.countryCode}`}
                onClick={() => {
                  setSearchCity(city.name);
                  setSearchResult(city);
                  setActiveView("search");
                }}
              >
                <span className="mw-rank-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <strong>{city.name}</strong>
                  <small>{city.country}</small>
                </span>
                <b>{score.total}</b>
              </button>
            ))}
          </div>
          <IndicatorGuide labels={labels} />
        </section>
      ) : null}

      {activeView === "search" ? (
        <section className="mw-view">
          <form className="mw-inline-form" onSubmit={search}>
            <CityInput
              label={labels.tabs.search}
              value={searchCity}
              placeholder={labels.searchPlaceholder}
              onChange={setSearchCity}
              onSubmitSuggestion={(city) => search(null, city)}
              resetKey={inputResetKey}
            />
            <button type="submit" disabled={searchLoading || !searchCity.trim()}>
              {searchLoading ? labels.searching : labels.search}
            </button>
          </form>
          <p className="mw-form-hint">{labels.suggestionHint}</p>

          {searchError ? <p className="mw-error">{searchError}</p> : null}

          {searchResult && searchScore ? (
            <div className="mw-search-result">
              <CityPanel city={searchResult} score={searchScore} labels={labels} />
              <section className="mw-matrix mw-single-matrix">
                <div className="mw-section-head">
                  <p className="mw-eyebrow">{labels.cityMetrics}</p>
                  <p>{labels.notes}</p>
                </div>
                <ScoreBreakdown labels={labels} score={searchScore} />
              </section>
            </div>
          ) : null}
        </section>
      ) : null}

      {activeView === "compare" ? (
        <section className="mw-view">
          <form className="mw-inline-form mw-compare-form" onSubmit={compare}>
            <CityInput
              label={labels.cityA}
              value={cityA}
              onChange={setCityA}
              onSubmitSuggestion={(city) => compare(null, city, cityB)}
              resetKey={inputResetKey}
            />
            <CityInput
              label={labels.cityB}
              value={cityB}
              onChange={setCityB}
              onSubmitSuggestion={(city) => compare(null, cityA, city)}
              resetKey={inputResetKey}
            />
            <button type="submit" disabled={compareLoading}>
              {compareLoading ? labels.comparing : labels.compare}
            </button>
          </form>
          <p className="mw-form-hint">{labels.suggestionHint}</p>

          <div className="mw-samples" aria-label="Sample comparisons">
            {samplePairs.map(([left, right]) => (
              <button
                type="button"
                key={`${left}-${right}`}
                onClick={() => {
                  setCityA(left);
                  setCityB(right);
                  compare(null, left, right);
                }}
              >
                {left} / {right}
              </button>
            ))}
          </div>

          {compareError ? <p className="mw-error">{compareError}</p> : null}

          {comparison && comparisonResult ? (
            <>
              <section className="mw-scoreboard">
                <div className="mw-winner">
                  <span>{labels.winner}</span>
                  <strong>{comparison.winner}</strong>
                  <p>{l(selectedProfile, "label")} profile</p>
                </div>
                <CityPanel
                  city={comparisonResult.left}
                  score={comparison.leftScore}
                  labels={labels}
                />
                <CityPanel
                  city={comparisonResult.right}
                  score={comparison.rightScore}
                  labels={labels}
                />
              </section>

              <section className="mw-matrix">
                <div className="mw-section-head">
                  <p className="mw-eyebrow">{labels.metrics}</p>
                  <p>{labels.notes}</p>
                </div>
                <MetricBar
                  label={labels.weather}
                  tip={labels.tooltips.weather}
                  left={comparison.leftScore.weather}
                  right={comparison.rightScore.weather}
                  leftName={comparisonResult.left.name}
                  rightName={comparisonResult.right.name}
                />
                <MetricBar
                  label={labels.air}
                  tip={labels.tooltips.air}
                  left={comparison.leftScore.air}
                  right={comparison.rightScore.air}
                  leftName={comparisonResult.left.name}
                  rightName={comparisonResult.right.name}
                />
                <MetricBar
                  label={labels.affordability}
                  tip={labels.tooltips.affordability}
                  left={comparison.leftScore.affordability}
                  right={comparison.rightScore.affordability}
                  leftName={comparisonResult.left.name}
                  rightName={comparisonResult.right.name}
                />
                <MetricBar
                  label={labels.economy}
                  tip={labels.tooltips.economy}
                  left={comparison.leftScore.economy}
                  right={comparison.rightScore.economy}
                  leftName={comparisonResult.left.name}
                  rightName={comparisonResult.right.name}
                />
              </section>
              <IndicatorGuide labels={labels} />
            </>
          ) : null}
        </section>
      ) : null}

      <section className="mw-sources">
        <p className="mw-eyebrow">{labels.sources}</p>
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Open-Meteo
        </a>
        <a href="https://data.worldbank.org/" target="_blank" rel="noreferrer">
          World Bank Open Data
        </a>
      </section>
    </main>
  );
};

export default MoveWise;
