import { useState, useEffect, useCallback } from "react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setIsVisible(window.scrollY > 400);
    window.addEventListener("scroll", toggle, { passive: true });
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg"
      style={{
        // FIX: proper min 44px tap target
        width: "clamp(44px, 6vw, 52px)",
        height: "clamp(44px, 6vw, 52px)",
        backgroundColor: isVisible ? "rgba(var(--c-yellow-rgb), 0.85)" : "rgba(var(--c-yellow-rgb), 0)",
        boxShadow: isVisible ? "0 4px 20px rgba(var(--c-yellow-rgb), 0.25)" : "none",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1) translateY(0)" : "scale(0.8) translateY(8px)",
        pointerEvents: isVisible ? "auto" : "none",
        // FIX: use safe-area bottom on iPhone X+
        bottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))",
      }}
    >
      <svg
        width="18" height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--c-white)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
};

export default BackToTop;
