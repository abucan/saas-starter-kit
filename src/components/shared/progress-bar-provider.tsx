'use client';

import { ProgressProvider } from '@bprogress/next/app';

function ProgressBarProvider({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider
      height='4px'
      color='#efb100'
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
}

export default ProgressBarProvider;
