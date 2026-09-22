"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { formatTelefone, isValidTelefone, sanitizeDigits } from "@/lib/indicacoes/cnpj";
import { cn } from "@/lib/utils";
import { getAuthErrorMessage } from "@/lib/auth/error-messages";

const PERFIS_PUBLICOS = [
  { id: 3, label: "Consultor" },
  { id: 4, label: "Contador" },
  { id: 5, label: "Cliente" },
  { id: 6, label: "Outro (gerente, funcionário, garçom etc.)" },
] as const;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [idFuncao, setIdFuncao] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const nomeNormalizado = nome.trim();
    const emailNormalizado = email.trim().toLowerCase();

    if (!nomeNormalizado) {
      setError("Informe seu nome completo.");
      return;
    }
    if (!emailNormalizado || !isValidEmail(emailNormalizado)) {
      setError("Informe um e-mail válido.");
      return;
    }
    if (!isValidTelefone(telefone)) {
      setError("Informe um WhatsApp válido, com DDD.");
      return;
    }
    if (!idFuncao) {
      setError("Selecione seu perfil.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      // O template "Magic link or OTP" não expõe {{ .Type }} e o Site URL
      // do painel está desatualizado, então "type" e "next" vão embutidos
      // aqui mesmo, na query string do emailRedirectTo — o Supabase ecoa
      // esse valor em {{ .RedirectTo }}, sem depender de nenhum dos dois.
      const redirectParams = new URLSearchParams({
        type: "email",
        next: "/auth/concluir-cadastro",
      });
      const emailRedirectTo = `${window.location.origin}/auth/confirm?${redirectParams.toString()}`;

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: emailNormalizado,
        options: {
          shouldCreateUser: true,
          emailRedirectTo,
          data: {
            pending_signup: true,
            nome: nomeNormalizado,
            telefone: sanitizeDigits(telefone),
            id_funcao: Number(idFuncao),
          },
        },
      });

      if (otpError) throw otpError;
      setSuccess(true);
    } catch (submitError: unknown) {
      setError(getAuthErrorMessage(submitError, "signup"));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={cn("w-full", className)} {...props}>
        <div className="rounded-[22px] border border-brand-border bg-white p-6 text-center shadow-[0_14px_38px_rgba(15,23,42,0.08)] md:p-8">
          <h2 className="text-2xl font-bold text-brand-text">Verifique seu e-mail</h2>
          <p className="mt-3 text-base text-brand-text-muted">
            Enviamos um link para o endereço informado. Acesse o link para concluir seu cadastro
            e criar sua senha.
          </p>
          <div className="mt-6 text-sm">
            <Link
              href="/auth/login"
              className="text-brand-text-muted underline-offset-4 transition hover:text-brand-text hover:underline"
            >
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <form
        onSubmit={handleSubmit}
        className="rounded-[22px] border border-brand-border bg-white p-6 shadow-[0_14px_38px_rgba(15,23,42,0.08)] md:p-8"
      >
        <div className="mb-7">
          <h2 className="text-3xl font-black tracking-[-0.06em] text-brand-text md:text-[2.2rem]">
            Cadastre-se
          </h2>
          <p className="mt-2 text-base text-brand-text-muted">
            Catedral Automação — Programa de Parceiros
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="nome" className="text-base font-medium text-brand-text-muted">
              Nome completo
            </Label>
            <Input
              id="nome"
              placeholder="Seu nome completo"
              autoComplete="name"
              required
              value={nome}
              onChange={(event) => setNome(event.target.value)}
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
              placeholder="seu@exemplo.com"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 rounded-xl border-brand-border bg-brand-background/60 text-base text-brand-text placeholder:text-brand-text-muted focus-visible:ring-brand-primary"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="telefone" className="text-base font-medium text-brand-text-muted">
              WhatsApp
            </Label>
            <Input
              id="telefone"
              placeholder="(00) 00000-0000"
              inputMode="numeric"
              autoComplete="tel"
              required
              value={telefone}
              onChange={(event) => setTelefone(formatTelefone(event.target.value))}
              className="h-12 rounded-xl border-brand-border bg-brand-background/60 text-base text-brand-text placeholder:text-brand-text-muted focus-visible:ring-brand-primary"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="id_funcao" className="text-base font-medium text-brand-text-muted">
              Perfil
            </Label>
            <select
              id="id_funcao"
              required
              value={idFuncao}
              onChange={(event) => setIdFuncao(event.target.value)}
              className="h-12 rounded-xl border border-brand-border bg-brand-background/60 px-3 text-base text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <option value="" disabled>
                Selecione...
              </option>
              {PERFIS_PUBLICOS.map((perfil) => (
                <option key={perfil.id} value={perfil.id}>
                  {perfil.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-6 h-12 w-full rounded-xl bg-brand-primary text-base font-semibold text-brand-dark transition hover:bg-brand-primary-hover focus-visible:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Enviando..." : "Cadastrar"}
        </Button>

        <div className="mt-5 text-center">
          <Link
            href="/auth/login"
            className="text-base text-brand-text-muted underline-offset-4 transition hover:text-brand-text hover:underline"
          >
            Já tenho cadastro / Entrar
          </Link>
        </div>
      </form>
    </div>
  );
}
