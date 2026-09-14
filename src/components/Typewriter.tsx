import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface TypewriterProps {
  words: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  pauseTime?: number;
}

export function Typewriter({
  words,
  className,
  typingSpeed = 65,
  deletingSpeed = 30,
  pauseMs = 1800,
  pauseTime,
}: TypewriterProps) {
  const actualPause = pauseTime ?? pauseMs;
  const safeWords =
    Array.isArray(words) && words.length > 0
      ? words.map((w) => (typeof w === "string" ? w.trim() : "")).filter(Boolean)
      : ["Full-Stack Web Architect"];
  const finalWords = safeWords.length > 0 ? safeWords : ["Full-Stack Web Architect"];

  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [idle, setIdle] = useState(false);
  const jitter = useRef(0);

  // Reset typewriter when the list of words changes
  const wordsKey = JSON.stringify(finalWords);
  useEffect(() => {
    setIndex(0);
    setText("");
    setDeleting(false);
    setIdle(false);
  }, [wordsKey]);

  useEffect(() => {
    const current = finalWords[index % finalWords.length] ?? "";

    // Full word completed: pause before deleting
    if (!deleting && text === current) {
      setIdle(true);
      const timeout = setTimeout(() => {
        setIdle(false);
        setDeleting(true);
      }, actualPause);
      return () => clearTimeout(timeout);
    }

    // Word completely cleared: pause briefly before next word
    if (deleting && text === "") {
      setIdle(true);
      const timeout = setTimeout(() => {
        setIdle(false);
        setDeleting(false);
        setIndex((i) => (i + 1) % finalWords.length);
      }, 360);
      return () => clearTimeout(timeout);
    }

    // Natural human keystroke timing variation
    jitter.current = Math.random() * 26 - 10;
    const nextChar = current.charAt(text.length);
    const isPunctuation = /[.,&/ -]/.test(nextChar);
    const delay = Math.max(
      22,
      (deleting ? deletingSpeed : typingSpeed) +
        (deleting ? 0 : jitter.current) +
        (isPunctuation ? 90 : 0),
    );

    const timeout = setTimeout(() => {
      setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, deleting, index, finalWords, typingSpeed, deletingSpeed, actualPause]);

  return (
    <span
      className={cn("inline-flex items-center font-sora font-bold tracking-tight", className)}
      aria-label={finalWords.join(", ")}
    >
      <span
        aria-hidden
        className="bg-gradient-to-r from-accent via-emerald-300 to-teal-200 bg-clip-text text-transparent drop-shadow-sm whitespace-pre"
      >
        {text}
      </span>
      <span
        aria-hidden
        className={cn(
          "ml-1 inline-block h-[1.15em] w-[3px] translate-y-[0.06em] rounded-sm bg-accent shadow-[0_0_10px_var(--color-accent)] transition-opacity duration-150",
          idle ? "animate-blink-caret" : "opacity-100",
        )}
      />
    </span>
  );
}
