'use client';

import { useState, type ReactNode } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { R } from '@/types/result';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type DangerZoneCardProps = {
  /** Title of the danger zone card */
  title: string;
  /** Description shown in the card header */
  description: string;
  /** Warning content shown in the card body */
  warningContent: ReactNode;
  /** Final warning content shown after initial click (optional) */
  finalWarningContent?: ReactNode;
  /** Label for the action button */
  actionLabel?: string;
  /** Label for the confirm button */
  confirmLabel?: string;
  /** Action to execute on confirmation */
  action: () => Promise<R>;
  /** Whether the user has permission to perform this action */
  canPerformAction?: boolean;
  /** Reason shown in tooltip when action is disabled */
  disabledReason?: string;
  /** Custom error message mapping (error code -> user message) */
  errorMessages?: Record<string, string>;
  /** Success message to show after action completes */
  successMessage?: string;
};

export function DangerZoneCard({
  title,
  description,
  warningContent,
  finalWarningContent,
  actionLabel = 'Delete',
  confirmLabel = 'Confirm Deletion',
  action,
  canPerformAction = true,
  disabledReason = 'You do not have permission to perform this action',
  errorMessages = {},
  successMessage,
}: DangerZoneCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleInitialClick = () => {
    setIsConfirming(true);
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  const handleConfirm = async () => {
    setIsExecuting(true);

    try {
      const result = await action();

      if (!result.ok) {
        const errorMessage = getErrorMessage(result.code, result.message);
        toast.error(errorMessage);
        setIsExecuting(false);
        setIsConfirming(false);
      } else {
        // Success - show toast if message provided
        if (successMessage) {
          toast.success(successMessage);
        }
        // Note: Don't reset state here - component will likely unmount
        // after successful deletion (redirect, etc.)
      }
    } catch {
      toast.error('An unexpected error occurred');
      setIsExecuting(false);
      setIsConfirming(false);
    }
  };

  function getErrorMessage(code: string, defaultMessage?: string): string {
    return errorMessages[code] ?? defaultMessage ?? 'Operation failed';
  }

  const actionButton = (
    <Button
      variant='destructive'
      onClick={handleInitialClick}
      disabled={!canPerformAction || isExecuting}
    >
      {actionLabel}
    </Button>
  );

  return (
    <Card className='border-destructive/50'>
      <CardHeader className='gap-0'>
        <CardTitle className='text-base font-bold font-bricolage-grotesque text-destructive'>
          {title}
        </CardTitle>
        <CardDescription className='text-sm font-bricolage-grotesque'>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-row items-start gap-4'>
          <AlertTriangle className='size-6 text-destructive shrink-0 mt-0.5' />
          <div className='flex flex-col gap-2'>
            <div className='text-sm text-muted-foreground font-bricolage-grotesque'>
              {warningContent}
            </div>
          </div>
        </div>

        {isConfirming && finalWarningContent && (
          <>
            <Separator />
            <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4'>
              <p className='text-sm font-semibold text-destructive font-bricolage-grotesque mb-2'>
                ⚠️ Final Warning
              </p>
              <div className='text-sm text-muted-foreground font-bricolage-grotesque'>
                {finalWarningContent}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className='flex gap-2'>
        {!isConfirming ? (
          canPerformAction ? (
            actionButton
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>{actionButton}</TooltipTrigger>
              <TooltipContent>
                <p>{disabledReason}</p>
              </TooltipContent>
            </Tooltip>
          )
        ) : (
          <>
            <Button
              variant='outline'
              onClick={handleCancel}
              disabled={isExecuting}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleConfirm}
              disabled={isExecuting}
            >
              {isExecuting ? (
                <>
                  <Loader2 className='size-4 animate-spin' />
                  Executing...
                </>
              ) : (
                confirmLabel
              )}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
