// src/hooks/useScrollAnimation.ts
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationConfig {
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  trigger?: HTMLElement | null;
  start?: string;
  end?: string;
  scrub?: boolean | number;
}

export const useScrollAnimation = (
  ref: React.RefObject<HTMLElement>,
  config: ScrollAnimationConfig
) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const animation = config.from
      ? gsap.fromTo(element, config.from, {
          ...config.to,
          scrollTrigger: {
            trigger: config.trigger || element,
            start: config.start || "top 80%",
            end: config.end,
            scrub: config.scrub ?? 0.8,
          },
        })
      : gsap.to(element, {
          ...config.to,
          scrollTrigger: {
            trigger: config.trigger || element,
            start: config.start || "top 80%",
            end: config.end,
            scrub: config.scrub ?? 0.8,
          },
        });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === element) st.kill();
      });
    };
  }, [ref, config]);
};

export const useParallax = (
  ref: React.RefObject<HTMLElement>,
  intensity: number = 0.5
) => {
  useScrollAnimation(ref, {
    to: { y: intensity * 100, ease: "none" },
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  });
};