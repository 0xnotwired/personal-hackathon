import { Button } from 'react-aria-components';
import { money, Operation } from '../flows/contracts';
import { resultCopy } from '../lib/copy';
import { BillDetails } from './bill-details';
import { Icon } from './ui-icon';
type Props = {
  operation: Operation;
  busy: boolean;
  onConsult: () => void;
  onCancel: () => void;
  onDownload: () => void;
  onRepeat: () => void;
};
export function ResultContent({
  operation,
  busy,
  onConsult,
  onCancel,
  onDownload,
  onRepeat,
}: Props) {
  return (
    <>
      <div className={'result-mark ' + operation.status}>
        <Icon name={resultCopy[operation.status].icon} size={38} />
      </div>
      <p className="result-explanation">{resultCopy[operation.status].text}</p>
      {operation.status === 'pending' && (
        <div className="quiet-notice">
          <Icon name="clock" />
          <span>
            Este ejemplo se aprueba al consultar después de un minuto, salvo que antes confirmemos
            su cancelación.
          </span>
        </div>
      )}
      <div className="receipt-heading">
        <Icon name="bill" />
        <h2>Comprobante de práctica</h2>
      </div>
      <div className="result-summary">
        <strong>{money(operation.bill.amount)}</strong>
        <span>{operation.bill.company}</span>
      </div>
      <details className="receipt-fold">
        <summary>Ver datos del comprobante de práctica</summary>
        <BillDetails bill={operation.bill} />
      </details>
      <p className="reference">
        Referencia: {operation.id}
        <br />
        {new Date(operation.createdAt).toLocaleString('es-AR')} · No es un comprobante de pago real.
      </p>
      {operation.status === 'pending' ? (
        <>
          <Button className="button primary full" isDisabled={busy} onPress={onConsult}>
            {busy ? 'Consultando…' : 'Consultar resultado'}
          </Button>
          <Button className="button secondary full" isDisabled={busy} onPress={onCancel}>
            Pedir cancelar este pago de práctica
          </Button>
        </>
      ) : (
        <Button className="button primary full" onPress={onDownload}>
          <Icon name="bill" />
          Guardar comprobante de práctica
        </Button>
      )}
      <Button className="button secondary full" onPress={onRepeat}>
        Volver a practicar
      </Button>
      <p className="small-text">Usá “Volver al inicio” arriba para empezar otra cosa.</p>
    </>
  );
}
