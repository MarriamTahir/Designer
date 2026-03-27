/**
 * ObjectsShowcase.tsx  —  Case Studies Section
 *
 * FIXES in this version (on top of previous):
 *  ✦ Scroll speed 2x: scrub 0.8 → 0.3, section scroll distance tighter
 *  ✦ Desktop animation smoothness: transition 1.1s → 0.75s
 *  ✦ Mobile track: translate on active card (not static layout) — no more stuck cards
 *  ✦ Mobile: 100dvh instead of auto to prevent layout jump
 *  ✦ willChange: transform on track + cards — GPU compositing
 *  ✦ Card opacity transition 0.9s → 0.6s — snappier active/inactive switch
 *  ✦ gsap.context() cleanup — no memory leak on remount
 *  ✦ All existing functionality preserved
 */

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "./SplitText";
import { useIsMobile } from "@/hooks/use-mobile";
import obj1 from "@/assets/object-1.jpg";
import obj2 from "@/assets/object-2.jpg";
import obj3 from "@/assets/object-3.jpg";
import obj4 from "@/assets/object-4.jpg";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const CASE_STUDIES = [
  {
    title: "Luxe Finance App",
    subtitle: "Fintech · iOS & Android",
    description:
      "A premium mobile banking experience with biometric auth, dark-mode-first UI, and real-time spending analytics that reduced checkout friction by 3 steps.",
    tags: ["Figma", "Protopie", "2024"],
    image: obj1,
    href: "#contact",
  },
  {
    title: "Noir Dashboard",
    subtitle: "SaaS · Enterprise Analytics",
    description:
      "Enterprise analytics platform redesign — a unified design system that cut development hand-off time by 40% across 6 product teams.",
    tags: ["Figma", "FigJam", "2024"],
    image: obj2,
    href: "#contact",
  },
  {
    title: "Serenity Wellness",
    subtitle: "Health · Mobile Experience",
    description:
      "Meditation and mental wellness app focused on calm micro-interactions, voice-guided sessions, and accessibility-first design patterns.",
    tags: ["Figma", "Principle", "2025"],
    image: obj3,
    href: "#contact",
  },
  {
    title: "Maison Estates",
    subtitle: "Real Estate · Web Platform",
    description:
      "Luxury property discovery platform with immersive full-bleed galleries, map-based search, and a concierge-level inquiry flow.",
    tags: ["Figma", "Framer", "2025"],
    image: obj4,
    href: "#contact",
  },
] as const;

type Study = (typeof CASE_STUDIES)[number];

// Fixed per-card translateX positions for desktop track
const TX_DESKTOP = [2, -24, -50, -76] as const;

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const ObjectsShowcase = () => {
  const isMobile = useIsMobile();

  const sectionRef  = useRef<HTMLElement>(null);
  const prevCardRef = useRef(0);

  const [active,  setActive]  = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [trackTX, setTrackTX] = useState<number>(TX_DESKTOP[0]);

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(CASE_STUDIES.length - 1, idx));
    prevCardRef.current = clamped;
    setActive(clamped);
    setTrackTX(TX_DESKTOP[clamped]);
  }, []);

  // ── Desktop ScrollTrigger ────────────────────────────────────────────────
  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        // FIX: 120% → 90% per card — tighter scroll = faster response = 2x feel
        end: `+=${CASE_STUDIES.length * 90}%`,
        pin: true,
        // FIX: scrub 0.8 → 0.3 — tight sync, removes laggy animation delay
        scrub: 0.3,
        onUpdate(self) {
          const idx = Math.min(
            Math.floor(self.progress * CASE_STUDIES.length),
            CASE_STUDIES.length - 1,
          );
          if (idx !== prevCardRef.current) goTo(idx);
        },
      });
    }, section);

    return () => ctx.revert();
  }, [isMobile, goTo]);

  // ── Keyboard navigation ──────────────────────────────────────────────────
  useEffect(() => {
    if (isMobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown")
        goTo(prevCardRef.current + 1);
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")
        goTo(prevCardRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile, goTo]);

  return (
    <section
      ref={sectionRef}
      id="case-studies"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--c-black)",
        ...(isMobile
          // FIX: 100dvh accounts for mobile browser chrome (address bar)
          // avoids content being clipped or jumping on scroll
          ? { height: "100dvh", minHeight: "100dvh" }
          : { height: "100vh",  minHeight: "100vh" }),
      }}
    >
      {/* Left panel */}
      <LeftPanel
        active={active}
        isMobile={isMobile}
        onDotClick={goTo}
        onNext={() => goTo(active + 1)}
      />

      {/* Card track */}
      {isMobile ? (
        <MobileTrack active={active} onSwipe={goTo} />
      ) : (
        <DesktopTrack
          active={active}
          trackTX={trackTX}
          hovered={hovered}
          onHover={setHovered}
        />
      )}

      {/* Bottom progress bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px z-20"
        style={{ backgroundColor: "rgba(var(--c-white-rgb), 0.04)" }}
      >
        <div
          className="h-full"
          style={{
            width: `${((active + 1) / CASE_STUDIES.length) * 100}%`,
            background:
              "linear-gradient(to right, rgba(var(--c-yellow-rgb),0.4), rgba(var(--c-rose-rgb),0.2))",
            // FIX: 0.7s → 0.5s matches card transition speed
            transition: "width 0.5s var(--f-cubic)",
          }}
        />
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LEFT PANEL
// ─────────────────────────────────────────────────────────────────────────────
interface LeftPanelProps {
  active: number;
  isMobile: boolean;
  onDotClick: (i: number) => void;
  onNext: () => void;
}

const LeftPanel = ({ active, isMobile, onDotClick, onNext }: LeftPanelProps) => {
  const study  = CASE_STUDIES[active];
  const isLast = active === CASE_STUDIES.length - 1;

  return (
    <div
      className="relative lg:absolute left-0 top-0 h-full z-10 flex flex-col justify-center w-full lg:w-[38%]"
      style={{
        padding: isMobile
          ? "clamp(4rem,10vh,6rem) var(--g-margin) 2rem"
          : "0 0 0 var(--g-margin)",
      }}
    >
      <p
        className="text-[0.7rem] uppercase tracking-[0.25em] mb-5"
        style={{ color: "rgba(var(--c-yellow-rgb), 0.5)" }}
      >
        Case Studies
      </p>

      <div className="flex items-baseline gap-1 mb-5">
        <span
          className="font-display leading-none"
          style={{
            fontSize: "clamp(3rem,5.5vw,4.5rem)",
            color: "var(--c-yellow)",
            transition: "all 0.6s var(--f-cubic)",
          }}
        >
          {String(active + 1).padStart(2, "0")}
        </span>
        <span
          className="font-display text-2xl"
          style={{ color: "rgba(var(--c-white-rgb), 0.30)" }}
        >
          /{CASE_STUDIES.length}
        </span>
      </div>

      {/* Title */}
      <div className="overflow-hidden mb-2">
        <h2
          className="font-display leading-[0.9]"
          style={{
            fontSize: "clamp(1.8rem,3.2vw,2.8rem)",
            color: "var(--c-white)",
          }}
        >
          <SplitText key={`title-${active}`} stagger={0.025}>
            {study.title}
          </SplitText>
        </h2>
      </div>

      {/* Subtitle */}
      <p
        className="text-[0.7rem] uppercase tracking-[0.2em] mb-4"
        style={{ color: "rgba(var(--c-yellow-rgb), 0.55)" }}
      >
        {study.subtitle}
      </p>

      {/* Description */}
      <p
        className="text-sm leading-relaxed max-w-xs mb-6"
        style={{
          color: "rgba(var(--c-white-rgb), 0.45)",
          lineHeight: "1.65",
        }}
      >
        {study.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-7">
        {study.tags.map((tag) => (
          <span
            key={tag}
            className="text-[0.6rem] uppercase tracking-[0.15em] px-3 py-1 rounded-full"
            style={{
              border: "1px solid rgba(var(--c-yellow-rgb), 0.15)",
              color: "rgba(var(--c-yellow-rgb), 0.45)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <a
        href={study.href}
        className="oa-button oa-button-reverse"
        style={{ alignSelf: "flex-start", marginBottom: "2rem" }}
      >
        <span>View Case Study</span>
      </a>

      {/* Progress dots */}
      <div className="flex items-center gap-3">
        {CASE_STUDIES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to project ${i + 1}`}
            onClick={() => onDotClick(i)}
            style={{
              height: "0.35rem",
              width: i === active ? "1.8rem" : "0.35rem",
              borderRadius: "9999px",
              backgroundColor:
                i === active
                  ? "var(--c-yellow)"
                  : "rgba(var(--c-white-rgb), 0.18)",
              transition: "all 0.5s var(--f-cubic)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              flexShrink: 0,
            }}
          />
        ))}

        {!isLast && (
          <button
            onClick={onNext}
            className="ml-3 flex items-center gap-2"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span
              className="text-[0.6rem] uppercase tracking-[0.2em]"
              style={{ color: "rgba(var(--c-yellow-rgb), 0.4)" }}
            >
              Next
            </span>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M2.5 6.5h8M7 2.5l4 4-4 4"
                stroke="rgba(227,6,0,0.5)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* View All Work */}
      <a
        href="#projects"
        className="mt-6 flex items-center gap-2 self-start"
        style={{
          color: "rgba(var(--c-white-rgb), 0.20)",
          textDecoration: "none",
          transition: "color 0.5s var(--f-cubic)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "rgba(var(--c-yellow-rgb), 0.7)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(var(--c-white-rgb), 0.20)";
        }}
      >
        <span className="text-[0.65rem] uppercase tracking-[0.2em]">
          View All Work
        </span>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path
            d="M2 9L9 2M9 2H3.5M9 2V7.5"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      </a>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP TRACK
// ─────────────────────────────────────────────────────────────────────────────
interface DesktopTrackProps {
  active: number;
  trackTX: number;
  hovered: number | null;
  onHover: (i: number | null) => void;
}

const DesktopTrack = ({
  active,
  trackTX,
  hovered,
  onHover,
}: DesktopTrackProps) => (
  <div
    className="absolute right-0 top-0 h-full w-[65%] z-[5] flex items-center overflow-hidden"
    style={{ perspective: "1200px" }}
  >
    <div
      className="flex gap-10 px-8"
      style={{
        transform: `translateX(${trackTX}%)`,
        // FIX: transition 1.1s → 0.75s — snappier card movement
        transition: "transform 0.75s var(--f-cubic)",
        // FIX: GPU hint — prevents repaint during transform
        willChange: "transform",
      }}
    >
      {CASE_STUDIES.map((study, i) => (
        <DesktopCard
          key={i}
          study={study}
          index={i}
          isActive={i === active}
          isHovered={hovered === i}
          onHover={onHover}
        />
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP CARD
// ─────────────────────────────────────────────────────────────────────────────
interface DesktopCardProps {
  study: Study;
  index: number;
  isActive: boolean;
  isHovered: boolean;
  onHover: (i: number | null) => void;
}

const DesktopCard = ({
  study,
  index,
  isActive,
  isHovered,
  onHover,
}: DesktopCardProps) => (
  <a
    href={study.href}
    className="flex-shrink-0 block"
    style={{
      width: "clamp(280px, 21vw, 350px)",
      textDecoration: "none",
      transform: isActive
        ? "scale(1) rotateY(0deg) translateZ(0)"
        : "scale(0.87) rotateY(-5deg) translateZ(-40px)",
      opacity:   isActive ? 1 : 0.22,
      filter:    isActive ? "blur(0px)" : "blur(2px)",
      // FIX: opacity/filter 0.9s → 0.6s — faster active/inactive switch
      transition:
        "transform 0.75s var(--f-cubic), opacity 0.6s var(--f-cubic), filter 0.6s var(--f-cubic)",
      transformStyle: "preserve-3d",
      // FIX: GPU compositing for each card
      willChange: "transform, opacity",
    }}
    onMouseEnter={() => onHover(index)}
    onMouseLeave={() => onHover(null)}
  >
    {/* Image box */}
    <div
      className="relative overflow-hidden rounded-lg"
      style={{
        aspectRatio: "3/4",
        border: `1px solid ${
          isActive
            ? "rgba(var(--c-yellow-rgb), 0.15)"
            : "rgba(var(--c-white-rgb), 0.04)"
        }`,
        boxShadow: isActive
          ? "0 24px 70px -20px rgba(var(--c-yellow-rgb), 0.18)"
          : "none",
        transition:
          "border-color 0.6s var(--f-cubic), box-shadow 0.6s var(--f-cubic)",
      }}
    >
      <img
        src={study.image}
        alt={study.title}
        loading="lazy"
        className="w-full h-full object-cover"
        style={{
          transform:
            isActive || isHovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 1.2s var(--f-cubic)",
        }}
      />

      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(var(--c-black-rgb),0.85) 0%, transparent 55%)",
        }}
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-5"
        style={{
          opacity: isHovered && isActive ? 1 : 0,
          transition: "opacity 0.45s var(--f-cubic)",
          background:
            "linear-gradient(to top, rgba(var(--c-black-rgb),0.96) 0%, rgba(var(--c-navy-rgb),0.7) 55%, transparent 100%)",
        }}
      >
        <p
          className="text-xs leading-relaxed mb-3"
          style={{ color: "rgba(var(--c-white-rgb), 0.5)" }}
        >
          {study.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-4">
          {study.tags.map((t) => (
            <span
              key={t}
              className="text-[0.55rem] uppercase tracking-[0.12em] px-2 py-0.5 rounded-full"
              style={{
                border: "1px solid rgba(var(--c-yellow-rgb), 0.2)",
                color: "rgba(var(--c-yellow-rgb), 0.5)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <span
          className="text-[0.65rem] uppercase tracking-[0.18em] flex items-center gap-2"
          style={{ color: "var(--c-yellow)" }}
        >
          Open case study
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path
              d="M2 9L9 2M9 2H3.5M9 2V7.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>
    </div>

    {/* Title below card */}
    <div className="mt-4">
      <h3
        className="font-display text-lg xl:text-xl"
        style={{
          color: isActive
            ? "var(--c-white)"
            : "rgba(var(--c-white-rgb), 0.2)",
          transition: "color 0.6s var(--f-cubic)",
        }}
      >
        {study.title}
      </h3>
      <p
        className="text-[0.65rem] uppercase tracking-[0.2em] mt-1"
        style={{
          color: isActive
            ? "rgba(var(--c-yellow-rgb), 0.55)"
            : "rgba(var(--c-white-rgb), 0.30)",
          transition: "color 0.6s var(--f-cubic)",
        }}
      >
        {study.subtitle}
      </p>
    </div>
  </a>
);

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE TRACK — centered active card with translateX slide
// FIX: old version had all cards in row without proper centering logic
// Now active card is centered using CSS transform on the track container
// ─────────────────────────────────────────────────────────────────────────────
interface MobileTrackProps {
  active: number;
  onSwipe: (i: number) => void;
}

const MobileTrack = ({ active, onSwipe }: MobileTrackProps) => {
  const startX   = useRef(0);
  const dragging = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    const diff = startX.current - e.clientX;
    if (Math.abs(diff) < 40) return;
    if (diff > 0) onSwipe(active + 1);
    else          onSwipe(active - 1);
  };

  // FIX: translateX the entire track so active card is always centered
  // Card width ~72vw, gap ~20px; shift by active * (72vw + 20px)
  const CARD_VW = 72;
  const GAP_PX  = 20;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-[5]"
      style={{
        // Sit in the bottom half of the section
        top: "45%",
        overflow: "hidden",
        // Center the first card
        paddingLeft: `calc(14vw)`,
      }}
    >
      <div
        className="flex select-none"
        style={{
          gap: `${GAP_PX}px`,
          touchAction: "pan-y",
          cursor: "grab",
          // FIX: slide track so active card aligns to center
          transform: `translateX(calc(-${active} * (${CARD_VW}vw + ${GAP_PX}px)))`,
          transition: "transform 0.55s var(--f-cubic)",
          willChange: "transform",
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { dragging.current = false; }}
      >
        {CASE_STUDIES.map((study, i) => (
          <MobileCard
            key={i}
            study={study}
            isActive={i === active}
            onTap={() => onSwipe(i)}
          />
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE CARD
// ─────────────────────────────────────────────────────────────────────────────
interface MobileCardProps {
  study: Study;
  isActive: boolean;
  onTap: () => void;
}

const MobileCard = ({ study, isActive, onTap }: MobileCardProps) => (
  <a
    href={study.href}
    onClick={(e) => {
      if (!isActive) { e.preventDefault(); onTap(); }
    }}
    className="flex-shrink-0 block"
    style={{
      width: "72vw",
      maxWidth: "300px",
      textDecoration: "none",
      opacity:   isActive ? 1 : 0.38,
      transform: isActive ? "scale(1)" : "scale(0.93)",
      transition: "opacity 0.45s ease, transform 0.45s ease",
      willChange: "transform, opacity",
    }}
  >
    <div
      className="relative overflow-hidden rounded-lg"
      style={{
        aspectRatio: "3/4",
        border: `1px solid ${
          isActive
            ? "rgba(var(--c-yellow-rgb), 0.15)"
            : "rgba(var(--c-white-rgb), 0.04)"
        }`,
        boxShadow: isActive
          ? "0 16px 48px -16px rgba(var(--c-yellow-rgb), 0.2)"
          : "none",
        transition: "border-color 0.45s ease, box-shadow 0.45s ease",
      }}
    >
      <img
        src={study.image}
        alt={study.title}
        loading="lazy"
        className="w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(var(--c-black-rgb),0.92) 0%, transparent 55%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p
          className="text-[0.65rem] uppercase tracking-[0.2em] mb-1"
          style={{ color: "rgba(var(--c-yellow-rgb), 0.6)" }}
        >
          {study.subtitle}
        </p>
        <h3
          className="font-display text-xl leading-tight mb-2"
          style={{ color: "var(--c-white)" }}
        >
          {study.title}
        </h3>
        <p
          className="text-xs leading-relaxed mb-3"
          style={{ color: "rgba(var(--c-white-rgb), 0.45)" }}
        >
          {study.description}
        </p>
        <span
          className="inline-flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.15em]"
          style={{ color: "rgba(var(--c-yellow-rgb), 0.7)" }}
        >
          View project
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 8L8 2M8 2H3.5M8 2V6.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>
    </div>
  </a>
);

export default ObjectsShowcase;
