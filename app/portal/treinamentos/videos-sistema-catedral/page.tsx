import { VideosSistemaCatedral } from "@/components/dashboard/videos-sistema-catedral";
import { createClient } from "@/lib/supabase/server";

async function fetchVideos() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wp_videos")
    .select("*")
    .order("ordem", { ascending: true, nullsFirst: true })
    .order("id", { ascending: true });

  return { data: data ?? [], error };
}

export default async function Page() {
  const { data, error } = await fetchVideos();

  if (error) {
    console.error("Erro ao buscar wp_videos:", error);
  }

  return <VideosSistemaCatedral videos={data ?? []} error={Boolean(error)} />;
}
