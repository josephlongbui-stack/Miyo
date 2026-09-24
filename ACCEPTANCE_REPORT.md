# Miyo demo — acceptance report

All critical criteria below were checked against the completed local demo. Interactive testing used the in-app browser, with desktop and narrow viewport inspection.

## Critical — must pass

### Build and navigation

- [x] `npm install` succeeds.
- [x] The documented development command runs without runtime errors.
- [x] The project passes a production build or equivalent TypeScript compilation check.
- [x] Landing page loads at `/`.
- [x] App demo is reachable from the landing page.
- [x] Main navigation links do not lead to broken pages.

### Landing page

- [x] Hero communicates Miyo within 5 seconds of viewing.
- [x] Hero includes a high-quality app preview, not only marketing text.
- [x] Purple/lilac visual identity is obvious.
- [x] Mascot is integrated without making the page childish.
- [x] “Try the demo” enters the product.

### Onboarding and connected apps

- [x] Gmail, Outlook, and Slack each have simulated connect interactions.
- [x] Connection state visibly changes to Connected.
- [x] The user can proceed through onboarding.

### Dashboard

- [x] Dashboard communicates what needs attention today.
- [x] Urgent, Important, Needs Reply, and low-priority/deferred information are visible.
- [x] Dashboard contains a prominent Catch Me Up entry point.
- [x] Dashboard contains commitments or action items.

### Inbox

- [x] Seeded Gmail, Outlook, and Slack items all appear.
- [x] Work / Personal / All filter works.
- [x] Category filters work.
- [x] Provider filters work.
- [x] Message cards show simple-language Miyo summaries.
- [x] At least one message exposes quick actions.

### Cross-platform linking

- [x] Project Atlas visibly contains Gmail + Outlook + Slack content.
- [x] The user can see a unified chronological activity feed.
- [x] Project page includes a current-state summary.
- [x] Decisions, open questions, and commitments are represented.

### Catch Me Up

- [x] Catch Me Up has a visible short loading/thinking state.
- [x] Mascot participates in the experience.
- [x] Result contains What Changed, What Needs You, and Safe to Ignore.
- [x] End state includes “You’re caught up.” or equivalent reassurance.

### Commitments

- [x] Both I Owe and Owed to Me exist.
- [x] At least one overdue commitment appears.
- [x] At least one commitment can be marked complete.
- [x] State visually updates after completion.

### Briefings

- [x] Morning Briefing exists.
- [x] Evening Wrap-Up exists.
- [x] Both use realistic seeded information rather than placeholder lorem ipsum.

### Actions

- [x] Extracted meeting exists.
- [x] Extracted task exists.
- [x] Extracted deadline exists.
- [x] Clicking at least one action button changes its state and gives feedback.

### Focus Mode

- [x] User can select a focus mode and duration.
- [x] Urgent override toggle exists.
- [x] VIP override toggle exists.
- [x] Auto Reply toggle exists.
- [x] Focus mode has a calm active state.
- [x] “Simulate urgent message” or equivalent demo control exists.

### Mascot urgent delivery

- [x] Triggering the urgent message makes the mascot enter from off-screen.
- [x] Movement visually suggests running.
- [x] Notification card moves with/follows the mascot.
- [x] Message settles into a readable urgent card.
- [x] Animation is smooth rather than jarring.
- [x] Reduced-motion behavior is implemented or gracefully falls back.

### Design

- [x] Overall interface is predominantly purple/lilac.
- [x] Cards and layouts feel clean and premium.
- [x] The product does not look like a children's app.
- [x] Text hierarchy is clear.
- [x] Urgent red is used sparingly.
- [x] Common desktop viewport looks excellent.
- [x] Mobile viewport does not visibly break.

## Strongly preferred

- [x] localStorage preserves some demo state across refreshes.
- [x] Toast feedback is used for completion/add/snooze actions.
- [x] Inbox search works on seeded messages.
- [x] Contact priorities are editable.
- [x] Connected services can be toggled/disconnected in settings.
- [x] Loading skeletons or polished transitions exist where appropriate.
- [x] Hover/focus states are refined.
- [x] Empty states use the mascot thoughtfully.

## Final self-check before stopping

Completed the primary journey in the browser:

`Landing → Demo → Dashboard → Catch Me Up → Project Atlas → Commitments → Focus → Simulate Urgent Message`

The journey completed, including the settled urgent card and its AI Draft / simulated reply flow.


## Verification evidence

- `npm install` succeeded; the dependency audit reported zero vulnerabilities at install time.
- `npm run typecheck` passed with no errors.
- `npm run build` passed, including compilation, TypeScript, and route generation.
- All 16 requested/implemented route checks returned HTTP 200 (including the `/app` redirect). An unknown app route returned the intended 404.
- The unmodified inbox displayed 13 seeded messages: Work 10 / Personal 3; Gmail 5 / Outlook 3 / Slack 5. Category filtering returned Urgent 2 / Important 4 / Needs Reply 2 / Casual 2 / Low Priority 3. Searching “research” returned the research meeting.
- Snoozing dinner moved it into Snoozed; Restore returned it to Active. Marking the newsletter done moved it into Done.
- Catch Me Up visibly entered its sorting state and revealed the supplied summary and Atlas links.
- Atlas showed the four source messages in chronological order: 10:36 Slack, 11:44 Gmail, 12:51 Outlook, 12:58 Slack.
- Completing pricing moved the commitment to Completed, completed the linked action, and changed the Atlas summary to “Alex has approved final pricing.”
- Owed to Me displayed Sarah’s overdue Q3 numbers and her revised promised time, plus Maya’s deck commitment.
- Add to Calendar updated the extracted meeting to Added and exposed Mark Done.
- Both Morning Briefing and Evening Wrap-Up rendered their supplied content.
- All onboarding steps completed. Individual Gmail, Outlook, and Slack connections showed Connecting before Connected; Connect all connected all five accounts.
- Changing Jordan’s priority to High survived a page reload. Reply templates and switches changed state. Disconnecting Personal Gmail left only Liam’s Slack message in the Personal inbox.
- The signature urgent animation was triggered and replayed on desktop and mobile. Its final card remained readable, dismissible, and actionable. The AI draft matched the supplied Maya reply; sending it produced a visible local demo reply.
- A custom 45-minute focus session started correctly. Disabling both overrides held Maya’s message; enabling VIP allowed it through. Disabling Auto Reply suppressed the simulated acknowledgment.
- Desktop presentation was inspected at 1440×1000. Responsive checks covered 390×844 and 319×774. Measured document width matched the viewport width on the inspected narrow app pages. A narrow inbox toolbar clipping issue was corrected.
- The original mascot and canonical seed were hash-checked against the bundle and are unchanged. The mascot is now the shared brand mark and favicon as requested.
- Runtime browser logs contained no application errors during the exercised journey. A Next.js smooth-scroll warning was fixed. Development hot reloads temporarily reloaded the preview; the healthy preview was restored.
- Both optional WebMCP tools registered. Completing a valid commitment changed the same app state; an invalid ID was rejected without corrupting state.

## Verification limits

- This is a deterministic local prototype; no real external integrations, deliveries, scheduled jobs, or model outputs were tested or implemented.
- The reduced-motion branches were verified in source (`useReducedMotion` and the CSS media query). The operating system accessibility setting was not changed during testing.
- Aggregate briefing/dashboard counts describe the supplied scenario; the detailed inbox intentionally contains the 13 representative records in the canonical seed.


## Minimal design revision

- Reworked the dashboard into a sequence of Catch Me Up, attention, commitments, and projects; removed duplicate supporting cards.
- Grouped navigation into Daily and Organize; reduced decorative labels, gradients, shadows, and repeated message metadata.
- Simplified app page titles and exposed secondary inbox filters on demand.
- Checked desktop presentation and 390/319 px mobile layouts. Corrected Catch Me Up card wrapping, commitment controls, briefing tabs, and connected-account rows.
- Verified inbox filtering, Catch Me Up → Project Atlas navigation, and the Focus urgent-delivery animation after the restyle.
- All inspected narrow pages (dashboard, inbox, projects, commitments, actions, briefings, Catch Me Up, Focus, settings, and landing) fit their viewport without horizontal overflow.
- The revised production build and TypeScript checks passed; no application errors appeared in browser logs.


## People & places priority revision

- Added editable inbox/workspace/channel priority preferences alongside contacts, with automatic local persistence and an expandable live inbox-order preview.
- Verified that making Jordan VIP moves his conversation above lower-priority contacts while urgent messages remain first.
- Verified #q4-launch High and Friends Slack Low survive reload. In the actual Needs Reply inbox view, the promoted Q4 message appears above the research check-in.
- Behavior checks passed for contact ordering, workspace inheritance, explicit channel overrides, low priority, person/place conflicts, urgent-first ordering, and unchanged seed order.
- Existing saved state loaded successfully with the new defaults. Temporary UI test preferences were restored.
- Inspected desktop and 319px layouts; no horizontal overflow or browser application errors. Production build and TypeScript checks passed.


## Simplified animated mascot revision

- Replaced the active mascot/logo/favicon with a simplified transparent local asset, preserving the original source image.
- Added shared Framer Motion moods and visible logo greeting motion. Existing Catch Me Up and urgent delivery flows still work.
- Observed changing idle transforms in the browser and the celebrate state after Catch Me Up. Triggered and inspected the new mascot delivering the Atlas alert.
- Verified 319px onboarding layout without horizontal overflow and no application errors during the exercised flows.
- Build and TypeScript passed. Reduced-motion handling was source-reviewed; no operating system preference was changed.


## User-selected mascot replacement

- Active logo, favicon, and shared mascot now use the exact newly uploaded artwork (`public/miyo-mascot-selected.png`). SHA-256 matches the source upload.
- Greeting, idle, thinking, celebration, Focus breathing, and running delivery motion remain enabled, with reduced-motion handling preserved.
- Observed changing idle transform values and exercised the urgent-message delivery with the selected asset in the browser. No application errors appeared.
- Production build and TypeScript passed.

## Localhost startup diagnosis — September 21, 2026

- The reported connection failure was not reproducible on a fresh request: an existing Miyo server responded on `http://127.0.0.1:3000`. An older in-app browser tab still showed a connection-refused page.
- Reproduced a startup conflict: launching a second copy tried port 3001, then exited because this same project already had a running Next.js development server. A different port does not bypass Next.js's per-project lock.
- Gracefully stopped the old Miyo development process and started a fresh instance with `npm run dev -- --port 3000`. Next.js reported ready in 171 ms. The server remains running on port 3000.
- Confirmed npm via `package-lock.json`; `npm ls --depth=0` found no missing dependencies. The existing development script, imports, routes, and configuration did not require application code changes.
- Fresh `npm run build` and `npm run typecheck` both passed. The fresh development log contained no application errors during testing.
- HTTP 200 for `/`, `/app`, `/app/dashboard`, `/app/catch-up`, `/app/projects/project-atlas`, `/app/commitments`, `/app/focus`, and the selected mascot asset. All 17 local Next.js assets referenced by the landing page returned HTTP 200.
- Loaded the landing page in native Safari and Chrome. In Chrome, clicked through dashboard → Catch Me Up processing and completed briefing → Project Atlas → commitments (both directions) → Focus Mode → simulated urgent notification. Ended the test Focus session afterward.
- Updated README startup instructions to explain keeping the terminal running, using the printed HTTP URL, and handling an already-running server separately from a port occupied by another application.

## Vercel deployment preparation

- Declared Node.js `24.x` in `package.json` and synchronized `package-lock.json`. Changed the production script to the standard `next start`, removing the hard-coded loopback binding. Local development remains restricted to loopback intentionally.
- Fixed catch-all routing so unexpected extra URL segments render a real 404 instead of silently showing an unrelated valid page.
- The final app's `npm run build` and `npm run typecheck` both exited successfully.
- Copied the source into a fresh directory without `node_modules`, `.next`, or TypeScript caches. `npm ci` succeeded and reported zero vulnerabilities. A fresh `npm run build` passed there with an environment containing only operating-system `PATH`, `HOME`, and `TMPDIR`; no application environment variables or `.env` files were present.
- Started that clean production build with `npm start` on a separate test port. All 16 base routes and 28 route/query combinations returned HTTP 200, including onboarding, all four project details, inbox category filters, commitment directions, and every settings tab. `/app` returned the expected 307 redirect to `/app/dashboard`.
- Six invalid-route cases returned HTTP 404 and the custom not-found page, including invalid projects and extra URL segments.
- All 72 discovered production assets returned HTTP 200, including bundled JavaScript, CSS, fonts, every mascot image, and both favicon assets. Served mascot PNG hashes matched the local source files.
- All seven production file traces resolved without missing files or dependencies outside the project. The lockfile contains no linked, filesystem, or localhost dependencies. Application source contains no network calls, environment-variable reads, or hard-coded local backend URLs.
- In the production browser, inspected every page route and found no broken images. Tested Catch Me Up completion → Project Atlas → commitments; completed a commitment and verified its completed state. Started Focus, triggered the urgent Atlas delivery, inspected the selected mascot, and ended the Focus session. Browser warning/error logs were empty.
- Added `VERCEL_DEPLOYMENT.md` with the Next.js preset, root directory, `npm ci`, `npm run build`, Node 24, default output directory, and no environment variables. Updated the portable source archive.
- These checks validate the source and local production runtime. No live Vercel deployment was created or tested during preparation.

## Dashboard completion feedback follow-up

- Reproduced and fixed the dashboard's singular attention text: one remaining item now reads “1 thing needs you today.”
- Completed dashboard commitments now expose “Reopen” as their accessible button label; reopening restores “Complete.”
- Verified both transitions in the running browser and reopened the two test commitments afterward.
- `npm run build` and `npm run typecheck` passed. The initial sandboxed build stalled during compilation; rerunning outside the sandbox completed successfully.

## Ask Miyo — September 22, 2026

- Added `/app/ask` within the existing route architecture, a main navigation item, a top-bar entry with ⌘ K / Ctrl K, and contextual links on project, commitment, contact-priority, and Catch Me Up screens. Existing page implementations and the canonical seed remain in place.
- Built a normalized knowledge/source model and replaceable `askMiyo` service. The default engine uses local intent/entity/text retrieval and grounded structured answers; it requires no API keys, environment variables, external database, or network service.
- `npm run test:ask`: **25 tests passed**, covering every required sample question plus context changes, missing records/false premises, current completion and priority state, revised deadlines, meeting times, source integrity, and the service adapter.
- Submitted **all 15 required questions in the development browser**. Each produced a meaningful cited answer, including explicit coverage explanations for the absent James record and Sarah meeting time. No unsupported example data was substituted for the supplied seed.
- Completed `Dashboard → Ask Miyo → Atlas summary → What am I responsible for? → Sarah meeting preparation → source message`. Verified project context on the responsibility follow-up and replacement by Sarah context on the named-person question. Repeated the Ask Miyo journey against the production build.
- Clicked Gmail, Outlook, and Slack citations and inspected the correct original-message dialogs. A commitment-record citation opened the **Owed to Me** tab. Atlas's contextual Ask link submitted its question automatically; the global keyboard shortcut opened Ask Miyo and focused its input when already on that route.
- Restored all 15 conversation turns after a browser refresh. New conversation cleared the questions and context. Completing Sarah's overdue commitment updated its card and removed it from the next overdue answer; reopening restored the shared commitment record. Temporary development-test completion was reverted.
- Completed an extracted Atlas confirmation action from an Ask answer in the production browser. Its card changed to Completed and the next responsibility answer omitted that action and its handled message.
- Inspected desktop at **1280×900**, and narrow layouts at **390×844** and **319×774**. Suggestion cards, answers, collapsed context, and the sticky input fit without horizontal overflow. Submitted a question with Enter and opened its Slack source on the 319px layout. The input remained within the viewport.
- `npm run build` and `npm run typecheck` both passed after the final application changes. The optimized production app started on a separate test port successfully.
- Production HTTP checks passed for **17 base routes** (including the expected `/app` redirect) and three contextual query URLs. Three invalid routes, including `/app/ask/invalid`, returned the intended 404. All **17 HTML-referenced/public assets** tested returned 200; served mascot hashes matched the local files.
- In the production browser, checked landing, dashboard, inbox, Catch Me Up, projects, Atlas, commitments, actions, briefings, Focus, settings, and onboarding. Each rendered its expected heading without broken loaded images. Browser warning/error logs were empty during the exercised journeys.
- The package lock contains no local-file, linked, or localhost dependencies. Ask Miyo has no fetch calls, application environment-variable reads, or hard-coded backend URL. It uses the existing Vercel-compatible build configuration. No live Vercel deployment was created or tested.
- Added `ASK_MIYO.md` with architecture, demo boundaries, source behavior, test commands, and the future server-side LLM/RAG adapter seam. Updated README, Vercel documentation, and the portable source ZIP.
