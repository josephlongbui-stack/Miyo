"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { PrioritySettings } from "./priorities";
import {
  Check,
  ArrowRight,
  Link2,
  Users,
  MessageSquare,
  Bell,
  RotateCcw,
  Sparkles,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  X,
} from "lucide-react";
import { seed, useDemo, labels } from "./store";
import {
  PageHeading,
  Provider,
  Avatar,
  Button,
  Toggle,
  Mascot,
  Logo,
} from "./ui";
export function Connections({ onboarding = false }: { onboarding?: boolean }) {
  const { state, update, notify } = useDemo();
  const [busy, setBusy] = useState<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  function connect(ids: string[]) {
    setBusy(ids);
    timers.current.push(
      setTimeout(() => {
        update((s) => ({
          ...s,
          accounts: {
            ...s.accounts,
            ...Object.fromEntries(ids.map((id) => [id, true])),
          },
        }));
        setBusy([]);
        notify("Connected. Your conversations are in good hands.");
      }, 800),
    );
  }
  return (
    <>
      <div className="settings-section-head">
        <div>
          <h2>
            {onboarding
              ? "Bring your conversations together."
              : "Your connected apps"}
          </h2>
          <p>One calm place for Gmail, Outlook, and Slack.</p>
        </div>
        <Button
          disabled={
            !!busy.length ||
            seed.connectedAccounts.every((a) => state.accounts[a.id])
          }
          onClick={() => connect(seed.connectedAccounts.map((a) => a.id))}
        >
          <Link2 size={14} />
          Connect all
        </Button>
      </div>
      <div className="connections-list">
        {seed.connectedAccounts.map((a) => (
          <div className="connection-row" key={a.id}>
            <span className={"connection-icon " + a.provider}>
              <Provider name={a.provider} compact />
            </span>
            <div>
              <h3>{a.label}</h3>
              <p>{a.address}</p>
              <span className="meta">{labels[a.context]}</span>
            </div>
            <Button
              ariaLabel={
                (busy.includes(a.id)
                  ? "Connecting "
                  : state.accounts[a.id]
                    ? "Disconnect "
                    : "Connect ") + a.label
              }
              disabled={busy.includes(a.id)}
              onClick={() =>
                state.accounts[a.id]
                  ? update((s) => ({
                      ...s,
                      accounts: { ...s.accounts, [a.id]: false },
                    }))
                  : connect([a.id])
              }
            >
              {busy.includes(a.id) ? (
                <>
                  <Loader2 className="spin" size={15} />
                  Connecting…
                </>
              ) : state.accounts[a.id] ? (
                <>
                  <Check size={15} />
                  <span className="connected-button-text">Connected</span>
                  <span className="disconnect-button-text">Disconnect</span>
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </div>
        ))}
      </div>
      <div className="settings-note">
        <ShieldCheck size={15} />
        Simulated connections. No passwords or external accounts needed.
      </div>
    </>
  );
}
export function AutoReplies() {
  const { state, update, notify } = useDemo();
  return (
    <>
      <div className="settings-section-head">
        <div>
          <h2>A thoughtful reply, while you’re away.</h2>
          <p>
            Let people know you’ve seen their message, without losing your
            focus.
          </p>
        </div>
      </div>
      <Toggle
        label="Automatic acknowledgments"
        description="Active during Focus Mode when Auto Reply is on."
        checked={state.focus.autoReply}
        onChange={(v) =>
          update((s) => ({ ...s, focus: { ...s.focus, autoReply: v } }))
        }
      />
      <div className="reply-settings-field">
        <label htmlFor="professional-reply">Professional reply</label>
        <p>For work conversations across your connected apps.</p>
        <textarea
          id="professional-reply"
          value={state.professionalReply}
          onChange={(e) =>
            update((s) => ({ ...s, professionalReply: e.target.value }))
          }
        />
        <span className="meta">
          Use {"{endTime}"} for the end of your focus session.
        </span>
      </div>
      <div className="reply-settings-field">
        <label htmlFor="casual-reply">Casual reply</label>
        <p>A lighter note for personal conversations.</p>
        <textarea
          id="casual-reply"
          value={state.casualReply}
          onChange={(e) =>
            update((s) => ({ ...s, casualReply: e.target.value }))
          }
        />
      </div>
      <div className="reply-settings-preview">
        <span className="summary-label">
          <MessageSquare size={15} />
          Preview · Work
        </span>
        <p>{state.professionalReply.replaceAll("{endTime}", "4:00 PM")}</p>
      </div>
      <Button
        variant="primary"
        onClick={() =>
          notify("Reply preferences saved. Miyo is ready when you are.")
        }
      >
        <Check size={15} />
        Save preferences
      </Button>
    </>
  );
}
export function FocusPreferences() {
  const { state, update } = useDemo();
  return (
    <>
      <Toggle
        label="Allow urgent messages"
        description="Let time-sensitive messages through during focus."
        checked={state.focus.allowUrgent}
        onChange={(v) =>
          update((s) => ({ ...s, focus: { ...s.focus, allowUrgent: v } }))
        }
      />
      <Toggle
        label="Allow VIP contacts"
        description="Keep a line open for your most important people."
        checked={state.focus.allowVip}
        onChange={(v) =>
          update((s) => ({ ...s, focus: { ...s.focus, allowVip: v } }))
        }
      />
      <Toggle
        label="Enable automatic acknowledgment"
        description="A reassuring reply while you’re focused."
        checked={state.focus.autoReply}
        onChange={(v) =>
          update((s) => ({ ...s, focus: { ...s.focus, autoReply: v } }))
        }
      />
    </>
  );
}
export function Settings({
  initialTab = "connected-apps",
}: {
  initialTab?: string;
}) {
  const { state, update, reset, notify } = useDemo();
  const [tab, setTab] = useState(
    initialTab === "contacts" ? "priorities" : initialTab,
  );
  const tabs = [
    ["connected-apps", "Connected apps", Link2],
    ["priorities", "People & places", Users],
    ["auto-replies", "Auto Replies", MessageSquare],
    ["notifications", "Notifications", Bell],
  ] as const;
  return (
    <>
      <PageHeading
        title="Settings"
        description="Your people, your preferences, your pace."
      />
      <div className="settings-layout">
        <aside className="settings-nav">
          {tabs.map(([id, label, Icon]) => (
            <button
              key={id}
              className={tab === id ? "selected" : ""}
              aria-pressed={tab === id}
              onClick={() => setTab(id)}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
          <div className="reset-card">
            <RotateCcw size={19} />
            <h3>A fresh start?</h3>
            <p>
              Restore the original demo, including messages and preferences.
            </p>
            <Button
              onClick={() => {
                reset();
                setTab("connected-apps");
              }}
            >
              Reset Demo
            </Button>
          </div>
        </aside>
        <section className="card settings-panel">
          {tab === "connected-apps" ? (
            <Connections />
          ) : tab === "priorities" ? (
            <PrioritySettings />
          ) : tab === "auto-replies" ? (
            <AutoReplies />
          ) : (
            <>
              <div className="settings-section-head">
                <div>
                  <h2>Interruptions, on your terms.</h2>
                  <p>Decide when Miyo should bring something to you.</p>
                </div>
              </div>
              <FocusPreferences />
              <div className="focus-divider" />
              <Toggle
                label="Morning Briefing"
                description="Start the day with what needs your attention."
                checked={state.morning}
                onChange={(v) => update((s) => ({ ...s, morning: v }))}
              />
              <Toggle
                label="Evening Wrap-Up"
                description="A little closure before you sign off."
                checked={state.evening}
                onChange={(v) => update((s) => ({ ...s, evening: v }))}
              />
              <div className="settings-note">
                Briefings are available in the demo at any time. Scheduled
                delivery is simulated.
              </div>
            </>
          )}
        </section>
      </div>
      <div className="settings-bottom">
        <Link href="/app/onboarding">
          Revisit onboarding
          <ArrowRight size={14} />
        </Link>
        <span>Light theme · Demo day: September 21, 2026</span>
      </div>
    </>
  );
}
export function Onboarding() {
  const { state, update, toast } = useDemo();
  const [step, setStep] = useState(0);
  function next() {
    if (step === 0) {
      update((s) => ({
        ...s,
        accounts: Object.fromEntries(
          seed.connectedAccounts.map((a) => [a.id, false]),
        ),
      }));
    }
    setStep((x) => x + 1);
  }
  return (
    <div className="onboarding">
      <header>
        <Logo />
        <Link className="text-link" href="/app/dashboard">
          Skip to demo
          <ArrowRight size={15} />
        </Link>
      </header>
      <div className="onboarding-progress">
        {["Welcome", "Connect", "Priorities", "Your focus", "You’re ready"].map(
          (x, i) => (
            <div key={x} className={i <= step ? "active" : ""}>
              <span>{i < step ? <Check size={13} /> : i + 1}</span>
              <p>{x}</p>
            </div>
          ),
        )}
      </div>
      <main className={"onboarding-card card step-" + step}>
        {step === 0 ? (
          <div className="welcome-step">
            <Mascot size={176} mood="hello" />
            <span className="eyebrow">
              A LITTLE LESS NOISE. A LOT MORE YOU.
            </span>
            <h1>Hi, I’m Miyo.</h1>
            <p>
              I’ll help you keep up without keeping
              <br />
              everything in your head.
            </p>
            <Button variant="primary" onClick={next}>
              Get started
              <ArrowRight size={16} />
            </Button>
            <span className="meta">
              A calmer workspace is just a few steps away.
            </span>
          </div>
        ) : step === 1 ? (
          <Connections onboarding />
        ) : step === 2 ? (
          <PrioritySettings />
        ) : step === 3 ? (
          <>
            <div className="onboarding-focus-heading">
              <Mascot size={92} />
              <h1>Your focus comes first.</h1>
              <p>
                Tell me what should get through. You can change this anytime.
              </p>
            </div>
            <FocusPreferences />
          </>
        ) : (
          <div className="welcome-step">
            <Mascot size={154} mood="celebrate" />
            <span className="ready-check">
              <Check size={20} />
            </span>
            <h1>You’re set.</h1>
            <p>
              Miyo found 3 things that need your attention.
              <br />
              The rest can wait.
            </p>
            <Link href="/app/dashboard" className="button primary large">
              Go to Miyo
              <ArrowRight size={17} />
            </Link>
          </div>
        )}
        {step > 0 && step < 4 && (
          <div className="onboarding-actions">
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft size={14} />
              Back
            </Button>
            <Button variant="primary" onClick={next}>
              {step === 3 ? "Finish setup" : "Continue"}
              <ArrowRight size={15} />
            </Button>
          </div>
        )}
      </main>
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {toast}
        </div>
      )}
      <p className="onboarding-footnote">Only what matters. When it matters.</p>
    </div>
  );
}
