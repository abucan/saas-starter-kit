import type { Metadata } from 'next';
import { DeleteAccountCard } from './_components/delete-account-card';

export const metadata: Metadata = {
  title: 'Security | Keyvaultify',
  description: 'Manage security settings and account deletion.',
};

export default function SecurityPage() {
  return (
    <div className='flex flex-col gap-6'>
      <DeleteAccountCard />
    </div>
  );
}
