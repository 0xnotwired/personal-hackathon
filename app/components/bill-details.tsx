import { Bill, money } from '../flows/contracts';
export function BillDetails({ bill }: { bill: Bill }) {
  return (
    <dl className="bill-details">
      <div>
        <dt>Empresa de ejemplo</dt>
        <dd>{bill.company}</dd>
      </div>
      <div>
        <dt>A nombre de</dt>
        <dd>{bill.holder}</dd>
      </div>
      <>
        <div>
          <dt>Número de cuenta</dt>
          <dd>{bill.account}</dd>
        </div>
        <div>
          <dt>Mes de la factura</dt>
          <dd>{bill.period}</dd>
        </div>
      </>
      <div>
        <dt>Número de factura</dt>
        <dd>{bill.code}</dd>
      </div>
      <div className="bill-total">
        <dt>Importe de práctica</dt>
        <dd>{money(bill.amount)}</dd>
      </div>
    </dl>
  );
}
