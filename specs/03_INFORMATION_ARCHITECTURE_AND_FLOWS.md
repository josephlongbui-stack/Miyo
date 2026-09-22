# Miyo Information Architecture and UX Flows

## 1. Route map

Recommended route structure:

- `/` — Landing page
- `/app` — redirect to dashboard
- `/app/onboarding`
- `/app/dashboard`
- `/app/inbox`
- `/app/projects`
- `/app/projects/project-atlas`
- `/app/catch-up`
- `/app/commitments`
- `/app/briefings`
- `/app/actions`
- `/app/focus`
- `/app/settings`

Alternative route naming is acceptable as long as navigation is clear and all screens exist.

## 2. Landing page

### Hero

Headline:
> Only what matters. When it matters.

Subhead:
> Miyo brings Gmail, Outlook, and Slack into one calm workspace, then tells you what needs your attention, what changed, and what you can safely ignore.

Primary CTA:
> Try the demo

Secondary CTA:
> See how it works

Hero visual:

A layered dashboard preview showing:

- Urgent message
- Catch Me Up card
- Project Atlas linked across Gmail + Slack + Outlook
- mascot positioned subtly near the interface

### Problem section

Visualize fragmented communication:

- Gmail card
- Outlook card
- Slack card
- arrows/noise

Then show Miyo reducing that into:

- 2 urgent
- 5 important
- 7 need replies
- 41 safely deferred

### How it works

Three steps:

1. Connect your communication
2. Miyo understands what matters
3. You get a calm, prioritized view

### Signature feature sections

- Cross-platform projects
- Catch Me Up
- Commitments
- Focus Mode
- Briefings

### Final CTA

> Stop checking everything.
> Let Miyo tell you what matters.

Button:
> Open the demo

## 3. Onboarding flow

### Step 1 — Welcome

Mascot visible.

Copy:
> Hi, I’m Miyo. I’ll help you keep up without keeping everything in your head.

Button:
> Get started

### Step 2 — Connect communication

Cards:

- Gmail
- Outlook
- Slack

Each has a Connect button.

Clicking Connect should simulate a short connection/loading state, then change to Connected with a checkmark.

Allow “Connect all” for demo convenience.

### Step 3 — Choose what matters

Select contact examples to mark VIP/High.

Preselected:

- Maya Chen — Manager — VIP
- Daniel Ruiz — Client — High
- Mom — VIP

### Step 4 — Choose focus behavior

Options:

- Allow urgent messages
- Allow VIP contacts
- Enable automatic acknowledgment

### Step 5 — Ready

Copy:
> You’re set. Miyo found 3 things that need your attention.

Button:
> Go to Miyo

## 4. Main Dashboard

### Header

Greeting:
> Good morning, Alex.

Supportive state:
> You have 3 things that need you today. The rest can wait.

Top-right:

- Focus button
- notification/demo control
- profile

### Primary priority panel

Show:

- 2 Urgent
- 5 Important
- 7 Need Reply

Use compact rows/cards rather than giant analytics tiles.

### Catch Me Up card

Copy:
> Away for 3 hours?
> I can summarize 42 new messages in under a minute.

Button:
> Catch me up

Mascot can appear carrying a small stack of message cards.

### Today panel

- 10:30 Client sync
- 2:30 Project Atlas demo
- 5:00 Investor deck due

### Commitments panel

- Send revised deck to Maya — today
- Review pricing model for Daniel — 4 PM
- Sarah owes Q3 numbers — overdue

### Lower priority summary

> 31 messages are safe to review later.

## 5. Unified Inbox

### Controls

Top filters:

- All
- Work
- Personal

Category filters:

- Urgent
- Important
- Needs Reply
- Casual
- Low Priority

Provider filters:

- Gmail
- Outlook
- Slack

Search field.

### Main message list

Use seeded messages from `05_SEED_DATA.json`.

Clicking a message opens a detail drawer or right panel with:

- full original text
- Miyo summary
- extracted actions
- related project
- related commitment
- quick reply / AI Draft buttons

### Quick actions

- Reply
- AI Draft
- Snooze
- Mark Done
- Create Task
- Add to Calendar

## 6. Projects page

Show cards for:

- Project Atlas
- Q4 Launch
- Client Redesign
- Investor Deck

Project Atlas should be visually featured because it demonstrates cross-platform linking.

Card should show provider icons for Gmail + Outlook + Slack.

## 7. Project Atlas view

Header:

> Project Atlas

Provider badges:

- Gmail
- Outlook
- Slack

Summary:
> The client approved the revised concept. Tomorrow’s demo moved to 2:30 PM, and pricing approval is still waiting on you.

Sections:

### Latest state

- Revised concept approved
- Demo moved to 2:30 PM
- Pricing requires user approval by 1:30 PM

### Decisions

- Use Concept B
- Move demo to 2:30 PM

### Open questions

- Can Alex approve final pricing?

### Commitments

- Alex → approve pricing by 1:30 PM
- Maya → send revised deck by 12:00 PM

### Unified activity timeline

Chronological messages from Gmail, Slack, and Outlook, each with provider indicator.

The user should visibly understand that Miyo merged separate conversations into a single project context.

## 8. Catch Me Up

Entry:

A large button or duration selector:

- Last 3 hours
- Today
- Since yesterday
- Since Friday

When activated:

1. mascot/thinking animation
2. short message like “Sorting 42 messages…”
3. reveal briefing

Briefing sections:

### What changed

- Project Atlas demo moved to 2:30 PM
- Concept B was approved

### What needs you

- Approve pricing by 1:30 PM
- Answer Jordan’s launch question
- Confirm tomorrow’s research meeting

### Decisions made

- Marketing will use the revised homepage

### Safe to ignore

- 11 newsletters
- 7 FYI messages
- 5 casual messages

Ending reassurance:
> You’re caught up.

## 9. Commitments

Tabs:

- I Owe
- Owed to Me

Filters:

- Due today
- Upcoming
- Overdue
- Completed

Each row/card:

- person
- commitment text
- due date
- source provider
- linked thread/project
- status
- Complete / Remind / Open conversation

## 10. Briefings

Two large cards/tabs:

### Morning Briefing

- 2 urgent items
- 4 commitments due today
- first meeting at 10:30
- 3 people waiting on you

### Evening Wrap-Up

- 1 important message still unanswered
- 1 commitment due tonight
- 18 items can safely wait until tomorrow
- 6 tasks completed today

## 11. Actions page

Sections:

- Meetings
- Tasks
- Deadlines
- Follow-ups

Cards should allow simulated:

- Add to Calendar
- Add Task
- Mark Done
- Remind Me

After clicking, update state and show a small success toast.

## 12. Focus Mode

Page or modal.

Choose mode:

- Deep Work
- Meeting
- Studying
- Sleeping

Set duration:

- 30 minutes
- 1 hour
- 2 hours
- custom visual option

Allow:

- Urgent messages
- VIP contacts

Auto Reply:

- toggle
- preview text

Primary CTA:
> Start Focus Mode

After enabling:

Show a calm purple focus-state screen/panel:

> Miyo is watching your messages.
> I’ll only interrupt you if something actually needs you.

Provide a demo control:
> Simulate urgent message

That button triggers the mascot delivery animation described in `04_MASCOT_ANIMATION_SPEC.md`.

## 13. Settings

Sections:

### Connected apps

Gmail — Connected
Outlook — Connected
Slack — Connected

### Contact priorities

Table/list with editable priority pills.

### Auto Replies

Configure professional and casual variants.

### Notifications

- Urgent only during focus
- VIP override
- Morning Briefing
- Evening Wrap-Up

### Appearance

- Light theme default
- optional visual toggle may exist but dark theme is not required

## 14. Primary demo journey

The prototype should support this exact journey without dead ends:

Landing page → Try Demo → Dashboard → Catch Me Up → Project Atlas → Commitments → Focus Mode → Simulate urgent message → mascot runs in with alert.

This journey is more important than secondary settings polish.
