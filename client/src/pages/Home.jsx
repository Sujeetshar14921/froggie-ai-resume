import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/home/Banner";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import Features from "../components/home/Features";
import TemplateShowcase from "../components/home/TemplateShowcase";
import Testimonial from "../components/home/Testimonial";
import CallToAction from "../components/home/CallToAction";
import Footer from "../components/home/Footer";
import FrogSplashIntro from "../components/home/FrogSplashIntro";
import { useSEO } from "../hooks/useSEO";
import { initScrollProgressBar } from "../animations";

const Home = () => {
  useSEO({
    title: "froggie — #1 Free AI Resume Builder & ATS Score Checker | 100% ATS-Friendly",
    description: "Build 100% ATS-compliant resumes in minutes with froggie AI. Features real-time ATS scoring, AI career copilot, 6+ modern designer templates, instant PDF and Word export. Free forever.",
    keywords: "froggie, froggie resume, AI resume builder, ATS resume builder, free resume maker, ATS score checker, ATS resume scanner, professional resume templates, CV maker, job resume generator, ATS friendly resume, resume editor, download resume PDF, career copilot, resume optimizer, best resume builder 2026",
    canonical: "https://froggie.site/",
    ogImage: "https://froggie.site/og-image.png",
  });

  const [showSplash, setShowSplash] = useState(() => {
    // Plays when user opens browser/session or tests with ?intro=true
    const params = new URLSearchParams(window.location.search);
    if (params.get("intro") === "true") return true;
    return !sessionStorage.getItem("froggie_splash_seen");
  });

  const progressBarRef = useRef(null);

  useEffect(() => {
    const cleanup = initScrollProgressBar(progressBarRef.current);
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-500 selection:text-white relative">
      {/* CINEMATIC FROG JUMP SPLASH INTRO */}
      {showSplash && (
        <FrogSplashIntro onComplete={() => setShowSplash(false)} />
      )}

      {/* Scroll Progress Bar at the top of the viewport */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 origin-left z-[100] pointer-events-none"
      />

      <Banner />
      <Navbar />

      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <TemplateShowcase />
        <Testimonial />
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
