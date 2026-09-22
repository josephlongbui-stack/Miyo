"use client";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
  Layers3,
  ShieldCheck,
  Moon,
  Handshake,
  Sun,
  MessageSquare,
} from "lucide-react";
import { Logo, Providers, Mascot } from "@/components/ui";
import { Dashboard } from "@/components/dashboard";
export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Logo />
        <nav>
          <a href="#how-it-works">How it works</a>
          <a href="#features">Made for your day</a>
          <Link href="/app/onboarding">Meet Miyo</Link>
        </nav>
        <Link className="button secondary" href="/app/dashboard">
          Try the demo
          <ArrowUpRight size={15} />
        </Link>
      </header>
      <main>
        <section className="hero">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <span className="hero-eyebrow">
            <Sparkles size={14} /> A calmer home for your attention
          </span>
          <h1>
            Only what matters.
            <br />
            <span>When it matters.</span>
          </h1>
          <p>
            Miyo brings Gmail, Outlook, and Slack into one calm workspace.
            <br className="desktop-break" /> Know what needs you, what changed,
            and what can wait.
          </p>
          <div className="hero-actions">
            <Link className="button primary large" href="/app/dashboard">
              Try the demo
              <ArrowRight size={17} />
            </Link>
            <a className="button secondary large" href="#how-it-works">
              See how it works
            </a>
          </div>
          <div className="hero-assurance">
            <Check size={13} /> No sign-up. Just a little peace of mind.
          </div>
          <div className="hero-product">
            <div className="preview-top">
              <div className="window-dots">
                <i />
                <i />
                <i />
              </div>
              <span>
                <ShieldCheck size={12} /> Your attention, in good hands
              </span>
              <Sparkles size={14} />
            </div>
            <div className="preview-body">
              <aside className="preview-sidebar">
                <Logo />
                {[
                  ["⌂", "Home"],
                  ["▤", "Inbox"],
                  ["✧", "Catch Me Up"],
                  ["▧", "Projects"],
                  ["✓", "Commitments"],
                  ["☼", "Briefings"],
                ].map(([icon, label], i) => (
                  <div className={i === 0 ? "selected" : ""} key={label}>
                    <span>{icon}</span>
                    {label}
                  </div>
                ))}
              </aside>
              <Dashboard preview />
            </div>
            <div className="hero-float">
              <Mascot size={72} />
              <div>
                <Sparkles size={13} />
                <strong>You’re in the loop.</strong>
                <span>Without being in every app.</span>
              </div>
            </div>
          </div>
          <div className="integrations-line">
            <span>All your conversations. Finally connected.</span>
            <Providers />
          </div>
        </section>
        <section
          id="how-it-works"
          className="marketing-section problem-section"
        >
          <span className="eyebrow">LESS SWITCHING. MORE LIVING.</span>
          <h2>
            Your brain wasn’t made
            <br />
            for twelve open tabs.
          </h2>
          <p>
            The decision is in Slack. The deadline is in Gmail. The new time is
            in Outlook.
            <br />
            Miyo connects the dots, so you don’t have to.
          </p>
          <div className="noise-to-clarity">
            <div className="source-stack">
              <div>
                <Providers names={["gmail"]} />
                <span>“Could you approve this by 1:30?”</span>
              </div>
              <div>
                <Providers names={["slack"]} />
                <span>“Concept B is ready for the demo.”</span>
              </div>
              <div>
                <Providers names={["outlook"]} />
                <span>“Your meeting time has changed.”</span>
              </div>
            </div>
            <span className="connecting-arrow">
              <ArrowRight />
            </span>
            <div className="clarity-card">
              <span className="summary-label">
                <Sparkles size={16} /> Miyo sees the bigger picture
              </span>
              <h3>One project. One clear next step.</h3>
              <p>
                Project Atlas is on track. Approve pricing by 1:30 PM, and
                you’re ready for tomorrow.
              </p>
              <div>
                <span>2 urgent</span>
                <span>5 important</span>
                <span>41 safely deferred</span>
              </div>
            </div>
          </div>
          <div className="steps">
            {[
              [
                "01",
                "Connect your communication",
                "Bring Gmail, Outlook, and Slack together in one place.",
              ],
              [
                "02",
                "Miyo finds what matters",
                "Decisions, deadlines, and promises become clear.",
              ],
              [
                "03",
                "Get your attention back",
                "A calm, prioritized view. A little more breathing room.",
              ],
            ].map(([n, t, p]) => (
              <div key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="marketing-section features-section" id="features">
          <span className="eyebrow">THOUGHTFUL BY NATURE</span>
          <h2>
            Less to keep in your head.
            <br />
            More space for your day.
          </h2>
          <div className="feature-grid">
            <Link
              href="/app/projects/project-atlas"
              className="feature-card wide"
            >
              <Layers3 />
              <h3>One story, across every app.</h3>
              <p>
                Miyo links related conversations. See decisions, open questions,
                and the next step in one Project Atlas timeline.
              </p>
              <div className="feature-project">
                <span className="project-symbol">A</span>
                <strong>Project Atlas</strong>
                <Providers />
              </div>
              <span className="text-link">
                Connect the dots
                <ArrowUpRight size={15} />
              </span>
            </Link>
            <Link href="/app/catch-up" className="feature-card lavender">
              <Sparkles />
              <h3>
                Three hours away.
                <br />
                One minute to catch up.
              </h3>
              <p>
                The changes, the decisions, and what needs you. Everything else
                can wait.
              </p>
              <span className="text-link">
                Catch me up
                <ArrowUpRight size={15} />
              </span>
            </Link>
            <Link href="/app/commitments" className="feature-card">
              <Handshake />
              <h3>Promises, remembered.</h3>
              <p>
                Keep track of what you owe and what’s owed to you. Even the
                “I’ll send it tomorrow” buried in a thread.
              </p>
            </Link>
            <Link href="/app/focus" className="feature-card focus-feature">
              <Moon />
              <h3>Your focus has a friend.</h3>
              <p>
                Settle into deep work. Miyo watches your messages and brings the
                truly urgent ones right to you.
              </p>
              <div className="feature-focus-bottom">
                <span>Quietly on your side.</span>
                <Mascot size={84} />
              </div>
            </Link>
            <Link href="/app/briefings" className="feature-card">
              <Sun />
              <h3>
                A softer start.
                <br />A clearer finish.
              </h3>
              <p>
                Start with a morning briefing. Close the day knowing what’s done
                and what can wait.
              </p>
            </Link>
          </div>
        </section>
        <section className="mascot-section">
          <Mascot size={150} mood="hello" />
          <div>
            <span className="eyebrow">MEET YOUR LITTLE ATTENTION MANAGER</span>
            <h2>
              A quiet companion.
              <br />A very good memory.
            </h2>
            <p>
              Miyo stays out of the way until you need a hand.
              <br />
              Helpful, thoughtful, and always on your side.
            </p>
          </div>
        </section>
        <section className="final-cta">
          <span className="eyebrow">MAKE ROOM FOR WHAT MATTERS</span>
          <h2>
            Stop checking everything.
            <br />
            <span>Start feeling caught up.</span>
          </h2>
          <Link href="/app/dashboard" className="button primary large">
            Open the demo
            <ArrowRight size={17} />
          </Link>
        </section>
      </main>
      <footer>
        <Logo />
        <p>Only what matters. When it matters.</p>
        <span>Interactive demo · No account required</span>
      </footer>
    </div>
  );
}
