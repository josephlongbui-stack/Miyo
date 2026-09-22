# Miyo Technical Implementation Guide

## 1. Scope

Build a front-end-only product prototype.

The goal is to create a believable interactive product, not to prove backend integration engineering.

Use deterministic mock data for all AI analysis and external-service behavior.

## 2. Recommended stack

- Next.js (App Router preferred)
- TypeScript
- React
- Tailwind CSS
- Framer Motion
- Lucide React for generic UI icons

Avoid unnecessary dependencies.

## 3. No external requirements

The app should run without:

- API keys
- OAuth credentials
- OpenAI key
- Google/Microsoft/Slack developer accounts
- database

This makes the prototype portable and one-shot friendly.

## 4. Suggested folder structure

```text
app/
  page.tsx
  app/
    layout.tsx
    dashboard/page.tsx
    inbox/page.tsx
    projects/page.tsx
    projects/[id]/page.tsx
    catch-up/page.tsx
    commitments/page.tsx
    briefings/page.tsx
    actions/page.tsx
    focus/page.tsx
    settings/page.tsx
    onboarding/page.tsx
components/
  app-shell/
  dashboard/
  inbox/
  projects/
  commitments/
  briefings/
  focus/
  mascot/
  ui/
data/
  seed.ts
lib/
  types.ts
  mock-engine.ts
  formatters.ts
public/
  miyo-mascot.png
```

Exact structure may vary.

## 5. Canonical data model

Use a normalized internal communication model even though all data is mocked.

Suggested type:

```ts
type Provider = "gmail" | "outlook" | "slack";
type AttentionCategory = "urgent" | "important" | "needs_reply" | "casual" | "low_priority";
type ContextType = "work" | "personal";
type ContactPriority = "vip" | "high" | "normal" | "low";

interface MiyoMessage {
  id: string;
  provider: Provider;
  accountLabel: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderPriority: ContactPriority;
  timestamp: string;
  subject?: string;
  channel?: string;
  body: string;
  preview: string;
  summary: string;
  attentionCategory: AttentionCategory;
  context: ContextType;
  needsReply: boolean;
  deadline?: string;
  projectId?: string;
  threadId?: string;
  extractedActionIds?: string[];
  commitmentIds?: string[];
  read: boolean;
  completed?: boolean;
}
```

## 6. Mock AI engine

Do not call a real model.

Create helper functions that return seeded/deterministic results so the UI architecture feels realistic:

- `getCatchUpSummary(range)`
- `getMorningBriefing()`
- `getEveningBriefing()`
- `getProjectSummary(projectId)`
- `getSuggestedReply(messageId)`
- `getExtractedActions(messageId)`

These can read directly from seed data.

Add a simulated delay of roughly 700–1300ms for AI-like actions such as Catch Me Up or AI Draft.

## 7. Demo state

Use React context, Zustand, or a lightweight equivalent only if it simplifies the app.

State to preserve:

- connected services
- completed commitments
- snoozed/completed messages
- contact priorities
- focus mode
- auto-reply toggle
- action completion state

Persist using localStorage where practical.

Provide a “Reset demo” button in Settings to restore the seed state.

## 8. Simulated integrations

Connected-app UI should act like OAuth without opening external sites.

Flow:

1. Click Connect
2. modal/compact sheet shows “Connecting…”
3. 600–1000ms delay
4. success checkmark
5. seeded provider messages become available

No fake credential forms. Never ask the user to enter a real Google/Microsoft/Slack password.

## 9. Thread linking implementation

Use `projectId` to deterministically connect cross-platform messages.

Project Atlas should have messages across all three providers.

The project view can sort all linked messages by timestamp and display provider-specific icons.

To communicate “AI linking,” optionally show:

> Miyo linked 3 conversations to this project

with a small sparkle/chain icon.

## 10. Commitment implementation

Represent commitments separately and reference source messages.

Suggested type:

```ts
interface Commitment {
  id: string;
  direction: "i_owe" | "owed_to_me";
  personName: string;
  text: string;
  dueAt: string;
  status: "open" | "overdue" | "completed";
  provider: Provider;
  sourceMessageId: string;
  projectId?: string;
}
```

## 11. Action extraction implementation

Suggested type:

```ts
type ActionKind = "meeting" | "task" | "deadline" | "follow_up" | "approval";

interface ExtractedAction {
  id: string;
  kind: ActionKind;
  title: string;
  dueAt?: string;
  sourceMessageId: string;
  provider: Provider;
  state: "suggested" | "added" | "done" | "dismissed";
}
```

## 12. Focus Mode architecture

Focus state should include:

```ts
interface FocusState {
  active: boolean;
  mode: "deep_work" | "meeting" | "studying" | "sleeping";
  endAt?: string;
  allowUrgent: boolean;
  allowVip: boolean;
  autoReply: boolean;
}
```

The urgent demo notification does not need a timer. It can be triggered explicitly by the user.

## 13. Mascot asset

Copy `assets/miyo-mascot.png` into the framework's public/static asset folder.

Because the supplied file has a light background, design placements so the asset blends naturally into white or very light surfaces. Do not apply destructive image processing unless needed.

For the running animation, animate the image container with Framer Motion.

## 14. Animation implementation suggestion

For urgent delivery:

- overlay component mounted in a portal or high-level app shell
- `AnimatePresence`
- mascot initial `{ x: 280, y: 8, rotate: 2, opacity: 0 }`
- animate into viewport with spring
- optional keyframe y/rotation sequence to imitate running
- card follows with 80–120ms stagger
- final stable state remains readable

Do not copy these values blindly if they look poor; tune visually.

## 15. Provider icons

Use recognizable but simple provider treatment.

If brand SVGs are not already available, use text badges or generic mail/chat icons with provider labels rather than fetching assets from the web.

The prototype must not depend on remote images.

## 16. Landing app preview

Prefer using real reusable app components populated with seed data rather than drawing a fake screenshot. This keeps the visual language consistent and makes the hero feel real.

## 17. Quality checks

Before finishing:

- run lint if configured
- run TypeScript/build check
- test major routes
- inspect desktop and narrow viewport
- verify animation does not overflow badly
- verify no empty placeholder pages
- verify no Lorem Ipsum
- verify all seed data renders without undefined values
