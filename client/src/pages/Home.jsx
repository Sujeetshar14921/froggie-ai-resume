import React, { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/home/Banner";
import Hero from "../components/home/Hero";
import BrandScroller from "../components/home/BrandScroller";
import HowItWorks from "../components/home/HowItWorks";
import Features from "../components/home/Features";
import TemplateShowcase from "../components/home/TemplateShowcase";
import Testimonial from "../components/home/Testimonial";
import CallToAction from "../components/home/CallToAction";
import Footer from "../components/home/Footer";
import { useSEO } from "../hooks/useSEO";
import { initScrollProgressBar } from "../animations";

const Home = () => {
  useSEO({
    title: "froggie 3.0 — #1 Free AI Resume Builder & ATS Score Checker | 100% ATS-Friendly",
    description: "Build 100% ATS-compliant resumes in minutes with froggie 3.0 AI Studio. Features real-time ATS scoring, AI career copilot, 6+ modern designer templates, instant PDF and Word export. Free forever.",
    keywords: "froggie, froggie 3.0, froggie resume, AI resume builder, ATS resume builder, free resume maker, ATS score checker, ATS resume scanner, professional resume templates, CV maker, job resume generator, ATS friendly resume, resume editor, download resume PDF, career copilot, resume optimizer, best resume builder 2026",
    canonical: "https://froggie.site/",
    ogImage: "https://froggie.site/og-image.png",
  });

  const progressBarRef = useRef(null);

  useEffect(() => {
    const cleanup = initScrollProgressBar(progressBarRef.current);
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#090d16] text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white relative pb-20 lg:pb-0">
      {/* Scroll Progress Bar at the top of the viewport */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 origin-left z-[100] pointer-events-none"
      />

      {/* Desktop-only announcement banner */}
      <div className="hidden md:block">
        <Banner />
      </div>

      <Navbar />

      <main>
        <Hero />
        
        {/* Heavy brand marquee: desktop only */}
        <div className="hidden md:block">
          <BrandScroller />
        </div>

        <HowItWorks />
        <Features />
        <TemplateShowcase />

        {/* 6-card testimonial grid: desktop only */}
        <div className="hidden md:block">
          <Testimonial />
        </div>

        <CallToAction />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
