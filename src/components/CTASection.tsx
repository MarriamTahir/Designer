import SplitText from "./SplitText";
import RevealOnScroll from "./RevealOnScroll";
import logoImg from "@/assets/stone.png";

const CTASection = () => {
  return (
    <section className="relative overflow-hidden" style={{
      backgroundColor: "var(--c-black)", color: "var(--c-white)",
      paddingTop: "clamp(6rem, 14vh, 12rem)", paddingBottom: "clamp(6rem, 14vh, 12rem)",
    }}>
      {/* Subtle gradient background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 50%, rgba(var(--c-navy-rgb), 0.4) 0%, transparent 70%)",
      }} />

      <div className="relative z-10 text-center" style={{ margin: `0 var(--g-margin)` }}>
        <RevealOnScroll className="mb-8 flex justify-center">
          <img src={logoImg} alt="RS" className="w-10 h-10 object-contain opacity-40" />
        </RevealOnScroll>

        <h2 className="font-display text-[clamp(1.5rem,4vw,2.8rem)] leading-[1.1] max-w-3xl mx-auto mb-16 lg:mb-24" style={{ color: "var(--c-white)" }}>
          <SplitText stagger={0.02}>
            Great design starts with a meaningful conversation — let's craft something extraordinary together
          </SplitText>
        </h2>

        <RevealOnScroll delay={0.3} className="flex flex-col items-center gap-8">
          <div className="text-sm leading-relaxed" style={{ color: "var(--c-yellow)" }}>
            <span className="block transition-transform duration-700 hover:translate-x-1" style={{ transitionTimingFunction: "var(--f-cubic)" }}>Have a project</span>
            <span className="block transition-transform duration-700 hover:translate-x-1" style={{ transform: "translateX(2em)", transitionTimingFunction: "var(--f-cubic)" }}>in mind?</span>
            <span className="block transition-transform duration-700 hover:translate-x-1" style={{ transform: "translateX(1em)", transitionTimingFunction: "var(--f-cubic)" }}>Let's talk /</span>
          </div>
          <a href="#contact" className="oa-button oa-button-big" style={{ maxWidth: "320px" }}>
            <span>Get In Touch</span>
          </a>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default CTASection;
