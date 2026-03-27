import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  triggerStart?: string;
  large?: boolean;
}

const SplitText = ({
  children,
  className = "",
  delay = 0,
  stagger = 0.03,
  triggerStart = "top 85%",
  large = false,
}: SplitTextProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll(".s-char");

    if (large) {
      gsap.set(chars, {
        opacity: 0,
        scale: 2,
        filter: "blur(3px)",
        skewX: 15,
        skewY: 30,
        x: (i: number) => `${(Math.random() - 0.5) * 20}px`,
        y: (i: number) => `${20 + Math.random() * 30}px`,
      });
    } else {
      gsap.set(chars, {
        y: "110%",
        opacity: 0,
        rotateX: -60,
      });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: triggerStart,
        toggleActions: "play none none none",
      },
    });

    if (large) {
      tl.to(chars, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        skewX: 0,
        skewY: 0,
        x: 0,
        y: 0,
        duration: 1.5,
        ease: "expo.out",
        stagger: { each: stagger, from: "random" },
        delay,
      });
    } else {
      tl.to(chars, {
        y: "0%",
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger,
        delay,
      });
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [children, delay, stagger, triggerStart, large]);

  const words = children.split(" ");

  return (
    <span ref={containerRef} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-flex overflow-hidden mr-[0.3em]">
          {word.split("").map((char, ci) => (
            <span
              key={ci}
              className="s-char inline-block"
              style={{
                willChange: "transform, opacity, filter",
                "--char-random": Math.random(),
              } as React.CSSProperties}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
