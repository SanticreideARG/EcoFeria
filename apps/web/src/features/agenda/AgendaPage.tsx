import { EmptyState, ErrorState, Icon, Loader } from '../../components/index.ts';
import { formatDateTimeShort } from '../../lib/format.ts';
import { useEvents } from '../../lib/queries.ts';

function DateBadge({ iso }: { iso: string }) {
  const d = new Date(iso);
  const day = new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(d);
  const month = new Intl.DateTimeFormat('es-AR', {
    month: 'short',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(d);
  return (
    <div className="flex w-16 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-primary py-2 text-on-primary">
      <span className="font-display text-headline-md leading-none">{day}</span>
      <span className="text-label-caps uppercase">{month.replace('.', '')}</span>
    </div>
  );
}

export function AgendaPage() {
  const { data: events, isLoading, isError } = useEvents();

  return (
    <div className="mx-auto max-w-[900px] px-5 py-6">
      <header className="mb-6">
        <h1 className="font-display text-display-lg-mobile text-primary">Agenda Cultural</h1>
        <p className="text-body-md text-on-surface-variant">
          Ferias, talleres y encuentros de la comunidad en el Alto Valle.
        </p>
      </header>

      {isLoading ? (
        <Loader label="Cargando agenda…" />
      ) : isError ? (
        <ErrorState />
      ) : events && events.length > 0 ? (
        <div className="space-y-4">
          {events.map((e) => (
            <article
              key={e.id}
              className="flex gap-4 rounded-lg bg-surface-container-lowest p-4 paper-border"
            >
              <DateBadge iso={e.startsAt} />
              <div className="min-w-0 flex-1">
                <p className="text-label-caps uppercase text-secondary">
                  {formatDateTimeShort(e.startsAt)}
                </p>
                <h2 className="text-title-lg text-on-surface">{e.title}</h2>
                {e.location && (
                  <p className="mt-0.5 flex items-center gap-1 text-body-sm text-on-surface-variant">
                    <Icon name="location_on" className="text-base text-primary" /> {e.location}
                  </p>
                )}
                {e.description && (
                  <p className="mt-2 text-body-sm text-on-surface-variant">{e.description}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="event"
          title="Sin eventos por ahora"
          hint="Pronto vamos a sumar nuevas fechas a la agenda."
        />
      )}
    </div>
  );
}
