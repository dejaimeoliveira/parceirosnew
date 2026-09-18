import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { isValidCnpj, isValidEmail, isValidTelefone } from "@/lib/indicacoes/cnpj";

const MENSAGENS_POR_STATUS: Record<string, { status: number; error: string }> = {
  token_invalido: { status: 404, error: "Este link de indicação não está disponível." },
  cnpj_invalido: { status: 400, error: "CNPJ inválido." },
  campos_obrigatorios: { status: 400, error: "Preencha todos os campos obrigatórios." },
  exclusividade: { status: 409, error: "Este CNPJ já possui uma indicação em andamento." },
  erro: { status: 500, error: "Não foi possível registrar sua indicação." },
};

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const token = typeof body?.token === "string" ? body.token.trim() : "";
  const nomeContato = typeof body?.nome_contato === "string" ? body.nome_contato.trim() : "";
  const empresa = typeof body?.empresa === "string" ? body.empresa.trim() : "";
  const cnpjRaw = typeof body?.cnpj === "string" ? body.cnpj : "";
  const telefoneRaw = typeof body?.telefone === "string" ? body.telefone : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!token) {
    return NextResponse.json({ error: "Link de indicação inválido." }, { status: 400 });
  }

  if (!nomeContato || !empresa || !cnpjRaw || !telefoneRaw) {
    return NextResponse.json(
      { error: "Preencha todos os campos obrigatórios." },
      { status: 400 },
    );
  }

  if (!isValidCnpj(cnpjRaw)) {
    return NextResponse.json({ error: "CNPJ inválido." }, { status: 400 });
  }

  if (!isValidTelefone(telefoneRaw)) {
    return NextResponse.json({ error: "Telefone inválido." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: resultado, error: rpcError } = await supabase.rpc("wp_criar_indicacao_publica", {
    p_token: token,
    p_nome_contato: nomeContato,
    p_empresa: empresa,
    p_cnpj: cnpjRaw,
    p_telefone: telefoneRaw,
    p_email: email || null,
  });

  if (rpcError) {
    // Log completo só no servidor (nunca enviado ao navegador): inclui
    // message/code/details/hint do Postgres para permitir diagnóstico real.
    console.error("Erro ao chamar wp_criar_indicacao_publica:", rpcError);
    return NextResponse.json({ error: "Não foi possível registrar sua indicação." }, { status: 500 });
  }

  if (resultado === "ok") {
    return NextResponse.json({ ok: true });
  }

  const mensagem =
    MENSAGENS_POR_STATUS[resultado as string] ?? {
      status: 500,
      error: "Não foi possível registrar sua indicação.",
    };

  return NextResponse.json({ error: mensagem.error }, { status: mensagem.status });
}
