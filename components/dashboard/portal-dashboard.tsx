import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type StatCardProps = {
  value: string;
  label: string;
  accent?: string;
};

function StatCard({ value, label, accent }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm">
      <div className={cn("text-3xl font-bold tracking-tight text-brand-text", accent)}>{value}</div>
      <p className="mt-2 text-sm text-brand-text-muted">{label}</p>
    </div>
  );
}

function QuickActionCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href} className="group rounded-2xl border border-brand-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-primary/40 hover:shadow-md">
      <div className="text-lg font-semibold text-brand-text">{title}</div>
      <p className="mt-2 text-sm text-brand-text-muted">{description}</p>
    </Link>
  );
}

function NewsCard({ title, status }: { title: string; status: string }) {
  return (
    <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-brand-text">{title}</h3>
      <p className="mt-3 text-sm text-brand-text-muted">{status}</p>
    </div>
  );
}

export function PortalDashboard({
  basePath = "/protected",
  userName = "Olá!",
}: {
  basePath?: string;
  userName?: string;
}) {
  const greeting = userName && userName !== "Olá!" ? `Olá, ${userName}!` : "Olá!";

  const quickActions = [
    { title: "Indicar Cliente", description: "Registre uma nova oportunidade.", href: `${basePath}/indicacoes/nova` },
    { title: "Minhas Indicações", description: "Acompanhe suas oportunidades.", href: `${basePath}/indicacoes/minhas-indicacoes` },
    { title: "Material de Vendas", description: "Acesse vídeos, apresentações e materiais.", href: `${basePath}/material-de-vendas/videos` },
    { title: "Treinamentos", description: "Prepare-se para vender melhor.", href: `${basePath}/treinamentos/passo-a-passo` },
    { title: "Falar com a Catedral", description: "Entre em contato com nossa equipe.", href: `${basePath}/central-do-parceiro/falar-com-a-catedral` },
  ];

  const onboardingSteps = [
    {
      title: "Conheça o Sistema Catedral",
      description: "Entenda o produto que você irá indicar.",
      href: `${basePath}/treinamentos/conhecendo-o-sistema-catedral`,
    },
    {
      title: "Entenda como funciona a parceria",
      description: "Saiba como funciona seu relacionamento com a Catedral.",
      href: `${basePath}/central-do-parceiro/como-funciona-o-programa`,
    },
    {
      title: "Veja como funcionam as comissões",
      description: "Conheça as regras, percentuais e pagamentos.",
      href: `${basePath}/comissoes/como-funcionam`,
    },
    {
      title: "Aprenda a identificar um potencial cliente",
      description: "Veja quais empresas têm o perfil ideal para o Catedral.",
      href: `${basePath}/treinamentos/venda-por-indicacao-e-demonstracao`,
    },
    {
      title: "Faça sua primeira indicação",
      description: "Encontrou uma oportunidade? Envie os dados pelo portal.",
      href: `${basePath}/indicacoes/nova`,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-text-muted">Portal dos Parceiros Catedral</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">{greeting}</h1>
            <p className="mt-2 text-base text-brand-text-muted">Bem-vindo ao Portal dos Parceiros Catedral.</p>
          </div>

          <Link
            href={`${basePath}/indicacoes/nova`}
            className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-brand-dark shadow-sm transition hover:bg-brand-primary-hover"
          >
            + INDICAR NOVO CLIENTE
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard value="0" label="Em negociação" />
        <StatCard value="0" label="Clientes convertidos" />
        <StatCard value="R$ 0,00" label="A receber" />
        <StatCard value="Parceiro" label="Programa Catedral" accent="text-brand-text" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-brand-text">Primeiros passos</h2>
          <p className="mt-2 text-sm text-brand-text-muted">
            Confira estas orientações para conhecer melhor a parceria e fazer boas indicações.
          </p>

          <div className="mt-6 space-y-3">
            {onboardingSteps.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-background px-3 py-3 transition hover:-translate-y-0.5 hover:border-brand-primary/40 hover:bg-white hover:shadow-sm"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-border bg-white text-xs font-semibold text-brand-text-muted transition group-hover:border-brand-primary/40 group-hover:text-brand-text">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-brand-text">{item.title}</div>
                  <p className="mt-1 text-xs leading-relaxed text-brand-text-muted">{item.description}</p>
                </div>

                <ArrowRight className="h-4 w-4 shrink-0 text-brand-text-muted transition group-hover:text-brand-text" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-brand-text">Últimas indicações</h2>
          <div className="mt-8 rounded-2xl border border-dashed border-brand-border bg-brand-background p-8 text-center">
            <p className="text-base font-medium text-brand-text-muted">Você ainda não possui indicações.</p>
            <Link
              href={`${basePath}/indicacoes/nova`}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-brand-primary-hover"
            >
              Fazer minha primeira indicação
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-brand-text">Acesso rápido</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {quickActions.map((action) => (
            <QuickActionCard key={action.title} title={action.title} description={action.description} href={action.href} />
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-brand-text">Novidades da Catedral</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <NewsCard title="Novos materiais" status="Conteúdo em preparação" />
          <NewsCard title="Treinamentos" status="Conteúdo em preparação" />
          <NewsCard title="Comunicados" status="Conteúdo em preparação" />
        </div>
      </div>
    </div>
  );
}
