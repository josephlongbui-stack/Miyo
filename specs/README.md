# Miyo Codex Demo Bundle

This bundle is designed to be dropped into a Codex workspace as the specification for a polished, front-end-only demo of **Miyo**, an AI attention manager for communication.

## Start here

Paste the contents of `00_CODEX_MASTER_PROMPT.md` into Codex and attach/upload the entire folder if your Codex workflow supports files. The master prompt tells Codex which documents to read and what to build.

## Included files

- `00_CODEX_MASTER_PROMPT.md` — the prompt to paste into Codex.
- `01_PRODUCT_PRD.md` — product definition, audience, value proposition, feature behavior, and demo scope.
- `02_DESIGN_SYSTEM.md` — visual system, color tokens, typography, layout, component language, and accessibility guidance.
- `03_INFORMATION_ARCHITECTURE_AND_FLOWS.md` — routes, navigation, screen-by-screen requirements, and key demo flows.
- `04_MASCOT_ANIMATION_SPEC.md` — mascot behavior, notification-delivery animation, and usage rules.
- `05_SEED_DATA.json` — realistic mock messages, projects, commitments, actions, contacts, and briefings.
- `06_DEMO_SCRIPT.md` — a 2–3 minute investor/user demo sequence.
- `07_ACCEPTANCE_TESTS.md` — concrete completion criteria Codex should satisfy before stopping.
- `08_TECHNICAL_IMPLEMENTATION.md` — recommended stack, architecture, mock integration strategy, state model, and constraints.
- `assets/miyo-mascot.png` — the mascot asset supplied by the product owner.

## Important scope rule

This is **not** a production integration project. Gmail, Outlook, and Slack connections should be convincingly simulated. The demo should prioritize interaction quality, product clarity, and visual polish over backend complexity.
