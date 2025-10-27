import { type NextRequest, NextResponse } from 'next/server'

import { useSupabase } from '@revit/supabase/client/useSupabase'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // if (request.cookies.get('mw_ran')?.value === 'true') {
  //   return response
  // }

  try {
    // Create an unmodified response

    const supabase = await useSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    response.cookies.set('mw_ran', 'true', { maxAge: 60 })

    if (user) {
      if (
        request.nextUrl.pathname === '/' ||
        request.nextUrl.pathname === '/signin' ||
        request.nextUrl.pathname === '/signup'
      ) {
        return NextResponse.redirect(new URL('/home', request.url))
      }
    } else {
      if (
        !(
          request.nextUrl.pathname == '/' ||
          request.nextUrl.pathname == '/privacy' ||
          request.nextUrl.pathname == '/terms' ||
          request.nextUrl.pathname == '/signup' ||
          request.nextUrl.pathname == '/signin' ||
          request.nextUrl.pathname == '/api/auth/callback'
        )
      ) {
        console.log('redirecting')
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
    return response
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}

export const config = {
  matcher: [
    '/',
    '/signin',
    '/signup',
    '/home',
    '/explore',
    '/forums/:path*',
    '/profile/:path*',
    '/api/auth/callback',
  ],
}
