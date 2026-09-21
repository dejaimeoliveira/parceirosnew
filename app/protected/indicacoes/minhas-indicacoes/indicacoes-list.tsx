"use client";

import { useMemo, useState } from "react";
import { formatCnpj, formatTelefone, sanitizeDigits } from "@/lib/indicacoes/cnpj";

type Indicacao = {
  id: number | string;
  nome_contato: string | null;
  email: string | null;
  telefone: string | null;
  empresa: string | null;
  cnpj: string | null;
  origem: string | null;
  observacao: string | null;
  data_indicacao: string | null;
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function matches(item: Indicacao, query: string, digitsQuery: string) {
  const textoBusca = normalizeText(
    [item.nome_contato, item.email, item.empresa].filter(Boolean).join(" "),
  );

  if (textoBusca.includes(query)) return true;

  if (digitsQuery) {
    const digitosBusca = `${sanitizeDigits(item.cnpj)} ${sanitizeDigits(item.telefone)}`;
    if (digitosBusca.includes(digitsQuery)) return true;
  }

  return false;
}

export function IndicacoesList({ indicacoes }: { indicacoes: Indicacao[] }) {
  const [busca, setBusca] = useState("");

  const query = normalizeText(busca.trim());
  const digitsQuery = sanitizeDigits(busca);

  const filtradas = useMemo(() => {
    if (!query) return indicacoes;
    return indicacoes.filter((item) => matches(item, query, digitsQuery));
  }, [indicacoes, query, digitsQuery]);

  return (
    <>
      <div className="mt-6">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Pesquisar indicações..."
          className="w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary sm:max-w-md"
        />
      </div>

      <div className="mt-6 space-y-4">
        {indicacoes.length === 0 && (
          <p className="text-sm text-brand-text-muted">Você ainda não possui indicações.</p>
        )}

        {indicacoes.length > 0 && filtradas.length === 0 && (
          <p className="text-sm text-brand-text-muted">Nenhuma indicação encontrada para esta pesquisa.</p>
        )}

        {filtradas.map((item) => (
          <div key={item.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium text-brand-text">{item.nome_contato || "-"}</div>
              <div className="text-sm text-brand-text-muted">{item.origem || "-"}</div>
            </div>
            <div className="mt-2 text-sm text-brand-text-muted">
              {item.email || "-"} • {item.telefone ? formatTelefone(item.telefone) : "-"}
            </div>
            {item.empresa ? <div className="mt-2 text-sm text-brand-text-muted">Empresa: {item.empresa}</div> : null}
            {item.cnpj ? <div className="mt-1 text-sm text-brand-text-muted">CNPJ: {formatCnpj(item.cnpj)}</div> : null}
            {item.observacao ? <div className="mt-3 text-sm text-brand-text-muted">{item.observacao}</div> : null}
            {item.data_indicacao ? (
              <div className="mt-2 text-xs text-brand-text-muted">Indicada em: {String(item.data_indicacao)}</div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
