import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatTelefone } from "@/lib/indicacoes/cnpj";

type ParceiroCadastro = {
  nome: string | null;
  email: string | null;
  telefone: string | null;
  cpf: string | null;
  pix_conta: string | null;
};

function formatCpf(cpf: string | null) {
  if (!cpf) return null;
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function Campo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-text-muted">{label}</p>
      <p className="mt-1 text-base font-medium text-brand-text">{value}</p>
    </div>
  );
}

async function fetchParceiro() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("wp_parceiros")
    .select("nome, email, telefone, cpf, pix_conta")
    .eq("uid", userId)
    .maybeSingle();

  return { data: data as ParceiroCadastro | null, error };
}

export default async function Page() {
  const { data, error } = await fetchParceiro();

  if (error) {
    console.error("Erro ao buscar wp_parceiros:", error);

    return (
      <div className="rounded-3xl border border-brand-border bg-white p-6 text-center shadow-sm sm:p-8">
        <p className="text-lg font-semibold text-brand-text">Não foi possível carregar seu cadastro</p>
        <p className="mt-2 text-sm text-brand-text-muted">Tente novamente mais tarde.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-brand-border bg-white p-6 text-center shadow-sm sm:p-8">
        <p className="text-lg font-semibold text-brand-text">Cadastro não encontrado</p>
        <p className="mt-2 text-sm text-brand-text-muted">
          Não foi possível localizar seu cadastro de parceiro. Entre em contato com a Catedral.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-text-muted">Portal</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-text">Meu Cadastro</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-text-muted">
          Consulte seus dados cadastrados no Programa de Parceiros Catedral.
        </p>

        <div className="mt-6 grid gap-6 rounded-2xl border border-brand-border bg-brand-background/60 p-5 sm:grid-cols-2">
          <Campo label="Nome" value={data.nome || "Não informado"} />
          <Campo label="E-mail" value={data.email || "Não informado"} />
          <Campo label="Telefone" value={data.telefone ? formatTelefone(data.telefone) : "Não informado"} />
          <Campo label="CPF" value={formatCpf(data.cpf) || "Não informado"} />
          <Campo label="Chave PIX" value={data.pix_conta || "Não informada"} />
        </div>
      </div>
    </div>
  );
}
