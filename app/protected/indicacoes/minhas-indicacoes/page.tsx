import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { IndicacoesList } from "./indicacoes-list";

export const dynamic = "force-dynamic";

async function fetchIndications() {
  await connection();
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("wp_indicacoes")
    .select("*")
    .eq("uid_parceiro", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export default async function Page() {
  const { data, error } = await fetchIndications();

  return (
    <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Minhas indicações</h1>

      {error ? (
        <p className="mt-4 text-sm text-red-600">Erro ao buscar indicações: {String(error.message || error)}</p>
      ) : null}

      <IndicacoesList indicacoes={data ?? []} />
    </div>
  );
}
