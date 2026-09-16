import s from "./apps.module.scss";
import { profile } from "../data/profile";

/**
 * Preview-style PDF viewer. Browsers without an inline PDF plugin (notably iOS
 * Safari) render nothing inside the object, so the fallback children carry a
 * download link rather than leaving a blank pane.
 */
function ResumeApp() {
  return (
    <div className={s.appRoot}>
      <div className={s.toolbar}>
        <span className={s.toolbarTitle}>{profile.name} — CV</span>
        <span className={s.toolbarSpacer} />
        <a
          className={`${s.button} ${s.buttonPrimary}`}
          href={profile.cv}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in new tab
        </a>
        <a className={s.button} href={profile.cv} download>
          Download
        </a>
      </div>

      <object
        data={profile.cv}
        type="application/pdf"
        aria-label={`${profile.name} curriculum vitae`}
        style={{ flex: 1, minHeight: 0, width: "100%", border: "none" }}
      >
        <div className={s.emptyState}>
          <div>
            <p className={s.prose}>This browser can’t display PDFs inline.</p>
            <p className={s.prose} style={{ marginTop: 12 }}>
              <a className={`${s.button} ${s.buttonPrimary}`} href={profile.cv} download>
                Download the CV
              </a>
            </p>
          </div>
        </div>
      </object>
    </div>
  );
}

export default ResumeApp;
