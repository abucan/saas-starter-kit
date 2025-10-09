import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';

export default function SignInLoading() {
  return (
    <Empty className='w-full'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <Spinner />
        </EmptyMedia>
        <EmptyTitle> Loading...</EmptyTitle>
        <EmptyDescription>
          Please wait while we load the page. Do not refresh the page.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant='outline' size='sm'>
          Cancel
        </Button>
      </EmptyContent>
    </Empty>
  );
}
