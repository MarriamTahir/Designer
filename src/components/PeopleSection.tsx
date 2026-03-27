import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "./SplitText";
import archImg from "@/assets/arch-silhouette.jpg";
import heroBg  from "@/assets/hero-bg.jpg";

gsap.registerPlugin(ScrollTrigger);

const PeopleSection = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const archRef     = useRef<HTMLDivElement>(null);
  const underlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // FIX: gsap.context for scoped cleanup
    const ctx = gsap.context(() => {
      if (archRef.current) {
        gsap.fromTo(
          archRef.current,
          { scale: 0.75, opacity: 0.6, rotateX: 8 },
          {
            scale: 1, opacity: 1, rotateX: 0,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "center center",
              scrub: 1,
            },
          }
        );
      }
      if (underlayRef.current) {
        gsap.fromTo(
          underlayRef.current,
          { y: 0 },
          {
            y: -80,
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--c-black)",
        paddingTop: "clamp(8rem, 20vh, 16rem)",
        paddingBottom: "clamp(8rem, 20vh, 16rem)",
      }}
    >
      {/* Parallax bg */}
      <div ref={underlayRef} className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.03,
          }}
        />
      </div>

      {/* Side decorations — desktop only */}
      {[{ side: "left", x: "5%" }, { side: "right", x: "auto", r: "5%" }].map(({ side, x, r }) => (
        <div
          key={side}
          className={`absolute top-1/2 -translate-y-1/2 z-[1] hidden lg:block`}
          style={{ left: side === "left" ? x : undefined, right: r }}
        >
          <svg width="60" height="200" viewBox="0 0 60 200" fill="none">
            <rect x="5"  y="20" width="50" height="160" rx="25" stroke="rgba(201,168,124,0.06)" strokeWidth="1" fill="none" />
            <rect x="15" y="40" width="30" height="120" rx="15" stroke="rgba(212,160,160,0.04)" strokeWidth="1" fill="none" />
          </svg>
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center perspective-wrap" style={{ margin: "0 var(--g-margin)" }}>
        {/* Heading */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-display" style={{ color: "var(--c-white)" }}>
            <span className="block text-[clamp(2.5rem,8vw,6rem)] leading-[0.85]">
              <SplitText stagger={0.04}>Designed</SplitText>
            </span>
            <span className="block text-[clamp(2.5rem,8vw,6rem)] leading-[0.85] ml-[3vw]">
              <SplitText delay={0.2} stagger={0.04}>for Humans</SplitText>
            </span>
            <span className="block text-[clamp(1.5rem,4vw,3rem)] leading-[1] mt-2" style={{ color: "rgba(var(--c-yellow-rgb), 0.4)" }}>
              <SplitText delay={0.4} stagger={0.03}>Not Just Screens</SplitText>
            </span>
          </h2>
        </div>

        {/* Arch image */}
        <div
          ref={archRef}
          className="relative mx-auto"
          style={{
            width: "clamp(220px, 35vw, 400px)",
            transformOrigin: "center bottom",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: "50% 50% 4px 4px",
              aspectRatio: "3/4",
              border: "1px solid rgba(var(--c-white-rgb), 0.05)",
              boxShadow: "0 30px 80px -20px rgba(var(--c-yellow-rgb), 0.1)",
            }}
          >
            <img src={archImg} alt="Creative vision" className="w-full h-full object-cover" />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(var(--c-black-rgb), 0.7) 0%, transparent 40%, rgba(var(--c-navy-rgb), 0.3) 100%)",
              }}
            />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            <span className="block w-12 h-px" style={{ backgroundColor: "rgba(var(--c-yellow-rgb), 0.12)" }} />
            <span className="block w-2 h-2 rounded-full -mt-0.5" style={{ backgroundColor: "rgba(var(--c-rose-rgb), 0.2)" }} />
            <span className="block w-12 h-px" style={{ backgroundColor: "rgba(var(--c-yellow-rgb), 0.12)" }} />
          </div>
        </div>

        <p
          className="text-sm text-center mt-16 max-w-md leading-relaxed"
          style={{ color: "rgba(var(--c-white-rgb), 0.25)" }}
        >
          Every interface carries the intention of its creator. My process is human — deliberate, empathetic, and irreplaceable by automation.
        </p>
      </div>
    </section>
  );
};

export default PeopleSection;
