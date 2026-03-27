import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

const RevealOnScroll = ({
  children,
  className = "",
  delay = 0,
  y = 40,
}: RevealOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // FIX: Use gsap.context for proper scoped cleanup
    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y,
        duration: 1.2,       // was 1.5 — slightly snappier
        ease: "expo.out",
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",  // was 88% — fires a touch earlier
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default RevealOnScroll;
