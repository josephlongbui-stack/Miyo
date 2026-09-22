# Clean project verification

This package is an export of the existing Miyo application, not a rebuild or redesign. Application source, styles, mascot assets, and demo data match the existing project byte for byte.

## Verified from a clean source copy

- `npm install`: passed; npm reported zero vulnerabilities.
- `npm run build`: passed with no application environment variables present.
- `npm run typecheck`: passed.
- 15 production pages returned HTTP 200: landing, dashboard, inbox, Catch Me Up, commitments, Focus, projects, all four project detail pages, actions, briefings, settings, and onboarding.
- `/app` returned HTTP 307 to `/app/dashboard`.
- Three invalid-route checks returned HTTP 404.
- All 72 bundled JavaScript, CSS, and font files returned HTTP 200 and matched their build files. Every public image and favicon was served successfully and matched the packaged asset bytes.
- All seven production dependency traces resolved entirely within the clean project, with no missing files.
- Browser walkthrough: landing → dashboard → Catch Me Up processing and completion → Project Atlas cross-platform thread → commitments → Focus → urgent mascot delivery → AI Draft. The delivered card and mascot rendered correctly; the Focus session was ended after testing.
- Mascot images loaded; changing animation transforms were observed during Focus and the urgent running delivery. The urgent notification settled into a readable card. Reduced-motion handling remains preserved in the unchanged source.
- No browser warning or error logs appeared during the walkthrough.
- All 13 canonical mock messages and the rest of the seed data are included.
- Source scan found no embedded credentials, private environment files, absolute user paths, symlinks, or local filesystem package dependencies.

## Archive layout and exclusions

`package.json` is directly at the ZIP root. Extract into a folder named `miyo-demo`, then upload its contents to the GitHub repository root, including `.gitignore`.

Excluded: `node_modules/`, `.next/`, `.git/`, environment files, caches, generated TypeScript metadata, agent workspace files, and temporary verification files. Next.js regenerates `next-env.d.ts` and `.next/` when you run development or build commands.

The application needs no API keys, environment variables, database, Codex runtime, or external asset service. npm registry access is needed to install dependencies. Gmail, Outlook, Slack, summaries, and replies remain simulated demo features.

## Deployment

Ready to upload to GitHub and deploy using Vercel's Next.js preset, repository root `.`, Node.js 24.x, `npm ci`, `npm run build`, and the default output directory. No live GitHub upload or Vercel deployment was performed as part of packaging.
