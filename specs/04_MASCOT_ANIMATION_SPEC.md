# Miyo Mascot and Animation Specification

## 1. Asset

Use:

`assets/miyo-mascot.png`

This is the canonical mascot image for the demo.

The mascot is a round purple creature with orange horns, large expressive eyes, small fangs, pink cheeks, and a waving arm.

## 2. Character personality

Miyo should feel:

- helpful
- energetic when needed
- calm most of the time
- reassuring
- slightly playful
- competent

It should NOT feel:

- childish
- noisy
- hyperactive
- like a game character taking over a productivity tool

Think of the mascot as a visual assistant, not the center of every screen.

## 3. Where Miyo appears

### High-value placements

- landing hero
- onboarding welcome
- Catch Me Up loading/reveal
- empty states
- successful completion moments
- focus mode
- urgent notification delivery

### Avoid

Do not place the full mascot in every message row, card, or navigation item.

A small simplified avatar/cropped head can be used sparingly for AI summary labels, but the full character should remain special.

## 4. Signature urgent-notification animation

This animation is essential.

### Trigger

- Focus Mode is active
- user clicks “Simulate urgent message”
- or a scripted demo event fires

### Story

The user is focused. Miyo detects a genuinely urgent message and physically brings it to them.

### Desktop animation sequence

Approximate total duration: 1.1–1.5 seconds.

1. A tiny soft purple pulse appears near the right/lower edge of the screen.
2. The mascot enters from off-screen right or bottom-right.
3. Use horizontal translation plus a light vertical bounce to suggest running.
4. A notification card follows slightly behind the mascot, as though Miyo is pulling it by an invisible tether or carrying it along.
5. The mascot decelerates near the center-right of the viewport.
6. The notification card settles beside/above Miyo with a soft spring.
7. Miyo does one tiny bounce or wave on arrival.
8. Optional subtle glow around the card indicates “urgent” without aggressive flashing.

### Notification example

Sender:
**Maya Chen · Slack**

Message:
> Client moved the Project Atlas demo to 2:30 PM. Can you confirm you’re available in the next 20 minutes?

Miyo summary:
> **Demo moved to 2:30 PM. Maya needs your confirmation soon.**

Buttons:

- Reply
- AI Draft
- Open

### Motion character

The mascot should run in a cute but clean way.

With a static image asset, simulate movement through:

- `x` translation
- slight `y` bounce cycle
- subtle 2–4 degree rotation alternating during movement
- small scale squash/stretch only if tasteful

Do not make the entire UI shake or flash.

## 5. Reduced motion

When `prefers-reduced-motion` is enabled:

- mascot fades/slides in gently
- notification fades in next to it
- no repeated bounce or running cycle

The content must remain understandable without motion.

## 6. Catch Me Up animation

When the user starts Catch Me Up:

1. mascot appears beside a small stack of message cards
2. cards visually reorder/condense
3. status copy cycles once or twice:
   - “Sorting what matters…”
   - “Finding decisions and follow-ups…”
4. transition into the briefing
5. mascot appears with a small success state beside:
   > You’re caught up.

Total wait should feel brief, around 1 second to 1.6 seconds.

## 7. Onboarding behavior

Use the mascot as a guide, not a talking cartoon.

Step 1:

> Hi, I’m Miyo. I’ll help you keep up without keeping everything in your head.

Later onboarding steps may show a small mascot beside helper copy.

## 8. Empty states

Examples:

No urgent items:

> Nothing urgent right now.
> You can keep focusing.

Mascot can be shown relaxed or simply waving using the supplied asset.

No commitments:

> Nothing you owe right now. Nice.

## 9. Success moments

When a user finishes all urgent items or completes the final due commitment:

- tiny mascot pop-in
- no confetti explosion
- optional small sparkle particles

Copy:
> You’re clear for now.

## 10. Landing page mascot use

The mascot should support the product rather than dominate the hero.

Good options:

- mascot peeking from behind the dashboard mockup
- mascot carrying a small priority card
- mascot standing beside the phrase “You’re caught up.”

Avoid making the landing page look like a children's educational product.
