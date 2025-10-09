import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing OTP countdown timer
 * @param initialSeconds - Initial countdown duration (default: 60 seconds)
 */
export function useOtpCountdown(initialSeconds: number = 60) {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  // Format time as MM:SS
  const formattedTime = (() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  })();

  // Computed: can resend when countdown reaches 0
  const canResend = timeRemaining === 0;

  // Countdown effect
  useEffect(() => {
    if (!isActive || timeRemaining === 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  // Start countdown
  const startCountdown = useCallback(() => {
    setTimeRemaining(initialSeconds);
    setIsActive(true);
  }, [initialSeconds]);

  // Stop countdown
  const stopCountdown = useCallback(() => {
    setIsActive(false);
  }, []);

  // Reset countdown
  const resetCountdown = useCallback(() => {
    setTimeRemaining(initialSeconds);
    setIsActive(false);
  }, [initialSeconds]);

  return {
    timeRemaining,
    canResend,
    isActive,
    formattedTime,
    startCountdown,
    stopCountdown,
    resetCountdown,
  };
}
