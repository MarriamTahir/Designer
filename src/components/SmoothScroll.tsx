import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // FIX: On touch/mobile devices, Lenis should NOT intercept native scroll
    // because it fights with GSAP ScrollTrigger's pinned sections
    if (isTouchDevice) {
      // For mobile: just connect native scroll events to ScrollTrigger
      // No Lenis needed — native scroll is already smooth on iOS/Android
      const onScroll = () => ScrollTrigger.update();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    // Desktop only: Lenis smooth scroll
    const lenis = new Lenis({
      // FIX: lerp 0.04 → 0.09 — snappier, removes sticky/laggy feel
      lerp: 0.09,
      // FIX: wheelMultiplier 0.6 → 1.2 — scroll speed exactly 2x
      wheelMultiplier: 1.2,
      touchMultiplier: 1.5,
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
