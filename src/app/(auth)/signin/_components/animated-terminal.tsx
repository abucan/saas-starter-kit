'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from '@/components/ui/shadcn-io/terminal';
import { terminalSteps as steps } from '@/config/terminal';

export function AnimatedTerminal() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (!currentStep) return;

    const outputLinesDelay = currentStep.command.output.length * 500;
    const totalDuration = currentStep.command.delay + outputLinesDelay;

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => (prev + 1) % steps.length);
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [currentStepIndex, currentStep]);

  if (!currentStep) {
    return null;
  }

  return (
    <div className='space-y-8 flex flex-col items-center justify-center'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={`title-${currentStepIndex}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className='text-center'
        >
          <p className='font-spectral font-[400] text-3xl max-w-sm'>
            {currentStep.description}
          </p>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode='wait'>
        <motion.div
          key={`terminal-${currentStepIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className='h-[220px] w-full max-w-xl'
        >
          <Terminal className='h-full w-full'>
            <AnimatedSpan delay={400} className='text-green-500'>
              <TypingAnimation>{currentStep.command.input}</TypingAnimation>
            </AnimatedSpan>

            {currentStep.command.output.map((line, index) => (
              <AnimatedSpan key={index} delay={1400 + index * 1400}>
                {line}
              </AnimatedSpan>
            ))}
          </Terminal>
        </motion.div>
      </AnimatePresence>

      <div className='flex justify-center gap-2'>
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              index === currentStepIndex
                ? 'bg-primary'
                : 'bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
