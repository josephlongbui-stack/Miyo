# Codex Master Prompt — Build the Miyo Demo

You are building a polished, demo-ready prototype for a startup called **Miyo**.

Before writing code, read every file in this repository/folder, especially:

1. `01_PRODUCT_PRD.md`
2. `02_DESIGN_SYSTEM.md`
3. `03_INFORMATION_ARCHITECTURE_AND_FLOWS.md`
4. `04_MASCOT_ANIMATION_SPEC.md`
5. `05_SEED_DATA.json`
6. `06_DEMO_SCRIPT.md`
7. `07_ACCEPTANCE_TESTS.md`
8. `08_TECHNICAL_IMPLEMENTATION.md`

Also use `assets/miyo-mascot.png` as the Miyo mascot.

## Goal

Build both:

1. a **premium startup landing page**, and
2. a **fully clickable front-end app demo**

for Miyo.

Miyo is an AI attention manager for busy professionals and students. It unifies communication from Gmail, Outlook, and Slack, then helps the user understand what actually matters: urgent messages, important updates, messages that need replies, commitments, decisions, tasks, deadlines, and cross-platform project conversations.

This is a **front-end prototype only**. Do not build real Gmail, Microsoft, or Slack OAuth integrations. Simulate them convincingly with seeded data and local state. The product should feel real enough for an investor or user demo.

## Core product idea

The product should communicate this idea immediately:

> Miyo turns fragmented communication into an organized understanding of what matters, what happened, and what you need to do next.

Primary brand ideas:

- **Only what matters. When it matters.**
- **An inbox for your attention.**

The experience should reduce communication stress rather than feel like another noisy inbox.

## Required implementation

Use:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- local mock/seed data
- local state and/or localStorage for demo interactions

No paid services, API keys, external database, or real OAuth should be required to run the demo.

## Required screens

Implement all of the following:

- Landing page
- Onboarding
- Connect accounts
- Main dashboard
- Unified inbox
- Work / Personal / All segmentation
- Cross-platform project/thread view
- Catch Me Up
- Commitments
- Morning and Evening Briefings
- Action extraction
- Focus / Do Not Disturb mode
- Contact priority settings
- Auto-reply settings
- Connected apps/settings

## Required features to demonstrate

The demo must visibly show:

- simulated Gmail, Outlook, and Slack connections
- Urgent / Important / Needs Reply / Casual / Low Priority classifications
- sender/contact priority tiers: VIP / High / Normal / Low
- Work vs Personal separation
- simple-language AI summaries
- a cross-platform thread linking example using the same project across Gmail + Outlook + Slack
- commitment tracking with both **I Owe** and **Owed to Me**
- Catch Me Up summaries after time away
- Morning Briefing and Evening Wrap-Up
- extracted meetings, deadlines, tasks, and follow-ups
- one-click actions such as Add to Calendar, Create Task, Remind Me, Reply, AI Draft, Snooze, Mark Done
- Focus Mode with simulated auto-reply
- a memorable urgent-notification animation in which the mascot **runs in carrying/pulling the notification card**

## Visual direction

Follow `02_DESIGN_SYSTEM.md` closely.

The design should be:

- mostly purple and lilac
- premium and minimal
- calm and friendly
- cute without looking childish
- highly polished, at the quality level expected from a modern top-tier SaaS product
- spacious, clear, and low-stress

Do not copy Stripe's exact UI or layouts. “Stripe-level polish” means craft, spacing, typography, subtle gradients, and refined motion — not visual imitation.

## Mascot

Use the supplied mascot throughout the product as described in `04_MASCOT_ANIMATION_SPEC.md`.

The mascot should be subtle most of the time. It becomes active for:

- onboarding
- Catch Me Up
- empty states
- successful completion moments
- urgent notifications

For an urgent message, the mascot must visibly run into the interface with the notification card. This is a signature demo moment.

## Data

Use `05_SEED_DATA.json` as the canonical mock dataset. Preserve the important scenarios and relationships in that file. You may add more mock records if needed, but do not replace the key Project Atlas storyline or the core commitments/actions used in the demo script.

## Product behavior

The prototype should feel interactive rather than static:

- filters work
- tabs work
- messages can be marked done/snoozed
- focus mode can be enabled/disabled
- auto-reply settings can be toggled
- connected services can visually connect/disconnect
- Catch Me Up has a short “thinking” animation before revealing the briefing
- extracted actions can change state when clicked
- commitments can be marked completed
- contact priority can be changed
- the urgent mascot notification can be replayed from a demo control

Use tasteful toast confirmations where useful.

## Landing page

The landing page should include:

- Hero with strong product statement and prominent app visual
- “Try the demo” CTA linking into the app
- Problem section showing fragmented communication overload
- How Miyo works
- Feature highlights
- Cross-platform thread linking showcase
- Catch Me Up showcase
- Focus Mode showcase
- Mascot/product personality section
- Final CTA
- Footer

Make the app preview in the hero look like a real product, not a generic marketing illustration.

## Prioritization

If implementation time becomes constrained, prioritize in this order:

1. visual polish and coherent design system
2. dashboard + unified inbox
3. Catch Me Up
4. cross-platform project linking
5. commitments + actions
6. focus mode + mascot urgent animation
7. briefings
8. settings/onboarding details

Do not sacrifice the signature mascot animation or the core Project Atlas cross-platform example.

## Completion behavior

Do not stop after scaffolding. Continue until the prototype is cohesive and demo-ready. Run the app, fix TypeScript/build/runtime errors, and verify the routes and interactions yourself.

Use `07_ACCEPTANCE_TESTS.md` as a final checklist. Only consider the task complete once the critical acceptance criteria pass.

At the end, provide a concise README-style summary of what was implemented and the exact command needed to run the demo locally.
