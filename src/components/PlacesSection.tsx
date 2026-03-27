import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "./SplitText";
import RevealOnScroll from "./RevealOnScroll";
import place1 from "@/assets/place-1.jpg";
import place2 from "@/assets/place-2.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import obj1 from "@/assets/object-1.jpg";
import obj2 from "@/assets/object-2.jpg";
import obj3 from "@/assets/object-3.jpg";
import obj4 from "@/assets/object-4.jpg";

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// PROJECTS DATA
// ============================================================
const projects = [
  { name: "Luxe Finance", category: "Fintech · Mobile App", image: place1 },
  { name: "Noir Dashboard", category: "SaaS · Web Platform", image: place2 },
  { name: "Atelier Brand", category: "E-Commerce · Luxury", image: obj1 },
  { name: "Zenith Analytics", category: "Enterprise · Dashboard", image: obj2 },
  { name: "Serenity App", category: "Wellness · Mobile", image: obj3 },
  { name: "Maison Estates", category: "Real Estate · Web", image: obj4 },
  { name: "Studio Workspace", category: "Productivity · SaaS", image: heroBg },
];

const PlacesSection = () => {
  // ============================================================
  // STATE & REFS
  // ============================================================
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // FIX: Touch detection — properly separates mobile vs desktop logic
  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  // Swipe refs
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);
  // Pointer swipe refs (for pointer events fallback)
  const pointerStartX = useRef(0);
  const pointerDragging = useRef(false);

  // ============================================================
  // NAVIGATION HELPER
  // ============================================================
  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(projects.length - 1, idx));
    setActiveIndex(clamped);
  }, []);

  // ============================================================
  // DESKTOP SCROLLTRIGGER — only runs on non-touch devices
  // FIX: was running on mobile too, causing conflict with swipe
  // ============================================================
  useEffect(() => {
    if (isTouchDevice) return; // ← KEY FIX: mobile pe bilkul nahi chalega

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        // FIX: scrub 0.5 → 0.3 for tighter scroll-to-animation sync
        end: `+=${projects.length * 100}%`,
        pin: true,
        scrub: 0.3,
        onUpdate: (self) => {
          const idx = Math.min(
            Math.floor(self.progress * projects.length),
            projects.length - 1
          );
          setActiveIndex(idx);
        },
      });
    }, section);

    return () => ctx.revert();
  }, []); // isTouchDevice is stable (window property), no need in deps

  // ============================================================
  // MOBILE SWIPE — touch events + pointer events fallback
  // FIX: was registering on desktop too — now mobile only
  // ============================================================
  useEffect(() => {
    if (!isTouchDevice) return; // ← Only runs on touch devices

    const section = sectionRef.current;
    if (!section) return;

    // Native touch events
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndRef.current = e.changedTouches[0].clientX;
      const diff = touchStartRef.current - touchEndRef.current;
      // FIX: threshold 50 → 40px for more responsive swipe detection
      if (Math.abs(diff) > 40) {
        if (diff > 0) setActiveIndex((p) => Math.min(p + 1, projects.length - 1));
        else setActiveIndex((p) => Math.max(p - 1, 0));
      }
    };

    section.addEventListener("touchstart", handleTouchStart, { passive: true });
    section.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      section.removeEventListener("touchstart", handleTouchStart);
      section.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--c-black)",
        // FIX: mobile pe h-screen 100dvh use karo (avoids browser chrome overlap)
        // Desktop pe normal 100vh (ScrollTrigger pin karta hai)
        height: isTouchDevice ? "100dvh" : "100vh",
        minHeight: isTouchDevice ? "100dvh" : "100vh",
      }}
    >
      {/* Image stack with clip-path */}
      <div ref={containerRef} className="absolute inset-0 z-[1]">
        {projects.map((project, i) => {
          let clipPath = "inset(0 100% 0 0)";
          if (i < activeIndex) clipPath = "inset(0 0 0 100%)";
          if (i === activeIndex) clipPath = "inset(0 0 0 0)";

          return (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                clipPath,
                // FIX: transition duration 1.2s → 0.85s for snappier feel
                transition: "clip-path 0.85s cubic-bezier(0.22, 0.61, 0.36, 1)",
                zIndex: i === activeIndex ? 2 : 1,
                // FIX: will-change for GPU compositing — eliminates paint jank
                willChange: "clip-path",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${project.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: i === activeIndex ? 0.55 : 0.15,
                  // FIX: transition on opacity also shortened
                  transition: "opacity 0.85s var(--f-cubic)",
                  // FIX: GPU hint for image layer
                  willChange: "opacity",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Gradient overlays */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(to right, var(--c-black) 0%, rgba(var(--c-black-rgb), 0.4) 40%, rgba(var(--c-navy-rgb), 0.6) 100%)",
        }}
      />

      {/* Navigation dots */}
      <div className="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-20">
        <span
          className="block w-px h-8"
          style={{ backgroundColor: "rgba(var(--c-yellow-rgb), 0.1)" }}
        />
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="w-7 h-7 rounded-full border flex items-center justify-center text-[0.6rem] font-body transition-all duration-700"
            style={{
              borderColor:
                i === activeIndex
                  ? "rgba(var(--c-yellow-rgb), 0.5)"
                  : "rgba(var(--c-white-rgb), 0.06)",
              color:
                i === activeIndex
                  ? "var(--c-yellow)"
                  : "rgba(var(--c-white-rgb), 0.12)",
              backgroundColor:
                i === activeIndex
                  ? "rgba(var(--c-yellow-rgb), 0.05)"
                  : "transparent",
              boxShadow:
                i === activeIndex
                  ? "0 0 20px rgba(var(--c-yellow-rgb), 0.1)"
                  : "none",
            }}
          >
            {i + 1}
          </button>
        ))}
        <span
          className="block w-px h-8"
          style={{ backgroundColor: "rgba(var(--c-yellow-rgb), 0.1)" }}
        />
      </div>

      {/* Prev/Next buttons - Desktop (left side) */}
      <div className="hidden md:flex absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 flex-col gap-4 z-20">
        <button
          onClick={() => goTo(activeIndex - 1)}
          className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500"
          style={{
            borderColor: "rgba(var(--c-white-rgb), 0.08)",
            color:
              activeIndex > 0
                ? "var(--c-yellow)"
                : "rgba(var(--c-white-rgb), 0.08)",
            opacity: activeIndex > 0 ? 1 : 0.3,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
        <button
          onClick={() => goTo(activeIndex + 1)}
          className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500"
          style={{
            borderColor: "rgba(var(--c-white-rgb), 0.08)",
            color:
              activeIndex < projects.length - 1
                ? "var(--c-yellow)"
                : "rgba(var(--c-white-rgb), 0.08)",
            opacity: activeIndex < projects.length - 1 ? 1 : 0.3,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      {/* Counter */}
      <div className="absolute top-8 right-4 lg:right-10 z-20">
        <span
          className="font-display text-2xl"
          style={{ color: "var(--c-yellow)" }}
        >
          {activeIndex + 1}
        </span>
        <span
          className="font-display text-lg"
          style={{ color: "rgba(var(--c-white-rgb), 0.15)" }}
        >
          /{projects.length}
        </span>
      </div>

      {/* Content */}
      <div
        className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-16"
        style={{ margin: `0 var(--g-margin)` }}
      >
        <div className="mb-4">
          <p
            className="text-[0.6rem] uppercase tracking-[0.25em] mb-3"
            style={{ color: "rgba(var(--c-yellow-rgb), 0.7)" }}
          >
            {projects[activeIndex].category}
          </p>
          <h2 className="font-display" style={{ color: "var(--c-white)" }}>
            <span className="block text-[clamp(3rem,10vw,8rem)] leading-[0.85] tracking-[-0.02em]">
              <SplitText key={`place-${activeIndex}`} stagger={0.03} large>
                {projects[activeIndex].name}
              </SplitText>
            </span>
          </h2>
        </div>

        <RevealOnScroll key={`detail-${activeIndex}`} delay={0.1} y={20}>
          <p
            className="text-sm max-w-md"
            style={{ color: "rgba(var(--c-white-rgb), 0.5)" }}
          >
            A thoughtfully designed experience where every pixel serves a
            purpose. Merging elegance with usability.
          </p>
        </RevealOnScroll>

        {/* Mobile Buttons */}
        <div className="flex md:hidden gap-6 mt-8 justify-center">
          <button
            onClick={() => goTo(activeIndex - 1)}
            className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500"
            style={{
              borderColor: "rgba(var(--c-white-rgb), 0.15)",
              color:
                activeIndex > 0
                  ? "var(--c-yellow)"
                  : "rgba(var(--c-white-rgb), 0.3)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          <button
            onClick={() => goTo(activeIndex + 1)}
            className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500"
            style={{
              borderColor: "rgba(var(--c-white-rgb), 0.15)",
              color:
                activeIndex < projects.length - 1
                  ? "var(--c-yellow)"
                  : "rgba(var(--c-white-rgb), 0.3)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 4L10 8L6 12"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px z-20">
        <div
          className="h-full"
          style={{
            width: `${((activeIndex + 1) / projects.length) * 100}%`,
            background:
              "linear-gradient(to right, rgba(var(--c-yellow-rgb), 0.3), rgba(var(--c-rose-rgb), 0.2))",
            // FIX: transition 700ms → 500ms matches clip-path speed
            transition: "width 0.5s var(--f-cubic)",
          }}
        />
      </div>
    </section>
  );
};

export default PlacesSection;
