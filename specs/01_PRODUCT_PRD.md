# Miyo Product Requirements Document

## 1. Product summary

**Miyo** is an AI attention manager for communication. It is designed for people who receive more messages than they can comfortably process: busy professionals, founders, office workers, knowledge workers, and students.

Instead of asking users to inspect Gmail, Outlook, Slack, and other communication channels separately, Miyo creates one calm layer that answers three questions:

1. **What matters right now?**
2. **What changed while I was away?**
3. **What do I need to do next?**

The demo connects to three simulated services:

- Gmail
- Outlook
- Slack

The prototype should make those integrations feel believable, even though all data is mocked.

## 2. Problem

Modern communication tools optimize their own inboxes and notifications. They do not optimize the user's overall attention.

A person can simultaneously have:

- a time-sensitive client email in Gmail
- a project decision buried in Slack
- a meeting change in Outlook
- low-value newsletters
- casual friend messages
- tasks and commitments hidden inside ordinary prose

The user has to mentally decide what matters, remember promises, connect fragmented conversations, and repeatedly check multiple apps.

Miyo externalizes that mental work.

## 3. Product thesis

Communication contains structure that messaging tools leave trapped inside text.

Miyo identifies and organizes that structure:

- urgency
- importance
- sender priority
- topic/project
- decisions
- questions
- commitments
- deadlines
- meetings
- tasks
- whether a response is required

The result is not merely a unified inbox. It is a structured representation of the user's communication obligations and attention.

## 4. Primary audience

### Busy professionals

Examples:

- startup founder
- consultant
- project manager
- researcher
- executive
- office worker

They often receive high message volume, use multiple channels, and risk missing commitments or time-sensitive changes.

### Students

Examples:

- college student balancing classes, clubs, research, and recruiting
- graduate student coordinating professors and research teams

The visual personality should be friendly enough for students but polished enough for professional use.

## 5. Emotional goal

Miyo should make the user feel **less overwhelmed**.

The desired response is:

> “I know what matters. I don't need to check everything.”

The app should avoid anxiety-inducing patterns such as excessive red badges, giant unread counts, or dense walls of text.

## 6. Classification model shown in the demo

Every communication can contain multiple attributes, but the primary attention category is one of:

### Urgent
Requires attention soon because of time sensitivity, blocking dependency, deadline proximity, or meaningful consequence.

Example:
> “The client moved the demo to 2:30 PM. Can you confirm in the next 20 minutes?”

### Important
Meaningful information that matters but does not require immediate interruption.

Example:
> “The launch date has moved to October 12.”

### Needs Reply
A person is waiting for an answer, but the message is not necessarily urgent.

Example:
> “Which of these two designs do you prefer?”

### Casual
Normal low-stakes personal conversation.

Example:
> “Dinner at 7?”

### Low Priority
Information that is safe to review later or ignore.

Example:
> newsletter, promo, meme, broad FYI message

## 7. Sender priority

Contact priority is independent from message priority.

Tiers:

- **VIP** — people who should receive elevated attention
- **High** — important recurring contacts
- **Normal** — default
- **Low** — senders unlikely to deserve interruption

Important product principle:

A VIP sender saying “Thanks!” should not automatically trigger an urgent notification, while a Normal contact communicating a genuine deadline may still become Urgent.

## 8. Work vs Personal

Users can view:

- All
- Work
- Personal

The demo should show both professional and casual communication while keeping the product work-oriented.

Examples:

**Work:** client email, project Slack, meeting changes, professor/research communication

**Personal:** personal Gmail, friends Slack workspace, dinner planning, casual message, meme link

## 9. Signature features

### 9.1 Unified attention inbox

A single feed across Gmail, Outlook, and Slack.

Each card should show:

- sender
- provider
- account/workspace
- timestamp
- subject/title or channel
- brief original-message preview
- Miyo summary
- attention category
- work/personal label
- needs-response indicator
- extracted due time if relevant
- quick actions

### 9.2 Cross-platform thread linking

Miyo recognizes when discussions in separate tools refer to the same underlying project.

Signature example: **Project Atlas**

The same project appears in:

- Gmail client thread
- Slack #project-atlas
- Outlook scheduling message

Miyo links these into one project page.

The page should show:

- plain-language project summary
- latest state
- key decisions
- people involved
- open questions
- commitments
- extracted tasks
- chronological activity from all platforms

This is one of Miyo's most distinctive demo features.

### 9.3 Commitment tracking

Miyo extracts statements such as:

- “I'll send that by Friday.”
- “I'll get back to you tomorrow.”
- “Can you review this before 4?”

Two views:

**I Owe** — commitments the user made to other people

**Owed to Me** — commitments other people made to the user

Each item should include:

- person
- commitment
- due date/time
- status
- source
- linked conversation/project

### 9.4 Catch Me Up

A user returns after a meeting, class, sick day, or vacation and presses one button.

The output should answer:

- What decisions were made?
- What changed?
- What needs my response?
- What deadlines are approaching?
- What can I safely ignore?

It should feel like a briefing from a highly competent assistant, not a generic summary.

### 9.5 Morning and Evening Briefings

**Morning Briefing**

- urgent today
- upcoming meetings
- commitments due
- people waiting on the user
- meaningful overnight changes

**Evening Wrap-Up**

- unresolved important messages
- commitments still due
- items safe to defer
- what was completed

### 9.6 Action extraction

Miyo identifies:

- meeting requests
- deadlines
- tasks
- requests for approval
- follow-up reminders

Actions can be simulated with buttons:

- Add to Calendar
- Create Task
- Remind Me
- Reply
- Mark Done

### 9.7 Focus Mode

Modes:

- Deep Work
- Meeting
- Studying
- Sleeping

Focus Mode suppresses normal message visibility and only lets qualifying messages break through.

Settings can define:

- allow Urgent
- allow VIP contacts
- enable auto-reply
- end time

### 9.8 Auto-replies

When Focus Mode is active, Miyo can simulate an automatic acknowledgment.

Examples:

Professional:
> “I’m in focus mode until 4:00 PM. I’ll review this afterward.”

Casual:
> “Busy right now — I’ll get back to you later.”

The demo should let the user toggle this behavior and preview the message.

## 10. AI summaries

Summaries should be written in simple language.

Bad:
> “The sender is notifying the recipient of a modification to the previously scheduled event.”

Good:
> “The client moved tomorrow’s meeting from 3:00 PM to 2:30 PM.”

Whenever possible, summaries should foreground:

1. what changed
2. what the user needs to do
3. by when

## 11. Landing page positioning

Miyo should not primarily market itself as “all your messages in one app.”

Preferred positioning:

> **Only what matters. When it matters.**

Supporting line:

> Miyo brings Gmail, Outlook, and Slack into one calm workspace, then tells you what needs your attention, what changed, and what you can safely ignore.

Secondary positioning:

> **An inbox for your attention.**

## 12. Demo scope boundaries

The prototype DOES need:

- believable connection flows
- seeded data
- realistic interactions
- responsive layout
- smooth motion
- coherent state changes

The prototype DOES NOT need:

- real OAuth
- real message sending
- real LLM calls
- production security
- persistent cloud database
- background workers
- push notification infrastructure

All “AI” outputs can be deterministic mock data for the demo.
