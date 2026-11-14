"use client";

import { useEffect, useRef } from "react";

/**
 * AnimateOnScroll — wraps any content and fades/slides it in
 * when it scrolls into the viewport using IntersectionObserver.
 *
 * Props:
 *  @param {string}  variant   - "up" | "left" | "right" | "scale"  (default "up")
 *  @param {string}  delay     - CSS delay class, e.g. "delay-200"
 *  @param {string}  className - Extra classes forwarded to the wrapper <div>
 *  @param {number}  threshold - Fraction of element visible before trigger (0–1)
 */
export default function AnimateOnScroll({
  children,
  variant = "up",
  delay = "",
  className = "",
  threshold = 0.12,
  as: Tag = "div",
}) {
  const ref = useRef(null);

  // Map variant names → CSS class names defined in globals.css
  const variantClass = {
    up:    "reveal",
    left:  "reveal-left",
    right: "reveal-right",
    scale: "reveal-scale",
  }[variant] ?? "reveal";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("reveal-visible");
          observer.unobserve(el); // animate only once
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      className={`${variantClass} ${delay} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
