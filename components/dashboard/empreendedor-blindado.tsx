const videos = [
  { id: "HjNBfKYRaJA", titulo: "V1 Risco" },
  { id: "taCF-bLcf68", titulo: "V2 Controle" },
  { id: "oTWnkpigGjQ", titulo: "V3 Viabilidade" },
  { id: "1t4hgHqJlrc", titulo: "V4 Gestão" },
  { id: "5k5VnaIjVIQ", titulo: "V5 Decisão" },
];

export function EmpreendedorBlindado() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-text-muted">
          Treinamentos
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-text">Empreendedor Blindado</h1>
        <p className="mt-4 max-w-2xl text-base text-brand-text-muted">
          Conteúdos para ajudar você a conhecer melhor o Sistema Catedral e se preparar para
          conversar com seus clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {videos.map((video) => (
          <div key={video.id} className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm">
            <div className="aspect-video w-full bg-brand-background">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h2 className="text-base font-semibold text-brand-text">{video.titulo}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
