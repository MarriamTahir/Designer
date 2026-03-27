// src/constants/index.ts

export const ANIMATIONS = {
  // Scroll trigger settings
  SCROLL: {
    scrub: 0.8,
    ease: "expo.out",
  },
  
  // Hero section
  HERO: {
    pathDraw: { duration: 5, ease: "power2.inOut", delay: 1.5 },
    stoneScroll: { y: -120, scale: 0.85, rotateY: 15 },
    leftCardScroll: { y: -100, rotate: -8, opacity: 0.3, rotateY: -10 },
    rightCardScroll: { y: -80, rotate: 10, opacity: 0.3, rotateY: 10 },
    gradientScroll: { scaleY: 1.8 },
    logoScroll: { y: -80, rotate: 15 },
  },
  
  // Reveal animations
  REVEAL: {
    duration: 1.5,
    ease: "expo.out",
    start: "top 88%",
    y: 50,
  },
  
  // Split text
  SPLIT_TEXT: {
    largeDuration: 1.5,
    normalDuration: 1.2,
    ease: "expo.out",
  },
  
  // Smooth scroll
  SMOOTH_SCROLL: {
    lerp: 0.04,
    wheelMultiplier: 0.6,
    touchMultiplier: 1.2,
  },
} as const;

export const COLORS = {
  sakura: {
    pink: "254, 74, 110",    // #FE4A6E
    rose: "227, 6, 0",        // #E30600
    lightPink: "255, 215, 233", // #FFD7E9
    darkRed: "153, 18, 21",   // #991215
  },
  neutral: {
    black: "0, 0, 0",
    white: "255, 255, 255",
    navy: "10, 15, 30",
    yellow: "201, 168, 124",
  },
} as const;

export const FORM_VALIDATION = {
  minNameLength: 2,
  minDetailsLength: 10,
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const PROJECTS = {
  places: [
    { name: "Luxe Finance", category: "Fintech · Mobile App", image: "place-1" },
    { name: "Noir Dashboard", category: "SaaS · Web Platform", image: "place-2" },
    { name: "Atelier Brand", category: "E-Commerce · Luxury", image: "object-1" },
    { name: "Zenith Analytics", category: "Enterprise · Dashboard", image: "object-2" },
    { name: "Serenity App", category: "Wellness · Mobile", image: "object-3" },
    { name: "Maison Estates", category: "Real Estate · Web", image: "object-4" },
    { name: "Studio Workspace", category: "Productivity · SaaS", image: "hero-bg" },
  ],
  services: [
    { number: "01", title: "UI/UX Design", desc: "Pixel-perfect interfaces that merge beauty with intuitive user flows." },
    { number: "02", title: "Design Systems", desc: "Scalable component libraries ensuring consistency across products." },
    { number: "03", title: "User Research", desc: "Data-driven insights through interviews and usability testing." },
    { number: "04", title: "Brand Identity", desc: "Visual identity systems that communicate your brand's essence." },
    { number: "05", title: "Prototyping", desc: "High-fidelity interactive prototypes ready for production." },
  ],
} as const;

export const CONTENT = {
  hero: {
    headline: ["Design", "Beyond", "Pixels"],
    tagline: ["Experience", "Defines", "Everything"],
    subtitle: ["Crafting Interfaces", "That Feel Like", "Second Nature /"],
  },
  people: {
    headline: ["Designed", "for Humans"],
    subhead: "Not Just Screens",
    description: "Every interface carries the intention of its creator. My process is human — deliberate, empathetic, and irreplaceable by automation.",
  },
} as const;