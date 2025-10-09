'use client';

import { useState, useEffect } from 'react';
import { Terminal, AnimatedSpan } from '@/components/ui/shadcn-io/terminal';
import { motion, AnimatePresence } from 'motion/react';

export interface Step {
  title: string;
  description: string;
  command: {
    input: string;
    output: string[];
    delay: number;
  };
}

export const steps: Step[] = [
  {
    title: 'Login to Your Account',
    description: 'Authenticate with your KeyVaultify API token',
    command: {
      input: 'keyvault login',
      output: [
        '🔑 Paste your API token: ••••••••••••••••••',
        '✅ Token saved to ~/.keyvaultify/config.json',
        '🎉 Successfully authenticated!',
      ],
      delay: 3000,
    },
  },
  {
    title: 'Initialize Your Project',
    description: 'Link your local project to KeyVaultify',
    command: {
      input: 'keyvault init',
      output: [
        '🆔 Enter your Project ID: my-awesome-app',
        '🌱 Environment (default: dev): production',
        '✅ Project initialized and linked to KeyVaultify.',
        '📝 Config saved to .keyvaultify/project.json',
      ],
      delay: 3500,
    },
  },
  {
    title: 'Push Your Secrets',
    description: 'Upload your environment variables securely',
    command: {
      input: 'keyvault push',
      output: [
        '📦 Found 8 secrets in .env',
        '🔐 Encrypting secrets...',
        '☁️  Uploading to my-awesome-app (production)',
        '✅ Successfully pushed 8 secrets',
        '🕒 Last updated: ' + new Date().toLocaleTimeString(),
      ],
      delay: 4000,
    },
  },
  {
    title: 'Pull Secrets to New Environment',
    description: 'Download secrets to your local environment file',
    command: {
      input: 'keyvault pull --env .env.local',
      output: [
        '☁️  Fetching secrets for my-awesome-app (production)',
        '🔓 Decrypting 8 secrets...',
        '📄 Writing to .env.local',
        '✅ Successfully pulled 8 secrets',
        '🔒 Your secrets are now available locally',
      ],
      delay: 3500,
    },
  },
];

export function AnimatedTerminal() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (!currentStep) return;

    // Calculate total duration for current step
    // Input appears immediately, then output lines, plus the step's delay
    const outputLinesDelay = currentStep.command.output.length * 500; // Approximate delay per line
    const totalDuration = currentStep.command.delay + outputLinesDelay;

    // Move to next step after the current one finishes
    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => (prev + 1) % steps.length); // Loop back to start
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [currentStepIndex, currentStep]);

  if (!currentStep) {
    return null;
  }

  return (
    <div className='space-y-8 flex flex-col items-center justify-center'>
      <AnimatePresence mode='wait'>
        {/* Title and description - animated from top */}
        <motion.div
          key={`title-${currentStepIndex}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className='text-center'
        >
          {/*           <h3 className='text-lg font-semibold'>{currentStep.title}</h3>
           */}
          <p className='font-spectral font-[400] text-3xl max-w-sm'>
            {currentStep.description}
          </p>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode='wait'>
        {/* Terminal - animated from bottom */}
        <motion.div
          key={`terminal-${currentStepIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className='h-[220px] w-full max-w-xl'
        >
          <Terminal className='h-full w-full'>
            {/* Command input */}
            <AnimatedSpan delay={0} className='text-green-500'>
              $ {currentStep.command.input}
            </AnimatedSpan>

            {/* Command output lines */}
            {currentStep.command.output.map((line, index) => (
              <AnimatedSpan key={index} delay={500 + index * 500}>
                {line}
              </AnimatedSpan>
            ))}
          </Terminal>
        </motion.div>
      </AnimatePresence>

      {/* Optional: Step indicators */}
      <div className='flex justify-center gap-2'>
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-colors ${
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
