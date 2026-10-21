# Mobile design — Personal-inspired Autonomía Digital

User direction, 2026-10-21: a mobile application with Personal's blue/cyan visual
style. This is a hackathon visual adaptation, not a verified official brand manual,
a licensed official logo asset or an institutional partnership claim.

## Design decisions

The phone is the primary canvas: single column, 480 px maximum shell, compact
header, persistent practice label, large task card, one procedure primary action
and labeled bottom navigation (Inicio, Ayuda, Voz). Desktop centers the same
mobile experience instead of turning it into a dashboard. The default typography
is local/system sans-serif; no remote font or tracking dependency is required.

| Token | Value | Use |
| --- | --- | --- |
| Primary blue | `#005DBB` | Primary actions, theme and high-contrast accents |
| Cyan | `#00B8E4` | Decorative brand accent, never small white-on-cyan instructions |
| Navy | `#062D55` | Main readable text |
| Surface | `#F6FAFF` | App background |
| Soft blue | `#E5F3FF` | Guidance and informative surfaces |
| Muted text | `#4B627A` | Secondary copy with readable contrast |

Semantic tokens in `app/globals.css` govern surfaces/actions. Amber and warm
error surfaces communicate pending/error with explicit words; color alone does
not identify status. Text and icons accompany actions. Focus remains clearly
outlined, targets are at least 44 CSS px, text and layout must tolerate zoom.
Do not substitute bright cyan for the primary button without checking contrast.

## UX rules for this audience

- Keep “Modo práctica — no se mueve dinero” visible. The Personal-inspired
  appearance cannot imply a live provider connection or a real payment.
- A full review shows holder, account, period and amount before confirmation.
  On a completed result, secondary receipt details can be expanded; the status,
  amount and available next action remain immediately visible.
- “Inicio” keeps the draft; “Ayuda” explains the current step; “Voz” reveals
  explicit controls. No navigation icon stands alone and no microphone opens
  just because the person navigated.
- Companion language follows COMPANION_CONTRACT.md: adult, concrete, brief,
  optional smaller step, pause without pressure. Do not treat low digital
  familiarity as low intelligence or infer a medical condition.
- Safety help is secondary and optional. It shows quoted signals, uncertain
  coverage and draft-only replies, and never inserts a payment confirmation.
- The standalone manifest and safe-area padding support a home-screen experience.
  Do not call this a native app, offline app or tested store distribution.

Source: `app/components/`, `app/globals.css`, `app/manifest.ts`, `public/`.
Automated checks and remaining device/user observations: IMPLEMENTATION_STATUS.md.
