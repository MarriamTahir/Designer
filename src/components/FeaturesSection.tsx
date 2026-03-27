import SplitText from "./SplitText";
import RevealOnScroll from "./RevealOnScroll";

const services = [
  { number: "01", title: "UI/UX Design", desc: "Pixel-perfect interfaces that merge beauty with intuitive user flows, crafting seamless digital experiences." },
  { number: "02", title: "Design Systems", desc: "Scalable component libraries and design tokens ensuring consistency across products and teams." },
  { number: "03", title: "User Research", desc: "Data-driven insights through interviews, usability testing, and behavioral analysis to inform every decision." },
  { number: "04", title: "Brand Identity", desc: "Visual identity systems that communicate your brand's essence through typography, color, and motion." },
  { number: "05", title: "Prototyping", desc: "High-fidelity interactive prototypes that bridge the gap between concept and production-ready code." },
];

const FeaturesSection = () => {
  return (
    <section id="services" className="relative overflow-hidden" style={{
      backgroundColor: "var(--c-black)",
      paddingTop: "clamp(5rem, 12vh, 10rem)",
      paddingBottom: "clamp(5rem, 12vh, 10rem)",
    }}>
      <div className="relative z-10" style={{ margin: `0 var(--g-margin)` }}>
        <RevealOnScroll className="mb-16 lg:mb-24">
          <p className="text-[0.6rem] uppercase tracking-[0.25em] mb-4" style={{ color: "rgba(var(--c-yellow-rgb), 0.35)" }}>Services</p>
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.9]" style={{ color: "var(--c-white)" }}>
            <SplitText>What I Do</SplitText>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 max-w-[1200px] perspective-wrap">
          {services.map((service, i) => (
            <RevealOnScroll key={service.number} delay={i * 0.08} y={40}>
              <div className="group relative overflow-hidden rounded-lg glass-card card-3d" style={{
                padding: "clamp(2rem, 4vw, 4rem) var(--g-gap) var(--g-gap) var(--g-gap)",
                transition: "border-color 0.9s var(--f-cubic), box-shadow 0.9s var(--f-cubic)",
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(var(--c-yellow-rgb), 0.12)";
                  e.currentTarget.style.boxShadow = "0 20px 60px -15px rgba(var(--c-yellow-rgb), 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(var(--c-white-rgb), 0.06)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(var(--c-white-rgb), 0.05)";
                }}>
                <div className="absolute top-3 right-3 flex items-center justify-center" style={{ width: "2.5rem", height: "2.5rem" }}>
                  <span className="font-display text-3xl" style={{ color: "rgba(var(--c-yellow-rgb), 0.06)" }}>{service.number}</span>
                  <span className="absolute w-10 h-10 rounded-full border" style={{ borderColor: "rgba(var(--c-white-rgb), 0.03)" }} />
                </div>
                <div className="relative">
                  <h3 className="font-display text-xl lg:text-2xl mb-2" style={{ color: "var(--c-white)" }}>
                    <span className="inline-block group-hover:translate-x-1 transition-transform duration-700" style={{ transitionTimingFunction: "var(--f-cubic)" }}>
                      {service.title}
                    </span>
                  </h3>
                  <p className="text-sm leading-relaxed max-w-sm" style={{ color: "rgba(var(--c-white-rgb), 0.3)" }}>{service.desc}</p>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-lg" style={{
                  background: "linear-gradient(135deg, rgba(var(--c-yellow-rgb), 0.04) 0%, rgba(var(--c-rose-rgb), 0.02) 50%, transparent 100%)",
                  transition: "opacity 0.9s var(--f-cubic)",
                }} />
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
