import * as React from "react";

const MOBILE_BREAKPOINT = 768;

// FIX: initializer function se window.innerWidth pehli render pe hi check
// Pehle: useState(undefined) → !!undefined = false → mobile pe bhi false
// Ab:    useState(() => window.innerWidth < 768) → correct from first render
// Yeh GSAP ScrollTrigger race condition fix karta hai
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    () => typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    // sync karo agar resize hua ho mount ke dauran
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}