import { getDashboardContext } from '@/lib/auth/get-dashboard-context';
import type { Metadata } from 'next';
import { ProfileForm } from './_components/profile-form';

export const metadata: Metadata = {
  title: 'Profile | Keyvaultify',
  description: 'Manage your profile information and preferences.',
};

export default async function ProfilePage() {
  const { user } = await getDashboardContext();

  return (
    <div className='flex flex-col gap-6'>
      <ProfileForm user={user} />
    </div>
  );
}
