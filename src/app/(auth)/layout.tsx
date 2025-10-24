import { ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

import { AnimatedTerminal } from './signin/_components';

export const metadata: Metadata = {
  title: {
    template: '%s | Keyvaultify',
    default: 'Authentication | Keyvaultify',
  },
  description: 'Secure authentication for your account',
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen'>
      <div className='flex flex-col w-full lg:w-[60%] relative'>
        <div className='absolute flex flex-row justify-between items-center py-4 px-6'>
          <h1 className='font-spectral text-xl font-semibold flex flex-row items-center justify-center gap-[4px]'>
            <ShieldCheck />
            Keyvaultify
          </h1>
        </div>
        <div className='flex h-screen justify-center items-center'>
          {children}
        </div>
      </div>
      <div className='hidden lg:flex lg:w-[40%] bg-[#F2F0EF] h-full items-center justify-center'>
        <AnimatedTerminal />
      </div>
    </div>
  );
}
