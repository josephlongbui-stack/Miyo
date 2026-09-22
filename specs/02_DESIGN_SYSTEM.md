# Miyo Design System

## 1. Visual personality

Miyo should feel like a premium productivity product that happens to have a cute assistant.

Keywords:

- calm
- polished
- soft
- intelligent
- modern
- airy
- reassuring
- subtly playful

Avoid:

- children's-app aesthetics
- excessive cartoon decoration
- neon overload
- heavy gradients everywhere
- dense enterprise dashboards
- cluttered unread-count anxiety
- aggressive red alert UI

“Stripe-level polish” means refined spacing, typography, motion, and detail. Do not reproduce Stripe's layouts or brand identity.

## 2. Core palette

The palette is inspired by the supplied mascot and a premium purple/lilac SaaS aesthetic.

### Primary

- `miyo-700`: **#6E2BD9** — deep purple for strong emphasis
- `miyo-600`: **#7C3AED** — primary action purple
- `miyo-500`: **#9A40E6** — mascot-derived vivid purple
- `miyo-400`: **#B56CF2** — soft active/hover purple
- `miyo-300`: **#C584F9** — lilac highlight
- `miyo-200`: **#DCC2FB** — gentle border/background purple
- `miyo-100`: **#F0E8FF** — tinted surfaces
- `miyo-50`: **#F8F5FF** — page background tint

### Neutrals

- `ink-950`: **#1D1528** — main text
- `ink-700`: **#51465F** — secondary text
- `ink-500`: **#7D728A** — tertiary metadata
- `line`: **#E9E4EF** — subtle border
- `surface`: **#FFFFFF**
- `canvas`: **#FBFAFD**

### Accents

Derived in part from the mascot:

- `pink`: **#F1459E**
- `pink-soft`: **#F88AC0**
- `amber`: **#FDB039**
- `amber-soft`: **#FFF1CC**
- `urgent`: **#E54867**
- `urgent-soft`: **#FDECEF**
- `success`: **#2F9E75**
- `success-soft`: **#EAF8F2**

### Category usage

- Urgent: urgent red/coral used sparingly
- Important: amber
- Needs Reply: primary purple
- Casual: soft lilac/blue-purple
- Low Priority: neutral gray-lilac

The interface should still read as predominantly purple/lilac.

## 3. Backgrounds

Default app canvas:

- off-white `#FBFAFD`
- optionally use very subtle radial purple/lilac glow behind major hero areas

Cards should primarily be white with low-contrast borders and soft shadows.

Avoid opaque dark-purple blocks unless used for a singular high-impact hero or focus-mode moment.

## 4. Typography

Use a modern sans-serif available through the project stack. Preferred direction:

- Geist
- Inter
- or another clean contemporary sans-serif

Hierarchy:

- Hero: 56–72px desktop, tight line height
- Page title: 30–36px
- Section title: 20–24px
- Card title: 15–17px semibold
- Body: 14–16px
- Metadata: 12–13px

Use sentence case. Avoid ALL CAPS except tiny provider/category micro-labels when aesthetically appropriate.

## 5. Layout

Desktop-first app shell:

- left navigation: 224–248px
- main content max width: ~1280–1400px depending on page
- optional right context panel on inbox/thread screens: 300–360px
- comfortable gutters: 24–32px

Landing page max-width sections:

- 1160–1280px

Spacing system:

- 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

## 6. Radius and shadows

Use rounded but not toy-like geometry.

Recommended:

- buttons: 10–12px
- cards: 16–20px
- large panels: 24px
- pills: full radius

Shadow direction:

- soft, large blur
- low opacity
- combine with 1px borders

Example feel:

`0 8px 30px rgba(57, 33, 82, 0.07)`

## 7. Buttons

Primary:

- purple fill
- white text
- subtle hover lift/lighten

Secondary:

- white surface
- soft purple border
- dark text

Tertiary:

- ghost button
- purple/dark text

Destructive/urgent interactions should not dominate the visual system.

## 8. Navigation

Left navigation should include:

- Miyo logo/name + small mascot mark
- Home
- Inbox
- Catch Me Up
- Projects
- Commitments
- Briefings
- Actions
- Focus
- Settings

At the bottom:

- connected account avatars/icons
- demo user profile

Active nav uses a soft lilac capsule background, not a giant solid purple block.

## 9. Message cards

Each message card should be highly scannable.

Recommended anatomy:

- sender avatar
- sender name
- provider badge/icon
- time
- subject/channel
- 1-line Miyo summary emphasized
- short original preview muted
- category chip
- work/personal chip if useful
- quick actions on hover or expanded state

Unread should be indicated with subtle weight/dot, not heavy background color.

## 10. Summary cards

Miyo summaries are a signature pattern.

Use:

- small mascot icon or sparkle mark
- label: “In simple terms”
- concise one- or two-sentence output
- optional action/deadline chips underneath

They should look calmer than the original message.

## 11. Dashboard cards

Avoid a traditional analytics dashboard feel.

Instead of giant KPI boxes, use an assistant-like hierarchy:

1. reassuring greeting
2. one-line state: “You have 3 things that need you today.”
3. urgent/important summary
4. Catch Me Up card
5. commitments/actions
6. lower-priority overview

Counts are useful, but they should support the narrative rather than dominate it.

## 12. Mascot usage

See `04_MASCOT_ANIMATION_SPEC.md`.

The mascot should never appear in every card. It should feel like a companion that appears at meaningful moments.

## 13. Motion

Motion should be quick and smooth.

Typical durations:

- micro interaction: 120–180ms
- card enter/exit: 180–260ms
- page/section transitions: 250–400ms
- Catch Me Up thinking sequence: ~900–1600ms
- urgent mascot delivery: ~1000–1500ms total

Use spring motion sparingly for friendly character animation.

Respect `prefers-reduced-motion` and provide a simpler fade/slide alternative.

## 14. Accessibility

- Maintain WCAG-readable contrast for body text and buttons.
- Do not use color as the only category indicator; pair with labels/icons.
- Focus states should be clearly visible.
- Keyboard navigation should work for major controls.
- Provide alt text for the mascot and meaningful images.
- Urgent states should remain understandable without animation.

## 15. Responsive behavior

Desktop is primary.

Tablet:

- collapse right-side panels into drawers
- narrow sidebar or icon navigation

Mobile:

- bottom navigation or compact drawer
- cards become full-width
- filters become horizontally scrollable pills
- mascot notification enters from lower edge rather than full side-run

The demo does not need a separate mobile design system, but should not break at common mobile widths.
