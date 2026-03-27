// src/components/BeeHummingbird.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Position {
  x: number;
  y: number;
}

interface Section {
  id: string;
  element: HTMLElement | null;
  headingPosition: Position;
}

const BeeHummingbird = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const birdRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const sectionsRef = useRef<Section[]>([]);
  const wingAngleRef = useRef(0);
  const bodyBounceRef = useRef(0);
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isHoveringRef = useRef(false);
  const hoverTargetRef = useRef<Position | null>(null);

  const getElementCenter = (el: HTMLElement): Position => {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2 + window.scrollY,
    };
  };

  const defineSections = useCallback(() => {
    const sections: Section[] = [];

    const heroHeading = document.querySelector("h1");
    if (heroHeading) {
      sections.push({
        id: "hero",
        element: document.querySelector("section"),
        headingPosition: getElementCenter(heroHeading as HTMLElement),
      });
    }

    const projectsHeading = document.querySelector("#projects h2");
    if (projectsHeading) {
      sections.push({
        id: "projects",
        element: document.querySelector("#projects"),
        headingPosition: getElementCenter(projectsHeading as HTMLElement),
      });
    }

    const servicesHeading = document.querySelector("#services h2");
    if (servicesHeading) {
      sections.push({
        id: "services",
        element: document.querySelector("#services"),
        headingPosition: getElementCenter(servicesHeading as HTMLElement),
      });
    }

    const contactHeading = document.querySelector("#contact h2");
    if (contactHeading) {
      sections.push({
        id: "contact",
        element: document.querySelector("#contact"),
        headingPosition: getElementCenter(contactHeading as HTMLElement),
      });
    }

    return sections;
  }, []);

  const updateSectionPositions = useCallback(() => {
    sectionsRef.current.forEach((section) => {
      if (section.id === "hero") {
        const heading = document.querySelector("h1");
        if (heading) section.headingPosition = getElementCenter(heading as HTMLElement);
      } else if (section.id === "projects") {
        const heading = document.querySelector("#projects h2");
        if (heading) section.headingPosition = getElementCenter(heading as HTMLElement);
      } else if (section.id === "services") {
        const heading = document.querySelector("#services h2");
        if (heading) section.headingPosition = getElementCenter(heading as HTMLElement);
      } else if (section.id === "contact") {
        const heading = document.querySelector("#contact h2");
        if (heading) section.headingPosition = getElementCenter(heading as HTMLElement);
      }
    });
  }, []);

  const updateBirdTarget = useCallback(() => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    let activeSection = 0;
    for (let i = 0; i < sectionsRef.current.length; i++) {
      const section = sectionsRef.current[i];
      if (section.element) {
        const rect = section.element.getBoundingClientRect();
        const sectionTop = rect.top + scrollY;
        const sectionBottom = sectionTop + rect.height;

        if (scrollY + viewportHeight / 3 >= sectionTop && scrollY + viewportHeight / 3 <= sectionBottom) {
          activeSection = i;
          break;
        }
      }
    }

    if (isHoveringRef.current && hoverTargetRef.current) {
      birdRef.current.targetX = hoverTargetRef.current.x;
      birdRef.current.targetY = hoverTargetRef.current.y - 25;
    } else {
      const target = sectionsRef.current[activeSection]?.headingPosition;
      if (target) {
        birdRef.current.targetX = target.x;
        birdRef.current.targetY = target.y - 30;
      }
    }
  }, []);

  // Professional vector-style hummingbird drawing
  const drawHummingbird = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    wingAngle: number,
    bodyBounce: number
  ) => {
    ctx.save();
    ctx.translate(x, y + bodyBounce * 1.5);
    
    // ========== BODY ==========
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#3B8A3A";
    ctx.fill();
    ctx.strokeStyle = "#2A6A28";
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Body highlight
    ctx.beginPath();
    ctx.ellipse(-2, -1.5, 3, 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(180, 220, 140, 0.5)";
    ctx.fill();
    
    // ========== HEAD ==========
    ctx.beginPath();
    ctx.ellipse(9, -1, 6, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#3B8A3A";
    ctx.fill();
    ctx.strokeStyle = "#2A6A28";
    ctx.stroke();
    
    // ========== EYE ==========
    ctx.beginPath();
    ctx.arc(12, -2, 1.3, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(12.4, -2.3, 0.7, 0, Math.PI * 2);
    ctx.fillStyle = "#1A2A1A";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(12.7, -2.6, 0.25, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    
    // Eye sparkle
    ctx.beginPath();
    ctx.arc(12.9, -2.8, 0.12, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    
    // ========== BEAK ==========
    ctx.beginPath();
    ctx.moveTo(14, -1);
    ctx.lineTo(19, -0.5);
    ctx.lineTo(14, 0);
    ctx.fillStyle = "#D49C5C";
    ctx.fill();
    ctx.strokeStyle = "#B87C3C";
    ctx.lineWidth = 0.5;
    ctx.stroke();
    
    // ========== GORGET (Rose-red throat) ==========
    ctx.beginPath();
    ctx.ellipse(6, 1.8, 4.5, 3.5, 0, 0, Math.PI * 2);
    const throatGrad = ctx.createLinearGradient(4, 0, 8, 3);
    throatGrad.addColorStop(0, "#E85A3A");
    throatGrad.addColorStop(1, "#C53A1A");
    ctx.fillStyle = throatGrad;
    ctx.fill();
    
    // Iridescent sparkle
    ctx.beginPath();
    ctx.ellipse(5.5, 1.2, 1.8, 1.2, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 200, 120, 0.7)";
    ctx.fill();
    
    // ========== WINGS (Smooth animation) ==========
    // Upper wing
    ctx.save();
    ctx.translate(-2, -2.5);
    ctx.rotate(wingAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-10, -4, -15, 0);
    ctx.quadraticCurveTo(-9, 3, 0, 0);
    ctx.fillStyle = "#4A9A48";
    ctx.fill();
    ctx.strokeStyle = "#2A6A28";
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();
    
    // Lower wing
    ctx.save();
    ctx.translate(-1, -1);
    ctx.rotate(-wingAngle * 0.6);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-8, -2, -12, 1);
    ctx.quadraticCurveTo(-6, 3, 0, 0);
    ctx.fillStyle = "#3B8A3A";
    ctx.fill();
    ctx.strokeStyle = "#2A6A28";
    ctx.stroke();
    ctx.restore();
    
    // Wing feather details
    ctx.beginPath();
    ctx.moveTo(-12, -1);
    ctx.lineTo(-14, -2);
    ctx.lineTo(-13, 0);
    ctx.fillStyle = "#5AAD58";
    ctx.fill();
    
    // ========== TAIL ==========
    ctx.beginPath();
    ctx.moveTo(-7, 2);
    ctx.quadraticCurveTo(-9, 4.5, -5, 5.5);
    ctx.quadraticCurveTo(-8, 6, -3, 5);
    ctx.fillStyle = "#3B8A3A";
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(-5, 2.2);
    ctx.quadraticCurveTo(-7, 5, -3, 6);
    ctx.quadraticCurveTo(-5, 6.5, -1, 5);
    ctx.fillStyle = "#2A6A28";
    ctx.fill();
    
    // ========== NECTAR SPARKLES ==========
    for (let i = 0; i < 3; i++) {
      const angle = timeRef.current * 8 + i * Math.PI * 2 / 3;
      const radius = 12 + Math.sin(timeRef.current * 12 + i) * 2;
      const px = 10 + Math.cos(angle) * radius;
      const py = -1 + Math.sin(angle) * radius * 0.5;
      
      ctx.beginPath();
      ctx.arc(px, py, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 160, 80, ${0.5 + Math.sin(timeRef.current * 15 + i) * 0.2})`;
      ctx.fill();
    }
    
    // ========== GLOW ==========
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 12, 0, 0, Math.PI * 2);
    const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 18);
    glowGrad.addColorStop(0, "rgba(255, 100, 70, 0.15)");
    glowGrad.addColorStop(0.6, "rgba(255, 100, 70, 0.05)");
    glowGrad.addColorStop(1, "rgba(255, 100, 70, 0)");
    ctx.fillStyle = glowGrad;
    ctx.fill();
    
    ctx.restore();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    setTimeout(() => {
      sectionsRef.current = defineSections();
      updateSectionPositions();
      
      if (sectionsRef.current[0]?.headingPosition) {
        birdRef.current.x = sectionsRef.current[0].headingPosition.x;
        birdRef.current.y = sectionsRef.current[0].headingPosition.y - 30;
        birdRef.current.targetX = birdRef.current.x;
        birdRef.current.targetY = birdRef.current.y;
      }
    }, 800);

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const card = target.closest(".glass-card, .card-3d, [class*='card'], .rounded-lg");
      
      if (card) {
        isHoveringRef.current = true;
        const rect = card.getBoundingClientRect();
        hoverTargetRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      } else {
        isHoveringRef.current = false;
        hoverTargetRef.current = null;
      }
    };

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: () => {
        updateSectionPositions();
        updateBirdTarget();
      },
    });

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", () => {
      updateSectionPositions();
      updateBirdTarget();
    });

    const animate = () => {
      if (!ctx) return;

      timeRef.current += 0.016;
      const time = timeRef.current;

      ctx.clearRect(0, 0, width, height);

      // Smooth movement
      birdRef.current.x += (birdRef.current.targetX - birdRef.current.x) * 0.12;
      birdRef.current.y += (birdRef.current.targetY - birdRef.current.y) * 0.12;

      // Wing flapping (smooth like SVG animation)
      wingAngleRef.current = Math.sin(time * 22) * 0.85;
      
      // Gentle body bounce while hovering
      bodyBounceRef.current = Math.sin(time * 5) * 1.2;

      drawHummingbird(ctx, birdRef.current.x, birdRef.current.y, wingAngleRef.current, bodyBounceRef.current);

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      st.kill();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", updateBirdTarget);
    };
  }, [defineSections, updateSectionPositions, updateBirdTarget, drawHummingbird]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[10]"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    />
  );
};

export default BeeHummingbird;