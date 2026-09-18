import { createClient } from "@/lib/supabase/server";
import { IndicacaoForm } from "./indicacao-form";

export const dynamic = "force-dynamic";

async function isTokenValido(token: string) {
  if (!token) return false;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("wp_indicacao_token_ativo", {
    p_token: token,
  });

  if (error) {
    console.error("Erro ao validar token de indicação:", error.message);
    return false;
  }

  return data === true;
}

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const valido = await isTokenValido(token);

  if (!valido) {
    return (
      <main className="min-h-svh bg-brand-background px-4 py-12 md:px-6">
        <div className="mx-auto flex max-w-[540px] flex-col items-center text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-dark text-sm font-bold text-white">
            C
          </div>
          <div className="mt-8 w-full rounded-[22px] border border-brand-border bg-white p-8 shadow-[0_14px_38px_rgba(15,23,42,0.08)]">
            <h1 className="text-2xl font-bold text-brand-text">
              Este link de indicação não está disponível.
            </h1>
            <p className="mt-3 text-base text-brand-text-muted">
              Verifique com quem compartilhou o link ou entre em contato diretamente com a
              Catedral Automação.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-brand-background px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto w-full max-w-[1180px]">
        <header className="mb-8 text-left md:mb-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-dark text-sm font-bold text-white">
            C
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-[-0.06em] text-brand-text md:text-6xl">
            Conheça o Sistema Catedral
          </h1>
          <p className="mt-3 max-w-2xl text-xl text-brand-text-muted md:text-2xl">
            Preencha seus dados e nossa equipe entrará em contato para apresentar a solução ideal
            para o seu negócio.
          </p>
        </header>

        <div className="mx-auto max-w-[540px]">
          <IndicacaoForm token={token} />
        </div>
      </div>
    </main>
  );
}
