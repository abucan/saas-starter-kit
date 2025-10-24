import { Empty, EmptyHeader, EmptyMedia } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';

export default function SettingsLoading() {
  return (
    <Empty className='w-full flex items-center justify-center'>
      <EmptyHeader>
        <EmptyMedia variant='default'>
          <Spinner />
        </EmptyMedia>
      </EmptyHeader>
    </Empty>
  );
}
