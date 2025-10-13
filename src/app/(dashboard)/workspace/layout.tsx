import { WorkspaceNav } from './_components/workspace-nav';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-bold font-bricolage-grotesque'>
          Workspace
        </h1>
        <p className='text-base text-muted-foreground font-bricolage-grotesque'>
          Manage your workspace settings and preferences.
        </p>
      </div>
      <div className='flex flex-row gap-10'>
        <WorkspaceNav />
        <div className='flex flex-1'>{children}</div>
      </div>
    </div>
  );
}
