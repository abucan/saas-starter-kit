'use client';

import { Copy } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type CopyLinkButtonProps = {
  url: string;
  canCopy: boolean;
};

export function CopyLinkButton({ url, canCopy }: CopyLinkButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Invitation link copied to clipboard');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size='icon'
          variant='outline'
          onClick={handleCopy}
          disabled={!canCopy}
        >
          <Copy className='size-4' />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {canCopy ? 'Copy invitation link' : 'Cannot copy expired invitation'}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
