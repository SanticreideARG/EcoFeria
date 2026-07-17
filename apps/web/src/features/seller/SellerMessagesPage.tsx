import { useEffect, useState, type FormEvent } from 'react';
import type { MessageThreadDTO } from '@ecoferia/shared';
import { EmptyState, ErrorState, Icon, Loader } from '../../components/index.ts';
import { cn } from '../../lib/cn.ts';
import { formatDateTimeShort } from '../../lib/format.ts';
import { useMarkThreadRead, useSellerMessages, useSendMessage } from '../../lib/queries.ts';

function ThreadPanel({ thread }: { thread: MessageThreadDTO }) {
  const sendMessage = useSendMessage();
  const markRead = useMarkThreadRead();
  const [body, setBody] = useState('');

  // Al abrir un hilo con pendientes, se marca como leído una sola vez.
  useEffect(() => {
    if (thread.hasUnread) markRead.mutate(thread.threadId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread.threadId]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!body.trim()) return;
    sendMessage.mutate(
      { threadId: thread.threadId, body: body.trim() },
      { onSuccess: () => setBody('') },
    );
  };

  return (
    <div className="border-t border-outline-variant bg-surface-container-low p-4">
      <div className="mb-3 space-y-2">
        {thread.messages.map((m) => (
          <div
            key={m.id}
            className={cn('flex', m.fromCustomer ? 'justify-start' : 'justify-end')}
          >
            <div
              className={cn(
                'max-w-[80%] rounded-xl px-3 py-2 text-body-sm',
                m.fromCustomer
                  ? 'bg-surface-container-lowest text-on-surface paper-border'
                  : 'bg-primary text-on-primary',
              )}
            >
              <p>{m.body}</p>
              <p
                className={cn(
                  'mt-1 text-[10px] uppercase',
                  m.fromCustomer ? 'text-on-surface-variant' : 'text-on-primary/70',
                )}
              >
                {formatDateTimeShort(m.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Escribí una respuesta…"
          className="flex-1 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-body-sm text-on-surface focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={sendMessage.isPending || !body.trim()}
          aria-label="Enviar"
          className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-primary text-on-primary disabled:opacity-50"
        >
          <Icon name="arrow_forward" className="text-lg" />
        </button>
      </form>
    </div>
  );
}

export function SellerMessagesPage() {
  const { data: threads, isLoading, isError } = useSellerMessages();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-display-lg-mobile text-primary">Mensajes</h1>
        <p className="text-body-md text-on-surface-variant">Buzón de tus clientes.</p>
      </header>

      {isLoading ? (
        <Loader label="Cargando mensajes…" />
      ) : isError ? (
        <ErrorState />
      ) : !threads || threads.length === 0 ? (
        <EmptyState icon="chat_bubble" title="Todavía no tenés mensajes" />
      ) : (
        <div className="space-y-3">
          {threads.map((t) => {
            const last = t.messages.at(-1);
            const open = openId === t.threadId;
            return (
              <div key={t.threadId} className="overflow-hidden rounded-xl bg-surface-container-lowest paper-border">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : t.threadId)}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-primary-container font-display text-title-lg font-bold text-on-primary-container">
                    {t.customerName[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-title-lg text-on-surface">{t.customerName}</p>
                      {t.hasUnread && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-secondary" />}
                    </div>
                    <p className="truncate text-body-sm text-on-surface-variant">
                      {t.brandName} · {last?.body}
                    </p>
                  </div>
                  <Icon
                    name={open ? 'expand_less' : 'expand_more'}
                    className="flex-shrink-0 text-on-surface-variant"
                  />
                </button>
                {open && <ThreadPanel thread={t} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
