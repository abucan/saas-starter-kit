import type { Metadata } from 'next';

import { getDashboardContext } from '@/lib/auth/get-dashboard-context';

import { ProfileForm } from './_components/profile-form';

export const metadata: Metadata = {
  title: 'Profile | Keyvaultify',
  description: 'Manage your account settings and preferences.',
};

export default async function ProfilePage() {
  const { user } = await getDashboardContext();

  return (
    <div className='flex-1'>
      <ProfileForm user={user} />
    </div>
  );
}
