[English](README.md) · [Español](README_ES.md) · **[Technical architecture](docs/ARCHITECTURE.md)**

# Autonomía Digital

**Understand each step. Make your own decision.**

Autonomía Digital is a proposed mobile-first companion for older adults who need
help understanding and practicing everyday digital procedures. It is a complete
simulation product with plain Spanish, optional speech and recoverable steps, keeping decisions
with the person.

## The intended experience

Choose a task from large labeled cards, ask for help when needed, review what
will happen, personally confirm, and receive a verified result. An interruption
should not erase the draft; an uncertain payment should not trigger another charge.

The first complete practice is a simulated utility-bill payment. Medical
appointments, transport and shopping follow as complete simulations. The teammate's
sketches inform home/favorites. No bank, payment or utility API connection is required.
Practice mode and receipts are explicitly labeled; no actual money moves.

## What makes the proposed experience distinct

| Need during a procedure | Intended behavior |
| --- | --- |
| Understand | Contextual written/spoken explanation of the next step and consequence |
| Decide | Explicit personal confirmation; speech cannot commit a payment |
| Recover | Retained draft, reconciled operation status and a useful error/support path |

These are product hypotheses and design requirements, not measured advantages
over competing applications. The destination is a usable simulator: its UI,
voice, saved state, results, cancellation and repeat practice must actually work.
It is not waiting for a real-payment integration to count as complete.

## Current state and evidence

**Planning stage: application implementation and user-study results are pending.
Live financial integration is outside the agreed product scope.** The repository contains product/architecture
documents, an execution plan and vendored agent skills. There is no runnable app
command to copy at this stage.

Behavioral claims and their required evidence are tracked in the
[evidence ledger](docs/EVIDENCE_LEDGER.md). The study protocol measures comprehension,
independent completion and transfer, not just whether someone likes the idea.

## Read with your role in mind

- **Team overview in Spanish:** [Producto para el equipo](docs/PRODUCTO_EQUIPO.md).
- **What to build:** [Product definition](docs/PRODUCT.md) and [module action plan](docs/ACTION_PLAN.md).
- **How it works:** [Technical architecture, authority boundaries and repository links](docs/ARCHITECTURE.md).
- **How to learn:** [User research and validation](docs/VALIDATION.md).
- **How to present it:** [Hackathon strategy](docs/HACKATHON_PLAYBOOK.md) and [3/5-minute demo and pitch](docs/DEMO_AND_PITCH.md).
- **Why these methods:** [Book reference and adaptations](docs/BOOK_REFERENCE.md).

The user reports a 3–5-minute pitch and no published judging criteria. Internal
review dimensions are explicitly our own; event rules and reuse requirements
still need confirmation.

## Repository organization

```text
AGENTS.md       Product invariants and repository operating rules
docs/           Product, architecture, execution, validation and presentation
.commandcode/   Vendored engineering skills and read-only learned preferences
```

Application/module paths in the architecture are proposed, not existing files.
Open-source dependencies and reference projects are distinguished there; none
has been integrated merely because it appears in the plan.

## References and license

Alvin Chia's *Hackathons Unboxed* informs the research, experimentation and pitch
process. [Source notes](docs/BOOK_REFERENCE.md) cite the supplied scan's pages and
separate the book's advice from our decisions. The book itself is not distributed
with this repository.

Repository license: [Apache-2.0](LICENSE). Reused dependencies/assets retain their
own applicable licenses and notices. Follow [AGENTS.md](AGENTS.md) before changes.
