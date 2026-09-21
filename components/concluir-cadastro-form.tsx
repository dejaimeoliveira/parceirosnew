"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const TERMO_VERSAO = "1.0";

const STATUS_SUCESSO = new Set(["ok", "ja_concluido"]);

const MENSAGENS_POR_STATUS: Record<string, string> = {
  nao_autenticado: "Sua sessão expirou. Faça login novamente para concluir o cadastro.",
  email_nao_confirmado:
    "Não foi possível confirmar seu e-mail. Acesse novamente o link enviado por e-mail.",
  perfil_invalido:
    "Não foi possível identificar seu perfil. Entre em contato com a Catedral Automação.",
  dados_invalidos:
    "Não foi possível concluir seu cadastro. Entre em contato com a Catedral Automação.",
  termo_nao_aceito: "É necessário aceitar o Termo de Adesão para concluir o cadastro.",
  email_duplicado: "Já existe um cadastro de parceiro para este e-mail.",
  erro: "Não foi possível concluir seu cadastro. Tente novamente.",
};

function isSenhaValida(senha: string) {
  return senha.trim().length > 0 && senha.length >= 8;
}

export function ConcluirCadastroForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termoAceito, setTermoAceito] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isSenhaValida(password)) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!termoAceito) {
      setError("É necessário aceitar o Termo de Adesão para concluir o cadastro.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error: passwordError } = await supabase.auth.updateUser({ password });
      if (passwordError) throw new Error(passwordError.message);

      // Nome, telefone, e-mail e perfil não são reenviados aqui: a RPC os
      // obtém diretamente da identidade autenticada (auth.uid()) e dos
      // metadados já armazenados no cadastro inicial, revalidando tudo
      // no banco. O único dado desta chamada é o aceite do Termo, que
      // precisa ser uma ação explícita deste envio.
      const { data: resultado, error: rpcError } = await supabase.rpc(
        "wp_concluir_cadastro_parceiro",
        { p_termo_aceite: true },
      );

      if (rpcError) {
        throw new Error(MENSAGENS_POR_STATUS.erro);
      }

      if (!STATUS_SUCESSO.has(resultado as string)) {
        throw new Error(MENSAGENS_POR_STATUS[resultado as string] ?? MENSAGENS_POR_STATUS.erro);
      }

      router.push("/protected");
      router.refresh();
    } catch (submitError: unknown) {
      setError(submitError instanceof Error ? submitError.message : MENSAGENS_POR_STATUS.erro);
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[22px] border border-brand-border bg-white p-6 shadow-[0_14px_38px_rgba(15,23,42,0.08)] md:p-8"
    >
      <div className="mb-7">
        <h2 className="text-3xl font-black tracking-[-0.06em] text-brand-text md:text-[2.2rem]">
          Concluir cadastro
        </h2>
        <p className="mt-2 text-base text-brand-text-muted">
          Defina sua senha e aceite o Termo de Adesão para acessar o Portal.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="password" className="text-base font-medium text-brand-text-muted">
            Nova senha
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 rounded-xl border-brand-border bg-brand-background/60 text-base text-brand-text placeholder:text-brand-text-muted focus-visible:ring-brand-primary"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword" className="text-base font-medium text-brand-text-muted">
            Confirmar senha
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="h-12 rounded-xl border-brand-border bg-brand-background/60 text-base text-brand-text placeholder:text-brand-text-muted focus-visible:ring-brand-primary"
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-border bg-brand-background/60 p-4">
        <p className="text-sm font-semibold text-brand-text">
          Termo de Adesão ao Programa de Parceiros Catedral
        </p>
        <div className="mt-2 max-h-48 space-y-3 overflow-y-auto pr-2 text-sm leading-relaxed text-brand-text-muted">
          <p>
            Ao concluir meu cadastro, declaro que desejo participar do Programa de Parceiros da
            Catedral Automação, realizando indicações de potenciais clientes de forma autônoma e
            sem qualquer vínculo empregatício com a Catedral Automação.
          </p>
          <p>
            Estou ciente de que a participação no programa não estabelece relação de emprego,
            obrigação de jornada, exclusividade ou subordinação entre as partes.
          </p>
          <p>
            Caso uma de minhas indicações resulte em contratação que gere comissão recorrente, a
            parceria será formalizada por meio de contrato assinado eletronicamente antes da
            liberação do primeiro pagamento.
          </p>
          <p>
            Declaro estar de acordo com estas condições para concluir meu cadastro e participar
            do Programa de Parceiros.
          </p>
        </div>
        <label className="mt-4 flex items-start gap-3 text-sm text-brand-text">
          <Checkbox
            checked={termoAceito}
            onCheckedChange={(checked) => setTermoAceito(checked === true)}
            className="mt-0.5"
          />
          <span>
            Li e concordo com o Termo de Adesão ao Programa de Parceiros Catedral (versão{" "}
            {TERMO_VERSAO}).
          </span>
        </label>
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
        {isLoading ? "Concluindo..." : "Concluir cadastro"}
      </Button>
    </form>
  );
}
