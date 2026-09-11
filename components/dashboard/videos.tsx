export function Videos() {
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
