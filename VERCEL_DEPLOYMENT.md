# Deploying the Miyo demo to Vercel

This project uses Vercel's native Next.js integration. It needs no API keys, environment variables, database, external services, or local server once deployed. The seed data, fonts, icons, and mascot images ship with the app. State is saved in each visitor's browser.

## Project settings

| Setting | Value |
| --- | --- |
| Framework preset | Next.js |
| Root directory | The directory containing this document and `package.json` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | Leave the Next.js default; do not override it to `out` or `dist` |
| Node.js | 24.x, declared in `package.json` |
| Environment variables | None |

The clean ZIP places `package.json` directly at its root. Extract into `miyo-demo`, upload the extracted contents to your GitHub repository root, and choose `.` as Vercel's root directory. Commit `package-lock.json`, all source directories, and `public/`. Build output and installed dependencies are regenerated during deployment.

Vercel detects Next.js and handles its dynamic routes directly; no custom rewrites, adapters, or `vercel.json` are needed. The production start command is the standard `next start`; the loopback address in the development command only controls local development.

## Local production preview

Run from the app directory:

```sh
npm ci
npm run build
npm run typecheck
npm start -- --hostname 127.0.0.1 --port 3002
```

Open `http://127.0.0.1:3002`. Port 3002 lets this preview coexist with the development server on port 3000. These local preview arguments are not Vercel settings.

## Demo behavior after deployment

- Gmail, Outlook, Slack, replies, AI summaries, and reminders remain simulated, as specified for this demo.
- Ask Miyo at `/app/ask` runs its retrieval and answer generation locally over the bundled seed and current browser state. It requires no additional Vercel configuration, API keys, environment variables, or external service. Conversation history is scoped to the visitor's browser tab.
- Each browser starts with the same supplied scenario and saves its own changes in localStorage. Existing localhost state does not transfer to a new deployment domain.
- Mascot images and the favicon use paths under `public/`; no remote image host or private local file is needed.
- Unknown pages, invalid project IDs, and unexpected extra URL segments use the app's not-found page.

See `ACCEPTANCE_REPORT.md` for the production verification results. Deployment preparation does not publish a site or create a Vercel project.

## Official references

- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Vercel build and root-directory settings](https://vercel.com/docs/builds/configure-a-build)
- [Vercel Node.js versions and package.json engines](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
