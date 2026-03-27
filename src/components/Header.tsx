import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const Header = () => {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu open/close animation
  useEffect(() => {
    if (!navRef.current) return;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        navRef.current,
        { opacity: 0, pointerEvents: "none" },
        { opacity: 1, pointerEvents: "all", duration: 0.5, ease: "power2.out" }
      );
      gsap.fromTo(
        ".menu-link",
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.2, stagger: 0.1, ease: "expo.out", delay: 0.2 }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(navRef.current, { opacity: 0, pointerEvents: "none", duration: 0.4 });
    }
  }, [menuOpen]);

  // Close menu on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-50 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(var(--c-black-rgb), ${scrolled ? 0.9 : 0.5}) 0%, rgba(var(--c-black-rgb), 0) 100%)`,
          paddingTop: "0.65rem",
          paddingBottom: scrolled ? "0.5rem" : "2.5rem",
          transition: "padding 1.5s var(--f-cubic)",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
        }}
      >
        <div
          className="mx-auto flex items-center"
          style={{
            margin: "0 var(--g-margin)",
            display: "grid",
            gridTemplateColumns: "repeat(var(--g-columns, 12), 1fr)",
            gap: "var(--g-gap)",
          }}
        >
          {/* Logo */}
          <a
            href="/"
            className="flex flex-col leading-[0.85] pointer-events-auto"
            style={{
              gridColumn: "1 / 3",
              fontFamily: "var(--font-display)",
              color: "var(--c-yellow)",
              transition: "color 0.9s var(--f-cubic)",
              textDecoration: "none",
            }}
          >
            <span className="text-lg md:text-xl tracking-wide">Riam</span>
            <span className="text-lg xl:text-lg tracking-wide" style={{ marginLeft: "0.5em" }}>Studio</span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center self-center pointer-events-auto" style={{ gridColumn: "5 / 7" }}>
            <a href="#projects" className="oa-button oa-button-reverse mr-2"><span>Projects</span></a>
          </div>
          <span className="hidden md:block self-center justify-self-center w-px bg-current opacity-5" style={{ gridColumn: "7", height: "1.5rem" }} />
          <div className="hidden md:flex items-center self-center pointer-events-auto" style={{ gridColumn: "8 / 10" }}>
            <a href="#services" className="oa-button oa-button-reverse"><span>Services</span></a>
          </div>

          {/* Let's Talk — appears on scroll */}
          <div
            className="hidden md:flex items-center self-center pointer-events-auto"
            style={{
              gridColumn: "10 / 11",
              opacity: scrolled ? 1 : 0,
              translate: scrolled ? "0 0" : "0 -100%",
              transition: "opacity 0.9s var(--f-cubic-in), translate 0.9s var(--f-cubic-in)",
              pointerEvents: scrolled ? "all" : "none",
            }}
          >
            <a href="#contact" className="oa-button oa-button-reverse"><span>Let's Talk</span></a>
          </div>

          {/* Menu button */}
          <div className="flex items-center self-center justify-end pointer-events-auto" style={{ gridColumn: "11 / 13" }}>
            <button
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-md transition-all duration-500"
              style={{
                border: "1px solid rgba(var(--c-white-rgb), 0.08)",
                backgroundColor: "rgba(var(--c-white-rgb), 0.04)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                // FIX: min tap target
                minHeight: "40px",
              }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className="flex flex-col gap-1">
                <span className="block w-3.5 md:w-4 h-px rounded-full" style={{ backgroundColor: "var(--c-yellow)" }} />
                <span className="block w-3.5 md:w-4 h-px rounded-full" style={{ backgroundColor: "var(--c-yellow)" }} />
              </span>
              <span className="hidden sm:inline text-[0.7rem] uppercase tracking-[0.18em] font-medium" style={{ color: "var(--c-yellow)" }}>
                Menu
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen nav overlay */}
      <div
        ref={navRef}
        className="fixed inset-0 z-[100] opacity-0 pointer-events-none"
        style={{
          backgroundColor: "rgba(var(--c-black-rgb), 0.95)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-8 z-10 flex items-center gap-3"
          style={{ color: "var(--c-yellow)", minHeight: "44px" }}
          aria-label="Close menu"
        >
          <span className="font-display text-lg">Close</span>
          <span className="relative w-6 h-6">
            <span className="absolute top-1/2 left-0 w-full h-px rotate-45"  style={{ backgroundColor: "var(--c-yellow)" }} />
            <span className="absolute top-1/2 left-0 w-full h-px -rotate-45" style={{ backgroundColor: "var(--c-yellow)" }} />
          </span>
        </button>

        <nav className="h-full flex flex-col items-center justify-center gap-2" aria-label="Main navigation">
          {[
            { label: "Projects", href: "#projects" },
            { label: "Services", href: "#services" },
            { label: "About",    href: "#about"    },
            { label: "Contact",  href: "#contact"  },
          ].map((item) => (
            <div key={item.label} className="overflow-hidden">
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="menu-link block font-display text-5xl lg:text-7xl tracking-tight transition-colors duration-500"
                style={{ color: "var(--c-white)", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-yellow)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-white)")}
              >
                {item.label}
              </a>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Header;
