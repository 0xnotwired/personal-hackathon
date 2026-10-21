'use client';
import { useEffect, useRef, useState } from 'react';
import { useMachine } from '@xstate/react';
import { Button, Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components';
import { procedureMachine, currentStep } from '../flows/procedure-machine';
import {
  Draft,
  Operation,
  Review,
  Service,
  money,
  serviceNames,
  stepCopy,
} from '../flows/contracts';
import { examples } from '../flows/catalogue';
import {
  load,
  save,
  clear as clearLocal,
  beginNewDraft,
  Preferences,
  SaveConflictError,
} from '../lib/persistence';
import { request } from '../lib/api';
import { useSpeech } from '../speech/use-speech';
import { Icon } from './ui-icon';
import { HomeContent } from './home-content';
import { VoiceControls } from './voice-controls';
import { ResultContent } from './result-content';
import { resultCopy } from '../lib/copy';
import { SafetyDialog } from './safety-dialog';
import { nextMove } from '../lib/companion';
import { BillDetails } from './bill-details';

export function PracticeApp() {
  const [snapshot, send] = useMachine(procedureMachine);
  const step = currentStep(snapshot.value);
  const draft = snapshot.context.draft;
  const [preferences, setPreferences] = useState<Preferences>({
    favorite: false,
    rate: 0.85,
    muted: false,
  });
  const [storage, setStorage] = useState('Preparando tu espacio…');
  const [storageError, setStorageError] = useState(false);
  const [storageConflict, setStorageConflict] = useState(false);
  const [restoreNotice, setRestoreNotice] = useState('');
  const [historyPreview, setHistoryPreview] = useState<Operation | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [help, setHelp] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [history, setHistory] = useState<Operation[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const selectedService = draft?.service || 'luz';
  const [readyToConfirm, setReadyToConfirm] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  const text =
    step === 'loading'
      ? 'Preparando tu espacio'
      : step === 'result' && draft?.operation
        ? resultCopy[draft.operation.status].title + '. ' + resultCopy[draft.operation.status].text
        : stepCopy[step].title + '. ' + stepCopy[step].help;
  const speech = useSpeech(
    (cmd) => {
      if (cmd === 'pay') {
        if (step === 'home') {
          if (draft && !draft.operation) send({ type: 'RESUME' });
          else start();
        } else setHelp(true);
      }
      if (cmd === 'repeat') speech.speak(text);
      if (cmd === 'slower') {
        setPreferences((p) => ({ ...p, rate: 0.65 }));
        speech.speak(text, 0.65);
      }
      if (cmd === 'help') {
        setHelp(true);
        speech.speak(text);
      }
      if (cmd === 'unknown') {
        setError(
          'Podés decir “repetí”, “más despacio” o “no entiendo”. Para confirmar un pago, usá el botón de la pantalla.',
        );
      }
    },
    preferences.rate,
    preferences.muted,
  );
  useEffect(() => {
    let active = true;
    load()
      .then(async (saved) => {
        if (!active) return;
        if (saved) setPreferences(saved.preferences);
        let restored = saved?.draft || null;
        // Persisted operation data cannot claim success; always reverify on the server.
        if (restored && (restored.step === 'submitting' || restored.step === 'result')) {
          restored = { ...restored, step: 'submitting', operation: undefined };
          send({ type: 'RESTORE', draft: restored });
          try {
            const ops = await request<Operation[]>('/api/operations?draftId=' + restored.id);
            if (active && ops[0]) send({ type: 'VERIFIED', operation: ops[0] });
            else if (active)
              setError(
                'No encontramos un resultado en este navegador. Si cambiaste de navegador o borraste sus datos, comenzá una práctica nueva.',
              );
          } catch (e) {
            if (active) setError((e as Error).message);
          }
        } else if (restored?.step === 'review') {
          try {
            const operations = await request<Operation[]>('/api/operations?draftId=' + restored.id);
            if (!active) return;
            if (operations[0]) {
              send({
                type: 'RESTORE',
                draft: { ...restored, step: 'submitting', operation: undefined },
              });
              send({ type: 'VERIFIED', operation: operations[0] });
            } else {
              const review = await request<Review>('/api/reviews', {
                draftId: restored.id,
                key: restored.key,
                service: restored.service,
                code: restored.code,
              });
              if (active) send({ type: 'RESTORE', draft: { ...restored, review } });
            }
          } catch {
            if (active) {
              send({
                type: 'RESTORE',
                draft: { ...restored, step: 'bill', review: undefined, key: crypto.randomUUID() },
              });
              setRestoreNotice(
                'No pudimos verificar la revisión guardada. Conservamos el número de factura. Podés buscarla de nuevo cuando haya conexión.',
              );
            }
          }
        } else send({ type: 'RESTORE', draft: restored });
      })
      .catch(() => {
        if (active) {
          setRestoreNotice(
            'No pudimos recuperar el avance guardado. Al empezar una práctica nueva, reemplazamos esos datos. Las operaciones confirmadas siguen en el registro de este navegador.',
          );
          setStorageError(true);
          setStorage(
            'No pudimos abrir lo guardado. Si cerrás esta página, podrías perder tu avance.',
          );
          send({ type: 'RESTORE', draft: null });
        }
      });
    return () => {
      active = false;
    };
  }, [send]);
  useEffect(() => {
    if (step === 'loading') return;
    let active = true;
    setStorage('Guardando…');
    save({ id: 'current', draft, preferences })
      .then(() => {
        if (active) {
          setStorage('Tu avance se guardó en este navegador.');
          setStorageError(false);
          setStorageConflict(false);
        }
      })
      .catch((e) => {
        if (!active) return;
        setStorageError(true);
        if (e instanceof SaveConflictError) {
          setStorageConflict(true);
          setStorage(
            'Otra pestaña cambió esta práctica. Para no perder ese avance, recargá esta página. Si querés conservar lo que escribiste acá, guardá esta versión.',
          );
        } else {
          setStorage(
            'No pudimos guardar. Podés seguir, pero no cierres la página si querés conservar tu avance.',
          );
        }
      });
    return () => {
      active = false;
    };
  }, [draft, preferences, step]);
  useEffect(() => {
    if (step === 'loading') return;
    setError('');
    setHelp(false);
    setReadyToConfirm(false);
    speech.stop();
    title.current?.focus();
    const timer = setTimeout(() => setReadyToConfirm(true), 900);
    return () => clearTimeout(timer);
    // speech object intentionally isn't a dependency: changes in playback cannot change the step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);
  async function work(action: () => Promise<void>) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }
  function leave() {
    speech.stop();
    send({ type: 'LEAVE' });
  }
  function start() {
    beginNewDraft();
    setRestoreNotice('');
    setStorageConflict(false);
    setNewOpen(false);
    speech.stop();
    send({ type: 'START' });
  }
  function keepThisVersion() {
    work(async () => {
      await save({ id: 'current', draft, preferences }, { force: true });
      setStorageConflict(false);
      setStorageError(false);
      setStorage('Guardamos la versión de esta pestaña.');
    });
  }
  function clearData() {
    work(async () => {
      let serverCleared = true;
      try {
        await request('/api/session', {});
      } catch {
        serverCleared = false;
      }
      await clearLocal();
      setPreferences({ favorite: false, rate: 0.85, muted: false });
      setHistory([]);
      setHistoryOpen(false);
      setHistoryPreview(null);
      setOptionsOpen(false);
      setRestoreNotice(
        serverCleared
          ? ''
          : 'Borramos los datos de este navegador. No pudimos confirmar el borrado del registro del servidor; podés intentarlo de nuevo.',
      );
      setStorageError(false);
      setStorageConflict(false);
      setStorage('Tus datos de práctica se borraron de este navegador.');
      setClearOpen(false);
      speech.stop();
      send({ type: 'RESET' });
    });
  }
  async function findBill() {
    if (!draft) return;
    await work(async () => {
      const previous = await request<Operation[]>('/api/operations?draftId=' + draft.id);
      if (previous[0]) {
        send({ type: 'VERIFIED', operation: previous[0] });
        return;
      }
      const review = await request<Review>('/api/reviews', {
        draftId: draft.id,
        key: draft.key,
        service: draft.service,
        code: draft.code,
      });
      send({ type: 'REVIEW', review });
    });
  }
  async function commitProcedure() {
    if (!draft?.review || step !== 'review' || !readyToConfirm || busyRef.current) return;
    const review = draft.review;
    send({ type: 'CONFIRM' });
    await work(async () => {
      const operation = await request<Operation>('/api/operations', {
        reviewId: review.id,
        key: review.key,
        confirmed: true,
      });
      send({ type: 'VERIFIED', operation });
    });
  }
  async function reconcile() {
    if (!draft) return;
    await work(async () => {
      const ops = await request<Operation[]>('/api/operations?draftId=' + draft.id);
      if (ops[0]) {
        send({ type: 'VERIFIED', operation: ops[0] });
        return;
      }
      setError(
        'El registro no tiene una operación confirmada. Podés volver a revisar la misma factura antes de intentar otra vez.',
      );
    });
  }
  function download() {
    if (!draft?.operation) return;
    const op = draft.operation;
    const content = `COMPROBANTE DE PRÁCTICA\nModo práctica — no se mueve dinero\nAutonomía Digital es un simulador. No es tu banco ni una app de pagos real.\nNo es un pago real ni un comprobante válido de pago.\n\n${resultCopy[op.status].title}\nEmpresa: ${op.bill.company}\nTitular: ${op.bill.holder}\nCuenta: ${op.bill.account}\nMes: ${op.bill.period}\nFactura: ${op.bill.code}\nImporte ficticio: ${money(op.bill.amount)}\nReferencia: ${op.id}\nFecha: ${new Date(op.createdAt).toLocaleString('es-AR')}\n`;
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'comprobante-de-practica.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const op = draft?.operation;
  const pointed = help ? ' is-pointed' : '';
  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" onClick={leave} aria-label="Autonomía Digital, ir al inicio">
          <img className="brand-icon" src="/app-icon.svg" alt="" width={34} height={34} />
          <span className="product-wordmark">
            Autonomía Digital
            <span className="brand-sub">PRÁCTICA DIGITAL</span>
          </span>
        </button>
        <Button
          className="button header-help"
          onPress={() => setHelp((h) => !h)}
          aria-expanded={help}
          aria-controls="context-help"
        >
          <Icon name="help" />
          ¿Qué hago?
        </Button>
      </header>
      <div className="practice-banner">
        <Icon name="shield" size={20} />
        <span>Modo práctica — no se mueve dinero</span>
      </div>
      <main id="main-content">
        {step === 'loading' ? (
          <div className="loading" role="status">
            Preparando tu espacio…
          </div>
        ) : (
          <>
            {step !== 'home' && (
              <div className="flow-top">
                <Button
                  className="text-button"
                  onPress={() => {
                    if (step === 'service') leave();
                    else if (step === 'submitting' || step === 'result') leave();
                    else send({ type: 'BACK' });
                  }}
                >
                  <Icon name="back" />
                  {step === 'service' || step === 'result'
                    ? 'Volver al inicio'
                    : step === 'submitting'
                      ? 'Guardar y salir'
                      : 'Volver al paso anterior'}
                </Button>
                {(step === 'bill' || step === 'review') && (
                  <Button className="text-button safety-entry" onPress={() => setSafetyOpen(true)}>
                    <Icon name="shield" />
                    Me están apurando para pagar
                  </Button>
                )}
                <span className="step-label">
                  {step === 'service'
                    ? 'Paso 1 de 4'
                    : step === 'bill'
                      ? 'Paso 2 de 4'
                      : step === 'review'
                        ? 'Paso 3 de 4'
                        : 'Paso 4 de 4'}
                </span>
              </div>
            )}
            {step === 'home' ? (
              <HomeContent
                draft={draft}
                favorite={preferences.favorite}
                title={title}
                onPrimary={() => {
                  if (draft && !draft.operation) send({ type: 'RESUME' });
                  else start();
                }}
                onOptions={() => setOptionsOpen(true)}
              />
            ) : (
              <div className="procedure-layout">
                <section className="procedure-card" aria-busy={busy}>
                  <p className="eyebrow">PAGAR UNA FACTURA · PRÁCTICA</p>
                  <h1 ref={title} tabIndex={-1}>
                    {step === 'result' && op ? resultCopy[op.status].title : stepCopy[step].title}
                  </h1>
                  {step === 'service' && (
                    <>
                      <fieldset className="service-options">
                        <legend className="sr-only">Elegí un servicio</legend>
                        {(['luz', 'gas', 'agua'] as Service[]).map((service) => (
                          <label className="service-button" key={service}>
                            <input
                              type="radio"
                              name="service"
                              value={service}
                              checked={selectedService === service}
                              onChange={() => send({ type: 'CHOOSE', service })}
                            />
                            <span className={'service-icon ' + service}>
                              <Icon
                                name={
                                  service === 'luz' ? 'light' : service === 'gas' ? 'gas' : 'water'
                                }
                                size={30}
                              />
                            </span>
                            <span>{serviceNames[service]}</span>
                          </label>
                        ))}
                      </fieldset>
                      <Button
                        className={'button primary full' + pointed}
                        onPress={() => send({ type: 'SELECT', service: selectedService })}
                      >
                        Seguir con {serviceNames[selectedService].toLowerCase()}
                        <Icon name="arrow" />
                      </Button>
                    </>
                  )}
                  {step === 'bill' && draft && (
                    <>
                      <div className="example-bill">
                        <span className="eyebrow">
                          FACTURA FICTICIA · {serviceNames[draft.service].toUpperCase()}
                        </span>
                        <strong className="pulse-target">
                          {examples(draft.service)[0].code}
                          <span className="pulse-dot" aria-hidden="true" />
                        </strong>
                        <span>Marta Ejemplo · Octubre de 2026</span>
                      </div>
                      <label className="field-label" htmlFor="bill-code">
                        Número de factura de práctica
                      </label>
                      <p id="bill-hint" className="field-hint">
                        Son 9 cifras. No uses una factura real.
                      </p>
                      <input
                        id="bill-code"
                        inputMode="numeric"
                        autoComplete="off"
                        value={draft.code}
                        aria-describedby={'bill-hint' + (error ? ' flow-error' : '')}
                        aria-invalid={!!error}
                        onChange={(e) =>
                          send({
                            type: 'CODE',
                            code: e.target.value.replace(/\D/g, '').slice(0, 9),
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') e.preventDefault();
                        }}
                      />
                      <Button
                        className="text-button fill-example"
                        onPress={() =>
                          send({ type: 'CODE', code: examples(draft.service)[0].code })
                        }
                      >
                        Usar este número de ejemplo
                      </Button>
                      <Button
                        className={'button primary full' + pointed}
                        isDisabled={busy || draft.code.length !== 9}
                        onPress={findBill}
                      >
                        {busy ? 'Buscando…' : 'Buscar factura'}
                        <Icon name="arrow" />
                      </Button>
                      <details className="other-examples">
                        <summary>Probar otros resultados</summary>
                        <p>
                          También podés practicar qué hacer si un pago queda en revisión o es
                          rechazado.
                        </p>
                        {examples(draft.service)
                          .slice(1)
                          .map((example) => (
                            <Button
                              key={example.code}
                              className="button secondary full"
                              onPress={() => send({ type: 'CODE', code: example.code })}
                            >
                              {example.label}: {example.code}
                            </Button>
                          ))}
                      </details>
                    </>
                  )}
                  {step === 'review' && draft?.review && (
                    <>
                      <div className="receipt-visual">
                        <strong>{money(draft.review.bill.amount)}</strong>
                        <span>
                          {draft.review.bill.company} · {draft.review.bill.period}
                        </span>
                      </div>
                      <details className="receipt-fold">
                        <summary>Ver todo</summary>
                        <BillDetails bill={draft.review.bill} />
                      </details>
                      <div className="quiet-notice">
                        <Icon name="shield" />
                        <span>Este es un ensayo. No se va a mover dinero.</span>
                      </div>
                      <Button
                        className={'button primary full confirm-button' + pointed}
                        isDisabled={busy || !readyToConfirm}
                        onKeyDown={(e) => {
                          if (e.repeat) e.preventDefault();
                        }}
                        onPress={commitProcedure}
                      >
                        Confirmar pago de práctica
                        <Icon name="check" />
                      </Button>
                      <Button className="text-button" onPress={() => send({ type: 'BACK' })}>
                        Quiero corregir la factura
                      </Button>
                    </>
                  )}
                  {step === 'submitting' && (
                    <>
                      <p>No vuelvas a pagar. Consultaremos el registro para saber qué pasó.</p>
                      <div className="pending-illustration">
                        <Icon name="clock" size={50} />
                      </div>
                      <p>
                        Si se cortó la conexión, podés consultar de nuevo. Salir de esta pantalla no
                        cancela la operación.
                      </p>
                      <Button
                        className={'button primary full' + pointed}
                        isDisabled={busy}
                        onPress={reconcile}
                      >
                        {busy ? 'Consultando…' : 'Consultar resultado'}
                      </Button>
                      {!busy && error.includes('no tiene una operación') && (
                        <Button
                          className="button secondary full"
                          onPress={() => {
                            if (draft?.review) send({ type: 'REVIEW', review: draft.review });
                            else setNewOpen(true);
                          }}
                        >
                          Volver a revisar la misma factura
                        </Button>
                      )}
                    </>
                  )}
                  {step === 'result' && op && (
                    <ResultContent
                      operation={op}
                      busy={busy}
                      onConsult={reconcile}
                      onCancel={() => setCancelOpen(true)}
                      onDownload={download}
                      onRepeat={start}
                    />
                  )}
                </section>
              </div>
            )}
            {restoreNotice && (
              <div className="error-notice" role="status">
                {restoreNotice}
              </div>
            )}
            {error && (
              <div className="error-notice" id="flow-error" role="alert">
                <strong>Vamos con calma.</strong>
                <p>{error}</p>
              </div>
            )}
            <ModalOverlay
              isOpen={help}
              onOpenChange={setHelp}
              isDismissable
              className="modal-overlay"
            >
              <Modal className="modal">
                <Dialog id="context-help">
                  <div className="section-title">
                    <Icon name="help" />
                    <Heading slot="title">¿Qué hago ahora?</Heading>
                  </div>
                  <p>{nextMove[step].instruction}</p>
                  {step === 'bill' && draft && (
                    <Button
                      className="button secondary full"
                      onPress={() => {
                        send({ type: 'CODE', code: examples(draft.service)[0].code });
                        setHelp(false);
                      }}
                    >
                      Usar un número de ejemplo en mi factura
                    </Button>
                  )}
                  {step !== 'home' && step !== 'result' && (
                    <Button className="button secondary full" onPress={leave}>
                      Guardar mi práctica y salir
                    </Button>
                  )}
                  <Button className="button secondary" onPress={() => speech.speak(text)}>
                    <Icon name="sound" />
                    Escuchar esta ayuda
                  </Button>
                  <Button className="text-button" onPress={() => setHelp(false)}>
                    Cerrar ayuda
                  </Button>
                </Dialog>
              </Modal>
            </ModalOverlay>

            <div
              className={'storage-status ' + (storageError ? 'storage-warning' : '')}
              role="status"
            >
              <Icon name={storageError ? 'help' : 'check'} size={18} />
              <span>{storage}</span>
              {storageConflict ? (
                <span className="storage-actions">
                  <Button className="text-button" onPress={keepThisVersion}>
                    Conservar mi versión
                  </Button>
                  <Button className="text-button" onPress={() => window.location.reload()}>
                    Recargar y ver lo más reciente
                  </Button>
                </span>
              ) : (
                storageError && (
                  <Button
                    className="text-button"
                    onPress={() => {
                      work(async () => {
                        await save({ id: 'current', draft, preferences });
                        setStorageError(false);
                        setStorage('Tu avance se guardó en este navegador.');
                      });
                    }}
                  >
                    Intentar guardar otra vez
                  </Button>
                )
              )}
            </div>
          </>
        )}
      </main>
      <nav className="mobile-nav" aria-label="Navegación principal">
        <Button className="nav-button" data-current={step === 'home'} onPress={leave}>
          <Icon name="home" />
          Inicio
        </Button>
        <Button className="nav-button" onPress={() => setHelp(true)}>
          <Icon name="help" />
          Ayuda
        </Button>
        <Button className="nav-button" aria-expanded={voiceOpen} onPress={() => setVoiceOpen(true)}>
          <Icon name="sound" />
          Voz
        </Button>
      </nav>
      <footer className="site-footer">
        <span>Autonomía Digital</span>
        <span>Aprender también es animarse a probar.</span>
        <span>Hecho para ir a tu ritmo.</span>
      </footer>
      <ModalOverlay
        isOpen={!!historyPreview}
        onOpenChange={(open) => {
          if (!open) setHistoryPreview(null);
        }}
        isDismissable
        className="modal-overlay"
      >
        <Modal className="modal">
          <Dialog>
            <Heading slot="title">Práctica anterior</Heading>
            {historyPreview && (
              <>
                <p>{resultCopy[historyPreview.status].title}</p>
                <BillDetails bill={historyPreview.bill} />
                <p>
                  Este es un resultado de práctica. No se movió dinero. Tu borrador actual sigue
                  guardado.
                </p>
              </>
            )}
            <Button className="button primary full" onPress={() => setHistoryPreview(null)}>
              Cerrar y conservar mi borrador
            </Button>
          </Dialog>
        </Modal>
      </ModalOverlay>
      {safetyOpen && (
        <SafetyDialog
          onClose={() => {
            speech.stop();
            setSafetyOpen(false);
          }}
          onPause={() => {
            speech.stop();
            setSafetyOpen(false);
            leave();
          }}
          onRead={speech.speak}
        />
      )}
      <ModalOverlay
        isOpen={newOpen}
        onOpenChange={setNewOpen}
        isDismissable
        className="modal-overlay"
      >
        <Modal className="modal">
          <Dialog>
            <Heading slot="title">¿Empezamos una práctica nueva?</Heading>
            <p>
              La nueva práctica reemplaza tu borrador guardado. Las operaciones ya confirmadas
              siguen en el registro: salir o empezar otra no las cancela.
            </p>
            <Button className="button primary full" onPress={start}>
              Empezar una práctica nueva
            </Button>
            <Button className="button secondary full" onPress={() => setNewOpen(false)}>
              Seguir con mi práctica
            </Button>
          </Dialog>
        </Modal>
      </ModalOverlay>
      <ModalOverlay
        isOpen={cancelOpen}
        onOpenChange={setCancelOpen}
        isDismissable
        className="modal-overlay"
      >
        <Modal className="modal">
          <Dialog>
            <Heading slot="title">¿Querés pedir la cancelación?</Heading>
            <p>
              Vamos a consultar si este pago de práctica todavía se puede cancelar. Hasta recibir el
              resultado, la cancelación no está confirmada.
            </p>
            <Button
              className="button primary full"
              isDisabled={busy}
              onPress={() => {
                setCancelOpen(false);
                work(async () => {
                  try {
                    const operation = await request<Operation>(
                      '/api/operations/' + op!.id + '/cancel',
                      {},
                    );
                    send({ type: 'VERIFIED', operation });
                  } catch (e) {
                    throw new Error(
                      'No pudimos confirmar la cancelación. Consultá el resultado antes de volver a intentarlo. ' +
                        (e as Error).message,
                    );
                  }
                });
              }}
            >
              Sí, pedir cancelación
            </Button>
            <Button className="button secondary full" onPress={() => setCancelOpen(false)}>
              Seguir esperando el resultado
            </Button>
          </Dialog>
        </Modal>
      </ModalOverlay>
      <ModalOverlay
        isOpen={clearOpen}
        onOpenChange={setClearOpen}
        isDismissable
        className="modal-overlay"
      >
        <Modal className="modal">
          <Dialog>
            <Heading slot="title">¿Borrar todo lo guardado?</Heading>
            <p>
              Se borran el borrador, los favoritos y las prácticas anteriores de este navegador.
              También pedimos borrar el registro de práctica del servidor. No se puede deshacer.
            </p>
            <Button className="button primary full" isDisabled={busy} onPress={clearData}>
              Sí, borrar todo
            </Button>
            <Button className="button secondary full" onPress={() => setClearOpen(false)}>
              No, conservar mis datos
            </Button>
          </Dialog>
        </Modal>
      </ModalOverlay>
      <ModalOverlay
        isOpen={optionsOpen}
        onOpenChange={setOptionsOpen}
        isDismissable
        className="modal-overlay"
      >
        <Modal className="modal">
          <Dialog>
            <Heading slot="title">Ayuda y opciones</Heading>
            <Button
              className="button secondary full"
              onPress={() => {
                setOptionsOpen(false);
                speech.speak(text);
              }}
            >
              <Icon name="sound" />
              Escuchar la bienvenida
            </Button>
            <Button
              className="button secondary full"
              onPress={() => {
                setOptionsOpen(false);
                setSafetyOpen(true);
              }}
            >
              <Icon name="shield" />
              Quiero revisar un mensaje que me pide pagar
            </Button>
            <Button
              className="text-button"
              aria-expanded={historyOpen}
              onPress={() => {
                setHistoryOpen((h) => !h);
                if (!historyOpen)
                  work(async () => setHistory(await request<Operation[]>('/api/operations')));
              }}
            >
              <Icon name="clock" />
              Ver mis prácticas anteriores
            </Button>
            {historyOpen && (
              <div>
                <h2>Prácticas en este navegador</h2>
                {!history.length && !busy && <p>Todavía no hay prácticas registradas.</p>}
                {history.map((operation) => (
                  <Button
                    className="history-item"
                    key={operation.id}
                    onPress={() =>
                      work(async () => {
                        const verified = await request<Operation>(
                          '/api/operations/' + operation.id,
                        );
                        if (draft && !draft.operation) setHistoryPreview(verified);
                        else {
                          setOptionsOpen(false);
                          send({ type: 'OPEN', operation: verified });
                        }
                      })
                    }
                  >
                    <span>
                      {serviceNames[operation.bill.service]} · {resultCopy[operation.status].title}
                      <small>
                        {new Date(operation.createdAt).toLocaleDateString('es-AR')} · Tocá para ver
                        el detalle
                      </small>
                    </span>
                    <Icon name="arrow" />
                  </Button>
                ))}
              </div>
            )}
            <Button
              className="text-button"
              aria-pressed={preferences.favorite}
              onPress={() => setPreferences((p) => ({ ...p, favorite: !p.favorite }))}
            >
              <Icon name="star" />
              {preferences.favorite
                ? 'Quitar Pagar una factura en favoritos'
                : 'Guardar Pagar una factura en favoritos'}
            </Button>
            {draft && !draft.operation && (
              <Button
                className="text-button"
                onPress={() => {
                  setOptionsOpen(false);
                  setNewOpen(true);
                }}
              >
                Empezar una práctica desde el principio
              </Button>
            )}
            <Button
              className="text-button"
              onPress={() => {
                setOptionsOpen(false);
                setClearOpen(true);
              }}
            >
              <Icon name="trash" />
              Borrar mis datos de práctica
            </Button>
            <p className="small-text">
              Guardamos el borrador, los favoritos y las prácticas de este navegador. Podés
              borrarlos cuando quieras.
            </p>
            <Button className="button primary full" onPress={() => setOptionsOpen(false)}>
              Cerrar
            </Button>
          </Dialog>
        </Modal>
      </ModalOverlay>
      <ModalOverlay
        isOpen={voiceOpen}
        onOpenChange={(open) => {
          setVoiceOpen(open);
          if (!open) speech.stop();
        }}
        isDismissable
        className="modal-overlay"
      >
        <Modal className="modal">
          <Dialog>
            <Heading slot="title">Voz y lectura</Heading>
            <VoiceControls
              speech={speech}
              text={text}
              preferences={preferences}
              onPreferences={setPreferences}
            />
            <Button
              className="button primary full"
              onPress={() => {
                setVoiceOpen(false);
                speech.stop();
              }}
            >
              Cerrar
            </Button>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </div>
  );
}
