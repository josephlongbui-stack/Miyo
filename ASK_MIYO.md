# Ask Miyo

Ask Miyo lives at `/app/ask`. It extends the existing Miyo app, uses the same shared state and message viewer, and runs entirely in the browser without an API key or a network service.

## Try the feature

1. Open **Ask Miyo** in the main navigation, use the top-bar entry, or press **⌘ K / Ctrl K**.
2. Choose **Catch me up on Project Atlas**. The answer links Gmail, Outlook, Slack, project decisions, and tracked commitments.
3. Ask **What am I responsible for?** The conversation retains Project Atlas context.
4. Ask **Prepare me for my meeting with Sarah**. The named person replaces the project context.
5. Click a numbered citation or supporting source. Message citations open Miyo's original-message dialog; record citations open the corresponding project, commitment list, contact priorities, actions, or briefing screen.

Project details, Catch Me Up, commitments, and contact priorities also have contextual Ask Miyo links. These pass a question through `?q=` and submit it after the saved demo state is ready. The scope pill shows the active person/project and can be cleared. **New conversation** clears questions and context.

## How demo intelligence works

`buildKnowledge(state)` normalizes the unchanged `data/seed.json` into messages, people, projects, decisions, commitments, actions, meetings, and a source registry. It applies the current contact priorities, message statuses, completed commitments, and extracted-action statuses from the existing demo store.

`retrieve(question, previousContext, knowledge)` matches people and projects, detects question intent, and ranks message text by matching useful query terms. Explicit names switch scope. Project-specific follow-ups retain scope; broad questions such as “Who am I waiting on?” search across the saved records. Templates in `answerDemo` turn the retrieved records into concise sections, meeting preparation, commitment cards, related actions, and source citations.

The interface displays a 950ms retrieval sequence, then reveals the structured answer. The mascot is still in the empty state and animates briefly while retrieving. Existing reduced-motion behavior is respected. Desktop has a context sidebar; narrow screens use a collapsible context panel and a sticky input.

Commitment completion/reopening and action completion use the existing shared store. Cards update immediately, and new answers read the latest state. Answer prose is a snapshot at the time of the question. Up to 20 questions and their retrieval contexts are stored in this tab's `sessionStorage` under `miyo-ask-v1`; restoring history regenerates answers against the current saved state. **Reset Demo** also clears this conversation history. No messages or questions are sent externally.

## Grounding and data boundaries

- The story date is **September 21, 2026**, shown beside the input. The index includes the 13 detailed canonical messages, three canonical projects, and nine contacts. It is not a live calendar or a general-purpose language model.
- Atlas's demo moved to **September 22 at 2:30 PM**. Pricing approval is due **September 21 at 1:30 PM**. Suggested examples with different dates do not override the supplied records.
- The seeded Sarah is **Sarah Patel in Finance**. No scheduled meeting with Sarah is recorded. Meeting preparation says this explicitly and summarizes her Q3 spreadsheet commitment, including the missed original deadline and revised promised time.
- **James is not in the seed.** Questions about his promises/spreadsheet return a clear coverage explanation and the known contact directory instead of inventing an answer.
- Known meeting starts are distinguished from reply deadlines. Unsupported historical ranges and unknown topics return a coverage boundary.
- Every factual answer item carries source IDs. Source destinations are resolved from the current trusted source map; stored history does not supply arbitrary links. A tracked commitment is cited as its own record when the linked message does not actually contain that promise.

## Code map and future AI integration

| File | Responsibility |
| --- | --- |
| `lib/ask-miyo/types.ts` | Knowledge entities, structured answers, source references, request/context, and the service interface |
| `lib/ask-miyo/knowledge.ts` | Canonical seed normalization, live demo-state overlay, source registry, date labels |
| `lib/ask-miyo/retrieval.ts` | Intent, entity, contextual follow-up, and text matching |
| `lib/ask-miyo/demo-engine.ts` | Grounded local answer generators |
| `lib/ask-miyo/service.ts` | `askMiyo(question, context, service)` adapter boundary |
| `lib/ask-miyo/prompts.ts` | Grounding contract for a future server-side model |
| `components/ask-miyo.tsx` | Conversation, source links, live cards, context panel, input, and session history |
| `components/ask-entry.tsx` | Shared contextual navigation link |
| `app/ask.css` | Scoped styles using existing Miyo design tokens |
| `scripts/test-ask-miyo.cjs` | Deterministic retrieval, source, state, and service tests |

To connect a real LLM/RAG service, implement `AskService.ask(request)` and supply it to `askMiyo`. A production adapter should call an authenticated server route that retrieves only records the user is authorized to access, performs retrieval and generation, validates source IDs against those records, and returns the existing `AskAnswer` shape. Keep credentials and authorization checks on that server. Respect `request.signal` for cancellation and use the existing UI error/retry path. The `prompts.ts` contract treats message contents as evidence, not executable instructions.

The default service remains deterministic and contains no fetch calls, environment-variable reads, local server dependencies, or required external services. A normal Next.js deployment on Vercel runs the demo unchanged.

## Verification

```sh
npm run test:ask
npm run typecheck
npm run build
```

The 25 engine tests cover all 15 required sample questions, contextual follow-ups, global scope, missing people and false premises, current completion/priority state, revised deadlines, meeting start times, unknown topics/ranges, source provenance, and a replaceable/cancellable service adapter. See `ACCEPTANCE_REPORT.md` for browser and deployment checks.
