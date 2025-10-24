import type { Metadata } from 'next';

import { deleteProfileAction } from '@/features/user/actions/delete-profile.action';

import { DeleteAccountCard } from './_components/delete-account-card';

export const metadata: Metadata = {
  title: 'Security | Keyvaultify',
  description: 'Manage security settings and delete your account',
};

export default function SecurityPage() {
  return (
    <div className='flex-1'>
      <DeleteAccountCard action={deleteProfileAction} />
    </div>
  );
}
