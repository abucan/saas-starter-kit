'use client';

import { useEffect, useState } from 'react';
import { Control, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { resendOtpAction } from '@/features/auth/actions/resend-otp.action';
import { useOtpCountdown } from '@/features/auth/hooks/use-otp-countdown';

type OTPFormProps = {
  form: UseFormReturn<{ email: string; otp: string }>;
  control: Control<{ email: string; otp: string }>;
  email: string;
  loading: boolean;
  onSubmit: () => void;
  onBack: () => void;
};

export function OTPForm({
  form,
  control,
  email,
  loading,
  onSubmit,
  onBack,
}: OTPFormProps) {
  const [resending, setResending] = useState(false);
  const { canResend, formattedTime, startCountdown } = useOtpCountdown(60);

  useEffect(() => {
    startCountdown();
  }, [startCountdown]);

  const handleResend = async () => {
    setResending(true);
    const result = await resendOtpAction({ email });
    setResending(false);

    if (result.ok) {
      form.setValue('otp', '');
      form.clearErrors('otp');
      toast.success('A new code has been sent to your email.');
      startCountdown();
    } else {
      form.setError('otp', { message: 'Failed to resend code' });
    }
  };

  return (
    <div className='container max-w-sm space-y-8'>
      <div className='text-center space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>Verify your email</h1>
        <p className='text-sm text-muted-foreground'>
          We sent a 6-digit code to{' '}
          <span className='font-medium text-foreground'>{email}</span>
        </p>
      </div>

      <div className='space-y-4'>
        <FormField
          control={control}
          name='otp'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  inputMode='numeric'
                  autoComplete='one-time-code'
                  aria-label='One-time password'
                  {...field}
                >
                  <InputOTPGroup className='w-full gap-2'>
                    <InputOTPSlot index={0} className='w-full' />
                    <InputOTPSlot index={1} className='w-full' />
                    <InputOTPSlot index={2} className='w-full' />
                    <InputOTPSlot index={3} className='w-full' />
                    <InputOTPSlot index={4} className='w-full' />
                    <InputOTPSlot index={5} className='w-full' />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='button'
          onClick={onSubmit}
          disabled={loading}
          className='w-full'
        >
          {loading ? 'Verifying...' : 'Verify'}
        </Button>

        <div className='text-center flex flex-row justify-center items-center'>
          <p className='text-sm text-muted-foreground -mr-2.5'>
            Didn&apos;t receive a code?
          </p>
          <Button
            type='button'
            variant='link'
            onClick={handleResend}
            disabled={!canResend || resending}
            className='text-sm text-foreground'
          >
            {resending
              ? 'Sending...'
              : canResend
              ? 'Resend code'
              : `Resend code (${formattedTime})`}
          </Button>
        </div>
      </div>

      <div className='text-center'>
        <Button
          type='button'
          variant='ghost'
          onClick={onBack}
          disabled={loading}
          className='text-sm'
        >
          ← Back to email
        </Button>
      </div>
    </div>
  );
}
