"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function LinkIndicacaoCard({ link }: { link: string }) {
  const [copiado, setCopiado] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      setCopiado(false);
    }
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    `Conheça o Sistema Catedral! Preencha seus dados aqui e nossa equipe vai te apresentar a solução ideal: ${link}`,
  )}`;

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-background/60 p-5">
      <p className="break-all text-sm font-medium text-brand-text">{link}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={handleCopy}
          className="rounded-xl bg-brand-primary text-brand-dark hover:bg-brand-primary-hover"
        >
          {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copiado ? "Link copiado!" : "Copiar link"}
        </Button>

        <Button type="button" variant="outline" asChild className="rounded-xl border-brand-border">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            Compartilhar no WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
