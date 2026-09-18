import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { formatCnpj, formatTelefone } from "@/lib/indicacoes/cnpj";

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

      <div className="mt-6 space-y-4">
        {(!data || data.length === 0) && <p className="text-sm text-brand-text-muted">Você ainda não possui indicações.</p>}

        {data?.map((item: any) => (
          <div key={item.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium text-brand-text">{item.nome_contato || "-"}</div>
              <div className="text-sm text-brand-text-muted">{item.origem || "-"}</div>
            </div>
            <div className="mt-2 text-sm text-brand-text-muted">{item.email || "-"} • {item.telefone ? formatTelefone(item.telefone) : "-"}</div>
            {item.empresa ? <div className="mt-2 text-sm text-brand-text-muted">Empresa: {item.empresa}</div> : null}
            {item.cnpj ? <div className="mt-1 text-sm text-brand-text-muted">CNPJ: {formatCnpj(item.cnpj)}</div> : null}
            {item.observacao ? <div className="mt-3 text-sm text-brand-text-muted">{item.observacao}</div> : null}
            {item.data_indicacao ? <div className="mt-2 text-xs text-brand-text-muted">Indicada em: {String(item.data_indicacao)}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
