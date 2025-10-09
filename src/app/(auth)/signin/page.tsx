'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import {
  signInWithEmailAction,
  verifyOtpAction,
} from '@/features/auth/actions';
import type { AuthStep } from '@/features/auth/types';
import { SignInForm } from './_components/sign-in-form';
import { OTPForm } from './_components/otp-form';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const [currentStep, setCurrentStep] = useState<AuthStep>('email');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const searchParams = useSearchParams();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      otp: '',
    },
    mode: 'onBlur',
  });

  // Get redirect URL
  const next = searchParams.get('next') || '/dashboard';
  const redirectUrl =
    next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';

  // Email submission handler
  const handleEmailSubmit = async () => {
    const email = form.getValues('email');

    // Validate email only
    const emailValidation = z.string().email().safeParse(email);
    if (!emailValidation.success) {
      form.setError('email', { message: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    const result = await signInWithEmailAction({ email });
    setLoading(false);

    if (result.ok) {
      setEmail(email);
      setCurrentStep('otp');
    } else {
      // Map error codes to user-friendly messages
      const errorMessages: Record<string, string> = {
        INVALID_EMAIL: 'Please enter a valid email address',
        RATE_LIMITED: 'Too many attempts. Please try again later.',
        VALIDATION_ERROR: 'Please enter a valid email address',
      };
      form.setError('email', {
        message: errorMessages[result.code] || result.message,
      });
    }
  };

  // OTP submission handler
  const handleOtpSubmit = async () => {
    const otp = form.getValues('otp');

    // Validate OTP only
    const otpValidation = z.string().length(6).safeParse(otp);
    if (!otpValidation.success) {
      form.setError('otp', { message: 'Please enter a valid 6-digit code' });
      return;
    }

    setLoading(true);
    const result = await verifyOtpAction({ email, otp, next: redirectUrl });
    setLoading(false);

    if (!result.ok) {
      // Map error codes to user-friendly messages
      const errorMessages: Record<string, string> = {
        INVALID_OTP: 'Invalid code. Please try again.',
        OTP_EXPIRED: 'Code expired. Request a new one.',
        RATE_LIMITED: 'Too many attempts. Please try again later.',
      };
      form.setError('otp', {
        message: errorMessages[result.code] || result.message,
      });
    }
    // On success, redirect happens automatically in the action
  };

  // Back to email step
  const handleBack = () => {
    setCurrentStep('email');
    form.setValue('otp', '');
    form.clearErrors('otp');
  };

  return (
    <div className='w-full grid place-items-center'>
      <Form {...form}>
        {currentStep === 'email' ? (
          <SignInForm
            control={form.control}
            loading={loading}
            onSubmit={handleEmailSubmit}
          />
        ) : (
          <OTPForm
            control={form.control}
            email={email}
            loading={loading}
            onSubmit={handleOtpSubmit}
            onBack={handleBack}
          />
        )}
      </Form>
    </div>
  );
}
