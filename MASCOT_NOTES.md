# Miyo mascot update

The active mascot is `public/miyo-mascot-selected.png` (1254 × 1254), copied unchanged from the user-selected `ChatGPT Image Sep 21, 2026 at 10_35_37 PM.png`. It is used for the logo, favicon, onboarding, dashboard, Catch Me Up, empty states, Focus Mode, and urgent delivery.

No image generation or image editing was used for this replacement. CSS blends the image’s white background into the app. The originally supplied asset (`miyo-mascot.png`) and the earlier simplified exploration (`miyo-mascot-minimal.png`) are preserved but are not the active artwork.

## Animation

- Logo: a short greeting tilt on appearance, repeating after a quiet 15-second pause; hover/tap reactions.
- Default mascot: a slow three-pixel bob and one-degree tilt.
- Onboarding and introduction: a brief greeting with a long pause between repetitions.
- Catch Me Up: a small thinking motion, then a short celebration on reveal.
- Focus: gentle six-second breathing movement.
- Urgent delivery: retains the off-screen entrance, running bounce, and staggered notification card. Idle movement is disabled inside this animation to avoid doubled transforms.
- Off-screen mascots stop animating. Reduced-motion preferences disable mascot movement; the urgent card uses its existing fade fallback.

Verified the changed transform values in the running dashboard, the success animation state after Catch Me Up, and the urgent delivery in the browser. The previous simplified version was checked at 319 pixels. The selected replacement was checked in the dashboard and urgent delivery; its local file hash matches the upload. Production build passed. Reduced-motion behavior was reviewed in source; the operating system preference was not changed.

## Archived prompt for the earlier simplified exploration

This prompt produced `miyo-mascot-minimal.png` using built-in image generation. It does not describe the currently selected artwork.

Use case: style-transfer. Edit target: the attached Miyo purple mascot. Create ONE polished, minimalist flat mascot asset for the existing Miyo calm productivity web app. Preserve the recognizable round purple friendly creature, two tiny warm pale-gold horns, little feet, and one raised greeting arm. Simplify strongly: smooth rounded silhouette, one tiny simple head tuft at most, two small dark-purple oval dot eyes (no big white eyeballs or iris rings), one very small curved closed smile, NO fangs, NO eyebrows, NO pink cheeks, NO tongue, NO belly patch, NO gradients, NO glossy texture, NO shadows, NO outline clutter. Use essentially one soft medium violet body color around #9B72E6, deep-purple eyes/mouth, and subtle pale-gold horns. Arms are simple smooth flippers/mitten shapes with no separate fingers. Minimal contemporary flat vector-like brand illustration, professional friendly and quiet, recognizable at 32 pixels. Keep the full figure centered in a square image, front-facing, with 8% breathing room at the edges. Actual transparent background with alpha, no white rectangle, no checkerboard baked into the image, no ground plane, no text or wordmark, no extra objects. This should be a simpler evolution of the supplied mascot, not a different animal.
