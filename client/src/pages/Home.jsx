import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "../components/Navbar";
import Banner from "../components/home/Banner";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import Features from "../components/home/Features";
import TemplateShowcase from "../components/home/TemplateShowcase";
import Testimonial from "../components/home/Testimonial";
import CallToAction from "../components/home/CallToAction";
import Footer from "../components/home/Footer";
import { useSEO } from "../hooks/useSEO";

const Home = () => {
  useSEO({
    title: "froggie — AI ATS Resume Builder & Career Copilot | Free Resume Maker",
    description: "Build 100% ATS-optimized resumes in minutes with froggie AI. Features real-time ATS scoring, AI career copilot, professional templates, instant PDF and Word export.",
    canonical: "https://froggie-resume.com/",
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-500 selection:text-white relative">
      {/* Scroll Progress Bar at the top of the viewport */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 origin-left z-[100]"
        style={{ scaleX }}
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
