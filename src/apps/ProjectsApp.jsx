import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import s from "./apps.module.scss";
import x from "./ProjectsApp.module.scss";
import { projects } from "../data/projects";

const spring = { type: "spring", stiffness: 320, damping: 32, mass: 0.9 };

/** Medium-style card feed. Clicking a card morphs its image/title into a
 * full article view; the reverse happens on back. */
function ProjectsApp() {
  const [openId, setOpenId] = useState(null);
  const opened = projects.find((p) => p.id === openId);

  return (
    <div className={s.appRoot}>
      <div className={s.toolbar}>
        {opened ? (
          <button
            type="button"
            className={x.backButton}
            onClick={() => setOpenId(null)}
            aria-label="Back to projects"
          >
            <span className={x.backChevron} aria-hidden="true">
              ‹
            </span>
            Projects
          </button>
        ) : (
          <span className={s.toolbarTitle}>Projects</span>
        )}
        <span className={s.toolbarSpacer} />
      </div>

      <LayoutGroup id="projects">
        <AnimatePresence mode="popLayout" initial={false}>
          {opened ? (
            <motion.div
              key={`detail-${opened.id}`}
              className={x.article}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <div className={x.articleInner}>
                <motion.div className={x.articleHero} layoutId={`project-image-${opened.id}`}>
                  <img
                    className={x.articleHeroImage}
                    src={opened.image}
                    alt={opened.name}
                  />
                </motion.div>

                {opened.tech && (
                  <div className={s.chipRow}>
                    {opened.tech.map((tech) => (
                      <span key={tech} className={s.chip}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <motion.h1
                  className={x.articleTitle}
                  layoutId={`project-title-${opened.id}`}
                >
                  {opened.name}
                </motion.h1>
                <p className={x.articleSubtitle}>{opened.subtitle}</p>

                <div className={x.articleMeta}>
                  <a
                    className={`${s.button} ${s.buttonPrimary}`}
                    href={opened.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/images/github.png"
                      alt=""
                      aria-hidden="true"
                      style={{ width: 14, height: 14, filter: "invert(1)" }}
                    />
                    View on GitHub
                  </a>
                </div>

                {opened.content?.map((paragraph, i) => (
                  <p key={i} className={x.articleProse}>
                    {paragraph}
                  </p>
                ))}

                {opened.features && (
                  <>
                    <div className={x.featuresHeading}>Key features</div>
                    <ul className={x.featuresList}>
                      {opened.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="feed"
              className={x.feed}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {projects.map((project) => (
                <div
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  className={x.card}
                  onClick={() => setOpenId(project.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setOpenId(project.id);
                  }}
                >
                  <div className={x.cardBody}>
                    <motion.h3
                      className={x.cardTitle}
                      layoutId={`project-title-${project.id}`}
                      transition={spring}
                    >
                      {project.name}
                    </motion.h3>
                    <p className={x.cardSubtitle}>
                      {project.subtitle ?? project.description}
                    </p>

                    <div className={x.cardFooter}>
                      <a
                        className={x.ghButton}
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${project.name} on GitHub`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <img src="/images/github.png" alt="" aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  <motion.div
                    className={x.cardImageFrame}
                    layoutId={`project-image-${project.id}`}
                    transition={spring}
                  >
                    <img className={x.cardImage} src={project.image} alt="" />
                  </motion.div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}

export default ProjectsApp;
