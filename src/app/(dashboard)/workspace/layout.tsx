import { WorkspaceNav } from './_components/workspace-nav';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-8'>
      <h1 className='text-2xl font-bold'>Workspace</h1>
      <div className='flex flex-row gap-8'>
        <WorkspaceNav />
        <div className='flex flex-1'>{children}</div>
      </div>
    </div>
  );
}
