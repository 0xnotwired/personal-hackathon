import type { Dispatch, SetStateAction } from 'react';
import { Button } from 'react-aria-components';
import type { useSpeech } from '../speech/use-speech';
import type { Preferences } from '../lib/persistence';
import { Icon } from './ui-icon';
type Props = {
  open: boolean;
  onToggle: () => void;
  speech: ReturnType<typeof useSpeech>;
  text: string;
  preferences: Preferences;
  onPreferences: Dispatch<SetStateAction<Preferences>>;
};
export function VoiceControls({ open, onToggle, speech, text, preferences, onPreferences }: Props) {
  return (
    <>
      <section className="voice-section">
        <div>
          <p className="eyebrow">A TU MANERA</p>
          <h2>También podemos hablar</h2>
          <p>Escuchá las indicaciones o pedí ayuda con tu voz.</p>
        </div>
        <Button
          className="button secondary"
          aria-expanded={open}
          aria-controls="voice-controls"
          onPress={onToggle}
        >
          <Icon name="sound" />
          {open ? 'Ocultar controles de voz' : 'Ver controles de voz'}
        </Button>
      </section>
      <div className="voice-controls" id="voice-controls" hidden={!open}>
        <p>
          La voz es opcional. Tu navegador puede enviar texto o audio a su proveedor para
          procesarlo. No guardamos grabaciones ni lo que decís.
        </p>
        <div className="voice-actions">
          <Button className="button secondary" onPress={() => speech.speak(text)}>
            <Icon name="sound" />
            Escuchar indicaciones
          </Button>
          <Button className="button secondary" onPress={() => speech.speak(text)}>
            Repetir
          </Button>
          <Button
            className="button secondary"
            isDisabled={!['speaking', 'paused'].includes(speech.state)}
            onPress={speech.pause}
          >
            {speech.state === 'paused' ? 'Continuar lectura' : 'Pausar lectura'}
          </Button>
          <Button className="button secondary" onPress={speech.stop}>
            Detener voz y micrófono
          </Button>
          <Button
            className="button secondary"
            onPress={() => onPreferences((p) => ({ ...p, rate: p.rate === 0.65 ? 0.85 : 0.65 }))}
          >
            {preferences.rate === 0.65 ? 'Velocidad normal' : 'Leer más despacio'}
          </Button>
          <Button
            className="button secondary"
            onPress={() => onPreferences((p) => ({ ...p, muted: !p.muted }))}
          >
            {preferences.muted ? 'Activar voz' : 'Silenciar voz'}
          </Button>
        </div>
        <p>
          Para hablar, tocá el botón y decí: “quiero pagar la luz”, “repetí”, “más despacio” o “no
          entiendo”. La voz nunca confirma un pago.
        </p>
        <Button
          className="button secondary"
          onPress={speech.state === 'listening' ? speech.stop : speech.listen}
        >
          <Icon name="mic" />
          {speech.state === 'listening' ? 'Detener micrófono' : 'Hablar con la app'}
        </Button>
        <p role="status">
          {speech.state === 'listening' ? 'Micrófono encendido. ' : ''}
          {speech.message}
        </p>
        {!speech.output && (
          <p>
            La lectura en voz alta no está disponible en este navegador. Podés seguir con los
            textos.
          </p>
        )}
        {!speech.input && (
          <p>Este navegador no reconoce comandos de voz. Todos los botones siguen disponibles.</p>
        )}
      </div>
    </>
  );
}
