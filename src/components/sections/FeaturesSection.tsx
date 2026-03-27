// src/components/sections/FeaturesSection.tsx
import { PROJECTS } from "@/constants";
import { SplitText } from "@/components/common/SplitText";
import { RevealOnScroll } from "@/components/common/RevealOnScroll";

export const FeaturesSection = () => {
  return (
    <section id="services" className="relative overflow-hidden bg-black py-[clamp(5rem,12vh,10rem)]">
      <div className="relative z-10 mx-[var(--g-margin)]">
        <RevealOnScroll className="mb-16 lg:mb-24">
          <p className="text-[0.6rem] uppercase tracking-[0.25em] mb-4 text-yellow/35">
            Services
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.9] text-white">
            <SplitText>What I Do</SplitText>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 max-w-[1200px] perspective-wrap">
          {PROJECTS.services.map((service, i) => (
            <RevealOnScroll key={service.number} delay={i * 0.08} y={40}>
              <div 
                className="group relative overflow-hidden rounded-lg glass-card card-3d p-[clamp(2rem,4vw,4rem)_var(--g-gap)_var(--g-gap)_var(--g-gap)] transition-all duration-900 hover:border-yellow/12 hover:shadow-[0_20px_60px_-15px_rgba(201,168,124,0.1)]"
                style={{ transitionTimingFunction: "var(--f-cubic)" }}
              >
                <div className="absolute top-3 right-3 flex items-center justify-center w-10 h-10">
                  <span className="font-display text-3xl text-yellow/6">
                    {service.number}
                  </span>
                  <span className="absolute w-10 h-10 rounded-full border border-white/3" />
                </div>
                
                <div className="relative">
                  <h3 className="font-display text-xl lg:text-2xl mb-2 text-white">
                    <span className="inline-block group-hover:translate-x-1 transition-transform duration-700">
                      {service.title}
                    </span>
                  </h3>
                  <p className="text-sm leading-relaxed max-w-sm text-white/30">
                    {service.desc}
                  </p>
                </div>
                
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-lg bg-gradient-to-br from-yellow/4 via-rose/2 to-transparent transition-opacity duration-900" />
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};