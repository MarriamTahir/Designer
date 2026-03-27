// src/pages/Index.tsx
import { useState, useCallback } from "react";
import CursorTrail from "../components/CursorTrail";
import SmoothScroll from "../components/SmoothScroll";
import LoadingScreen from "../components/LoadingScreen";
import SakuraVine from "../components/SakuraVine";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import PlacesSection from "../components/PlacesSection";
import ObjectsShowcase from "../components/ObjectsShowcase";
import UpdatesSection from "../components/UpdatesSection";
import PeopleSection from "../components/PeopleSection";
import FeaturesSection from "../components/FeaturesSection";
import AdmissionForm from "../components/AdmissionForm";
import Footer from "../components/Footer";
import BackToTop from "@/components/BackToTop";

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      <LoadingScreen onComplete={handleLoadComplete} />
      {loaded && (
        <SmoothScroll>
          <CursorTrail />
          <SakuraVine />
          <div className="noise-overlay" />
          <Header />
          <main>
            <HeroSection />
            <PlacesSection />
            <ObjectsShowcase />
            <PeopleSection />
            <FeaturesSection />
            <UpdatesSection />
            <AdmissionForm />
          </main>
          <Footer />
          <BackToTop />
        </SmoothScroll>
      )}
    </>
  );
};

export default Index;