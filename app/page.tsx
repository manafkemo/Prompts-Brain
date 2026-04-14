import dynamic from 'next/dynamic';
import { LandingNavbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { AnimatedBackground } from '@/components/AnimatedBackground';

// Lazy load heavy sections
const Features = dynamic(() => import('@/components/landing/Features').then(mod => mod.Features));
const HowItWorks = dynamic(() => import('@/components/landing/HowItWorks').then(mod => mod.HowItWorks));
const WhyZanZora = dynamic(() => import('@/components/landing/WhyZanZora').then(mod => mod.WhyZanZora));
const CTA = dynamic(() => import('@/components/landing/CTA').then(mod => mod.CTA));
const Footer = dynamic(() => import('@/components/landing/Footer').then(mod => mod.Footer));

export default function HomePage() {
  return (
    <main className="min-h-screen relative text-white selection:bg-violet-500/30 overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        <LandingNavbar />
        <Hero />
        <Features />
        <HowItWorks />
        <WhyZanZora />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}

