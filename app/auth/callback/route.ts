import { NextResponse } from "next/server";

// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";
import { fetchUserById, insertUserProfile } from "@/data-access/user.db";
import { User } from "@/types/user";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const resp = await fetchUserById(data.user.id);

      if (!resp) {
        const user: User = {
          id: data.user.id,
          email: data.user.user_metadata.email,
          name: data.user.user_metadata.name,
          createdAt: new Date(data.user.created_at),
          profileImage: data.user.user_metadata.picture,
        };

        await insertUserProfile(user);
      }

      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
