# Miyo Demo Acceptance Tests

Codex should use this as a completion checklist.

## Critical — must pass

### Build and navigation

- [ ] `npm install` succeeds.
- [ ] The documented development command runs without runtime errors.
- [ ] The project passes a production build or equivalent TypeScript compilation check.
- [ ] Landing page loads at `/`.
- [ ] App demo is reachable from the landing page.
- [ ] Main navigation links do not lead to broken pages.

### Landing page

- [ ] Hero communicates Miyo within 5 seconds of viewing.
- [ ] Hero includes a high-quality app preview, not only marketing text.
- [ ] Purple/lilac visual identity is obvious.
- [ ] Mascot is integrated without making the page childish.
- [ ] “Try the demo” enters the product.

### Onboarding and connected apps

- [ ] Gmail, Outlook, and Slack each have simulated connect interactions.
- [ ] Connection state visibly changes to Connected.
- [ ] The user can proceed through onboarding.

### Dashboard

- [ ] Dashboard communicates what needs attention today.
- [ ] Urgent, Important, Needs Reply, and low-priority/deferred information are visible.
- [ ] Dashboard contains a prominent Catch Me Up entry point.
- [ ] Dashboard contains commitments or action items.

### Inbox

- [ ] Seeded Gmail, Outlook, and Slack items all appear.
- [ ] Work / Personal / All filter works.
- [ ] Category filters work.
- [ ] Provider filters work.
- [ ] Message cards show simple-language Miyo summaries.
- [ ] At least one message exposes quick actions.

### Cross-platform linking

- [ ] Project Atlas visibly contains Gmail + Outlook + Slack content.
- [ ] The user can see a unified chronological activity feed.
- [ ] Project page includes a current-state summary.
- [ ] Decisions, open questions, and commitments are represented.

### Catch Me Up

- [ ] Catch Me Up has a visible short loading/thinking state.
- [ ] Mascot participates in the experience.
- [ ] Result contains What Changed, What Needs You, and Safe to Ignore.
- [ ] End state includes “You’re caught up.” or equivalent reassurance.

### Commitments

- [ ] Both I Owe and Owed to Me exist.
- [ ] At least one overdue commitment appears.
- [ ] At least one commitment can be marked complete.
- [ ] State visually updates after completion.

### Briefings

- [ ] Morning Briefing exists.
- [ ] Evening Wrap-Up exists.
- [ ] Both use realistic seeded information rather than placeholder lorem ipsum.

### Actions

- [ ] Extracted meeting exists.
- [ ] Extracted task exists.
- [ ] Extracted deadline exists.
- [ ] Clicking at least one action button changes its state and gives feedback.

### Focus Mode

- [ ] User can select a focus mode and duration.
- [ ] Urgent override toggle exists.
- [ ] VIP override toggle exists.
- [ ] Auto Reply toggle exists.
- [ ] Focus mode has a calm active state.
- [ ] “Simulate urgent message” or equivalent demo control exists.

### Mascot urgent delivery

- [ ] Triggering the urgent message makes the mascot enter from off-screen.
- [ ] Movement visually suggests running.
- [ ] Notification card moves with/follows the mascot.
- [ ] Message settles into a readable urgent card.
- [ ] Animation is smooth rather than jarring.
- [ ] Reduced-motion behavior is implemented or gracefully falls back.

### Design

- [ ] Overall interface is predominantly purple/lilac.
- [ ] Cards and layouts feel clean and premium.
- [ ] The product does not look like a children's app.
- [ ] Text hierarchy is clear.
- [ ] Urgent red is used sparingly.
- [ ] Common desktop viewport looks excellent.
- [ ] Mobile viewport does not visibly break.

## Strongly preferred

- [ ] localStorage preserves some demo state across refreshes.
- [ ] Toast feedback is used for completion/add/snooze actions.
- [ ] Inbox search works on seeded messages.
- [ ] Contact priorities are editable.
- [ ] Connected services can be toggled/disconnected in settings.
- [ ] Loading skeletons or polished transitions exist where appropriate.
- [ ] Hover/focus states are refined.
- [ ] Empty states use the mascot thoughtfully.

## Final self-check before stopping

Codex should manually navigate this path:

`Landing → Demo → Dashboard → Catch Me Up → Project Atlas → Commitments → Focus → Simulate Urgent Message`

If any part of that path is broken, incomplete, or visually unfinished, continue fixing it before considering the task complete.
