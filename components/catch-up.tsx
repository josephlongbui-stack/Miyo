"use client";
import { AskLink } from "./ask-entry";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  Clock3,
  GitBranch,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { seed, useDemo } from "./store";
import { PageHeading, Mascot, Providers, Button, Summary } from "./ui";
export function CatchUp({ autoStart = false }: { autoStart?: boolean }) {
  const [range, setRange] = useState("Last 3 hours");
  const [status, setStatus] = useState<"idle" | "sorting" | "finding" | "done">(
    autoStart ? "sorting" : "idle",
  );
  const reduce = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { openMessage, state } = useDemo();
  const pending = seed.catchUp.needsYou
    .map((text, i) => ({
      text,
      id: [
        "msg_atlas_gmail_approval",
        "msg_atlas_slack_urgent",
        "msg_q4_slack_question",
        "msg_professor_outlook",
      ][i],
    }))
    .filter((item) => !["done", "replied"].includes(state.messages[item.id]));
  function run() {
    timer.current.forEach(clearTimeout);
    setStatus("sorting");
    timer.current = [
      setTimeout(() => setStatus("finding"), 620),
      setTimeout(() => setStatus("done"), 1450),
    ];
  }
  useEffect(() => {
    if (autoStart) run();
    return () => timer.current.forEach(clearTimeout);
  }, []);
  const busy = status === "sorting" || status === "finding";
  return (
    <>
      <PageHeading
        title="Catch Me Up"
        description="Everything that changed. Only the parts that matter."
        action={
          <AskLink question="What changed while I was away?">
            Ask a follow-up
          </AskLink>
        }
      />
      <div className="catchup-controls">
        <div
          className="range-pills"
          role="group"
          aria-label="Catch up time range"
        >
          {["Last 3 hours", "Today", "Since yesterday", "Since Friday"].map(
            (x) => (
              <button
                aria-pressed={range === x}
                className={range === x ? "selected" : ""}
                onClick={() => {
                  setRange(x);
                  setStatus("idle");
                  timer.current.forEach(clearTimeout);
                }}
                key={x}
              >
                {x}
              </button>
            ),
          )}
        </div>
        <Button variant="primary" onClick={run} disabled={busy}>
          {status === "done" ? <RefreshCw size={15} /> : <Sparkles size={16} />}{" "}
          {status === "done" ? "Refresh briefing" : "Catch me up"}
        </Button>
      </div>
      <AnimatePresence mode="wait">
        {status === "idle" ? (
          <motion.div
            className="catchup-intro card"
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="intro-mascot">
              <Mascot size={190} mood="hello" />
              <span className="little-label">
                <Check size={13} /> I’ve got the context.
              </span>
            </div>
            <h2>You were busy. I kept up.</h2>
            <p>
              Decisions, deadlines, and messages that need you.
              <br />
              Let’s turn 42 messages into a clear next step.
            </p>
            <Providers />
            <Button variant="primary" onClick={run}>
              <Sparkles size={16} />
              Catch me up on {range.toLowerCase()}
            </Button>
            <span className="meta">
              About a minute to read. A lot less to carry.
            </span>
          </motion.div>
        ) : busy ? (
          <motion.div
            role="status"
            className="catchup-thinking card"
            key="thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="thinking-scene">
              <div>
                <Mascot size={160} mood="thinking" />
              </div>
              <div className="sorting-cards">
                {["gmail", "slack", "outlook"].map((p, i) => (
                  <motion.div
                    key={p}
                    initial={{ x: 35, y: i * 7, opacity: 0 }}
                    animate={
                      reduce
                        ? { opacity: 1 }
                        : {
                            x: [30, 0, -10, 0],
                            y: [i * 7, i * -8, 0],
                            rotate: [8, -5, 0],
                            opacity: 1,
                          }
                    }
                    transition={{ duration: 0.7, delay: i * 0.12 }}
                  >
                    <Check size={14} />
                    {p}
                  </motion.div>
                ))}
              </div>
            </div>
            <h2>
              {status === "sorting"
                ? "Sorting 42 messages…"
                : "Finding decisions and follow-ups…"}
            </h2>
            <p>A little order. A little breathing room.</p>
            <div className="loading-track">
              <motion.span
                initial={{ width: "8%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.3 }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="catchup-result"
          >
            <div className="briefing-banner">
              <div className="flex-row">
                <Mascot size={74} mood="celebrate" />
                <div>
                  <span className="eyebrow">YOUR ATTENTION, DISTILLED</span>
                  <h2>You’re caught up.</h2>
                  <p>42 messages reviewed · {range} · September 21</p>
                </div>
              </div>
              <Providers />
            </div>
            <div className="briefing-grid">
              <section className="card briefing-section">
                <div className="briefing-section-title">
                  <span className="section-icon lavender-icon">
                    <GitBranch size={19} />
                  </span>
                  <div>
                    <span className="eyebrow">THE BIG PICTURE</span>
                    <h2>What changed</h2>
                  </div>
                  <span className="section-number">03</span>
                </div>
                {seed.catchUp.whatChanged.map((text, i) => (
                  <Link
                    href={
                      i < 2
                        ? "/app/projects/project-atlas"
                        : "/app/commitments?tab=owed_to_me"
                    }
                    className="briefing-item"
                    key={text}
                  >
                    <span className="item-dot" />
                    <p>{text}</p>
                    <ArrowUpRight size={15} />
                  </Link>
                ))}
                <div className="briefing-bottom">
                  <Link
                    href="/app/projects/project-atlas"
                    className="text-link"
                  >
                    Open Project Atlas
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </section>
              <section className="card briefing-section needs-you">
                <div className="briefing-section-title">
                  <span className="section-icon">
                    <Sparkles size={19} />
                  </span>
                  <div>
                    <span className="eyebrow">YOUR NEXT MOVES</span>
                    <h2>What needs you</h2>
                  </div>
                  <span className="section-number">
                    {String(pending.length).padStart(2, "0")}
                  </span>
                </div>
                {pending.map(({ text, id }, i) => (
                  <button
                    className="briefing-item"
                    key={text}
                    onClick={() => openMessage(id)}
                  >
                    <span className="number-bubble">{i + 1}</span>
                    <p>{text}</p>
                    <ArrowUpRight size={15} />
                  </button>
                ))}
                {pending.length === 0 && (
                  <div className="briefing-item">
                    <Check size={17} />
                    <p>You’ve taken care of everything that needed you.</p>
                  </div>
                )}
              </section>
              <section className="card briefing-section">
                <div className="briefing-section-title">
                  <span className="section-icon green-icon">
                    <CheckCheck size={19} />
                  </span>
                  <div>
                    <span className="eyebrow">ALREADY SETTLED</span>
                    <h2>Decisions made</h2>
                  </div>
                </div>
                {seed.catchUp.decisionsMade.map((t) => (
                  <div className="briefing-item" key={t}>
                    <Check size={16} />
                    <p>{t}</p>
                  </div>
                ))}
              </section>
              <section className="card briefing-section safe-section">
                <div className="briefing-section-title">
                  <span className="section-icon">
                    <ShieldCheck size={19} />
                  </span>
                  <div>
                    <span className="eyebrow">PERMISSION TO LET GO</span>
                    <h2>Safe to ignore</h2>
                  </div>
                </div>
                <div className="safe-counts">
                  {Object.entries(seed.catchUp.safeToIgnore).map(
                    ([key, value]) => (
                      <div key={key}>
                        <strong>{value}</strong>
                        <span>
                          {
                            {
                              newsletters: "Newsletters",
                              fyiMessages: "FYI messages",
                              casualMessages: "Casual messages",
                              otherLowPriority: "Other low priority",
                            }[key]
                          }
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </section>
            </div>
            <div className="catchup-footer">
              <span>
                <Check size={17} /> You know what matters. The rest can wait.
              </span>
              <Link
                href="/app/projects/project-atlas"
                className="button primary"
              >
                Explore Project Atlas
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
