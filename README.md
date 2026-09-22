# Miyo — an inbox for your attention

A complete, local, interactive demo built with Next.js App Router, React, TypeScript, Tailwind CSS, and Framer Motion. No API keys, accounts, database, or external integrations are required.

## Run locally

Uses Node.js 24 LTS, declared in `package.json` for consistent local and Vercel builds. Tested with Node.js 24.21.0 and npm 11.19.0.

```sh
cd miyo-demo
npm install
npm run dev
```

Open **http://127.0.0.1:3000**. When using the source ZIP elsewhere, run the same npm commands from the extracted `miyo-demo` directory.

Keep the terminal running while using Miyo. Wait for Next.js to print **Ready** before opening the URL. Closing the server or restarting your computer stops localhost; opening the browser alone does not start the app. Use `http://`, not `https://`.

The package manager is **npm** (`package-lock.json` is included). The clean source package excludes installed dependencies. Run `npm install` after extraction; subsequent launches only need `npm run dev`. Use `npm ci` for a reproducible installation from the lockfile.

If Next.js reports **Another next dev server is already running**, use the existing server's printed **Local** URL. Starting another copy of this same project on a different port still conflicts with its development lock. To restart it, stop the original server with **Ctrl+C**, then run `npm run dev` again. Do not delete the lock while its server is running.

For a production preview:

```sh
npm run build
npm start
```

Use `npm run typecheck` for an independent TypeScript check. If port 3000 is occupied by a different application, use `npm run dev -- --port 3001` and open **http://127.0.0.1:3001**. Always follow the **Local** URL printed by Next.js.

## Deploy to Vercel

Deploy this `miyo-demo` directory using the **Next.js** framework preset. Use `npm ci` to install and `npm run build` to build; leave the output directory at the Next.js default. No environment variables or API keys are required. Node.js 24.x is selected by `package.json`.

The ZIP contains the project files directly at its root, with no enclosing app folder. Extract it into a folder named `miyo-demo` and upload its contents (including `.gitignore`) to the root of your GitHub repository. Upload the extracted files, not the ZIP itself. Set Vercel's **Root Directory** to `.` (the repository root). See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for deployment settings and verification details.

## Design update

The interface now uses a simpler single-column dashboard, larger gaps between sections, grouped navigation, quieter surfaces, and fewer repeated badges. Secondary inbox filters live behind the Filters control. Project, catch-up, action, and briefing sections follow the same minimal visual style.

## The main walkthrough

1. Landing page → **Try the demo**.
2. Dashboard → the **Catch me up** card.
3. Watch Miyo sort messages and reveal the briefing.
4. **Open Project Atlas** to see the Gmail, Outlook, and Slack timeline.
5. **See your commitments**; explore **I Owe** and **Owed to Me** and complete a promise.
6. **Focus** → **Deep Work** → **2 hours** → **Start Focus Mode**.
7. **Simulate urgent message**. Miyo runs in from off-screen with Maya’s Project Atlas alert. On mobile, the delivery enters from the lower edge.
8. Try **AI Draft**, edit the suggested reply, and send it within the demo.

The animation is replayable. Urgent and VIP overrides determine whether the simulated message is delivered or held. Automatic acknowledgment is shown only when Auto Reply is enabled.

## Included screens and behavior

- Landing page with a real, reusable dashboard preview and the supplied mascot as the logo and favicon.
- Five-step onboarding, individual account connection animations, and Connect all.
- Dashboard, prioritized inbox, All / Work / Personal segmentation, category/provider filters, search, message details, and original-message context.
- Reply, delayed AI Draft, snooze, done, and restore interactions.
- Projects: Atlas, Q4 Launch, Investor Deck, and the secondary Client Redesign example requested in the information architecture.
- Project Atlas summary, decisions, questions, people, linked actions, commitments, and chronological cross-platform timeline.
- Catch Me Up with a brief sorting animation, supplied briefing, and completed/replied items removed from “What needs you.”
- I Owe / Owed to Me, status filters, overdue promises, revised due times, reminders, completion, and reopening.
- Morning Briefing, Evening Wrap-Up, and extracted meetings, tasks, approvals, deadlines, and follow-ups.
- Four focus modes, preset/custom duration, live countdown, urgent/VIP overrides, Auto Reply, and the signature delivery animation.
- Connected-app settings, editable contact priorities, professional/casual reply templates, and briefing preferences.
- Native modal focus handling, keyboard focus styles, responsive navigation, and reduced-motion branches.
- Optional browser WebMCP tools for reading the demo state and completing commitments. The app works normally without WebMCP support.

## People & places priorities

Open **Inbox → Set priorities** or **Settings → People & places**. Contacts support VIP / High / Normal / Low; inboxes, Slack workspaces, and channels support High / Normal / Low. Channels can inherit their workspace setting. Changes save automatically, and the expandable inbox preview shows the same ordering as the actual inbox.

Urgent messages stay first. Normal contacts follow their place; when both the person and place have a custom priority, the higher priority wins. Within the same priority, message category and recency break ties. These preferences change ordering, not the seeded urgency category. Place settings do not override Focus Mode; its VIP contact and urgent-message switches still apply.

Existing saved demos gain default place settings automatically. **Reset Demo** restores the original contact priorities and default place settings.

## Demo data and persistence

`data/seed.json` is an unchanged copy of the supplied canonical seed. The original specifications are retained in `specs/`. `public/miyo-mascot.png` preserves the supplied original. The active artwork is `public/miyo-mascot-selected.png`, an unchanged copy of the replacement image selected by the user. Its white background blends into the app through CSS. The shared mascot uses gentle Framer Motion greetings, idle movement, thinking, celebration, and Focus breathing, with reduced-motion and off-screen handling. Fonts and icons are bundled locally. See `MASCOT_NOTES.md` for asset provenance and animation details.

The demo uses September 21, 2026 as its story date. Where prose and data differ, the seed takes precedence: the Atlas demo is **tomorrow, September 22 at 2:30 PM**. Dashboard and briefing aggregate counts come from the specification; the inbox contains the **13 detailed representative messages** supplied in the seed. Catch-up ranges present the same fixed demo snapshot rather than generating new data. Client Redesign has a small supplementary presentation; the original Atlas storyline is preserved.

Useful state is saved to `localStorage` under `miyo-demo-v1`: connected accounts, contact and place priorities, message status, completed commitments, extracted action state, reminders, replies, focus settings/end time, reply templates, and briefing preferences. Completing a commitment also completes its linked action; completed pricing is reflected in Project Atlas.

Use **Settings → Reset Demo** before a fresh walkthrough. Reset restores the original connected accounts, open messages, promises, priorities, and default focus preferences. Onboarding intentionally starts its connection step with disconnected demo accounts.

“Send,” “Add to Calendar,” “Create Task,” and reminders update local demo state only. They do not contact Gmail, Outlook, Slack, calendar services, or any AI service. Scheduled briefings and notifications are simulated. Nothing is sent externally.

## Project map

```text
app/                  Next.js routes, metadata, and design system
components/store.tsx  Shared demo state and linked actions
components/ui.tsx     Shared visual components and mascot logo
components/shell.tsx  Responsive app navigation
components/inbox.tsx  Filters, message detail, replies, and AI drafts
components/catch-up.tsx
components/projects.tsx
components/productivity.tsx  Commitments, actions, and briefings
components/focus.tsx  Focus timer and mascot delivery animation
components/settings.tsx     Settings and onboarding
components/web-tools.tsx    Optional progressive WebMCP support
data/seed.json        Canonical supplied data
public/               Local mascot asset
specs/                Supplied project specifications
```

See `ACCEPTANCE_REPORT.md` for the completed checklist, test evidence, and verification limits.
