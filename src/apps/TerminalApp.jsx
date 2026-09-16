import { useEffect, useRef, useState } from "react";
import s from "./apps.module.scss";
import term from "./TerminalApp.module.scss";
import { useWindows } from "../os/state/windows";
import { profile, socials } from "../data/profile";
import { experience } from "../data/experience";
import { projects } from "../data/projects";
import { aboutSlides } from "../data/about";

const PROMPT = "ammar@portfolio ~ %";

const FILES = {
  "about.txt": () => aboutSlides.flatMap((slide) => slide.paragraphs),
  "experience.txt": () =>
    experience.map((e) => `${e.period.padEnd(22)} ${e.role} — ${e.company}`),
  "projects.txt": () =>
    projects.map((p) => `${p.name.padEnd(18)} ${p.tech.join(", ")}`),
  "contact.txt": () => socials.map((sc) => `${sc.label.padEnd(10)} ${sc.handle}`),
};

const BANNER = [
  `Last login: ${new Date().toDateString()}`,
  `Welcome to ${profile.name}'s portfolio shell.`,
  `Type "help" for available commands.`,
];

function runCommand(raw, { openApp, appNames, clear }) {
  const [cmd, ...args] = raw.trim().split(/\s+/);

  switch (cmd) {
    case "":
      return [];

    case "help":
      return [
        "Available commands:",
        "  help              show this message",
        "  whoami            who you're talking to",
        "  ls                list readable files",
        "  cat <file>        print a file",
        "  open <app>        open an app window",
        "  apps              list openable apps",
        "  socials           where to find me",
        "  clear             clear the screen",
      ];

    case "whoami":
      return [profile.name, ...profile.intro, `Currently: ${profile.roles.join(", ")}`];

    case "ls":
      return [Object.keys(FILES).join("   ")];

    case "cat": {
      if (!args[0]) return ["usage: cat <file>"];
      const file = FILES[args[0]];
      if (!file) return [`cat: ${args[0]}: No such file or directory`];
      return file();
    }

    case "apps":
      return [Object.keys(appNames).join("   ")];

    case "open": {
      if (!args[0]) return ["usage: open <app>"];
      const id = args[0].toLowerCase();
      if (!appNames[id]) {
        return [`open: ${args[0]}: app not found. Try "apps".`];
      }
      openApp(id);
      return [`Opening ${appNames[id]}…`];
    }

    case "socials":
      return socials.map((sc) => `${sc.label.padEnd(10)} ${sc.href}`);

    case "clear":
      clear();
      return [];

    case "sudo":
      return ["Nice try."];

    default:
      return [`zsh: command not found: ${cmd}`];
  }
}

function TerminalApp() {
  const { openApp, apps } = useWindows();
  const [lines, setLines] = useState(BANNER);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyAt, setHistoryAt] = useState(-1);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Keep the prompt in view as output accumulates.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const appNames = Object.fromEntries(apps.map((app) => [app.id, app.name]));

  const submit = (e) => {
    e.preventDefault();
    const entered = input;
    const output = runCommand(entered, {
      openApp,
      appNames,
      clear: () => setLines([]),
    });

    if (entered.trim() !== "clear") {
      setLines((prev) => [...prev, `${PROMPT} ${entered}`, ...output]);
    }
    if (entered.trim()) {
      setHistory((prev) => [entered, ...prev]);
    }
    setHistoryAt(-1);
    setInput("");
  };

  // Up/down walk shell history, same as a real prompt.
  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyAt + 1, history.length - 1);
      if (next >= 0) {
        setHistoryAt(next);
        setInput(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyAt - 1;
      setHistoryAt(next);
      setInput(next >= 0 ? history[next] : "");
    }
  };

  return (
    <div
      className={`${s.appRoot} ${term.terminal}`}
      onPointerUp={() => inputRef.current?.focus()}
    >
      <div className={term.scroll} ref={scrollRef}>
        {lines.map((line, i) => (
          <div key={i} className={term.line}>
            {line || " "}
          </div>
        ))}

        <form className={term.promptRow} onSubmit={submit}>
          <span className={term.prompt}>{PROMPT}</span>
          <input
            ref={inputRef}
            className={term.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal input"
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  );
}

export default TerminalApp;
