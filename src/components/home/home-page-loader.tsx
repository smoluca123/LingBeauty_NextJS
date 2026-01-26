'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Generate particle configurations outside of render to avoid impure function calls
const generateParticleConfigs = () =>
  [...Array(6)].map(() => ({
    initialX: Math.random() * 100 - 50,
    initialY: Math.random() * 100 + 100,
    duration: 2 + Math.random() * 2,
  }));

export function HomePageLoader() {
  // Use lazy initializer to generate configs only once on mount
  const [particleConfigs] = useState(generateParticleConfigs);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo/spinner */}
        <div className="relative">
          {/* Outer rotating ring */}
          <motion.div
            className="h-20 w-20 rounded-full border-4 border-primary-pink/20"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-pink"
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>

          {/* Center pulsing dot */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-pink"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Loading text */}
        <motion.div
          className="flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-sm font-medium text-muted-foreground">
            Đang tải
          </span>
          <motion.span
            className="text-sm font-medium text-muted-foreground"
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ...
          </motion.span>
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particleConfigs.map((config, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-primary-pink/30"
              initial={{
                x: config.initialX,
                y: config.initialY,
              }}
              animate={{
                y: [null, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: config.duration,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeOut',
              }}
              style={{
                left: `${20 + i * 15}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
