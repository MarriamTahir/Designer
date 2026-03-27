import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "./SplitText";
import RevealOnScroll from "./RevealOnScroll";
import heroBg from "@/assets/hero-bg.jpg";
import logoImg from "@/assets/stone.png";
import place1 from "@/assets/place-1.jpg";
import place2 from "@/assets/place-2.jpg";

gsap.registerPlugin(ScrollTrigger);

const isTouchDevice =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const HeroSection = () => {
  const sectionRef   = useRef<HTMLElement>(null);
  const pathRef      = useRef<SVGPathElement>(null);
  const videoRef     = useRef<HTMLDivElement>(null);
  const logoRef      = useRef<HTMLDivElement>(null);
  const stoneRef     = useRef<HTMLDivElement>(null);
  const leftCardRef  = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const gradientRef  = useRef<HTMLDivElement>(null);

  const [spotlightAngle,    setSpotlightAngle]    = useState(0);
  const [spotlightDistance, setSpotlightDistance] = useState(100);

  // ── Spotlight (desktop only) ─────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent): void => {
    if (isTouchDevice || !stoneRef.current) return;
    const rect = stoneRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    setSpotlightAngle(Math.atan2(dy, dx) * (180 / Math.PI));
    setSpotlightDistance(Math.min(Math.sqrt(dx * dx + dy * dy), 300));
  }, []);

  // ── GSAP scroll animations ────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Use gsap.context for proper cleanup of ALL triggers at once
    const ctx = gsap.context(() => {

      // SVG path draw-on
      if (pathRef.current) {
        const len = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          duration: 5,
          ease: "power2.inOut",
          delay: 1.5,
        });
      }

      const sharedST = {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      };

      // Parallax BG
      if (videoRef.current) {
        gsap.to(videoRef.current, { scale: 1.15, scrollTrigger: { ...sharedST, scrub: true } });
      }

      // Stone
      if (stoneRef.current) {
        gsap.to(stoneRef.current, {
          y: isTouchDevice ? -60 : -120, // gentler on mobile
          scale: 0.85,
          rotateY: isTouchDevice ? 0 : 15,
          scrollTrigger: sharedST,
        });
      }

      // Left card (desktop only — hidden on mobile anyway)
      if (leftCardRef.current && !isTouchDevice) {
        gsap.fromTo(
          leftCardRef.current,
          { y: 0, rotate: -3, opacity: 0.7, rotateY: 5 },
          { y: -100, rotate: -8, opacity: 0.3, rotateY: -10, scrollTrigger: sharedST }
        );
      }

      // Right card
      if (rightCardRef.current && !isTouchDevice) {
        gsap.fromTo(
          rightCardRef.current,
          { y: 0, rotate: 3, opacity: 0.7, rotateY: -5 },
          { y: -80, rotate: 10, opacity: 0.3, rotateY: 10, scrollTrigger: sharedST }
        );
      }

      // Gradient
      if (gradientRef.current) {
        gsap.fromTo(
          gradientRef.current,
          { scaleY: 1 },
          { scaleY: 1.8, scrollTrigger: sharedST }
        );
      }

      // Logo
      if (logoRef.current) {
        gsap.fromTo(
          logoRef.current,
          { y: 0, rotate: 0 },
          { y: isTouchDevice ? -40 : -80, rotate: 15, scrollTrigger: sharedST }
        );
      }

    }, section); // scope to section

    return () => ctx.revert(); // kills ALL triggers inside context
  }, []);

  const spotlightGradient = `radial-gradient(circle at 50% 50%, rgba(var(--c-yellow-rgb), 0.3) 0%, rgba(var(--c-rose-rgb), 0.1) 40%, transparent 60%)`;
  const spotlightMask = `radial-gradient(ellipse ${200 - spotlightDistance * 0.3}px ${200 - spotlightDistance * 0.3}px at ${50 + Math.cos(spotlightAngle * Math.PI / 180) * (spotlightDistance * 0.1)}% ${50 + Math.sin(spotlightAngle * Math.PI / 180) * (spotlightDistance * 0.1)}%, white 0%, transparent 100%)`;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden perspective-wrap"
      onMouseMove={!isTouchDevice ? handleMouseMove : undefined}
    >
      {/* BG parallax */}
      <div
        ref={videoRef}
        className="absolute inset-0 z-0 scale-[1.05]"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          willChange: "transform",
        }}
      />

      {/* Gradient overlay */}
      <div
        ref={gradientRef}
        className="absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(to bottom, rgba(var(--c-black-rgb), 0.2) 0%, rgba(var(--c-navy-rgb), 0.5) 50%, var(--c-black) 100%)",
          transformOrigin: "center bottom",
        }}
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, transparent 0%, rgba(var(--c-black-rgb), 0.5) 70%)",
        }}
      />

      {/* SVG path */}
      <svg
        className="absolute inset-0 w-full h-full z-[2] pointer-events-none"
        viewBox="0 0 1440 1080"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="hero-path-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0"   stopColor="rgba(201,168,124,0.08)" />
            <stop offset="0.5" stopColor="rgba(212,160,160,0.15)" />
            <stop offset="1"   stopColor="rgba(201,168,124,0.08)" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          fill="none"
          stroke="url(#hero-path-grad)"
          strokeWidth="1"
          d="M0,1070.2c246-1389.9,431-530.3,403-229.7-63.1,677.8-94-723.7,475-742.8,195.6-6.6,141-314-86,264.2-62.6,159.5,197.7-298.2,648-289.1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Left floating card — desktop only */}
      <div
        ref={leftCardRef}
        className="absolute left-[3%] lg:left-[8%] top-[25%] z-[3] w-32 lg:w-48 hidden md:block"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative overflow-hidden rounded-lg glass-card" style={{ aspectRatio: "3/4" }}>
          <img src={place1} alt="Fintech App Design" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(var(--c-yellow-rgb), 0.12), transparent)" }} />
        </div>
        <p className="mt-2 text-[0.6rem] uppercase tracking-[0.2em]" style={{ color: "rgba(var(--c-yellow-rgb), 0.2)" }}>
          Mobile Design
        </p>
      </div>

      {/* Right floating card — desktop only */}
      <div
        ref={rightCardRef}
        className="absolute right-[3%] lg:right-[8%] top-[35%] z-[3] w-28 lg:w-40 hidden md:block"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative overflow-hidden rounded-lg glass-card" style={{ aspectRatio: "3/4" }}>
          <img src={place2} alt="Dashboard Design" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(225deg, rgba(var(--c-rose-rgb), 0.1), transparent)" }} />
        </div>
        <p className="mt-2 text-[0.6rem] uppercase tracking-[0.2em] text-right" style={{ color: "rgba(var(--c-yellow-rgb), 0.2)" }}>
          Web Platform
        </p>
      </div>

      {/* Center stone logo with spotlight */}
      <div
        ref={stoneRef}
        className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 z-[4]"
        style={{
          width: "clamp(8rem, 16vw, 13rem)",
          height: "clamp(8rem, 16vw, 13rem)",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <div className="relative w-full h-full">
          <img
            src={logoImg}
            alt="Riam Studio"
            className="w-full h-full object-contain opacity-75 drop-shadow-2xl"
          />
          <div
            className="absolute inset-[-20%] rounded-full pointer-events-none"
            style={{
              background: spotlightGradient,
              maskImage: spotlightMask,
              WebkitMaskImage: spotlightMask,
              transition: "all 0.3s ease-out",
            }}
          />
          <div
            className="absolute inset-[-40%] rounded-full border opacity-10 animate-spin"
            style={{ borderColor: "rgba(var(--c-yellow-rgb), 0.1)", animationDuration: "30s" }}
          />
          <div
            className="absolute inset-[-65%] rounded-full border opacity-5"
            style={{ borderColor: "rgba(var(--c-rose-rgb), 0.06)" }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-6xl mx-auto text-center">
          <h1 className="font-display" style={{ color: "var(--c-white)" }}>
            <span className="block text-[clamp(3rem,13vw,10rem)] leading-[0.82] tracking-[-0.02em]">
              <SplitText delay={0.3} stagger={0.05} large>Design</SplitText>
            </span>
            {/* FIX: responsive margin — was overflowing on narrow screens */}
            <span className="block text-[clamp(3rem,13vw,10rem)] leading-[0.82] tracking-[-0.02em] ml-[3vw] md:ml-[8vw]">
              <SplitText delay={0.5} stagger={0.05} large>Beyond</SplitText>
            </span>
            <span className="block text-[clamp(3rem,13vw,10rem)] leading-[0.82] tracking-[-0.02em] -ml-[3vw] md:-ml-[4vw]">
              <SplitText delay={0.7} stagger={0.05} large>Pixels</SplitText>
            </span>
          </h1>

          <RevealOnScroll delay={1.2} className="mt-10 lg:mt-20">
            <div className="group flex flex-wrap items-center justify-center gap-x-8 gap-y-2 cursor-default">
              {["Experience", "Defines", "Everything"].map((word, i) => (
                <span
                  key={word}
                  className="inline-block text-[0.65rem] uppercase tracking-[0.3em]"
                  style={{ color: "rgba(var(--c-yellow-rgb), 0.45)" }}
                >
                  {word}
                </span>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={1.5} className="mt-12 lg:mt-24">
            <div className="flex flex-col items-center gap-6">
              <div
                className="text-sm leading-relaxed"
                style={{ color: "rgba(var(--c-white-rgb), 0.5)" }}
              >
                <span className="block sm:translate-x-[2em]">Crafting Interfaces</span>
                <span className="block sm:translate-x-[3em]">That Feel Like</span>
                <span className="block sm:translate-x-[2.5em]">Second Nature /</span>
              </div>
              <a
                href="#contact"
                className="oa-button oa-button-big"
                style={{ maxWidth: "320px" }}
              >
                <span>Start a Project</span>
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Bottom-right logo */}
      <div
        ref={logoRef}
        className="absolute bottom-[8%] right-[6%] lg:right-[12%] z-[5]"
        style={{
          width: "clamp(4.5rem, 7vw, 7rem)",
          height: "clamp(4.5rem, 7vw, 7rem)",
          willChange: "transform",
        }}
      >
        <img src={logoImg} alt="RS" className="w-full h-full object-contain opacity-40" />
        <div className="absolute inset-[-50%] rounded-full border opacity-15" style={{ borderColor: "rgba(var(--c-yellow-rgb), 0.1)" }} />
        <div className="absolute inset-[-80%] rounded-full border opacity-5"  style={{ borderColor: "rgba(var(--c-rose-rgb), 0.08)" }} />
      </div>
    </section>
  );
};

export default HeroSection;
