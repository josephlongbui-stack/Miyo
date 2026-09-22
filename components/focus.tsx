"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  Moon,
  BookOpen,
  Headphones,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Play,
  Square,
  Clock3,
  Check,
  MessageSquare,
  X,
  Send,
  ArrowUpRight,
  BellRing,
} from "lucide-react";
import { seed, useDemo, time, allowedInFocus } from "./store";
import {
  PageHeading,
  Button,
  Toggle,
  Mascot,
  Provider,
  Badge,
  Avatar,
} from "./ui";
const icons = {
  deep_work: Headphones,
  meeting: Users,
  studying: BookOpen,
  sleeping: Moon,
};
export function FocusPage() {
  const { state, update, notify, openMessage } = useDemo();
  const f = state.focus;
  const [now, setNow] = useState(Date.now());
  const [urgent, setUrgent] = useState(0);
  const [delivery, setDelivery] = useState(false);
  const [ack, setAck] = useState("");
  const [held, setHeld] = useState(false);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width:760px)");
    const sync = () => setMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const reduce = useReducedMotion();
  const m = seed.messages[0];
  const endText = f.active
    ? time(new Date(f.endAt).toISOString())
    : time(new Date(Date.now() + f.minutes * 60000).toISOString());
  const remaining = Math.max(0, Math.ceil((f.endAt - now) / 1000));
  const countdown = `${Math.floor(remaining / 3600)
    .toString()
    .padStart(2, "0")}:${Math.floor((remaining % 3600) / 60)
    .toString()
    .padStart(2, "0")}:${(remaining % 60).toString().padStart(2, "0")}`;
  useEffect(() => {
    if (!f.active) return;
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, [f.active]);
  function config(values: Partial<typeof f>) {
    update((s) => ({ ...s, focus: { ...s.focus, ...values } }));
  }
  function simulate() {
    if (!f.active) return;
    setAck(
      f.autoReply
        ? state.professionalReply.replaceAll("{endTime}", endText)
        : "",
    );
    if (allowedInFocus(m, state)) {
      setUrgent((x) => x + 1);
      setDelivery(true);
      setHeld(false);
    } else {
      setDelivery(false);
      setHeld(true);
      notify("Message held quietly. Both interruption overrides are off.");
    }
  }
  return (
    <>
      <PageHeading
        title="Focus"
        description="You do your thing. Miyo will keep an eye on the noise."
        action={
          f.active ? (
            <span className="focus-status">
              <span className="active-dot" />
              Focus is on
            </span>
          ) : undefined
        }
      />
      <div className={"focus-layout " + (f.active ? "active" : "")}>
        <section
          className={"focus-stage card " + (f.active ? "is-focusing" : "")}
        >
          <div className="focus-stage-label">
            <ShieldCheck size={15} />
            {f.active
              ? "YOUR ATTENTION IS PROTECTED"
              : "YOUR NEXT GOOD STRETCH OF FOCUS"}
          </div>
          <div className="focus-orb">
            <span className="focus-ring focus-ring-outer" />
            <span className="focus-ring focus-ring-middle" />
            <span className="focus-ring focus-ring-inner" />
            <div>
              <Mascot size={155} mood={f.active ? "focus" : "idle"} />
            </div>
            <span className="focus-orb-status">
              <span className="active-dot" />
              {f.active ? "Quietly on your side" : "Ready when you are"}
            </span>
          </div>
          {f.active ? (
            <>
              <div className="focus-timer" aria-label="Time remaining">
                {countdown}
              </div>
              <p className="focus-timer-label">
                {seed.focusPresets.find((p) => p.id === f.mode)?.label} · until{" "}
                {endText}
              </p>
              <h2>Miyo is watching your messages.</h2>
              <p>I’ll only interrupt you if something actually needs you.</p>
              <Button
                onClick={() => {
                  config({ active: false });
                  setDelivery(false);
                  notify("Focus ended. Welcome back.");
                }}
              >
                <Square size={13} />
                End focus session
              </Button>
              <div className="focus-demo-control">
                <span>SEE MIYO IN ACTION</span>
                <Button variant="primary" onClick={simulate}>
                  <Play size={14} />
                  {delivery
                    ? "Replay urgent delivery"
                    : "Simulate urgent message"}
                </Button>
                <p>A Project Atlas update from Maya Chen</p>
              </div>
            </>
          ) : (
            <>
              <h2>Make room for your best work.</h2>
              <p>
                Let the everyday messages wait.
                <br />
                Miyo knows when something can’t.
              </p>
              <div className="focus-promise">
                <ShieldCheck size={14} />
                Your settings. Your boundaries.
              </div>
            </>
          )}
          {ack && (
            <div className="acknowledgment">
              <span>
                <Check size={14} />
                Automatic acknowledgment simulated
              </span>
              <p>“{ack}”</p>
              <small>Nothing was sent to Slack.</small>
            </div>
          )}
          {held && (
            <div className="held-message">
              <Clock3 size={16} />
              Maya’s update is held until focus ends. Turn on Urgent or VIP to
              let it through.
            </div>
          )}
        </section>
        <aside className="focus-settings card">
          <h2>
            {f.active ? "Your focus settings" : "Settle into your rhythm"}
          </h2>
          <p className="context-copy">A few boundaries. A calmer headspace.</p>
          <span className="field-label">What are you making time for?</span>
          <div className="focus-modes" role="group" aria-label="Focus mode">
            {seed.focusPresets.map((p) => {
              const Icon = icons[p.id as keyof typeof icons];
              return (
                <button
                  aria-pressed={f.mode === p.id}
                  key={p.id}
                  className={f.mode === p.id ? "selected" : ""}
                  onClick={() =>
                    config({
                      mode: p.id,
                      ...(!f.active
                        ? {
                            minutes: p.defaultMinutes,
                            allowUrgent: p.allowUrgent,
                            allowVip: p.allowVip,
                            autoReply: p.autoReply,
                          }
                        : {}),
                    })
                  }
                >
                  <Icon size={18} />
                  {p.label}
                  {f.mode === p.id && <Check size={12} />}
                </button>
              );
            })}
          </div>
          <label className="field-label" htmlFor="duration">
            For how long?
          </label>
          <select
            id="duration"
            disabled={f.active}
            value={[30, 60, 120].includes(f.minutes) ? f.minutes : "custom"}
            onChange={(e) =>
              config({
                minutes:
                  e.target.value === "custom" ? 90 : Number(e.target.value),
              })
            }
          >
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="custom">Custom duration</option>
          </select>
          {![30, 60, 120].includes(f.minutes) && (
            <div className="custom-duration">
              <input
                aria-label="Custom duration in minutes"
                type="number"
                min="1"
                max="720"
                value={f.minutes}
                disabled={f.active}
                onChange={(e) =>
                  config({
                    minutes: Math.max(
                      1,
                      Math.min(720, Number(e.target.value) || 1),
                    ),
                  })
                }
              />
              <span>minutes</span>
            </div>
          )}
          <div className="focus-divider" />
          <span className="field-label">Let the right things through</span>
          <Toggle
            checked={f.allowUrgent}
            label="Allow urgent messages"
            description="Time-sensitive things that need you."
            onChange={(v) => config({ allowUrgent: v })}
          />
          <Toggle
            checked={f.allowVip}
            label="Allow VIP contacts"
            description="Your most important people."
            onChange={(v) => config({ allowVip: v })}
          />
          <div className="focus-divider" />
          <Toggle
            checked={f.autoReply}
            label="Auto Reply"
            description="A thoughtful acknowledgment while you’re away."
            onChange={(v) => config({ autoReply: v })}
          />
          {f.autoReply && (
            <div className="auto-reply-preview">
              <MessageSquare size={15} />
              <p>{state.professionalReply.replaceAll("{endTime}", endText)}</p>
            </div>
          )}
          {!f.active && (
            <Button
              variant="primary"
              className="full-width start-focus"
              onClick={() => {
                setNow(Date.now());
                config({ active: true, endAt: Date.now() + f.minutes * 60000 });
                setAck("");
                setHeld(false);
                notify("Focus started. Miyo has your back.");
              }}
            >
              <Headphones size={16} />
              Start Focus Mode
              <ArrowRight size={16} />
            </Button>
          )}
          <Link
            href="/app/settings?tab=auto-replies"
            className="text-link focus-settings-link"
          >
            Customize automatic replies
            <ArrowUpRight size={13} />
          </Link>
        </aside>
      </div>
      <AnimatePresence>
        {delivery && f.active && (
          <div
            className="urgent-delivery"
            key={urgent}
            role="region"
            aria-live="assertive"
            aria-label="Urgent Project Atlas notification"
          >
            <motion.div
              className="delivery-pulse"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.4, 0], scale: 1.3 }}
              transition={{ duration: 0.6 }}
            />
            <motion.div
              className="delivery-mascot"
              initial={
                reduce
                  ? { opacity: 0 }
                  : mobile
                    ? { y: "100vh", opacity: 1 }
                    : { x: "110vw", opacity: 1 }
              }
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={
                reduce
                  ? { duration: 0.2 }
                  : { type: "spring", stiffness: 70, damping: 14, mass: 1 }
              }
            >
              <motion.div
                animate={
                  reduce
                    ? {}
                    : {
                        y: [0, -9, 0, -7, 0, -5, 0, -3, 0],
                        rotate: [3, -3, 3, -3, 2, -2, 1, 0],
                        scaleY: [1, 0.97, 1.02, 1],
                      }
                }
                transition={{ duration: 1.15, ease: "easeOut" }}
              >
                <Mascot size={133} mood="still" />
              </motion.div>
            </motion.div>
            <motion.div
              className="urgent-card"
              initial={
                reduce
                  ? { opacity: 0 }
                  : mobile
                    ? { y: "100vh", x: 0, rotate: 0, opacity: 0 }
                    : { x: "110vw", y: 10, rotate: 2, opacity: 0 }
              }
              animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              exit={{ opacity: 0, y: 15 }}
              transition={
                reduce
                  ? { duration: 0.2 }
                  : { type: "spring", stiffness: 95, damping: 16, delay: 0.12 }
              }
            >
              <div className="urgent-card-top">
                <span>
                  <BellRing size={14} />
                  This one needs you.
                </span>
                <button
                  aria-label="Dismiss urgent notification"
                  onClick={() => setDelivery(false)}
                >
                  <X size={17} />
                </button>
              </div>
              <div className="flex-row urgent-sender">
                <Avatar name="Maya Chen" />
                <div>
                  <strong>Maya Chen</strong>
                  <span>Slack · #project-atlas</span>
                </div>
                <Badge value="urgent" />
              </div>
              <h3>Demo moved to 2:30 PM.</h3>
              <p>
                Client moved the Project Atlas demo to 2:30 PM. Can you confirm
                you’re available in the next 20 minutes?
              </p>
              <div className="urgent-summary">
                <Sparkles size={13} />
                <span>Maya needs your confirmation soon.</span>
              </div>
              <div className="urgent-actions">
                <Button
                  variant="primary"
                  onClick={() => {
                    setDelivery(false);
                    openMessage(m.id, "reply");
                  }}
                >
                  <Send size={14} />
                  Reply
                </Button>
                <Button
                  onClick={() => {
                    setDelivery(false);
                    openMessage(m.id, "draft");
                  }}
                >
                  <Sparkles size={14} />
                  AI Draft
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setDelivery(false);
                    openMessage(m.id);
                  }}
                >
                  Open
                  <ArrowUpRight size={14} />
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
