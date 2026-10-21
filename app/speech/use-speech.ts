'use client';
import { useEffect, useRef, useState } from 'react';
import { Command, command } from './commands';
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  abort: () => void;
  onresult:
    ((e: { results: { [n: number]: { [n: number]: { transcript: string } } } }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};
type SpeechWindow = Window & {
  SpeechRecognition?: new () => Recognition;
  webkitSpeechRecognition?: new () => Recognition;
};
export function useSpeech(onCommand: (value: Command) => void, rate: number, muted: boolean) {
  const [output, setOutput] = useState(false);
  const [input, setInput] = useState(false);
  const [state, setState] = useState<'idle' | 'speaking' | 'paused' | 'listening'>('idle');
  const [message, setMessage] = useState('');
  const recognition = useRef<Recognition | null>(null);
  const callback = useRef(onCommand);
  callback.current = onCommand;
  useEffect(() => {
    setOutput(
      typeof window.speechSynthesis?.speak === 'function' &&
        typeof SpeechSynthesisUtterance === 'function',
    );
    setInput(
      Boolean(
        (window as SpeechWindow).SpeechRecognition ||
        (window as SpeechWindow).webkitSpeechRecognition,
      ),
    );
    return () => {
      window.speechSynthesis?.cancel();
      recognition.current?.abort();
    };
  }, []);
  function stop() {
    window.speechSynthesis?.cancel();
    recognition.current?.abort();
    recognition.current = null;
    setState('idle');
  }
  useEffect(() => {
    if (muted) {
      window.speechSynthesis?.cancel();
      setState('idle');
    }
  }, [muted]);
  function speak(text: string, overrideRate = rate) {
    if (!output) {
      setMessage('Este navegador no puede leer en voz alta. La ayuda escrita está disponible.');
      return;
    }
    if (muted) {
      setMessage('La voz está silenciada. Elegí Activar voz para escuchar.');
      return;
    }
    stop();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-AR';
    utterance.rate = overrideRate;
    const voices = window.speechSynthesis.getVoices();
    const spanish =
      voices.find((x) => x.lang === 'es-AR') || voices.find((x) => x.lang.startsWith('es'));
    if (spanish) utterance.voice = spanish;
    utterance.onstart = () => setState('speaking');
    utterance.onend = () => setState('idle');
    utterance.onerror = (event) => {
      setState('idle');
      if (event.error === 'canceled' || event.error === 'interrupted') return;
      setMessage('No pudimos leer la ayuda. Podés seguir con el texto.');
    };
    window.speechSynthesis.speak(utterance);
  }
  function listen() {
    stop();
    const Constructor =
      (window as SpeechWindow).SpeechRecognition ||
      (window as SpeechWindow).webkitSpeechRecognition;
    if (!Constructor) {
      setMessage('Este navegador no permite hablarle a la app. Podés usar todos los botones.');
      return;
    }
    const r = new Constructor();
    recognition.current = r;
    r.lang = 'es-AR';
    r.continuous = false;
    r.interimResults = false;
    r.onresult = (e) => {
      callback.current(command(e.results[0][0].transcript));
    };
    r.onerror = (e) => {
      setMessage(
        e.error === 'not-allowed'
          ? 'El micrófono no está habilitado. Podés seguir con los botones.'
          : 'No pudimos escucharte. Podés seguir con los botones.',
      );
      setState('idle');
    };
    r.onend = () => {
      setState('idle');
      recognition.current = null;
      setMessage((previous) =>
        previous === 'Te escucho. Podés detener el micrófono.'
          ? 'Terminamos de escuchar. Podés volver a hablar o usar los botones.'
          : previous,
      );
    };
    try {
      setState('listening');
      setMessage('Te escucho. Podés detener el micrófono.');
      r.start();
    } catch {
      setState('idle');
      setMessage('No pudimos abrir el micrófono. Seguí con los botones.');
    }
  }
  function pause() {
    if (state === 'paused') {
      window.speechSynthesis.resume();
      setState('speaking');
    } else {
      window.speechSynthesis.pause();
      setState('paused');
    }
  }
  return { output, input, state, message, speak, listen, pause, stop };
}
