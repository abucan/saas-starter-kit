import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { bAuth } from '@/lib/auth/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: invitationId } = await params;

  try {
    // Accept the invitation using Better Auth
    await bAuth.api.acceptInvitation({
      headers: await headers(),
      body: { invitationId },
    });

    // Create redirect response to dashboard
    const redirectUrl = new URL('/dashboard', request.url);
    const response = NextResponse.redirect(redirectUrl);

    // Set toast cookie to show success message
    response.cookies.set('kvf_toast', 'INVITE_ACCEPTED', {
      maxAge: 10, // 10 seconds
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false, // Needs to be readable by client
    });

    return response;
  } catch (error) {
    console.error('Error accepting invitation:', error);

    // Redirect to sign-in with next parameter to retry after login
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('next', `/accept-invitation/${invitationId}`);
    return NextResponse.redirect(signInUrl);
  }
}
