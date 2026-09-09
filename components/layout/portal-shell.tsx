"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  GraduationCap,
  Home,
  Menu,
  MessageSquareText,
  PackageOpen,
  ShieldCheck,
  Target,
  UserRound,
  X,
} from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MenuItem = {
  label: string;
  href: string;
};

type MenuGroup = {
  id: string;
  label: string;
  href?: string;
  icon: typeof Home;
  items?: MenuItem[];
};

function humanizeLabel(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getCurrentTitle(pathname: string, basePath: string) {
  const relativePath = pathname.startsWith(basePath)
    ? pathname.slice(basePath.length)
    : pathname;

  const cleanPath = relativePath.replace(/^\/+|\/+$/g, "");
  if (!cleanPath) return "Início";

  const segments = cleanPath.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "inicio";

  const titleMap: Record<string, string> = {
    inicio: "Início",
    "minhas-indicacoes": "Minhas Indicações",
    "indicar-cliente": "Indicar Cliente",
    "nova": "Indicar Cliente",
    comissoes: "Comissões",
    "minhas-comissoes": "Minhas Comissões",
    "comissoes-e-desempenho": "Comissões e Desempenho",
    "como-funcionam": "Como Funcionam as Comissões",
    "material-de-vendas": "Material de Vendas",
    videos: "Vídeos",
    "circuito-catedral": "Circuito Catedral",
    imagens: "Imagens",
    whatsapp: "WhatsApp",
    "argumentos-de-venda": "Argumentos de Venda",
    objecoes: "Objeções",
    "cases-de-clientes": "Cases de Clientes",
    treinamentos: "Treinamentos",
    "passo-a-passo": "Passo a Passo",
    "conhecendo-o-sistema-catedral": "Conhecendo o Sistema Catedral",
    "venda-por-indicacao-e-demonstracao": "Venda por Indicação e Demonstração",
    "conteudos-para-parceiros": "Conteúdos para Parceiros",
    "academia-catedral": "Academia Catedral",
    "meu-desempenho": "Meu Desempenho",
    "central-do-parceiro": "Central do Parceiro",
    "como-funciona-o-programa": "Como Funciona o Programa",
    "perguntas-frequentes": "Perguntas Frequentes",
    "noticias-e-comunicados": "Notícias e Comunicados",
    "falar-com-a-catedral": "Falar com a Catedral",
    "meu-cadastro": "Meu Cadastro",
    "alterar-senha": "Alterar Senha",
    suporte: "Suporte",
    "comunicados": "Comunicados",
    "desempenho": "Meu Desempenho",
    "indicacoes": "Indicações",
  };

  return titleMap[lastSegment] || humanizeLabel(lastSegment);
}

export function PortalShell({
  children,
  userName,
  basePath = "/protected",
}: {
  children: React.ReactNode;
  userName: string;
  basePath?: string;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    indicacoes: true,
    comissoes: true,
    materiais: true,
    treinamentos: true,
    central: true,
  });

  const groups = useMemo<MenuGroup[]>(() => {
    const homeHref = basePath;

    return [
      { id: "inicio", label: "Início", href: homeHref, icon: Home },
      {
        id: "indicacoes",
        label: "Indicações",
        icon: Target,
        items: [
          { label: "Indicar Cliente", href: `${basePath}/indicacoes/nova` },
          { label: "Minhas Indicações", href: `${basePath}/indicacoes/minhas-indicacoes` },
        ],
      },
      {
        id: "comissoes",
        label: "Comissões",
        icon: BriefcaseBusiness,
        items: [
          { label: "Como Funcionam as Comissões", href: `${basePath}/comissoes/como-funcionam` },
          { label: "Comissões e Desempenho", href: `${basePath}/comissoes/comissoes-e-desempenho` },
        ],
      },
      {
        id: "materiais",
        label: "Material de Vendas",
        icon: PackageOpen,
        items: [
          { label: "Vídeos", href: `${basePath}/material-de-vendas/videos` },
          { label: "Circuito Catedral", href: `${basePath}/material-de-vendas/circuito-catedral` },
          { label: "Imagens", href: `${basePath}/material-de-vendas/imagens` },
          { label: "Argumentos de Venda", href: `${basePath}/material-de-vendas/argumentos-de-venda` },
          { label: "Objeções", href: `${basePath}/material-de-vendas/objecoes` },
          { label: "Cases de Clientes", href: `${basePath}/material-de-vendas/cases-de-clientes` },
        ],
      },
      {
        id: "treinamentos",
        label: "Treinamentos",
        icon: GraduationCap,
        items: [
          { label: "Passo a passo", href: `${basePath}/treinamentos/passo-a-passo` },
          { label: "Conhecendo o Sistema Catedral", href: `${basePath}/treinamentos/conhecendo-o-sistema-catedral` },
          { label: "Venda por Indicação e Demonstração", href: `${basePath}/treinamentos/venda-por-indicacao-e-demonstracao` },
          { label: "Academia Catedral", href: `${basePath}/treinamentos/academia-catedral` },
        ],
      },
      {
        id: "central",
        label: "Central do Parceiro",
        icon: MessageSquareText,
        items: [
          { label: "Como Funciona o Programa", href: `${basePath}/central-do-parceiro/como-funciona-o-programa` },
          { label: "Perguntas Frequentes", href: `${basePath}/central-do-parceiro/perguntas-frequentes` },
          { label: "Notícias e Comunicados", href: `${basePath}/central-do-parceiro/noticias-e-comunicados` },
          { label: "Falar com a Catedral", href: `${basePath}/central-do-parceiro/falar-com-a-catedral` },
        ],
      },
    ];
  }, [basePath]);

  const currentTitle = getCurrentTitle(pathname ?? basePath, basePath);

  const renderGroup = (group: MenuGroup) => {
    const hasItems = Boolean(group.items?.length);
    const isOpen = openGroups[group.id] ?? true;
    const isActive =
      group.href ? pathname === group.href : group.items?.some((item) => pathname.startsWith(item.href));

    const triggerContent = (
      <div className="flex w-full items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <group.icon className={cn("h-4 w-4", isActive && "text-brand-primary")} />
          <span>{group.label}</span>
        </span>
        {hasItems ? <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} /> : null}
      </div>
    );

    if (!hasItems) {
      return (
        <Link
          key={group.id}
          href={group.href ?? basePath}
          className={cn(
            "flex items-center gap-3 rounded-xl border-l-2 px-3 py-2.5 text-sm font-medium transition-colors",
            isActive
              ? "border-brand-primary bg-brand-primary/10 text-brand-text shadow-sm"
              : "border-transparent text-brand-text-muted hover:bg-brand-background hover:text-brand-text",
          )}
        >
          {triggerContent}
        </Link>
      );
    }

    return (
      <div key={group.id} className="space-y-1">
        <button
          type="button"
          onClick={() => {
            setOpenGroups((prev) => ({ ...prev, [group.id]: !prev[group.id] }));
          }}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-xl border-l-2 px-3 py-2.5 text-left text-sm font-medium transition-colors",
            isActive
              ? "border-brand-primary bg-brand-primary/10 text-brand-text shadow-sm"
              : "border-transparent text-brand-text-muted hover:bg-brand-background hover:text-brand-text",
          )}
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-2">
            <group.icon className={cn("h-4 w-4", isActive && "text-brand-primary")} />
            {group.label}
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen ? (
          <div className="space-y-1 pl-8 pt-1">
            {group.items?.map((item) => {
              const isItemActive = pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition-colors",
                    isItemActive
                      ? "bg-brand-primary/10 font-medium text-brand-text"
                      : "text-brand-text-muted hover:bg-brand-background hover:text-brand-text",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-brand-background text-brand-text">
      <aside className="hidden w-72 shrink-0 border-r border-brand-border bg-white lg:flex lg:flex-col">
        <div className="border-b border-brand-border px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-dark text-sm font-bold text-white">C</div>
            <div>
              <div className="text-xl font-bold tracking-tight text-brand-text">Catedral</div>
              <div className="text-xs font-medium uppercase tracking-[0.12em] text-brand-text-muted">Portal de Parceiros</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
          {groups.map(renderGroup)}
        </nav>

        <div className="border-t border-brand-border px-4 py-4">
          <div className="space-y-2 pt-1">
            <Link
              href={`${basePath}/meu-cadastro`}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-brand-text-muted transition-colors hover:bg-brand-background hover:text-brand-text",
                pathname.startsWith(`${basePath}/meu-cadastro`) && "bg-brand-background text-brand-text",
              )}
            >
              <UserRound className="h-4 w-4" />
              Meu Cadastro
            </Link>
            <Link
              href={`${basePath}/alterar-senha`}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-brand-text-muted transition-colors hover:bg-brand-background hover:text-brand-text",
                pathname.startsWith(`${basePath}/alterar-senha`) && "bg-brand-background text-brand-text",
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              Alterar Senha
            </Link>
            <div className="pt-1">
              <LogoutButton variant="outline" className="w-full justify-start border-brand-border bg-white text-brand-text-muted hover:bg-brand-background hover:text-brand-text" />
            </div>
          </div>
        </div>
      </aside>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-40 bg-brand-dark/40 lg:hidden" onClick={() => setIsMenuOpen(false)} />
      ) : null}

      <div className={cn("fixed inset-y-0 left-0 z-50 w-72 transform border-r border-brand-border bg-white transition-transform duration-200 lg:hidden", isMenuOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between border-b border-brand-border px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-dark text-sm font-bold text-white">C</div>
            <div>
              <div className="text-lg font-bold text-brand-text">Catedral</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-brand-text-muted">Parceiros</div>
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} aria-label="Fechar menu">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="space-y-2 overflow-y-auto px-4 py-4">
          {groups.map(renderGroup)}
        </nav>

        <div className="border-t border-brand-border px-4 py-4 space-y-2">
          <Link href={`${basePath}/meu-cadastro`} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-brand-text-muted hover:bg-brand-background">Meu Cadastro</Link>
          <Link href={`${basePath}/alterar-senha`} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-brand-text-muted hover:bg-brand-background">Alterar Senha</Link>
          <div className="pt-1">
            <LogoutButton variant="outline" className="w-full justify-start border-brand-border bg-white text-brand-text-muted hover:bg-brand-background" />
          </div>
        </div>
      </div>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-brand-border bg-white/85 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Abrir menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-text-muted">Portal</p>
                <h1 className="text-xl font-bold text-brand-text">{currentTitle}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost" size="icon" aria-label="Notificações">
                <Bell className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-background px-2 py-1.5 text-sm font-medium text-brand-text-muted shadow-sm transition hover:border-brand-primary/40 hover:bg-brand-background"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-brand-dark">
                      {userName?.trim()?.charAt(0)?.toUpperCase() || "P"}
                    </div>
                    <span className="hidden sm:inline">{userName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem asChild>
                    <Link href={`${basePath}/meu-cadastro`} className="cursor-pointer">Meu Cadastro</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`${basePath}/alterar-senha`} className="cursor-pointer">Alterar Senha</Link>
                  </DropdownMenuItem>
                  <div className="px-2 py-1.5">
                    <LogoutButton variant="ghost" className="w-full justify-start px-2" />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
