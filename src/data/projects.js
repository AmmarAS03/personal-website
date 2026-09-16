// `tech` lists only stacks named in the original descriptions; nothing inferred.
// Emptied to rebuild from scratch. Old entries kept below in projectsArchived, not deleted.
export const projects = [
  {
    id: 1,
    name: "Claude Code Skills",
    subtitle: "A personal library of Claude Code skills for reading unfamiliar code",
    image: "/images/skills-banner.svg",
    github: "https://github.com/AmmarAS03/skills",
    tech: ["Claude Code", "Skills", "Markdown"],
    description:
      "The skills I actually reach for day to day, built to help me and my team understand code faster without trading away quality for speed.",
    content: [
      "This is a running collection of the Claude Code skills I use daily to understand codebases I didn't write, my own past work included. The guiding rule behind all of them is that a skill should make you understand the system better, not just make output appear faster. If a shortcut trades comprehension for speed, it doesn't belong here.",
      "Right now the repo holds two. `learn-visualise` traces a code flow across one or more repositories and renders it as an interactive, scrollable, dark-mode diagram, built for re-learning how a feature works end to end by following real call chains instead of guessing from file names. `system-design-review` reviews an existing flow and produces an evolved, version-by-version view of how the architecture should scale, grounded in file:line citations rather than speculative rewrites.",
      "Both skills share the same principle: read the actual files, trace the actual calls, and stay honest about uncertainty. A confident but wrong diagram does more damage than no diagram at all.",
      "I use these with my own team first. Once a skill has been through enough real use and is polished, it lands here so anyone can pick it up.",
    ],
    features: [
      "learn-visualise: traces cross-repo code flows into an interactive dark-mode diagram",
      "system-design-review: evolves an architecture version-by-version toward its next realistic scale",
      "Every trace is grounded in real file reads, never inferred from naming alone",
    ],
  },
  {
    id: 2,
    name: "UQuizzle",
    subtitle: "Turning lecture recordings into interactive quizzes",
    image: "/images/uquizzle.png",
    github: "https://github.com/nafisazizir/uquizzle",
    tech: ["Chrome Extension", "OpenAI API", "JavaScript"],
    description:
      "A Chrome extension that sits inside the Echo360 lecture player and turns whatever's playing into quizzes, notes, and timestamped feedback.",
    content: [
      "UQuizzle is a Chrome extension built to help students study directly from their lecture recordings. It embeds itself into the Echo360 video player, where most university lectures live, and layers AI-powered study tools on top of the stream, so the material becomes something you can actively test yourself on instead of just replaying it at 2x speed.",
      "The extension reads the lecture content and generates multiple-choice quizzes on the fly, each question linked to the exact timestamp in the video where that topic was covered. Get something wrong, and you jump straight back to the moment it was explained instead of scrubbing through fifty minutes of footage.",
      "Alongside quizzes, it condenses each lecture into concise, downloadable notes, and after a quiz attempt it breaks down performance by topic: what you're solid on, what needs another pass, and what to review next.",
      "AI shows up in two places in the build itself: during development, to help with debugging, and after, to tighten the wording on user-facing copy like instructions and feedback text.",
    ],
    features: [
      "Quiz generation with timestamp-linked multiple choice questions",
      "Downloadable, auto-summarized lecture notes",
      "Topic-by-topic performance feedback after each quiz",
      "One-click navigation back to the relevant point in the lecture",
    ],
  },
];

export const projectsArchived = [
  {
    id: 1,
    name: "Siasisten",
    image: "/images/Siasisten.png",
    tech: ["Python REST", "ReactJS"],
    description:
      "Siasisten is a web app that efficiently manages teaching assistant related works for admin, finance, lecturers, and students. made with Python REST and reactJS.",
  },
  {
    id: 2,
    name: "Digipets",
    image: "/images/digipets.png",
    tech: ["Bootstrap"],
    description:
      "A digital pets application where you can find, raise, and cuztomized your pets. I handled Micro-transactions module using Bootstrap.",
  },
  {
    id: 3,
    name: "ACB-ISBE",
    image: "/images/acb.png",
    tech: ["Django", "Flutter"],
    description:
      "A web conference app with 1600+ data about paper, journals, etc. Redesigned the web and mobile app using Django and Flutter.",
  },
  {
    id: 4,
    name: "EAN-13",
    image: "/images/ean-13.png",
    tech: ["Python"],
    description:
      "Barcode generator that automates the creation of the 13th number. Created using Python.",
  },
  {
    id: 5,
    name: "Gotong Ruang",
    image: "/images/gotongruang.png",
    tech: ["NodeJS", "ReactJS"],
    description:
      "A community based platform for users to discover and participate in various volunteer activities. made with NodeJS and ReactJS",
  },
  {
    id: 6,
    name: "Fine-Later",
    image: "/images/fine-later.png",
    tech: ["NodeJS"],
    description:
      "Fine Later is a prototype to help scientist gather data to handle the low quality for pediatrics medicine. Ensuring easiness, privacy, and quality. Build with NodeJS.",
  },
  {
    id: 7,
    name: "Blazer's Analysis",
    image: "/images/portland.png",
    tech: ["Web Scraping", "Machine Learning"],
    description:
      "A data analysis project, extracting real-time 1000+ data through web scraping. Applying machine learning algorithms to analyze and evaluate performance.",
  },
];
