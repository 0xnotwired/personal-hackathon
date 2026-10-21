// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Anna Tchijova
// Adapted in TypeScript for Autonomía Digital from the distinct-signal gate in
// wolf-and-cronos/corvus/corvus/verdict/engine.py and influence cue categories
// in corvus/corvus/analysis/l2_carnegie_cialdini.py, commit
// 74ed33977d015b9024277b164857642d906a2919.
// Changes: bounded es-AR surface rules; no scores, behavioral profiles, LLM,
// forensic seals or scam verdict. Absence of matches remains UNVERIFIED.
// These cue families are not statistically independent detectors.
import { verbatim } from './verbatim';
export type SafetySignal = { family: string; label: string; quote: string; explanation: string };
export type SafetyAssessment = {
  kind: 'pressure' | 'signal' | 'unverified';
  signals: SafetySignal[];
  hardBoundary: boolean;
  summary: string;
  nextAction: string;
  ruleVersion: 'es-AR-1';
};
const rules = [
  {
    family: 'urgency',
    label: 'Te apuran',
    pattern:
      /\b(?:ahora mismo|ya mismo|es urgente|[uú]ltima oportunidad|en [1-5] minutos|ahora o nunca)\b/i,
    explanation:
      'La frase intenta que decidas rápido. Una urgencia por sí sola no demuestra un engaño.',
  },
  {
    family: 'credentials',
    label: 'Te piden una clave o un código',
    pattern:
      /\b(?:pasame|pas[áa]me|enviame|envi[áa]me|mandame|decime|compartime|dame)\s+(?:(?:tu|el|la|un|una|tus|los)\s+)?(?:claves?|contrase[ñn]as?|c[oó]digos?|token)\b/i,
    explanation:
      'Una clave o un código puede dar acceso a tu cuenta. No lo compartas con otra persona.',
  },
  {
    family: 'secrecy',
    label: 'Te piden que no consultes',
    pattern:
      /\b(?:no se lo cuentes a nadie|no (?:llames|consultes|hables) (?:al banco|con nadie)|que quede entre nosotros)\b/i,
    explanation: 'Pedir secreto puede impedir que verifiques lo que te están solicitando.',
  },
  {
    family: 'authority',
    label: 'Dicen representar a una entidad',
    pattern: /\b(?:soy|somos) (?:del banco|de seguridad|del soporte|de soporte|de la empresa)\b/i,
    explanation: 'Decir que es del banco o del soporte no prueba quién envió el mensaje.',
  },
  {
    family: 'payment-change',
    label: 'Cambian la forma de pago',
    pattern:
      /\b(?:transferime|transfer[íi]me|pagame|pag[áa]me) (?:a (?:mi|esta|otra) cuenta|por (?:este|el) enlace)\b/i,
    explanation:
      'Un cambio de cuenta o enlace merece una verificación por un canal que vos ya conozcas.',
  },
] as const;
export const safetyExamples = {
  pressure: 'Soy del banco. Pasame tu código ahora mismo y no se lo cuentes a nadie.',
  ordinary: 'Tu factura de luz vence el 10 de noviembre. Podés revisar el importe en la factura.',
  ambiguous: 'Es urgente, ¿podés revisar esto?',
};
export function assessMessage(raw: string): SafetyAssessment {
  if (typeof raw !== 'string' || !raw.trim())
    throw new Error('Escribí un mensaje o elegí un ejemplo para revisarlo.');
  if (raw.length > 2000) throw new Error('Podés revisar hasta 2000 caracteres por vez.');
  const signals: SafetySignal[] = [];
  for (const rule of rules) {
    const quote = verbatim(raw, rule.pattern);
    if (quote)
      signals.push({
        family: rule.family,
        label: rule.label,
        quote,
        explanation: rule.explanation,
      });
  }
  const kind = signals.length >= 2 ? 'pressure' : signals.length === 1 ? 'signal' : 'unverified';
  const hardBoundary = signals.some((s) => s.family === 'credentials');
  return {
    kind,
    signals,
    hardBoundary,
    ruleVersion: 'es-AR-1',
    summary:
      kind === 'pressure'
        ? 'Encontré varias señales para revisar. No prueban por sí solas que sea un engaño.'
        : kind === 'signal'
          ? 'Encontré una señal para revisar. No alcanza para afirmar que sea un engaño.'
          : 'No puedo confirmar si este mensaje es confiable. No encontrar señales no significa que sea seguro.',
    nextAction: hardBoundary
      ? 'No compartas claves ni códigos. Podés detenerte y verificar por un canal que vos ya conozcas.'
      : 'Podés tomarte un momento y verificar con la entidad por un canal que vos ya conozcas. No uses un enlace ni un teléfono que solo apareció en ese mensaje.',
  };
}
export const replyOptions = [
  {
    label: 'Pedir tiempo',
    text: 'Voy a revisar la información por mi cuenta antes de continuar.',
    protects: 'Te da tiempo para verificar.',
    consequence: 'Deja la conversación abierta.',
  },
  {
    label: 'Poner un límite',
    text: 'No voy a compartir claves ni códigos. Si necesito ayuda, voy a contactar a la entidad por un canal que yo conozca.',
    protects: 'Mantiene tus claves y códigos en privado.',
    consequence: 'Rechaza la solicitud de datos.',
  },
] as const;
