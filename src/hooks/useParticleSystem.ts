// src/hooks/useParticleSystem.ts
import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
  rotation: number;
  vx: number;
  vy: number;
}

interface ParticleSystemConfig {
  maxParticles?: number;
  emissionRate?: number;
  gravity?: number;
  fadeSpeed?: number;
}

export const useParticleSystem = (config: ParticleSystemConfig = {}) => {
  const {
    maxParticles = 120,
    emissionRate = 18,
    gravity = 0.3,
    fadeSpeed = 0.016,
  } = config;

  const particlesRef = useRef<Particle[]>([]);
  const lastEmitRef = useRef(0);
  const rafRef = useRef<number>();

  const emitParticle = useCallback((
    x: number,
    y: number,
    velocityX: number = 0,
    velocityY: number = 0
  ) => {
    particlesRef.current.push({
      x, y,
      vx: velocityX + (Math.random() - 0.5) * 1.2,
      vy: velocityY + Math.random() * gravity,
      life: 1,
      maxLife: 1.2 + Math.random() * 1.5,
      size: 4 + Math.random() * 6,
      rotation: Math.random() * Math.PI * 2,
    });
  }, [gravity]);

  const updateParticles = useCallback(() => {
    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= fadeSpeed / p.maxLife;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += 0.05;
      p.vx *= 0.99;
      p.vy *= 0.998;

      if (p.life <= 0 || particles.length > maxParticles) {
        particles.splice(i, 1);
      }
    }
  }, [fadeSpeed, maxParticles]);

  return {
    particlesRef,
    emitParticle,
    updateParticles,
    lastEmitRef,
    rafRef,
  };
};