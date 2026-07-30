import { useState } from "react";
import s from "./apps.module.scss";
import { projects } from "../data/projects";

/** Finder-style grid; double-click (or Enter) drills into a project. */
function ProjectsApp() {
  const [selectedId, setSelectedId] = useState(null);
  const [openId, setOpenId] = useState(null);

  const opened = projects.find((p) => p.id === openId);

  if (opened) {
    return (
      <div className={s.appRoot}>
        <div className={s.toolbar}>
          <button type="button" className={s.button} onClick={() => setOpenId(null)}>
            ‹ Back
          </button>
          <span className={s.toolbarTitle}>{opened.name}</span>
        </div>

        <div className={s.detailScroll}>
          <div className={s.imageFrame}>
            <img className={s.image} src={opened.image} alt={opened.name} />
          </div>
          <h2 className={s.detailHeading}>{opened.name}</h2>
          <p className={s.prose} style={{ marginTop: 10 }}>
            {opened.description}
          </p>
          <div className={s.chipRow}>
            {opened.tech.map((tech) => (
              <span key={tech} className={s.chip}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.appRoot}>
      <div className={s.toolbar}>
        <span className={s.toolbarTitle}>Projects</span>
        <span className={s.toolbarSpacer} />
        <span className={s.hint}>{projects.length} items · double-click to open</span>
      </div>

      <div className={s.grid}>
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            className={`${s.tile} ${project.id === selectedId ? s.tileSelected : ""}`}
            onClick={() => setSelectedId(project.id)}
            onDoubleClick={() => setOpenId(project.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setOpenId(project.id);
            }}
          >
            <img className={s.tileImage} src={project.image} alt="" />
            <span className={s.tileLabel}>{project.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProjectsApp;
