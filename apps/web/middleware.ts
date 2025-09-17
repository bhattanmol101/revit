import { NextResponse, type NextRequest } from 'next/server'

import { useSupabase } from '@revit/supabase/client/useSupabase'

export async function middleware(request: NextRequest) {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
    const supabase = await useSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      if (request.nextUrl.pathname === '/') {
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
          request.nextUrl.pathname.includes('/revit/') ||
          request.nextUrl.pathname == '/api/auth/callback' ||
          request.nextUrl.pathname == '/api/webhook'
        )
      ) {
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
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css)$).*)',
  ],
}
