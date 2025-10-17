import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { bAuth } from '@/lib/auth/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: invitationId } = await params;

  try {
    await bAuth.api.acceptInvitation({
      headers: await headers(),
      body: { invitationId },
    });

    const redirectUrl = new URL('/dashboard', request.url);
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set('kvf_toast', 'INVITE_ACCEPTED', {
      maxAge: 10,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false,
    });

    return response;
  } catch (error) {
    console.error('Error accepting invitation:', error);

    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('next', `/accept-invitation/${invitationId}`);
    return NextResponse.redirect(signInUrl);
  }
}
