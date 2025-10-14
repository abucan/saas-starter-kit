'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

type ToastOnceProps = {
  token?: string;
};

const ALLOWED_TOKENS = new Set(['INVITE_ACCEPTED']);

export function ToastOnce({ token }: ToastOnceProps) {
  useEffect(() => {
    if (!token || !ALLOWED_TOKENS.has(token)) return;

    if (token === 'INVITE_ACCEPTED') {
      setTimeout(() => {
        toast.success('Successfully joined the workspace!');
      }, 100);
    }

    // Clear the cookie after showing toast
    document.cookie = 'kvf_toast=; Max-Age=0; path=/; SameSite=Lax';
  }, [token]);

  return null;
}
