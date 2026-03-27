import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealOnScroll from "./RevealOnScroll";
import SplitText from "./SplitText";
import logoImg from "@/assets/stone.png";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stoneRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !stoneRef.current) return;

    // FIX: gsap.context for clean teardown
    const ctx = gsap.context(() => {
      gsap.fromTo(
        stoneRef.current,
        { y: 40 },
        {
          y: -30,
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      id="about"
      className="relative safe-bottom"
      style={{
        backgroundColor: "var(--c-black)",
        borderTop: "1px solid rgba(var(--c-white-rgb), 0.03)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(var(--c-yellow-rgb), 0.015) 0%, transparent 40%)",
        }}
      />

      <div
        className="relative z-10"
        style={{
          margin: "0 var(--g-margin)",
          paddingTop: "clamp(6rem, 14vh, 12rem)",
          paddingBottom: "clamp(3rem, 6vh, 5rem)",
        }}
      >
        {/* Headline + CTA */}
        <div className="text-center mb-16 lg:mb-24">
          <h2 className="font-display" style={{ color: "var(--c-white)" }}>
            <span className="block text-[clamp(2.5rem,8vw,7rem)] leading-[0.85]">
              <SplitText stagger={0.04}>Let's Create</SplitText>
            </span>
            <span className="block text-[clamp(2.5rem,8vw,7rem)] leading-[0.85] ml-[5vw]">
              <SplitText delay={0.2} stagger={0.04}>Together</SplitText>
            </span>
          </h2>

          <RevealOnScroll delay={0.4} className="mt-12 flex justify-center">
            <a
              href="#contact"
              className="group relative w-20 h-20 rounded-full border flex items-center justify-center transition-all duration-[0.9s]"
              style={{
                borderColor: "rgba(var(--c-yellow-rgb), 0.15)",
                transitionTimingFunction: "var(--f-cubic)",
              }}
            >
              <svg
                className="w-6 h-6 transition-all duration-[0.9s] group-hover:rotate-45"
                style={{ color: "var(--c-yellow)", transitionTimingFunction: "var(--f-cubic)" }}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-[0.9s]"
                style={{
                  backgroundColor: "rgba(var(--c-yellow-rgb), 0.04)",
                  boxShadow: "0 0 30px rgba(var(--c-yellow-rgb), 0.08)",
                }}
              />
            </a>
          </RevealOnScroll>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6">
          <div className="lg:col-span-3">
            <RevealOnScroll>
              <p
                className="text-[0.6rem] uppercase tracking-[0.25em] mb-4"
                style={{ color: "rgba(var(--c-white-rgb), 0.15)" }}
              >
                Marriam Tahir
              </p>
              <p className="text-sm mb-8" style={{ color: "rgba(var(--c-white-rgb), 0.3)" }}>
                UI/UX designer crafting premium digital experiences with a passion for elegant simplicity.
              </p>
              <div className="font-display text-xl lg:text-2xl leading-tight" style={{ color: "var(--c-white)" }}>
                <span className="block">Where Design</span>
                <span className="block" style={{ marginLeft: "1em" }}>Meets</span>
                <span className="block" style={{ marginLeft: "0.5em", color: "var(--c-yellow)" }}>Intention.</span>
              </div>
            </RevealOnScroll>
          </div>

          <nav className="lg:col-span-4 lg:col-start-5 flex flex-col gap-1" aria-label="Footer navigation">
            {[
              { label: "Social", items: ["Twitter / X", "Instagram", "Behance", "Dribbble"] },
              { label: "Studio", items: ["Projects", "Services", "About", "Contact"] },
            ].map((group) => (
              <div key={group.label} className="mb-6">
                <p
                  className="text-[0.55rem] uppercase tracking-[0.25em] mb-3"
                  style={{ color: "rgba(var(--c-white-rgb), 0.1)" }}
                >
                  {group.label}
                </p>
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="font-display text-lg transition-all duration-500"
                      style={{ color: "rgba(var(--c-white-rgb), 0.3)", transitionTimingFunction: "var(--f-cubic)", textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-yellow)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(var(--c-white-rgb), 0.3)")}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="lg:col-span-3 lg:col-start-10 flex flex-col justify-between">
            <div ref={stoneRef} className="w-16 h-16 opacity-25 mb-8 lg:mb-0 lg:self-end">
              <img src={logoImg} alt="RS" className="w-full h-full object-contain" />
            </div>
            <RevealOnScroll delay={0.3}>
              <p className="text-[0.65rem]" style={{ color: "rgba(var(--c-white-rgb), 0.15)" }}>© 2026 Riam Studio</p>
              <p className="text-[0.65rem] mt-1" style={{ color: "rgba(var(--c-white-rgb), 0.15)" }}>Designed by Marriam Tahir</p>
              <a
                href="mailto:hello@riamstudio.com"
                className="text-[0.65rem] mt-1 inline-block"
                style={{ color: "rgba(var(--c-yellow-rgb), 0.25)", transition: "color 0.5s", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-yellow)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(var(--c-yellow-rgb), 0.25)")}
              >
                hello@riamstudio.com
              </a>
            </RevealOnScroll>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{ borderTop: "1px solid rgba(var(--c-white-rgb), 0.03)", padding: "clamp(2rem, 4vh, 4rem) 0" }}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6" style={{ margin: "0 var(--g-margin)" }}>
          <a
            href="/"
            className="font-display"
            style={{ color: "var(--c-yellow)", lineHeight: 0.85, textDecoration: "none" }}
          >
            <span className="block text-xl lg:text-2xl"><SplitText stagger={0.03}>Riam</SplitText></span>
            <span className="block text-xl lg:text-2xl" style={{ marginLeft: "0.5em" }}><SplitText delay={0.1} stagger={0.03}>Studio</SplitText></span>
          </a>
          <span className="hidden lg:block font-display text-6xl mx-6" style={{ color: "rgba(var(--c-white-rgb), 0.04)" }}>/</span>
          <div className="max-w-md">
            <p className="text-[0.7rem]" style={{ color: "rgba(var(--c-white-rgb), 0.2)" }}>
              <span style={{ color: "rgba(var(--c-yellow-rgb), 0.5)" }}>Riam Studio</span> is the creative practice of Marriam Tahir — crafting premium UI/UX for ambitious brands.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
