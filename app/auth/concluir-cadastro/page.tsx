import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ConcluirCadastroForm } from "@/components/concluir-cadastro-form";

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const { data: parceiro } = await supabase
    .from("wp_parceiros")
    .select("id")
    .eq("uid", data.user.id)
    .maybeSingle();

  if (parceiro) {
    // Cadastro já concluído anteriormente (ex.: link acessado novamente).
    redirect("/protected");
  }

  // Nome, telefone e perfil não precisam ser lidos aqui: a RPC de
  // conclusão obtém esses dados diretamente de auth.users no banco.
  return (
    <main className="flex min-h-svh items-center justify-center bg-brand-background px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto w-full max-w-[540px]">
        <ConcluirCadastroForm />
      </div>
    </main>
  );
}
