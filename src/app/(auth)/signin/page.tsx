'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import { signInWithEmailAction } from '@/features/auth/actions/sign-in-with-email.action';
import { verifyOtpAction } from '@/features/auth/actions/verify-otp.action';
import {
  SignInInput,
  signInSchema,
  signInWithEmailSchema,
  verifyOtpSchema,
} from '@/features/auth/schemas/auth.schema';
import type { AuthStep } from '@/features/auth/types';

import { OTPForm, SignInForm } from './_components';

export default function SignInPage() {
  const [currentStep, setCurrentStep] = useState<AuthStep>('email');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const searchParams = useSearchParams();

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      otp: '',
    },
    mode: 'onSubmit',
  });

  const next = searchParams.get('next') || '/dashboard';
  const redirectUrl =
    next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';

  const handleEmailSubmit = async () => {
    const email = form.getValues('email');

    const emailValidation = signInWithEmailSchema.safeParse({ email: email });
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

  const handleOtpSubmit = async () => {
    const otp = form.getValues('otp');

    const otpValidation = verifyOtpSchema.safeParse({ email: email, otp: otp });
    if (!otpValidation.success) {
      form.setError('otp', { message: 'Please enter a valid 6-digit code' });
      return;
    }

    setLoading(true);
    const result = await verifyOtpAction({ email, otp, next: redirectUrl });
    setLoading(false);

    if (!result.ok) {
      const errorMessages: Record<string, string> = {
        INVALID_OTP: 'Invalid code. Please try again.',
        OTP_EXPIRED: 'Code expired. Request a new one.',
        RATE_LIMITED: 'Too many attempts. Please try again later.',
      };
      form.setError('otp', {
        message: errorMessages[result.code] || result.message,
      });
    }
  };

  const handleBack = () => {
    setCurrentStep('email');
    form.setValue('otp', '');
    form.clearErrors('otp');
    form.clearErrors('email');
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
            form={form}
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
