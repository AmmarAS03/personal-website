// Work history, newest first. `project` is optional — roles without one
// render description only (no Project tab in the Experience app).
export const experience = [
  {
    id: 1,
    role: "Software Engineer",
    company: "Distrosub",
    period: "June 2026 – Present",
    description: [
      "Distrosub is a Brisbane based artist-first music streaming platform I work on under contract.",
      "I came in to take the product past its MVP stage, which mostly means moving it from a Next.js PWA into a proper React Native app. I also run sprint planning and set the technical direction for the short and long term work. Day to day I look into reported issues through Sentry, write up what I find for the team, and test releases before they go out so the platform stays stable for its 500+ active users. A good chunk of my time here goes into AI tooling. I built an AI code review agent into the CI/CD pipeline so bugs get caught before merge instead of in production, and I open sourced a Claude Code skill that generates interactive flow diagrams from the codebase. That one cut our onboarding time down a lot.",
    ],
    site: { url: "distrosub.com/landing", image: "/images/distrosub-site.jpg" },
  },
  {
    id: 2,
    role: "Founding Engineer",
    company: "Meels",
    period: "Sept 2025 – Present",
    description: [
      "Meels is a Melbourne startup that turns short-form food videos into recipes, shopping lists, and meal plans people actually use, built as a social video and forum app for home cooks.",
      "I work remotely as the founding engineer, having built the platform from scratch and taken it through to production. The feature I own most closely is meal planning: recipe ingredients sync straight into a shopping list, units get merged where they overlap, and every ingredient keeps a link back to the video it came from. The rest of my work sits on the data side for FMCG brand partners, an analytics dashboard that pulls usage data like recipe volume, ingredient pairings, and seasonal trends, adds brand specific context, and runs it through an LLM to produce insights and partnership recommendations. There's also a lead generation pipeline that reads platform trends by itself to spot ingredient opportunities before they take off, then drafts outreach and fills in verified contact details for the brands worth approaching.",
    ],
    site: { url: "meelsapp.com", image: "/images/meels-site.jpg" },
  },
  {
    id: 3,
    role: "Web Developer",
    company: "Newish Communications",
    period: "Jan 2025 – June 2025",
    description:
      "Newish is a communications agency run by students from the University of Queensland with the support and mentorship of industry professionals specializing in content creation, social media marketing, and digital platform. I work as a web dev team and learn how to work as a team and discuss with real clients from Brisbane.",
    project:
      "My projects Revolve in designing and making website using Figma and Wordpress. In addition, my job is also to understand the client's need and discuss what's the best way to approach their problem.",
    workImage: "/images/newish_page.jpg",
    projectImage: "/images/newish_project.jpg",
  },
  {
    id: 4,
    role: "Software Engineer",
    company: "Techflouu",
    period: "Feb 2024 – Mar 2025",
    description:
      "Techflouu is an IT Consulting startup based in Singapore with team from all over ASEAN countries. I started my journey with Techflouu as an intern and in my final month, I was offered a full time offer. I was quite suprised and scared because Im still in my 6th semester with a full time offer in front of my face. But, stepping back isn't really my thing so I took the offer and become a full time software engineer x full time student.",
    project:
      "I've been heavily involved in 2 projects where both of them are live right now. I created a gamification feature for users to track their habits and reward them.",
    workImage: "/images/TechflouuWork.JPG",
    projectImage: "/images/TechflouuProject.png",
  },
  {
    id: 6,
    role: "Network Engineer Intern",
    company: "Netsistem Infotama",
    period: "Apr 2023 – June 2023",
    description:
      "Netsistem is a government-focused outsourcing company. I have the chance to work with BIN, where I learned valuable understanding about 7-layer OSI which strengthen my computer science foundation.",
    workImage: "/images/Network.jpg",
  },
];

// Removed from display, kept for later reuse. Not rendered by ExperienceApp.
export const experienceArchived = [
  {
    id: 7,
    role: "Teaching Assistant",
    company: "Faculty of Computer Science UI",
    period: "Jan 2023 – June 2023",
    description:
      "As a Teaching Assistant for Foundation of Programming 2 (Java), I mentored 8 students over 4 months. I conducted lab sessions, assisting in understanding programming concepts and their Java assignments.",
    workImage: "/images/TA.jpg",
  },
  {
    id: 8,
    role: "Python Mentor",
    company: "Dasar-dasar Pemrograman 0",
    period: "July 2022 - August 2022",
    description:
      "Dasar-dasar Pemrograman 0 is a program where second year computer science student teach new students the basics of coding using Python. It's a 4 week program where I gave them weekly mentoring.",
    workImage: "/images/mentor.jpg",
  },
];
