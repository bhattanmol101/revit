import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function proxy(req: Request) {
    const res = NextResponse.next();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => {
                    const cookieHeader = req.headers.get("cookie") || "";

                    return cookieHeader
                        .split(";")
                        .map((c) => c.trim())
                        .filter(Boolean)
                        .map((c) => {
                            const [name, ...rest] = c.split("=");
                            return { name, value: rest.join("=") };
                        });
                },

                setAll: (cookies) => {
                    cookies.forEach(({ name, value, options }) => {
                        res.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // 🔥 This refreshes session automatically
    await supabase.auth.getUser();

    return res;
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