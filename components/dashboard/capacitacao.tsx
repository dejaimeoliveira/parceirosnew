import { GraduationCap } from "lucide-react";

export function Capacitacao() {
  return (
    <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-background text-brand-text">
          <GraduationCap className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-text-muted">
            Capacitação
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-text">
            Capacitação
          </h1>
        </div>
      </div>

      <div className="max-w-4xl rounded-3xl border border-brand-border bg-gradient-to-br from-brand-background via-white to-white p-6 sm:p-8">
        <div className="mb-6 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
          Conhecimento para ajudar você a crescer
        </div>

        <div className="space-y-5 text-base leading-7 text-brand-text-muted">
          <p>
            Estamos preparando a <strong className="font-semibold text-brand-text">Capacitação</strong>,
            um espaço dedicado ao desenvolvimento profissional dos nossos parceiros.
          </p>

          <p>
            Aqui você encontrará conteúdos práticos para desenvolver conhecimentos e habilidades importantes para a
            aquisição de novos clientes e para o crescimento da sua atividade como parceiro.
          </p>

          <p>
            Entre os temas que estamos preparando estão <strong className="font-semibold text-brand-text">administração do tempo,
              organização e produtividade, comunicação, abordagem de clientes, técnicas de vendas, negociação,
              relacionamento</strong> e outras habilidades importantes para o desenvolvimento profissional e comercial.
          </p>

          <p>
            Nosso objetivo é oferecer conteúdos que possam ser aplicados no dia a dia, ajudando você a se
            organizar melhor, identificar oportunidades e conquistar novos clientes.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-brand-border bg-white px-5 py-4">
          <p className="text-lg font-semibold text-brand-text">
            Novos conteúdos estão sendo preparados. Em breve, a Capacitação estará disponível para ajudar você a desenvolver novas habilidades e ampliar seus resultados.
          </p>
        </div>
      </div>
    </div>
  );
}
