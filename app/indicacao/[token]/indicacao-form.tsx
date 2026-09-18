"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCnpj, formatTelefone } from "@/lib/indicacoes/cnpj";

export function IndicacaoForm({ token }: { token: string }) {
  const [nomeContato, setNomeContato] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/indicacoes/publica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          nome_contato: nomeContato,
          empresa,
          cnpj,
          telefone,
          email,
        }),
      });

      const json = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(json?.error || "Não foi possível enviar seus dados. Tente novamente.");
      }

      setEnviado(true);
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível enviar seus dados. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <div className="rounded-[22px] border border-brand-border bg-white p-8 text-center shadow-[0_14px_38px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-bold text-brand-text">Obrigado!</h2>
        <p className="mt-3 text-base text-brand-text-muted">
          Recebemos seus dados. Nossa equipe comercial entrará em contato com você.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[22px] border border-brand-border bg-white p-6 shadow-[0_14px_38px_rgba(15,23,42,0.08)] md:p-8"
    >
      <div className="space-y-5">
        <div className="grid gap-2">
          <Label htmlFor="nome_contato" className="text-base font-medium text-brand-text-muted">
            Nome do contato *
          </Label>
          <Input
            id="nome_contato"
            placeholder="Nome completo"
            required
            value={nomeContato}
            onChange={(event) => setNomeContato(event.target.value)}
            className="h-12 rounded-xl border-brand-border bg-brand-background/60 text-base text-brand-text placeholder:text-brand-text-muted focus-visible:ring-brand-primary"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="empresa" className="text-base font-medium text-brand-text-muted">
            Empresa *
          </Label>
          <Input
            id="empresa"
            placeholder="Nome da empresa"
            required
            value={empresa}
            onChange={(event) => setEmpresa(event.target.value)}
            className="h-12 rounded-xl border-brand-border bg-brand-background/60 text-base text-brand-text placeholder:text-brand-text-muted focus-visible:ring-brand-primary"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cnpj" className="text-base font-medium text-brand-text-muted">
            CNPJ *
          </Label>
          <Input
            id="cnpj"
            placeholder="00.000.000/0000-00"
            required
            inputMode="numeric"
            value={cnpj}
            onChange={(event) => setCnpj(formatCnpj(event.target.value))}
            className="h-12 rounded-xl border-brand-border bg-brand-background/60 text-base text-brand-text placeholder:text-brand-text-muted focus-visible:ring-brand-primary"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="telefone" className="text-base font-medium text-brand-text-muted">
            Telefone *
          </Label>
          <Input
            id="telefone"
            placeholder="(00) 00000-0000"
            required
            inputMode="numeric"
            value={telefone}
            onChange={(event) => setTelefone(formatTelefone(event.target.value))}
            className="h-12 rounded-xl border-brand-border bg-brand-background/60 text-base text-brand-text placeholder:text-brand-text-muted focus-visible:ring-brand-primary"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-base font-medium text-brand-text-muted">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="exemplo@empresa.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 rounded-xl border-brand-border bg-brand-background/60 text-base text-brand-text placeholder:text-brand-text-muted focus-visible:ring-brand-primary"
          />
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={loading}
        className="mt-6 h-12 w-full rounded-xl bg-[#CD9019] text-base font-semibold text-white transition hover:bg-[#CD9019]/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Enviando..." : "QUERO CONHECER O SISTEMA CATEDRAL"}
      </Button>
    </form>
  );
}
