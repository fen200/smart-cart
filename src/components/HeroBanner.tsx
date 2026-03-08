import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import heroBanner1 from "@/assets/hero-banner-1.jpg";
import heroBanner2 from "@/assets/hero-banner-2.jpg";

const slides = [
  {
    image: heroBanner1,
    title: "Tech That Moves You",
    subtitle: "Up to 40% off on premium electronics",
    cta: "Shop Electronics",
  },
  {
    image: heroBanner2,
    title: "Spring Collection",
    subtitle: "New arrivals in fashion & lifestyle",
    cta: "Explore Now",
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="relative aspect-[21/9] sm:aspect-[21/8] md:aspect-[21/7]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={slides[current].image}
              alt={slides[current].title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 sm:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-lg"
                >
                  <h2 className="mb-2 text-2xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
                    {slides[current].title}
                  </h2>
                  <p className="mb-4 text-sm text-primary-foreground/80 sm:text-lg">
                    {slides[current].subtitle}
                  </p>
                  <button className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90 hover:shadow-elevated sm:px-8 sm:py-3">
                    {slides[current].cta}
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-foreground backdrop-blur-sm transition-all hover:bg-card"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-foreground backdrop-blur-sm transition-all hover:bg-card"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-accent" : "w-2 bg-card/60"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
