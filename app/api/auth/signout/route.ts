import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "@/lib/utils";
import { getAuthErrorMessage } from "@/lib/auth/error-messages";

export async function POST(request: NextRequest) {
  let supabaseResponse = NextResponse.next();

  if (!hasEnvVars) {
    return NextResponse.json({ error: getAuthErrorMessage(null) }, { status: 500 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Mirror cookies into the mutable NextResponse instance so the
          // browser receives any Set-Cookie headers Supabase sets (for
          // example to clear session cookies on sign out).
          cookiesToSet.forEach(({ name, value }) =>
            supabaseResponse.cookies.set(name, value),
          );
        },
      },
    },
  );

  try {
    const { error } = await supabase.auth.signOut();

    // Return a response that includes any cookies set by Supabase
    const res = NextResponse.json({ error: error ? getAuthErrorMessage(error) : null });
    const cookies = supabaseResponse.cookies.getAll();
    cookies.forEach((c: any) => {
      try {
        res.cookies.set(c.name, c.value);
      } catch {
        // ignore cookie copy failures
      }
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: getAuthErrorMessage(err) }, { status: 500 });
  }
}
