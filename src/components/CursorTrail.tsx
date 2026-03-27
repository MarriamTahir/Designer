import { useEffect, useRef, useCallback } from "react";

interface Petal {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number;
  rotation: number; rotationSpeed: number; type: number;
}
interface ClickBurst {
  x: number; y: number; petals: BurstPetal[];
}
interface BurstPetal {
  angle: number; dist: number; speed: number; size: number;
  rotation: number; rotationSpeed: number; life: number; type: number;
}

// FIX: Don't render at all on touch devices — saves CPU/GPU + fixes cursor conflicts
const isTouchDevice =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const CursorTrail = () => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const petalsRef    = useRef<Petal[]>([]);
  const burstsRef    = useRef<ClickBurst[]>([]);
  const mouseRef     = useRef({ x: -100, y: -100, prevX: -100, prevY: -100 });
  const isHoveringRef = useRef(false);
  const bloomRef     = useRef(0);
  const rafRef       = useRef<number>(0);

  // Return null immediately on touch devices
  if (isTouchDevice) return null;

  const drawSakuraCursor = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, bloom: number) => {
      ctx.save();
      ctx.translate(x, y);
      const baseSize = 10 + bloom * 4;
      const petalCount = 5;
      for (let i = 0; i < petalCount; i++) {
        const angle = (i * Math.PI * 2) / petalCount - Math.PI / 2;
        ctx.save();
        ctx.rotate(angle);
        const s = baseSize;
        const spread = 1 + bloom * 0.3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(s*0.35*spread, -s*0.3, s*0.5*spread, -s*0.8, 0, -s);
        ctx.bezierCurveTo(-s*0.5*spread, -s*0.8, -s*0.35*spread, -s*0.3, 0, 0);
        const alpha = 0.5 + bloom * 0.3;
        ctx.fillStyle = i % 2 === 0 ? `rgba(254,74,110,${alpha})` : `rgba(255,215,233,${alpha+0.1})`;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(s*0.15, -s*0.15, s*0.2, -s*0.5, 0, -s*0.7);
        ctx.bezierCurveTo(-s*0.2, -s*0.5, -s*0.15, -s*0.15, 0, 0);
        ctx.fillStyle = `rgba(255,255,255,${0.3+bloom*0.2})`;
        ctx.fill();
        ctx.restore();
      }
      const cr = 2.5 + bloom * 1.5;
      const cGrad = ctx.createRadialGradient(0,0,0,0,0,cr);
      cGrad.addColorStop(0, `rgba(227,6,0,0.9)`);
      cGrad.addColorStop(1, `rgba(254,74,110,0.4)`);
      ctx.beginPath();
      ctx.arc(0,0,cr,0,Math.PI*2);
      ctx.fillStyle = cGrad;
      ctx.fill();
      if (bloom > 0.3) {
        const sa = (bloom-0.3)/0.7;
        for (let i = 0; i < 6; i++) {
          const a = (i*Math.PI*2)/6;
          const len = cr+2+bloom*3;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a)*cr*0.5, Math.sin(a)*cr*0.5);
          ctx.lineTo(Math.cos(a)*len, Math.sin(a)*len);
          ctx.strokeStyle = `rgba(153,18,21,${sa*0.5})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(Math.cos(a)*(len+1), Math.sin(a)*(len+1), 1, 0, Math.PI*2);
          ctx.fillStyle = `rgba(227,6,0,${sa*0.7})`;
          ctx.fill();
        }
      }
      const glow = ctx.createRadialGradient(0,0,0,0,0,20+bloom*10);
      glow.addColorStop(0, `rgba(254,74,110,${0.06+bloom*0.06})`);
      glow.addColorStop(0.5, `rgba(255,215,233,${0.03+bloom*0.03})`);
      glow.addColorStop(1, `rgba(254,74,110,0)`);
      ctx.beginPath();
      ctx.arc(0,0,20+bloom*10,0,Math.PI*2);
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.restore();
    }, []
  );

  const drawBurstPetal = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, bp: BurstPetal) => {
      ctx.save();
      const px = x + Math.cos(bp.angle)*bp.dist;
      const py = y + Math.sin(bp.angle)*bp.dist;
      ctx.translate(px, py);
      ctx.rotate(bp.rotation);
      ctx.globalAlpha = bp.life * bp.life;
      const s = bp.size * (0.5 + bp.life*0.5);
      ctx.beginPath();
      ctx.moveTo(0,-s);
      ctx.bezierCurveTo(s*0.5,-s*0.6,s*0.4,s*0.2,0,s*0.4);
      ctx.bezierCurveTo(-s*0.4,s*0.2,-s*0.5,-s*0.6,0,-s);
      const colors = [
        `rgba(254,74,110,${0.6*bp.life})`,
        `rgba(255,215,233,${0.7*bp.life})`,
        `rgba(227,6,0,${0.4*bp.life})`,
      ];
      ctx.fillStyle = colors[bp.type%3];
      ctx.fill();
      ctx.restore();
    }, []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let lastEmit = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      const now = performance.now();
      if (now - lastEmit < 25) return;
      lastEmit = now;
      const dx = e.clientX - mouseRef.current.prevX;
      const dy = e.clientY - mouseRef.current.prevY;
      const speed = Math.sqrt(dx*dx + dy*dy);
      if (speed > 3) {
        const count = Math.min(Math.floor(speed/12)+1, 2);
        for (let i = 0; i < count; i++) {
          const t = i/count;
          petalsRef.current.push({
            x: mouseRef.current.prevX + dx*t + (Math.random()-0.5)*8,
            y: mouseRef.current.prevY + dy*t + (Math.random()-0.5)*8,
            vx: (Math.random()-0.5)*0.8 + dx*0.015,
            vy: Math.random()*0.6+0.2, life: 1,
            maxLife: 1.2+Math.random()*1,
            size: 3+Math.random()*5,
            rotation: Math.random()*Math.PI*2,
            rotationSpeed: (Math.random()-0.5)*0.06,
            type: Math.floor(Math.random()*3),
          });
        }
        if (petalsRef.current.length > 80)
          petalsRef.current.splice(0, petalsRef.current.length-80);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const burst: ClickBurst = { x: e.clientX, y: e.clientY, petals: [] };
      const count = 12 + Math.floor(Math.random()*6);
      for (let i = 0; i < count; i++) {
        burst.petals.push({
          angle: (i/count)*Math.PI*2 + (Math.random()-0.5)*0.4,
          dist: 0, speed: 2+Math.random()*4,
          size: 4+Math.random()*7,
          rotation: Math.random()*Math.PI*2,
          rotationSpeed: (Math.random()-0.5)*0.12,
          life: 1, type: Math.floor(Math.random()*3),
        });
      }
      burstsRef.current.push(burst);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName==="A"||t.tagName==="BUTTON"||t.closest("a")||t.closest("button")||t.closest("[role='button']"))
        isHoveringRef.current = true;
    };
    const handleMouseOut = () => { isHoveringRef.current = false; };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    const drawTrailPetal = (ctx: CanvasRenderingContext2D, p: Petal, alpha: number) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = alpha;
      const s = p.size*(0.4+0.6*p.life);
      if (p.type===0) {
        ctx.beginPath();
        ctx.moveTo(0,-s);
        ctx.bezierCurveTo(s*0.6,-s*0.6,s*0.5,s*0.3,0,s*0.5);
        ctx.bezierCurveTo(-s*0.5,s*0.3,-s*0.6,-s*0.6,0,-s);
        ctx.fillStyle=`rgba(254,74,110,${0.5+alpha*0.3})`;ctx.fill();
      } else if (p.type===1) {
        ctx.beginPath();ctx.ellipse(0,0,s*0.5,s*0.7,0,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,215,233,${0.4+alpha*0.4})`;ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(0,s*0.5);
        ctx.bezierCurveTo(-s*0.7,s*0.1,-s*0.5,-s*0.7,0,-s*0.3);
        ctx.bezierCurveTo(s*0.5,-s*0.7,s*0.7,s*0.1,0,s*0.5);
        ctx.fillStyle=`rgba(227,6,0,${0.25+alpha*0.25})`;ctx.fill();
      }
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width/dpr, canvas.height/dpr);
      const dt = 0.016;
      bloomRef.current += ((isHoveringRef.current?1:0) - bloomRef.current)*0.08;
      const petals = petalsRef.current;
      for (let i = petals.length-1; i >= 0; i--) {
        const p = petals[i];
        p.life -= dt/p.maxLife;
        p.x += p.vx + Math.sin(p.rotation*2)*0.2;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vx *= 0.99; p.vy *= 0.998;
        if (p.life <= 0) { petals.splice(i,1); continue; }
        drawTrailPetal(ctx, p, p.life*p.life);
      }
      const bursts = burstsRef.current;
      for (let b = bursts.length-1; b >= 0; b--) {
        const burst = bursts[b]; let alive = false;
        for (const bp of burst.petals) {
          if (bp.life<=0) continue;
          alive=true; bp.life-=dt*0.7; bp.dist+=bp.speed; bp.speed*=0.96;
          bp.rotation+=bp.rotationSpeed;
          drawBurstPetal(ctx, burst.x, burst.y, bp);
        }
        if (!alive) bursts.splice(b,1);
      }
      const {x:mx,y:my} = mouseRef.current;
      if (mx > 0 && my > 0) drawSakuraCursor(ctx, mx, my, bloomRef.current);
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [drawSakuraCursor, drawBurstPetal]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 z-[9998] pointer-events-none" />
  );
};

export default CursorTrail;
