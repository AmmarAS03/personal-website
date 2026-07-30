import { useState } from "react";
import s from "./apps.module.scss";
import { experience } from "../data/experience";

/** Mail-style sidebar of roles with a description/project detail pane. */
function ExperienceApp() {
  const [selectedId, setSelectedId] = useState(experience[0].id);
  const [tab, setTab] = useState("description");

  const role = experience.find((item) => item.id === selectedId) ?? experience[0];
  const hasProject = Boolean(role.project);
  // Roles without a project can only ever show the description.
  const activeTab = hasProject ? tab : "description";

  const image = activeTab === "project" ? role.projectImage : role.workImage;
  const body = activeTab === "project" ? role.project : role.description;

  return (
    <div className={s.appRoot}>
      <div className={s.split}>
        <nav className={s.sidebar} aria-label="Roles">
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
              }}
            >
              <div className={s.itemTitle}>{item.role}</div>
              <div className={s.itemMeta}>{item.company}</div>
              <div className={s.itemMeta}>{item.period}</div>
            </button>
          ))}
        </nav>

        <div className={s.detail}>
          <div className={s.tabs}>
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

            {image && (
              <div className={s.imageFrame} style={{ marginTop: 16 }}>
                <img className={s.image} src={image} alt={`${role.company} — ${activeTab}`} />
              </div>
            )}

            <p className={s.prose}>{body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExperienceApp;
