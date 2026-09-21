import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { PortalDashboard } from "@/components/dashboard/portal-dashboard";

async function getPartnerDisplayName(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  try {
    const { data, error } = await supabase
      .from("wp_parceiros")
      .select("nome")
      .eq("uid", userId)
      .maybeSingle();

    if (error || !data?.nome) {
      return "Olá!";
    }

    const parsedName = String(data.nome).trim();
    return parsedName || "Olá!";
  } catch {
    return "Olá!";
  }
}

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect("/auth/login");
  }

  const { data: parceiro, error } = await supabase
    .from("wp_parceiros")
    .select("id, nome, ativo, id_funcao")
    .eq("uid", userId)
    .maybeSingle();

  if (error) {
    redirect("/auth/login");
  }

  if (!parceiro) {
    // Sessão válida, mas cadastro de parceiro ainda não concluído.
    redirect("/auth/concluir-cadastro");
  }

  if (parceiro.ativo !== true) {
    redirect("/auth/login");
  }

  const userName = await getPartnerDisplayName(supabase, userId);

  return <PortalDashboard basePath="/protected" userName={userName} />;
}
