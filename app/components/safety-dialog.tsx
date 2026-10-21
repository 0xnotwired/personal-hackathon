'use client';
import { useState } from 'react';
import { Button, Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components';
import {
  assessMessage,
  replyOptions,
  safetyExamples,
  type SafetyAssessment,
} from '../lib/safety/assess';
import { Icon } from './ui-icon';
type Props = { onClose: () => void; onPause: () => void; onRead: (text: string) => void };
export function SafetyDialog({ onClose, onPause, onRead }: Props) {
  const [message, setMessage] = useState('');
  const [assessment, setAssessment] = useState<SafetyAssessment | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  function edit(value: string) {
    setMessage(value);
    setAssessment(null);
    setError('');
    setCopied('');
  }
  function analyze() {
    try {
      setAssessment(assessMessage(message));
      setError('');
      setCopied('');
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function copy(text: string, label: string) {
    try {
      if (!navigator.clipboard) throw new Error();
      await navigator.clipboard.writeText(text);
      setCopied(
        'Copiamos “' + label + '”. Vos decidís si lo usás. La app no envió ningún mensaje.',
      );
    } catch {
      setCopied(
        'No pudimos copiar. Podés seleccionar el texto de la respuesta y copiarlo por tu cuenta. No se envió ningún mensaje.',
      );
    }
  }
  return (
    <ModalOverlay
      isOpen
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      isDismissable
      className="modal-overlay"
    >
      <Modal className="modal safety-modal">
        <Dialog>
          <p className="eyebrow">AYUDA PARA DECIDIR CON CALMA</p>
          <Heading slot="title">¿Te están apurando para pagar?</Heading>
          <p>Podés revisar un mensaje antes de decidir. No hace falta responder ni pagar ahora.</p>
          <div className="quiet-notice">
            <Icon name="shield" />
            <span>
              El mensaje se revisa en este navegador. No se envía ni se guarda. No pegues claves,
              códigos ni datos privados.
            </span>
          </div>
          <details className="safety-examples">
            <summary>Probar con un mensaje de ejemplo</summary>
            <div className="example-actions">
              <Button
                className="button secondary full"
                onPress={() => edit(safetyExamples.pressure)}
              >
                Ejemplo: me piden un código
              </Button>
              <Button
                className="button secondary full"
                onPress={() => edit(safetyExamples.ordinary)}
              >
                Ejemplo: aviso de vencimiento
              </Button>
              <Button
                className="button secondary full"
                onPress={() => edit(safetyExamples.ambiguous)}
              >
                Ejemplo: un pedido urgente
              </Button>
            </div>
          </details>
          <label className="field-label" htmlFor="message-to-review">
            Mensaje que querés revisar
          </label>
          <p id="safety-hint" className="field-hint">
            Hasta 2000 caracteres. Estas reglas buscan algunas frases en español; pueden pasar por
            alto un engaño.
          </p>
          <textarea
            id="message-to-review"
            rows={4}
            maxLength={2000}
            value={message}
            onChange={(e) => edit(e.target.value)}
            aria-describedby="safety-hint"
          />
          <Button className="button primary full" onPress={analyze}>
            Revisar señales del mensaje
          </Button>
          {error && (
            <p className="error-notice" role="alert">
              {error}
            </p>
          )}
          {assessment && (
            <section className="safety-result" aria-label="Resultado de la revisión del mensaje">
              <h3>
                {assessment.kind === 'pressure'
                  ? 'Hay varias señales para revisar'
                  : assessment.kind === 'signal'
                    ? 'Hay una señal para revisar'
                    : 'No hay un resultado concluyente'}
              </h3>
              <p role="status">{assessment.summary}</p>
              {assessment.signals.length > 0 && (
                <ul className="signal-list">
                  {assessment.signals.map((signal) => (
                    <li key={signal.family}>
                      <strong>{signal.label}</strong>
                      <blockquote>“{signal.quote}”</blockquote>
                      <p>{signal.explanation}</p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="quiet-notice">
                <Icon name="shield" />
                <span>{assessment.nextAction}</span>
              </div>
              <Button
                className="button secondary full"
                onPress={() => onRead(assessment.summary + ' ' + assessment.nextAction)}
              >
                <Icon name="sound" />
                Escuchar esta explicación
              </Button>
              <details className="reply-options">
                <summary>Ver respuestas que puedo usar</summary>
                <p>
                  Son textos de ejemplo. Podés cambiarlos o no responder. Ninguna opción se envía
                  desde la app.
                </p>
                {replyOptions.map((option) => (
                  <article key={option.label} className="reply-card">
                    <h4>{option.label}</h4>
                    <label className="sr-only" htmlFor={'reply-' + option.label}>
                      Respuesta: {option.label}
                    </label>
                    <textarea id={'reply-' + option.label} readOnly value={option.text} rows={4} />
                    <p>
                      {option.protects} {option.consequence}
                    </p>
                    <Button
                      className="button secondary full"
                      onPress={() => copy(option.text, option.label)}
                    >
                      Copiar: {option.label}
                    </Button>
                  </article>
                ))}
              </details>
              <p role="status">{copied}</p>
            </section>
          )}
          <div className="safety-exits">
            <Button className="button secondary full" onPress={onPause}>
              Guardar mi práctica y descansar
            </Button>
            <Button className="text-button" onPress={onClose}>
              Volver a donde estaba
            </Button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
