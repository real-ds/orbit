"use client";

import { useEffect, useState } from "react";

const WORDS = [
  "AI",
  "Agentic Systems",
  "Deep Learning",
  "Machine Learning",
];

export default function AboutHero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = WORDS[wordIndex];
    let delay = deleting ? 45 : 85;

    if (!deleting && text === currentWord) {
      delay = 1700;
    } else if (deleting && text === "") {
      delay = 350;
    }

    const timer = window.setTimeout(() => {
      if (!deleting && text === currentWord) {
        setDeleting(true);
        return;
      }

      if (deleting && text === "") {
        setDeleting(false);
        setWordIndex((prev) => (prev + 1) % WORDS.length);
        return;
      }

      setText(
        deleting
          ? currentWord.slice(0, text.length - 1)
          : currentWord.slice(0, text.length + 1)
      );
    }, delay);

    return () => window.clearTimeout(timer);
  }, [text, deleting, wordIndex]);

  return (
    <header className="about-hero">
      <div className="about-hero__inner">
        <h1 className="about-hero__title">
          <span className="about-hero__question">
            What do you want to
          </span>

          <span className="about-hero__question">
            orbit around<span className="about-hero__question-mark">?</span>
          </span>

          <span
            className="about-hero__typewriter"
            aria-hidden="true"
          >
            <span className="about-hero__typed">{text}</span>
            <span className="about-hero__cursor" />
          </span>

          <span className="sr-only">
            AI, Agentic Systems, Deep Learning and Machine Learning.
          </span>
        </h1>
      </div>
    </header>
  );
}
