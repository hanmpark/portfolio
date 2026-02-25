import { useState } from "react";
import { contact, socialLinks, sectionCopy } from "../data/home.js";
import "./Contact.css";

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

const initialForm = {
  fullName: "",
  email: "",
  message: "",
};

/* ── SVG icons for quick-connect cards ─────────────── */
const icons = {
  email: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="M22 7l-10 6L2 7" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.37.5 0 5.78 0 12.3c0 5.21 3.44 9.64 8.2 11.21.6.11.82-.26.82-.57v-2.17c-3.34.72-4.04-1.42-4.04-1.42-.55-1.37-1.33-1.74-1.33-1.74-1.09-.73.08-.72.08-.72 1.2.09 1.84 1.22 1.84 1.22 1.07 1.8 2.8 1.28 3.49.98.1-.76.42-1.28.76-1.57-2.66-.3-5.47-1.31-5.47-5.84 0-1.29.47-2.35 1.24-3.18-.13-.3-.54-1.5.12-3.13 0 0 1-.32 3.3 1.21a11.6 11.6 0 016.01 0c2.3-1.53 3.3-1.21 3.3-1.21.66 1.63.25 2.83.12 3.13.77.83 1.24 1.89 1.24 3.18 0 4.55-2.82 5.54-5.5 5.83.43.37.82 1.1.82 2.22v3.29c0 .31.21.69.83.57C20.57 21.93 24 17.51 24 12.3 24 5.78 18.63.5 12 .5z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
  arrow: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  ),
  send: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
};

/* ── Build quick-connect items from data ───────────── */
const connectChannels = [
  {
    key: "email",
    label: "Email",
    value: contact.email,
    href: `mailto:${contact.email}`,
    icon: icons.email,
  },
  ...socialLinks
    .filter((l) => /github|linkedin/i.test(l.label))
    .map((l) => ({
      key: l.label.toLowerCase(),
      label: l.label,
      value: l.label === "GitHub" ? "hanmpark" : "Hanmin Park",
      href: l.href,
      icon: icons[l.label.toLowerCase()] ?? icons.arrow,
    })),
];

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState({
    type: "idle",
    message: "",
  });

  const emailJsConfig = {
    serviceId:
      import.meta.env.VITE_APP_EMAILJS_SERVICE_ID ??
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId:
      import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID ??
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey:
      import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY ??
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  };

  const isEmailJsConfigured = Boolean(
    emailJsConfig.serviceId &&
    emailJsConfig.templateId &&
    emailJsConfig.publicKey,
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (submitState.type !== "idle") {
      setSubmitState({ type: "idle", message: "" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEmailJsConfigured) {
      setSubmitState({
        type: "error",
        message:
          "Email form is not configured yet. Add VITE_APP_EMAILJS_SERVICE_ID, VITE_APP_EMAILJS_TEMPLATE_ID, and VITE_APP_EMAILJS_PUBLIC_KEY.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitState({ type: "idle", message: "" });

      const response = await fetch(EMAILJS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: emailJsConfig.serviceId,
          template_id: emailJsConfig.templateId,
          user_id: emailJsConfig.publicKey,
          template_params: {
            from_name: form.fullName,
            name: form.fullName,
            reply_to: form.email,
            from_email: form.email,
            email: form.email,
            subject: "Portfolio contact form submission",
            message: form.message,
            to_email: contact.email,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("EmailJS request failed");
      }

      setForm(initialForm);
      setSubmitState({
        type: "success",
        message: "Message sent! I'll get back to you soon.",
      });
    } catch (error) {
      console.error(error);
      setSubmitState({
        type: "error",
        message:
          "Could not send your message right now. Please try again or use the direct email link.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section ct-section" id="contact">
      {/* Decorative glow accents */}
      <div className="ct-glow ct-glow--1" aria-hidden="true" />
      <div className="ct-glow ct-glow--2" aria-hidden="true" />

      <div className="ct-inner">
        {/* ── Left column: info panel ──────────────────── */}
        <div className="ct-info">
          <div className="ct-copy">
            <p className="eyebrow">{sectionCopy.contact.eyebrow}</p>
            <h2 className="section-title ct-title">
              {sectionCopy.contact.title}
            </h2>
            <p className="ct-sub">{sectionCopy.contact.subtitle}</p>
          </div>

          {/* Availability badge */}
          <div className="ct-availability">
            <span className="ct-availability__dot" />
            <span className="ct-availability__text">
              Available for new projects
            </span>
          </div>

          {/* Quick-connect cards */}
          <div className="ct-channels">
            {connectChannels.map((ch) => (
              <a
                key={ch.key}
                className="ct-channel"
                href={ch.href}
                target={ch.key !== "email" ? "_blank" : undefined}
                rel={ch.key !== "email" ? "noopener noreferrer" : undefined}
              >
                <span className="ct-channel__icon">{ch.icon}</span>
                <span className="ct-channel__body">
                  <span className="ct-channel__label">{ch.label}</span>
                  <span className="ct-channel__value">{ch.value}</span>
                </span>
                <span className="ct-channel__arrow">{icons.arrow}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ── Right column: form card ──────────────────── */}
        <div className="ct-form-card">
          <div className="ct-form-card__header">
            <span className="ct-form-card__icon">{icons.send}</span>
            <span className="ct-form-card__heading">Send a message</span>
          </div>

          <form className="ct-form" onSubmit={handleSubmit}>
            <div className="ct-form__row">
              <label className="ct-field">
                <span>Full name</span>
                <input
                  className="ct-input"
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                  placeholder="John Doe"
                />
              </label>

              <label className="ct-field">
                <span>Email</span>
                <input
                  className="ct-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label className="ct-field ct-field--grow">
              <span>Your message</span>
              <textarea
                className="ct-input ct-textarea"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                placeholder="Tell me about your project, what you need, and your goals..."
                rows={5}
              />
            </label>

            <div className="ct-form-footer">
              <button
                className="ct-submit"
                type="submit"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? "Sending..." : "Send message"}</span>
                {!isSubmitting && (
                  <svg
                    className="ct-submit__icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>

              <p
                className={`ct-status${
                  submitState.type !== "idle"
                    ? ` ct-status--${submitState.type}`
                    : ""
                }`}
                role="status"
                aria-live="polite"
              >
                {submitState.message}
              </p>
            </div>

            {!isEmailJsConfigured && (
              <p className="ct-config-note">
                Configure <code>VITE_APP_EMAILJS_SERVICE_ID</code>,{" "}
                <code>VITE_APP_EMAILJS_TEMPLATE_ID</code>, and{" "}
                <code>VITE_APP_EMAILJS_PUBLIC_KEY</code> to enable the form.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
