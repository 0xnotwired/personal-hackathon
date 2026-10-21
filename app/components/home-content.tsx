import { Ref } from 'react';
import { Button } from 'react-aria-components';
import { Draft } from '../flows/contracts';
import { Preferences } from '../lib/persistence';
import { Icon } from './ui-icon';
type Props = {
  draft: Draft | null;
  preferences: Preferences;
  title: Ref<HTMLHeadingElement>;
  onResume: () => void;
  onStart: () => void;
  onNew: () => void;
  onFavorite: () => void;
  onWelcome: () => void;
};
export function HomeContent({
  draft,
  preferences,
  title,
  onResume,
  onStart,
  onNew,
  onFavorite,
  onWelcome,
}: Props) {
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
      </section>
      <div className="home-grid">
        <section className="task-area" aria-label="Tus trámites">
          {draft && !draft.operation && (
            <div className="resume-card">
              <div>
                <p className="eyebrow">SEGUIMOS DONDE DEJASTE</p>
                <h2>Tu práctica está guardada</h2>
                <p>Podés retomar el paso que estabas haciendo.</p>
              </div>
              <Button className="button primary" onPress={onResume}>
                Continuar mi práctica
                <Icon name="arrow" />
              </Button>
            </div>
          )}
          {preferences.favorite && (
            <div className="favorite-shortcut">
              <Icon name="star" />
              <span>Tu favorito</span>
              <Button
                className="text-button"
                onPress={() => (draft && !draft.operation ? onResume() : onStart())}
              >
                Pagar una factura
                <Icon name="arrow" />
              </Button>
            </div>
          )}
          <article className="task-card">
            <div className="task-card-top">
              <span className="task-icon">
                <Icon name="bill" size={34} />
              </span>
              <Button
                className={'favorite-button ' + (preferences.favorite ? 'is-favorite' : '')}
                aria-label={
                  preferences.favorite
                    ? 'Quitar Pagar una factura de favoritos'
                    : 'Guardar Pagar una factura en favoritos'
                }
                aria-pressed={preferences.favorite}
                onPress={onFavorite}
              >
                <Icon name="star" />
                <span>{preferences.favorite ? 'En favoritos' : 'Guardar favorito'}</span>
              </Button>
            </div>
            <span className="pill">PARA PRACTICAR</span>
            <h2>Pagar una factura</h2>
            <p>Practicá cómo pagar la luz, el gas o el agua. Te acompañamos en cada paso.</p>
            <Button
              className="button primary"
              onPress={() => (draft && !draft.operation ? onNew() : onStart())}
            >
              Quiero practicar
              <Icon name="arrow" />
            </Button>
            <span className="task-note">Sin cuentas, tarjetas ni contraseñas.</span>
          </article>
          <div className="roadmap">
            <p className="eyebrow">MÁS ADELANTE</p>
            <h2>Más cosas para aprender</h2>
            <p>
              Turnos médicos, transporte y compras.
              <br />
              Estas prácticas todavía no están disponibles.
            </p>
          </div>
        </section>
        <aside className="companion-card">
          <div className="companion-art" aria-hidden="true">
            <div className="art-circle">
              <Icon name="sound" size={52} />
            </div>
            <span className="art-star star-one">✦</span>
            <span className="art-star star-two">✦</span>
            <div className="art-message">Vamos paso a paso.</div>
          </div>
          <p className="eyebrow">NO TENÉS QUE SABER TODO</p>
          <h2>Estamos para acompañarte</h2>
          <p>
            Podés pedir ayuda todas las veces que quieras. También podés escuchar las indicaciones.
          </p>
          <Button className="button secondary" onPress={onWelcome}>
            <Icon name="sound" />
            Escuchar la bienvenida
          </Button>
          <p className="small-text">Vos elegís cuándo empezar y cuándo parar.</p>
        </aside>
      </div>
    </>
  );
}
