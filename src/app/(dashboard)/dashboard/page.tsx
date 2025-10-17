import { cookies } from 'next/headers';

import { ToastOnce } from '@/components/shared/toast-once';

export default async function DashboardPage() {
  const c = await cookies();
  const toast = c.get('kvf_toast');

  return (
    <div>
      <h1>Dashboard</h1>
      <ToastOnce token={toast?.value} />
    </div>
  );
}
