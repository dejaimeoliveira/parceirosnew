"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Play, Search } from "lucide-react";

type VideoRecord = {
  id?: number | string | null;
  titulo?: string | null;
  title?: string | null;
  nome?: string | null;
  descricao?: string | null;
  description?: string | null;
  imagem?: string | null;
  imagem_url?: string | null;
  image?: string | null;
  image_url?: string | null;
  thumbnail?: string | null;
  thumbnail_url?: string | null;
  thumb?: string | null;
  thumb_url?: string | null;
  capa?: string | null;
  capa_url?: string | null;
  video_url?: string | null;
  url?: string | null;
  link?: string | null;
  link_externo?: string | null;
  embed_url?: string | null;
  youtube_url?: string | null;
  youtube_id?: string | null;
  video_id?: string | null;
  id_video?: string | null;
  codigo_video?: string | null;
  ativo?: boolean | null;
  ordem?: number | null;
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getVideoTitle(video: VideoRecord) {
  const fallbackTitle = `Vídeo ${video.id ?? ""}`.trim();

  if (video.titulo) return video.titulo;
  if (video.title) return video.title;
  if (video.nome) return video.nome;
  if (fallbackTitle) return fallbackTitle;

  return "Vídeo";
}

function getVideoDescription(video: VideoRecord) {
  return video.descricao ?? video.description ?? "";
}

function getVideoUrl(video: VideoRecord) {
  const candidates = [
    video.video_url,
    video.url,
    video.link,
    video.link_externo,
    video.embed_url,
    video.youtube_url,
    video.youtube_id,
    video.video_id,
    video.id_video,
    video.codigo_video,
  ];

  const firstValue = candidates.find((value) => typeof value === "string" && value.trim().length > 0)?.trim();
  if (!firstValue) return "";

  if (/^[A-Za-z0-9_-]{11}$/.test(firstValue)) {
    return `https://www.youtube.com/watch?v=${firstValue}`;
  }

  return firstValue;
}

function getYoutubeVideoId(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return "";

  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.includes("youtube.com/watch?v=")) {
    const match = trimmed.match(/[?&]v=([^&]+)/i);
    return match?.[1] ?? "";
  }

  if (trimmed.includes("youtube.com/embed/")) {
    const match = trimmed.match(/youtube\.com\/embed\/([^?]+)/i);
    return match?.[1] ?? "";
  }

  if (trimmed.includes("youtube.com/shorts/")) {
    const match = trimmed.match(/youtube\.com\/shorts\/([^?]+)/i);
    return match?.[1] ?? "";
  }

  if (trimmed.includes("youtu.be/")) {
    const match = trimmed.match(/youtu\.be\/([^?]+)/i);
    return match?.[1] ?? "";
  }

  return "";
}

function getLocalVideoImage(video: VideoRecord) {
  const candidates = [
    video.imagem,
    video.imagem_url,
    video.image,
    video.image_url,
    video.thumbnail,
    video.thumbnail_url,
    video.thumb,
    video.thumb_url,
    video.capa,
    video.capa_url,
  ];

  const directImage = candidates.find((value) => typeof value === "string" && value.trim().length > 0)?.trim();
  if (directImage) {
    if (/^(https?:)?\/\//i.test(directImage) || directImage.startsWith("/")) return directImage;
    if (directImage.toLowerCase().endsWith(".jpg") || directImage.toLowerCase().endsWith(".jpeg") || directImage.toLowerCase().endsWith(".png") || directImage.toLowerCase().endsWith(".webp")) {
      return `/Videos_Youtube/${directImage}`;
    }
    return `/Videos_Youtube/${directImage}.jpg`;
  }

  const title = getVideoTitle(video);
  const normalizedName = normalizeText(title);
  if (normalizedName) {
    return `/Videos_Youtube/${normalizedName}.jpg`;
  }

  return "";
}

function getVideoThumbnail(video: VideoRecord) {
  const localImage = getLocalVideoImage(video);
  if (localImage) return localImage;

  const rawUrl = getVideoUrl(video);
  if (!rawUrl) return "";

  const youtubeId = getYoutubeVideoId(rawUrl);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }

  return "";
}

function getVideoLink(video: VideoRecord) {
  const rawUrl = getVideoUrl(video);
  if (!rawUrl) return "";

  const youtubeId = getYoutubeVideoId(rawUrl);
  if (youtubeId) return `https://www.youtube.com/watch?v=${youtubeId}`;

  return rawUrl;
}

export function VideosSistemaCatedral({ videos, error }: { videos: VideoRecord[]; error?: boolean }) {
  const [query, setQuery] = useState("");

  const filteredVideos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return videos ?? [];

    return (videos ?? []).filter((video) => {
      const title = getVideoTitle(video).toLowerCase();
      const description = getVideoDescription(video).toLowerCase();
      return title.includes(normalizedQuery) || description.includes(normalizedQuery);
    });
  }, [query, videos]);

  if (error) {
    return (
      <div className="rounded-3xl border border-brand-border bg-white p-6 text-center shadow-sm sm:p-8">
        <p className="text-sm text-brand-text-muted">
          Não foi possível carregar os vídeos neste momento. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-text-muted">
            Treinamentos
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-text">Vídeos Sistema Catedral</h1>
          <p className="mt-4 max-w-2xl text-base text-brand-text-muted">
            Os vídeos cadastrados no sistema aparecerão aqui assim que forem publicados.
          </p>
        </div>

        <div className="rounded-3xl border border-dashed border-brand-border bg-brand-background p-8 text-center">
          <p className="text-base font-medium text-brand-text-muted">Nenhum vídeo cadastrado no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-text-muted">
          Treinamentos
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-text">Vídeos Sistema Catedral</h1>
        <p className="mt-4 max-w-2xl text-base text-brand-text-muted">
          Acesse os materiais em vídeo disponíveis no Portal dos Parceiros.
        </p>
      </div>

      <div className="rounded-3xl border border-brand-border bg-white p-4 shadow-sm sm:p-5">
        <label className="flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-background px-3 py-2.5 focus-within:border-brand-primary">
          <Search className="h-4 w-4 text-brand-text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pesquisar vídeo"
            className="w-full border-0 bg-transparent text-sm text-brand-text placeholder:text-brand-text-muted focus:outline-none"
            aria-label="Pesquisar vídeos"
          />
        </label>
      </div>

      {filteredVideos.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-brand-border bg-brand-background p-8 text-center">
          <p className="text-base font-medium text-brand-text-muted">Nenhum vídeo encontrado para sua busca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredVideos.map((video) => {
            const title = getVideoTitle(video);
            const description = getVideoDescription(video);
            const thumbnail = getVideoThumbnail(video);
            const videoLink = getVideoLink(video);
            const youtubeThumbnail = videoLink ? (() => {
              const youtubeId = getYoutubeVideoId(videoLink);
              return youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : "";
            })() : "";

            return (
              <article
                key={video.id ?? title}
                className="group overflow-hidden rounded-3xl border border-brand-border bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (videoLink) {
                      window.open(videoLink, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="block w-full text-left"
                  aria-label={`Assistir ${title}`}
                >
                  <div className="relative aspect-video overflow-hidden bg-brand-background">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={title}
                        className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                        loading="lazy"
                        onError={(event) => {
                          const target = event.currentTarget as HTMLImageElement;
                          if (youtubeThumbnail && target.currentSrc !== youtubeThumbnail) {
                            target.src = youtubeThumbnail;
                          }
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-background to-white">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary shadow-sm">
                          <Play className="ml-1 h-7 w-7 fill-current" />
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-brand-dark/10 opacity-0 transition group-hover:opacity-100">
                      <span className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-text shadow-sm">
                        <Play className="h-3.5 w-3.5 fill-current" />
                        Assistir
                      </span>
                    </div>
                  </div>
                </button>

                <div className="space-y-3 p-4">
                  <div>
                    <h2 className="line-clamp-2 text-lg font-semibold text-brand-text">{title}</h2>
                    {description ? <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-brand-text-muted">{description}</p> : null}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (videoLink) {
                          window.open(videoLink, "_blank", "noopener,noreferrer");
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-3 py-2 text-sm font-semibold text-brand-dark transition hover:bg-brand-primary-hover"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Assistir
                    </button>

                    {videoLink ? (
                      <a
                        href={videoLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline"
                      >
                        Abrir
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
