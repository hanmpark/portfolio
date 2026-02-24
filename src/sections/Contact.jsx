import { useState } from "react";
import { contact, sectionCopy } from "../data/home.js";
import "./Contact.css";

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

const initialForm = {
  fullName: "",
  email: "",
  message: "",
};

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
        message: "Message sent. I will get back to you soon.",
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
      <div className="ct-inner">
        <div className="ct-copy">
          <p className="eyebrow">{sectionCopy.contact.eyebrow}</p>
          <h2 className="section-title ct-title">{sectionCopy.contact.title}</h2>
          <p className="ct-sub">{sectionCopy.contact.subtitle}</p>
        </div>

        <form className="ct-form" onSubmit={handleSubmit}>
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
              placeholder="Your full name"
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

          <label className="ct-field">
            <span>Your message</span>
            <textarea
              className="ct-input ct-textarea"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              placeholder="Tell me about your project, what you need, and your goals."
              rows={6}
            />
          </label>

          <div className="ct-form-footer">
            <button className="ct-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send message"}
            </button>

            <p className="ct-footnote">
              Prefer email? <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
          </div>

          {!isEmailJsConfigured ? (
            <p className="ct-config-note">
              Configure `VITE_APP_EMAILJS_SERVICE_ID`,
              `VITE_APP_EMAILJS_TEMPLATE_ID`, and
              `VITE_APP_EMAILJS_PUBLIC_KEY` to enable the form.
            </p>
          ) : null}

          <p
            className={`ct-status${
              submitState.type !== "idle" ? ` ct-status--${submitState.type}` : ""
            }`}
            role="status"
            aria-live="polite"
          >
            {submitState.message}
          </p>
        </form>
      </div>
    </section>
  );
};

export default Contact;
