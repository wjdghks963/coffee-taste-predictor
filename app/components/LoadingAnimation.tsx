'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Droplet, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const loadingSteps = [
  'Analyzing roast profile...',
  'Calculating particle distribution...',
  'Simulating extraction yield...',
  'Predicting flavor notes...',
  'Optimizing brew parameters...',
];

export default function LoadingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-coffee-light/20 p-12 md:p-16">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Coffee Bean Animation Container */}
          <div className="relative w-48 h-48">
            {/* Central Coffee Cup */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-coffee-dark via-coffee-brown to-coffee-medium flex items-center justify-center">
                  <Coffee className="w-16 h-16 text-cream" />
                </div>

                {/* Ripple Effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.5, 2],
                    opacity: [0.5, 0.2, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  className="absolute inset-0 rounded-full border-4 border-coffee-medium"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.5, 2],
                    opacity: [0.5, 0.2, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: 0.5,
                  }}
                  className="absolute inset-0 rounded-full border-4 border-coffee-light"
                />
              </div>
            </motion.div>

            {/* Floating Particles */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 360) / 12;
              const delay = i * 0.1;

              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [
                      0,
                      Math.cos((angle * Math.PI) / 180) * 80,
                      Math.cos((angle * Math.PI) / 180) * 60,
                    ],
                    y: [
                      0,
                      Math.sin((angle * Math.PI) / 180) * 80,
                      Math.sin((angle * Math.PI) / 180) * 60,
                    ],
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: delay,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-coffee-medium" />
                </motion.div>
              );
            })}

            {/* Water Droplets */}
            {[...Array(6)].map((_, i) => {
              const xPos = -60 + i * 24;

              return (
                <motion.div
                  key={`drop-${i}`}
                  className="absolute left-1/2 top-0"
                  initial={{ x: xPos, y: -20, opacity: 0 }}
                  animate={{
                    y: [0, 180],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeIn',
                  }}
                >
                  <Droplet className="w-4 h-4 text-coffee-light fill-coffee-light/30" />
                </motion.div>
              );
            })}
          </div>

          {/* Loading Text with Typing Effect */}
          <div className="h-16 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-5 h-5 text-accent-gold" />
                </motion.div>
                <p className="text-lg font-semibold text-coffee-dark">
                  {loadingSteps[currentStep]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md">
            <div className="h-2 bg-cream rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-coffee-light via-coffee-medium to-coffee-brown"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </div>

          {/* Subtitle */}
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm text-coffee-medium"
          >
            AI is brewing your perfect cup...
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
