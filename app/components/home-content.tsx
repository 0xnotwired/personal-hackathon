import { Ref } from 'react';
import { Button } from 'react-aria-components';
import { Draft } from '../flows/contracts';
import { Icon } from './ui-icon';

type Props = {
  draft: Draft | null;
  favorite: boolean;
  title: Ref<HTMLHeadingElement>;
  onPrimary: () => void;
  onOptions: () => void;
};
const roadmapTasks = [
  { icon: 'clock', name: 'Turnos médicos' },
  { icon: 'arrow', name: 'Transporte' },
  { icon: 'bill', name: 'Compras' },
] as const;
export function HomeContent({ draft, favorite, title, onPrimary, onOptions }: Props) {
  const inProgress = !!draft && !draft.operation;
  return (
    <>
      <section className="home-intro">
        <p className="eyebrow">BIENVENIDA, BIENVENIDO</p>
        <h1 ref={title} tabIndex={-1}>
          ¿Qué necesitás hacer?
        </h1>
        <p className="intro-copy">Practicá tus trámites, a tu ritmo.</p>
        <span className="reassurance">
          <span className="small-check">
            <Icon name="check" size={15} />
          </span>
          Acá podés probar sin miedo a equivocarte.
        </span>
        <p className="identity-notice">
          <Icon name="shield" size={18} />
          <span>
            Autonomía Digital es un simulador. No es tu banco ni una app de pagos real. Nunca te
            pedimos claves, códigos ni datos de tarjeta.
          </span>
        </p>
      </section>
      <div className="home-grid">
        <section className="task-area" aria-label="Tus trámites">
          <article className="task-card">
            <div className="task-card-top">
              <span className="task-icon">
                <Icon name="bill" size={34} />
              </span>
              {favorite && (
                <span className="favorite-badge">
                  <Icon name="star" size={15} /> En favoritos
                </span>
              )}
            </div>
            {inProgress && (
              <p className="draft-note">
                Tu práctica está guardada. Podés retomarla donde la dejaste.
              </p>
            )}
            <span className="pill">PARA PRACTICAR</span>
            <h2>Pagar una factura</h2>
            <p>Practicá cómo pagar la luz, el gas o el agua. Te acompañamos en cada paso.</p>
            <Button className="button primary" onPress={onPrimary}>
              {inProgress ? 'Continuar mi práctica' : 'Quiero practicar'}
              <Icon name="arrow" />
            </Button>
            <span className="task-note">Sin cuentas, tarjetas ni contraseñas.</span>
          </article>
          <Button className="button secondary full" onPress={onOptions}>
            Ayuda y opciones
            <Icon name="arrow" />
          </Button>
          <div className="roadmap">
            <p className="eyebrow">MÁS ADELANTE</p>
            {roadmapTasks.map((task) => (
              <div className="roadmap-item" key={task.name}>
                <Icon name={task.icon} size={22} />
                <span>{task.name}</span>
                <small>Próximamente</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
