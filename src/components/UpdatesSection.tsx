import { useState, useCallback } from "react";
import RevealOnScroll from "./RevealOnScroll";
import place1 from "@/assets/place-1.jpg";
import place2 from "@/assets/place-2.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import obj1 from "@/assets/object-1.jpg";
import obj2 from "@/assets/object-2.jpg";

const updates = [
  { status: "New Project", title: "Luxe Finance — Live on App Store", desc: "The Luxe Finance mobile banking app has launched, featuring a dark-mode-first design with rose gold accents and biometric authentication flows.", image: place1 },
  { status: "Case Study", title: "Noir Dashboard — Published", desc: "Full case study for the enterprise analytics platform, showcasing the design system that reduced development time by 40%.", image: place2 },
  { status: "In Progress", title: "Serenity Wellness — Designing", desc: "Currently crafting the meditation and wellness experience. Focusing on calming micro-interactions and accessibility-first patterns.", image: heroBg },
  { status: "Open for Work", title: "Taking New Projects — Q2 2026", desc: "Limited availability for premium design partnerships. Ideal for brands seeking elevated digital experiences.", image: obj1 },
  { status: "Design System", title: "Component Library — v3.0", desc: "Released version 3 of my personal design system with 200+ components, dark/light themes, and full Figma integration.", image: obj2 },
];

const UpdatesSection = () => {
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (idx === active || transitioning || idx < 0 || idx >= updates.length) return;
    setTransitioning(true);
    setTimeout(() => {
      setActive(idx);
      setTimeout(() => setTransitioning(false), 100);
    }, 300);
  }, [active, transitioning]);

  const update = updates[active];

  return (
    <section className="relative overflow-hidden" style={{
      backgroundColor: "var(--c-black)",
      paddingTop: "clamp(5rem, 12vh, 10rem)",
      paddingBottom: "clamp(5rem, 12vh, 10rem)",
    }}>
      <div className="relative z-10" style={{ margin: `0 var(--g-margin)` }}>
        <RevealOnScroll className="mb-12">
          <p className="text-[0.6rem] uppercase tracking-[0.25em]" style={{ color: "rgba(var(--c-yellow-rgb), 0.35)" }}>Journal</p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative perspective-wrap">
            <div className="relative overflow-hidden rounded-lg" style={{
              aspectRatio: "16/10",
              border: "1px solid rgba(var(--c-white-rgb), 0.04)",
              boxShadow: "0 20px 60px -20px rgba(0,0,0,0.5)",
            }}>
              <img
                src={update.image}
                alt={update.title}
                className="w-full h-full object-cover transition-all duration-[0.9s]"
                style={{
                  opacity: transitioning ? 0 : 1,
                  transform: transitioning ? "scale(1.05) rotateY(2deg)" : "scale(1) rotateY(0deg)",
                  transitionTimingFunction: "var(--f-cubic)",
                }}
              />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to top, rgba(var(--c-black-rgb), 0.6), transparent 40%)",
              }} />
            </div>

            <button onClick={() => goTo(active - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 backdrop-blur-sm"
              style={{
                borderColor: "rgba(var(--c-white-rgb), 0.1)",
                backgroundColor: "rgba(var(--c-black-rgb), 0.5)",
                color: active > 0 ? "var(--c-white)" : "rgba(var(--c-white-rgb), 0.15)",
                opacity: active > 0 ? 1 : 0.4,
              }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
            <button onClick={() => goTo(active + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 backdrop-blur-sm"
              style={{
                borderColor: "rgba(var(--c-white-rgb), 0.1)",
                backgroundColor: "rgba(var(--c-black-rgb), 0.5)",
                color: active < updates.length - 1 ? "var(--c-white)" : "rgba(var(--c-white-rgb), 0.15)",
                opacity: active < updates.length - 1 ? 1 : 0.4,
              }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
          </div>

          {/* Text */}
          <div className="flex flex-col">
            <span className="text-[0.6rem] uppercase tracking-[0.25em] mb-3 transition-opacity duration-500"
              style={{ color: "rgba(var(--c-yellow-rgb), 0.5)", opacity: transitioning ? 0 : 1 }}>
              {update.status}
            </span>
            <h3 className="font-display text-2xl lg:text-3xl mb-4 transition-all duration-[0.9s]"
              style={{
                color: "var(--c-white)",
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? "translateY(10px)" : "translateY(0)",
                transitionTimingFunction: "var(--f-cubic)",
              }}>
              {update.title}
            </h3>
            <p className="text-sm leading-relaxed max-w-md transition-all duration-[0.9s]"
              style={{
                color: "rgba(var(--c-white-rgb), 0.35)",
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? "translateY(15px)" : "translateY(0)",
                transitionTimingFunction: "var(--f-cubic)",
                transitionDelay: transitioning ? "0s" : "0.1s",
              }}>
              {update.desc}
            </p>

            <div className="flex items-center gap-2 mt-8">
              {updates.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className="w-8 h-8 rounded-full border flex items-center justify-center text-[0.6rem] font-body transition-all duration-700"
                  style={{
                    borderColor: i === active ? "rgba(var(--c-yellow-rgb), 0.5)" : "rgba(var(--c-white-rgb), 0.06)",
                    color: i === active ? "var(--c-yellow)" : "rgba(var(--c-white-rgb), 0.15)",
                    backgroundColor: i === active ? "rgba(var(--c-yellow-rgb), 0.05)" : "transparent",
                    transform: i === active ? "scale(1.15)" : "scale(1)",
                    boxShadow: i === active ? "0 0 15px rgba(var(--c-yellow-rgb), 0.1)" : "none",
                  }}>{i + 1}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpdatesSection;
