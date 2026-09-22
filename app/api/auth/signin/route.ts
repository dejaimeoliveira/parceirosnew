import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "@/lib/utils";
import { getAuthErrorMessage } from "@/lib/auth/error-messages";

export async function POST(request: NextRequest) {
  // Create a placeholder NextResponse to capture cookies set by Supabase
  let supabaseResponse = NextResponse.next();

  if (!hasEnvVars) {
    return NextResponse.json({ error: getAuthErrorMessage(null, "login") }, { status: 500 });
  }

  const body = await request.json();
  const { email, password } = body || {};

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
                // Mirror cookies into the mutable NextResponse instance.
                cookiesToSet.forEach(({ name, value, options }) =>
                  // `options` may not be typed the same across environments; set minimal cookie
                  // values on the response so the browser receives Set-Cookie headers.
                  supabaseResponse.cookies.set(name, value),
                );
        },
      },
    },
  );

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: getAuthErrorMessage(error, "login") }, { status: 401 });
    }

    // Return a response that includes the cookies set by supabase
    // Return JSON response and also copy any cookies that Supabase set.
    const res = NextResponse.json({ data: data ?? null });
    const cookies = supabaseResponse.cookies.getAll();
    cookies.forEach((c: any) => {
      // Only set name/value to avoid typing mismatches; Supabase sets HttpOnly cookies server-side
      // but replicating basic Set-Cookie is sufficient for SSR recognition here.
      try {
        res.cookies.set(c.name, c.value);
      } catch {
        // ignore cookie copy failures to avoid crashing the route
      }
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: getAuthErrorMessage(err, "login") }, { status: 500 });
  }
}
