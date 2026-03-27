import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Petal {
  id: number; x: number; y: number; size: number;
  rotation: number; rotationSpeed: number;
  vx: number; vy: number;
  swayOffset: number; swaySpeed: number;
  opacity: number; color: string;
  life: number; maxLife: number;
}

// FIX: Disable on touch devices — canvas animations eat battery & cause lag on mobile
const isTouchDevice =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const SakuraVine = () => {
  // Return null on mobile/touch — skip all canvas work
  if (isTouchDevice) return null;

  const canvasRef        = useRef<HTMLCanvasElement>(null);
  const petalsRef        = useRef<Petal[]>([]);
  const scrollProgressRef = useRef(0);
  const timeRef          = useRef(0);
  const rafRef           = useRef<number>(0);

  const generatePetal = useCallback((x: number, y: number, side: "left" | "right") => {
    const colors = ["#FE4A6E","#FF8A9F","#FFB7C5","#FFD7E9","#FFFFFF"];
    const size = 6 + Math.random() * 10;
    const isLeft = side === "left";
    const vx = isLeft ? 0.3 + Math.random() * 0.8 : -0.3 - Math.random() * 0.8;
    const vy = 0.2 + Math.random() * 0.7;
    return {
      id: Math.random(), x, y, size,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      vx, vy,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.03,
      opacity: 0.6 + Math.random() * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      maxLife: 200 + Math.random() * 300,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // ScrollTrigger for scroll progress
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => { scrollProgressRef.current = self.progress; },
    });

    const SPAWN_INTERVAL = 8; // frames between spawns
    let frameCount = 0;

    const animate = () => {
      if (!canvas || !ctx) return;
      timeRef.current += 0.016;
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new petals every N frames based on scroll
      if (frameCount % SPAWN_INTERVAL === 0) {
        const spawnCount = 1 + Math.floor(scrollProgressRef.current * 2);
        for (let i = 0; i < spawnCount; i++) {
          const side: "left" | "right" = Math.random() > 0.5 ? "left" : "right";
          const x = side === "left"
            ? Math.random() * canvas.width * 0.15
            : canvas.width - Math.random() * canvas.width * 0.15;
          const y = Math.random() * canvas.height * 0.6;
          if (petalsRef.current.length < 60) { // cap for performance
            petalsRef.current.push(generatePetal(x, y, side));
          }
        }
      }

      // Draw and update petals
      const petals = petalsRef.current;
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.life--;
        if (p.life <= 0) { petals.splice(i, 1); continue; }

        const sway = Math.sin(timeRef.current * p.swaySpeed * 60 + p.swayOffset) * 0.5;
        p.x += p.vx + sway;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        const lifeRatio = p.life / p.maxLife;
        const alpha = p.opacity * Math.min(lifeRatio * 4, 1) * lifeRatio;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Draw petal shape
        ctx.beginPath();
        const s = p.size;
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo( s*0.5, -s*0.6,  s*0.4,  s*0.3, 0,  s*0.4);
        ctx.bezierCurveTo(-s*0.4,  s*0.3, -s*0.5, -s*0.6, 0, -s);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      st.kill();
    };
  }, [generatePetal]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{ opacity: 0.35 }}
    />
  );
};

export default SakuraVine;
