import React from 'react';
import { Hero } from "../components/sections/Hero";
import { BentoGrid } from "../components/sections/BentoGrid";
import { Testimonials } from "../components/sections/Testimonials";

export default function Home() {
    return (
        <div className="relative min-h-screen">
            <Hero />
            <Testimonials />
            <BentoGrid />
        </div>
    );
}
