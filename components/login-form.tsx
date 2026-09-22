"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getAuthErrorMessage } from "@/lib/auth/error-messages";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(json?.error || getAuthErrorMessage(null, "login"));
        return;
      }

      router.push("/protected");
      router.refresh();
    } catch {
      setError(getAuthErrorMessage(null, "login"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <form
        onSubmit={handleLogin}
        className="rounded-[22px] border border-brand-border bg-white p-6 shadow-[0_14px_38px_rgba(15,23,42,0.08)] md:p-8"
      >
        <div className="mb-7">
          <h2 className="text-3xl font-black tracking-[-0.06em] text-brand-text md:text-[2.2rem]">
            Portal de Parceiros
          </h2>
          <p className="mt-2 text-base text-brand-text-muted">
            Catedral Automação — entre com sua conta
          </p>
        </div>

        <div className="space-y-6">
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
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password" className="text-base font-medium text-brand-text-muted">
                Senha
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-brand-text-muted underline-offset-4 transition hover:text-brand-text hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded-xl border-brand-border bg-brand-background/60 text-base text-brand-text placeholder:text-brand-text-muted focus-visible:ring-brand-primary"
            />
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
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>

        <div className="mt-5 text-center text-sm text-brand-text-muted">
          Ainda não é parceiro?{" "}
          <Link
            href="/auth/sign-up"
            className="font-medium text-brand-text underline-offset-4 transition hover:underline"
          >
            Cadastre-se
          </Link>
        </div>
      </form>
    </div>
  );
}
