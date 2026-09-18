import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { LinkIndicacaoCard } from "./link-indicacao-card";

async function fetchToken() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("wp_parceiros")
    .select("token_indicacao")
    .eq("uid", userId)
    .maybeSingle();

  return { token: data?.token_indicacao as string | null | undefined, error };
}

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");
  const proto = headersList.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return host ? `${proto}://${host}` : "https://parceiroscatedral.com.br";
}

export default async function Page() {
  const [{ token, error }, baseUrl] = await Promise.all([fetchToken(), getBaseUrl()]);

  return (
    <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-text-muted">Portal</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-text">Seu link de indicação</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-text-muted">
        Compartilhe este link por WhatsApp, e-mail ou redes sociais. Quem preencher o formulário
        será automaticamente vinculado a você como indicação.
      </p>

      <div className="mt-6">
        {error || !token ? (
          <p className="text-sm text-brand-text-muted">
            Não foi possível carregar seu link de indicação no momento. Entre em contato com a
            Catedral se o problema persistir.
          </p>
        ) : (
          <LinkIndicacaoCard link={`${baseUrl}/indicacao/${token}`} />
        )}
      </div>
    </div>
  );
}
