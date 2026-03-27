import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onComplete();
      },
    });

    tl.fromTo(
      ".loading-bar",
      { scaleX: 0 },
      { scaleX: 1, duration: 0.6, stagger: 0.15, ease: "power4.inOut", transformOrigin: "0 50%" }
    );

    tl.fromTo(
      ".loading-text span",
      { y: "100%" },
      { y: "0%", duration: 0.8, stagger: 0.1, ease: "expo.out" },
      "-=0.3"
    );

    tl.to({}, { duration: 0.6 });

    tl.to(".loading-text span", {
      y: "-100%", duration: 0.6, stagger: 0.05, ease: "expo.in",
    });

    tl.to(".loading-bar", {
      scaleX: 0, duration: 0.8, stagger: { each: 0.1, from: "end" },
      ease: "power4.inOut", transformOrigin: "100% 50%",
    }, "-=0.3");

    return () => { tl.kill(); };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div ref={containerRef} className="loading-screen">
      <div className="bars">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="loading-bar" style={{ backgroundColor: i % 2 === 0 ? "var(--c-black)" : "var(--c-navy)" }} />
        ))}
      </div>
      <div className="loading-text relative z-10 flex flex-col items-center gap-1 overflow-hidden">
        <span className="inline-block overflow-hidden">
          <span className="inline-block font-display text-3xl lg:text-5xl" style={{ color: "var(--c-white)" }}>
            Riam Studio
          </span>
        </span>
        <span className="inline-block overflow-hidden">
          <span className="inline-block font-body text-xs uppercase tracking-[0.3em]" style={{ color: "rgba(var(--c-yellow-rgb), 0.6)" }}>
            by Marriam Tahir
          </span>
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;
