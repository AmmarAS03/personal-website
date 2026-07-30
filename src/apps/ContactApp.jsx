import { useState } from "react";
import s from "./apps.module.scss";
import { profile, socials } from "../data/profile";

const email = socials.find((item) => item.id === "email").handle;

/**
 * Mail-compose styling over a plain mailto: handoff — no backend, and nothing
 * typed here leaves the page until the user's own mail client opens.
 */
function ContactApp() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const send = () => {
    const url = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  return (
    <div className={s.appRoot}>
      <div className={s.toolbar}>
        <span className={s.toolbarTitle}>New Message</span>
        <span className={s.toolbarSpacer} />
        <button
          type="button"
          className={`${s.button} ${s.buttonPrimary}`}
          onClick={send}
          disabled={!subject && !body}
        >
          Send
        </button>
      </div>

      <div className={s.field}>
        <span className={s.fieldLabel}>To</span>
        <span>{email}</span>
      </div>

      <div className={s.field}>
        <label className={s.fieldLabel} htmlFor="contact-subject">
          Subject
        </label>
        <input
          id="contact-subject"
          className={s.input}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Saying hello"
        />
      </div>

      <textarea
        className={s.textarea}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={`Hi ${profile.shortName}, …`}
        aria-label="Message body"
      />

      <div className={s.rail}>
        {socials.map((item) => (
          <a
            key={item.id}
            className={s.button}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={item.icon} alt="" width={16} height={16} />
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default ContactApp;
