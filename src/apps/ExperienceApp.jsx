import { useState } from "react";
import s from "./apps.module.scss";
import x from "./ExperienceApp.module.scss";
import { experience } from "../data/experience";

/** Mini browser chrome around a screenshot of the company's homepage, for
 * roles with no work photo on hand. */
function SiteFrame({ url, image, label }) {
  return (
    <div className={x.siteFrame}>
      <div className={x.siteChrome}>
        <div className={x.siteDots}>
          <span className={`${x.siteDot} ${x.siteDotRed}`} />
          <span className={`${x.siteDot} ${x.siteDotYellow}`} />
          <span className={`${x.siteDot} ${x.siteDotGreen}`} />
        </div>
        <span className={x.siteUrl}>{url}</span>
      </div>
      <img className={x.siteImage} src={image} alt={`${label} website`} />
    </div>
  );
}

/** Mail-style sidebar of roles with a description/project detail pane. */
function ExperienceApp() {
  const [selectedId, setSelectedId] = useState(experience[0].id);
  const [tab, setTab] = useState("description");
  // Only consulted below the narrow breakpoint, where the panes show one at a
  // time. At desktop widths the CSS ignores it and both panes stay up.
  const [view, setView] = useState("list");

  const role = experience.find((item) => item.id === selectedId) ?? experience[0];
  const hasProject = Boolean(role.project);
  // Roles without a project can only ever show the description.
  const activeTab = hasProject ? tab : "description";

  const image = activeTab === "project" ? role.projectImage : role.workImage;
  const body = activeTab === "project" ? role.project : role.description;
  // Most roles keep it to one paragraph; a couple read better split into a
  // short "what it is" / "what I do" pair, so `description` may be an array.
  const paragraphs = Array.isArray(body) ? body : [body];

  return (
    <div className={`${s.appRoot} ${x.root}`} data-view={view}>
      <div className={s.split}>
        <nav className={`${s.sidebar} ${x.roles}`} aria-label="Roles">
          {experience.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${s.sidebarItem} ${
                item.id === selectedId ? s.sidebarItemActive : ""
              }`}
              aria-current={item.id === selectedId}
              onClick={() => {
                setSelectedId(item.id);
                setTab("description");
                setView("detail");
              }}
            >
              <div className={s.itemTitle}>{item.role}</div>
              <div className={s.itemMeta}>{item.company}</div>
              <div className={s.itemMeta}>{item.period}</div>
            </button>
          ))}
        </nav>

        <div className={`${s.detail} ${x.detail}`}>
          <div className={s.tabs}>
            <button
              type="button"
              className={x.back}
              onClick={() => setView("list")}
              aria-label="Back to roles"
            >
              <span className={x.backChevron} aria-hidden="true">
                ‹
              </span>
              Roles
            </button>
            <button
              type="button"
              className={`${s.tab} ${activeTab === "description" ? s.tabActive : ""}`}
              onClick={() => setTab("description")}
            >
              Description
            </button>
            {hasProject && (
              <button
                type="button"
                className={`${s.tab} ${activeTab === "project" ? s.tabActive : ""}`}
                onClick={() => setTab("project")}
              >
                Project
              </button>
            )}
          </div>

          <div className={s.detailScroll}>
            <h2 className={s.detailHeading}>{role.role}</h2>
            <p className={s.detailSub}>
              {role.company} · {role.period}
            </p>

            {image ? (
              <div className={s.imageFrame} style={{ marginTop: 16 }}>
                <img className={s.image} src={image} alt={`${role.company} — ${activeTab}`} />
              </div>
            ) : (
              activeTab === "description" &&
              role.site && (
                <div style={{ marginTop: 16, marginBottom: 16 }}>
                  <SiteFrame url={role.site.url} image={role.site.image} label={role.company} />
                </div>
              )
            )}

            {paragraphs.map((paragraph, i) => (
              <p key={i} className={s.prose}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExperienceApp;
