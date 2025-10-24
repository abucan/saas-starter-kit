import { AccountNav } from './_components/account-nav';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-8'>
      <h1 className='text-2xl font-bold'>Account</h1>
      <div className='flex flex-col lg:flex-row gap-8'>
        <AccountNav />
        <div className='flex flex-1'>{children}</div>
      </div>
    </div>
  );
}
