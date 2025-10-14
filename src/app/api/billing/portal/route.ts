import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { billingService } from '@/features/billing/services/billing.service';
import { requireUserId } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await headers();
    const userId = await requireUserId();

    const portalUrl = await billingService.createPortalSession(userId);

    return NextResponse.redirect(portalUrl, { status: 303 });
  } catch (error) {
    console.error('Portal route error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/account/billing?error=portal_failed`,
      { status: 303 }
    );
  }
}
