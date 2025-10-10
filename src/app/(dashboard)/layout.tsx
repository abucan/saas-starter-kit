import { AppSidebar } from '@/components/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fakeCtx = {
    user: {
      id: '1',
      email: 'test@test.com',
      name: 'Test',
      image: 'https://avatars.githubusercontent.com/u/24756586?v=4',
    },
    org: { id: '1', slug: 'test', name: 'Test', isPersonal: true },
    membership: { role: 'owner' as 'owner' | 'admin' | 'member' },
    teams: [
      {
        id: '1',
        name: 'Test',
        slug: 'test',
        logo: 'https://avatars.githubusercontent.com/u/24756586?v=4',
        default_role: 'owner' as 'owner' | 'admin' | 'member',
        createdAt: new Date(),
        metadata: {},
      },
    ],
  };

  return (
    <SidebarProvider>
      <AppSidebar variant='floating' side='left' ctx={fakeCtx} />
      <SidebarInset className='container mx-auto px-12'>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear'>
          <div className='flex flex-row w-full items-center justify-between gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <SidebarTrigger className='-ml-1' />
              <Separator
                orientation='vertical'
                className='mr-2 data-[orientation=vertical]:h-4'
              />
              {/* <SearchCommand /> */}
            </div>
            {/* <ModeToggle /> */}
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 pt-0'>
          <div className='min-h-[100vh] flex-1 md:min-h-min pt-6'>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
