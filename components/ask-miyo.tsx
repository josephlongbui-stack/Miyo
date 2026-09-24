"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Layers3,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useDemo, seed } from "./store";
import { Avatar, Mascot, Provider } from "./ui";
import { askMiyo } from "@/lib/ask-miyo/service";
import { answerDemo } from "@/lib/ask-miyo/demo-engine";
import {
  buildKnowledge,
  dateLabel,
  projectHref,
} from "@/lib/ask-miyo/knowledge";
import type {
  AskAnswer,
  AskContext,
  AskTurn,
  Source,
} from "@/lib/ask-miyo/types";

const HISTORY_KEY = "miyo-ask-v1";
const suggestions = [
  ["Your next step", "What needs my attention today?", Clock3],
  ["The full picture", "Catch me up on Project Atlas", Layers3],
  ["Promises to you", "Who am I waiting on?", MessageCircle],
  ["Loose ends", "What commitments are overdue?", Check],
  ["Walk in prepared", "Prepare me for my next meeting", BookOpen],
  ["A quick reset", "What changed today?", Sparkles],
] as const;

function Citation({
  source,
  index,
  compact = false,
}: {
  source: Source;
  index: number;
  compact?: boolean;
}) {
  const { openMessage } = useDemo();
  const content = compact ? (
    <>{index}</>
  ) : (
    <>
      <span className="ask-source-number">{index}</span>
      <span className="ask-source-copy">
        <span>
          {source.platform ? (
            <Provider name={source.platform} compact />
          ) : (
            <BookOpen size={13} />
          )}
          <strong>{source.title}</strong>
        </span>
        <small>
          {source.detail}
          {source.timestamp ? " · " + dateLabel(source.timestamp) : ""}
        </small>
      </span>
      <ArrowUpRight size={13} />
    </>
  );
  const className = compact ? "ask-cite" : "ask-source";
  const label = `Source ${index}: ${source.title}`;
  return source.messageId ? (
    <button
      className={className}
      aria-label={label}
      title={source.title}
      onClick={() => openMessage(source.messageId!)}
    >
      {content}
    </button>
  ) : (
    <Link
      className={className}
      aria-label={label}
      title={source.title}
      href={source.href || "/app/inbox"}
    >
      {content}
    </Link>
  );
}

function Answer({
  answer,
  onAsk,
  disabled,
}: {
  answer: AskAnswer;
  onAsk: (q: string) => void;
  disabled: boolean;
}) {
  const { state, completeCommitment, act } = useDemo();
  const kb = buildKnowledge(state);
  // Resolve destinations from the current trusted knowledge map, not stored URLs.
  const sources = answer.sources.map((s) => kb.sources[s.id]).filter(Boolean);
  const cite = (ids: string[]) =>
    ids.map((id) => {
      const index = sources.findIndex((s) => s.id === id);
      return index < 0 ? null : (
        <Citation key={id} source={sources[index]} index={index + 1} compact />
      );
    });
  return (
    <div className="ask-answer">
      <div className="ask-answer-byline">
        <span className="ask-answer-spark">
          <Sparkles size={15} />
        </span>
        <strong>Miyo</strong>
        <span>From your saved sources</span>
      </div>
      <h2>{answer.title}</h2>
      <p className="ask-answer-intro">{answer.intro}</p>
      {answer.meeting && (
        <div className="ask-meeting-card">
          <BookOpen size={21} />
          <div>
            <span>Meeting preparation</span>
            <h3>{answer.meeting.title}</h3>
            <p>{answer.meeting.when}</p>
            <small>{answer.meeting.person}</small>
          </div>
        </div>
      )}
      <div className="ask-answer-sections">
        {answer.sections.map((section, i) => (
          <section key={i}>
            <h3>{section.title}</h3>
            <ul>
              {section.items.map((item, j) => (
                <li key={j}>
                  <span>
                    {item.text}{" "}
                    <span className="ask-inline-cites">
                      {cite(item.sourceIds)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      {answer.commitmentIds.length > 0 && (
        <section className="ask-promises">
          <h3>Tracked commitments</h3>
          {answer.commitmentIds.map((id) => {
            const c = kb.commitments.find((c) => c.id === id);
            if (!c) return null;
            return (
              <article className="ask-promise" key={id}>
                <div className="ask-promise-person">
                  <Avatar name={c.person} size="small" />
                  <span>
                    {c.direction === "i_owe" ? "You owe " : "Owed to you · "}
                    <strong>{c.person}</strong>
                  </span>
                  <span className={"ask-status " + c.status}>{c.status}</span>
                </div>
                <h4>{c.title}</h4>
                <p>
                  <Clock3 size={13} />
                  {dateLabel(c.dueAt)}
                </p>
                {c.revisedDueAt && (
                  <p className="ask-revised">
                    New promised time · {dateLabel(c.revisedDueAt)}
                  </p>
                )}
                <div className="ask-promise-footer">
                  {c.projectId && (
                    <Link href={projectHref(c.projectId)}>
                      {kb.projects.find((p) => p.id === c.projectId)?.name}
                    </Link>
                  )}
                  <span>{cite([id])}</span>
                  <button
                    className="text-link"
                    onClick={() => completeCommitment(id)}
                  >
                    {c.status === "completed" ? "Reopen" : "Mark complete"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
      {answer.actionIds.length > 0 && (
        <details className="ask-actions">
          <summary>
            Related actions <span>{answer.actionIds.length}</span>
            <ChevronDown size={14} />
          </summary>
          {answer.actionIds.map((id) => {
            const a = kb.actions.find((a) => a.id === id);
            if (!a) return null;
            return (
              <div key={id}>
                <span>
                  {a.title}
                  <small>
                    {a.status === "done"
                      ? "Completed"
                      : a.status === "added"
                        ? "Added to your list"
                        : dateLabel(a.dueAt)}
                  </small>
                </span>
                <button
                  disabled={a.status === "done"}
                  className="text-link"
                  onClick={() => act(id, "done")}
                >
                  {a.status === "done" ? <Check size={16} /> : "Done"}
                </button>
              </div>
            );
          })}
        </details>
      )}
      {answer.note && <p className="ask-answer-note">{answer.note}</p>}
      {sources.length > 0 && (
        <section className="ask-sources">
          <h3>
            <ShieldCheck size={14} />
            Supporting sources <span>{sources.length}</span>
          </h3>
          <div>
            {sources.slice(0, 4).map((source, i) => (
              <Citation key={source.id} source={source} index={i + 1} />
            ))}
          </div>
          {sources.length > 4 && (
            <details>
              <summary>Show {sources.length - 4} more sources</summary>
              {sources.slice(4).map((source, i) => (
                <Citation key={source.id} source={source} index={i + 5} />
              ))}
            </details>
          )}
        </section>
      )}
      <div className="ask-followups" aria-label="Suggested follow-up questions">
        {answer.followUps.map((q) => (
          <button key={q} onClick={() => onAsk(q)} disabled={disabled}>
            {q}
            <ArrowUpRight size={13} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function AskMiyo({
  initialQuestion = "",
}: {
  initialQuestion?: string;
}) {
  const demo = useDemo();
  const [turns, setTurns] = useState<AskTurn[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState("");
  const [phase, setPhase] = useState(0);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [contextExpanded, setContextExpanded] = useState(false);
  const [scope, setScope] = useState<AskContext>({});
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pendingRef = useRef<HTMLDivElement>(null);
  const lastAnswerRef = useRef<HTMLDivElement>(null);
  const request = useRef<AbortController | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const initialUsed = useRef(false);
  const stateRef = useRef(demo.state);
  stateRef.current = demo.state;
  const kb = buildKnowledge(demo.state);
  const latest = turns.at(-1)?.answer;
  const scopeLabel =
    kb.projects.find((p) => p.id === scope.projectId)?.name ||
    kb.contacts.find((c) => c.id === scope.contactId)?.name;

  useEffect(() => {
    if (!demo.ready || loaded) return;
    try {
      const saved: unknown = JSON.parse(
        sessionStorage.getItem(HISTORY_KEY) || "[]",
      );
      if (Array.isArray(saved)) {
        let context: AskContext = {};
        const restored: AskTurn[] = saved
          .slice(-20)
          .filter(
            (
              x,
            ): x is {
              question: string;
              id: string;
              queryContext?: AskContext;
            } =>
              !!x &&
              typeof x.question === "string" &&
              x.question.length <= 600 &&
              typeof x.id === "string",
          )
          .map((x) => {
            const queryContext =
              x.queryContext && typeof x.queryContext === "object"
                ? {
                    projectId: kb.projects.some(
                      (p) => p.id === x.queryContext?.projectId,
                    )
                      ? x.queryContext.projectId
                      : undefined,
                    contactId: kb.contacts.some(
                      (c) => c.id === x.queryContext?.contactId,
                    )
                      ? x.queryContext.contactId
                      : undefined,
                  }
                : context;
            const answer = answerDemo({
              question: x.question,
              context: queryContext,
              state: stateRef.current,
            });
            context = answer.context;
            return { ...x, queryContext, answer };
          });
        setTurns(restored);
        setScope(context);
      }
    } catch {}
    setLoaded(true);
  }, [demo.ready, loaded]);
  useEffect(() => {
    if (loaded)
      try {
        sessionStorage.setItem(
          HISTORY_KEY,
          JSON.stringify(
            turns
              .slice(-20)
              .map(({ id, question, queryContext }) => ({
                id,
                question,
                queryContext,
              })),
          ),
        );
      } catch {}
  }, [turns, loaded]);
  useEffect(
    () => () => {
      request.current?.abort();
      timers.current.forEach(clearTimeout);
    },
    [],
  );
  useEffect(() => {
    setContextExpanded(window.matchMedia("(min-width:901px)").matches);
  }, []);
  useEffect(() => {
    const focus = () => inputRef.current?.focus();
    window.addEventListener("miyo:ask-focus", focus);
    return () => window.removeEventListener("miyo:ask-focus", focus);
  }, []);
  useEffect(() => {
    if (pending)
      pendingRef.current?.scrollIntoView({
        block: "nearest",
        behavior: reduce ? "instant" : "smooth",
      });
  }, [pending, reduce]);

  async function submit(value: string) {
    const question = value.trim().slice(0, 600);
    if (!question || request.current || !loaded) return;
    const controller = new AbortController();
    request.current = controller;
    setInput("");
    setPending(question);
    setError("");
    setPhase(0);
    timers.current.push(setTimeout(() => setPhase(1), 450));
    try {
      const [answer] = await Promise.all([
        askMiyo(question, {
          context: scope,
          state: stateRef.current,
          signal: controller.signal,
        }),
        new Promise((resolve) => {
          timers.current.push(setTimeout(resolve, 950));
        }),
      ]);
      if (controller.signal.aborted) return;
      setTurns((t) => [
        ...t,
        { id: crypto.randomUUID(), question, queryContext: scope, answer },
      ]);
      setScope(answer.context);
      timers.current.push(
        setTimeout(
          () =>
            lastAnswerRef.current?.scrollIntoView({
              block: "start",
              behavior: reduce ? "instant" : "smooth",
            }),
          30,
        ),
      );
    } catch (e) {
      if (!controller.signal.aborted) {
        setError(
          "I couldn’t finish that answer. Your question is ready to try again.",
        );
        setInput(question);
      }
    } finally {
      if (!controller.signal.aborted) {
        setPending("");
        request.current = null;
      }
    }
  }
  useEffect(() => {
    if (loaded && initialQuestion && !initialUsed.current) {
      initialUsed.current = true;
      void submit(initialQuestion);
    }
  }, [loaded, initialQuestion]); // Initial contextual navigation only.
  function clear() {
    request.current?.abort();
    request.current = null;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setTurns([]);
    setPending("");
    setInput("");
    setScope({});
    setError("");
    inputRef.current?.focus();
  }
  return (
    <div className="ask-page">
      <div className="ask-page-heading">
        <div>
          <span className="ask-page-label">
            <Sparkles size={14} />
            Your communication, connected
          </span>
          <h1>Ask Miyo</h1>
        </div>
        <button
          className="button secondary"
          onClick={clear}
          disabled={!turns.length && !pending}
        >
          <Plus size={15} />
          New conversation
        </button>
      </div>
      <div className="ask-layout">
        <div className="ask-main">
          {!turns.length && !pending ? (
            <div className="ask-empty">
              <div className="ask-empty-mascot">
                <Mascot size={86} mood="still" />
                <span>
                  <Sparkles size={14} />
                </span>
              </div>
              <h2>
                Ask Miyo anything
                <br />
                about your work.
              </h2>
              <p>
                Miyo can search your messages, projects, commitments, meetings,
                and everything you’ve been keeping track of.
              </p>
              <div className="ask-suggestions">
                {suggestions.map(([label, q, Icon]) => (
                  <button
                    key={q}
                    onClick={() => void submit(q)}
                    disabled={!loaded}
                  >
                    <Icon size={18} />
                    <span>
                      <small>{label}</small>
                      <strong>{q}</strong>
                    </span>
                    <ArrowUpRight size={14} />
                  </button>
                ))}
              </div>
              <div className="ask-coverage">
                <ShieldCheck size={14} />
                Grounded in your sources. Always one click away.
              </div>
            </div>
          ) : (
            <div
              className="ask-conversation"
              aria-label="Conversation with Miyo"
            >
              {turns.map((turn, index) => (
                <article className="ask-turn" key={turn.id}>
                  <div className="ask-user-question">
                    <span>You</span>
                    <p>{turn.question}</p>
                  </div>
                  <div
                    ref={index === turns.length - 1 ? lastAnswerRef : undefined}
                    className="ask-answer-anchor"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: reduce ? 0 : 7 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.24 }}
                    >
                      <Answer
                        answer={turn.answer}
                        onAsk={(q) => void submit(q)}
                        disabled={!!pending}
                      />
                    </motion.div>
                  </div>
                </article>
              ))}
            </div>
          )}
          {pending && (
            <div className="ask-pending" ref={pendingRef}>
              <div className="ask-user-question">
                <span>You</span>
                <p>{pending}</p>
              </div>
              <div role="status" className="ask-thinking">
                <Mascot size={42} mood="thinking" />
                <div>
                  <strong>
                    {phase === 0
                      ? "Checking your messages…"
                      : /atlas/i.test(pending)
                        ? "Looking through Project Atlas…"
                        : "Connecting the dots…"}
                  </strong>
                  <span>Finding the details that support your answer</span>
                </div>
                <span className="ask-thinking-dot" />
              </div>
            </div>
          )}
          {error && (
            <p role="alert" className="ask-error">
              {error}
            </p>
          )}
          <div className="ask-composer-wrap">
            <form
              className="ask-composer"
              onSubmit={(e) => {
                e.preventDefault();
                void submit(input);
              }}
            >
              {scopeLabel && (
                <div className="ask-scope">
                  <Layers3 size={12} />
                  Following {scopeLabel}
                  <button
                    type="button"
                    aria-label="Clear conversation context"
                    onClick={() => setScope({})}
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <div>
                <label className="ask-sr-only" htmlFor="ask-question">
                  Ask Miyo a question
                </label>
                <textarea
                  id="ask-question"
                  ref={inputRef}
                  value={input}
                  maxLength={600}
                  rows={2}
                  placeholder={
                    scopeLabel
                      ? `Ask a follow-up about ${scopeLabel}…`
                      : "Ask about a person, project, or anything on your mind…"
                  }
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      !e.nativeEvent.isComposing
                    ) {
                      e.preventDefault();
                      void submit(input);
                    }
                  }}
                />
                <button
                  className="ask-send"
                  aria-label="Send question"
                  disabled={!input.trim() || !!pending || !loaded}
                >
                  <ArrowUp size={19} />
                </button>
              </div>
            </form>
            <p className="ask-composer-note">
              <span>Demo snapshot · Sep 21, 2026</span>
              <span>Answers link to saved sources</span>
            </p>
          </div>
        </div>
        <aside className="ask-context">
          <details
            open={contextExpanded}
            onToggle={(e) => setContextExpanded(e.currentTarget.open)}
          >
            <summary>
              <span>
                <BookOpen size={15} />
                In the picture
              </span>
              <ChevronDown size={14} />
            </summary>
            <div className="ask-context-content">
              {latest ? (
                <>
                  <span className="ask-context-label">Related projects</span>
                  {latest.relatedProjects.length ? (
                    latest.relatedProjects.map((id) => {
                      const p = kb.projects.find((p) => p.id === id);
                      return (
                        p && (
                          <Link
                            className="ask-context-project"
                            href={projectHref(id)}
                            key={id}
                          >
                            <span>{p.name.charAt(0)}</span>
                            {p.name}
                            <ArrowUpRight size={13} />
                          </Link>
                        )
                      );
                    })
                  ) : (
                    <p>No project linked to this answer.</p>
                  )}
                  <span className="ask-context-label">People involved</span>
                  {latest.relatedPeople.length ? (
                    latest.relatedPeople.map((id) => {
                      const c = kb.contacts.find((c) => c.id === id);
                      return (
                        c && (
                          <button
                            className="ask-context-person"
                            key={id}
                            disabled={!!pending}
                            onClick={() =>
                              void submit(
                                `What am I waiting on from ${c.name}?`,
                              )
                            }
                          >
                            <Avatar name={c.name} size="small" />
                            <span>
                              <strong>{c.name}</strong>
                              <small>{c.role}</small>
                            </span>
                            <ArrowUpRight size={12} />
                          </button>
                        )
                      );
                    })
                  ) : (
                    <p>Ask about a contact to explore their context.</p>
                  )}
                  <span className="ask-context-label">Source platforms</span>
                  <div className="ask-context-providers">
                    {[
                      ...new Set(
                        latest.sources.map((s) => s.platform).filter(Boolean),
                      ),
                    ].map((p) => (
                      <Provider key={p} name={p!} />
                    ))}
                    {!latest.sources.some((s) => s.platform) && (
                      <small>Saved Miyo records</small>
                    )}
                  </div>
                  <span className="ask-context-label">
                    Open threads to track
                  </span>
                  <Link className="ask-context-stat" href="/app/commitments">
                    <span>Commitments in this answer</span>
                    <strong>
                      {
                        latest.commitmentIds.filter(
                          (id) => !demo.state.commitments.includes(id),
                        ).length
                      }
                    </strong>
                  </Link>
                  <Link className="ask-context-stat" href="/app/actions">
                    <span>Related actions</span>
                    <strong>
                      {
                        latest.actionIds.filter(
                          (id) => demo.state.actions[id] !== "done",
                        ).length
                      }
                    </strong>
                  </Link>
                </>
              ) : (
                <>
                  <div className="ask-context-illustration">
                    <span>
                      <Provider name="gmail" compact />
                    </span>
                    <span>
                      <Provider name="outlook" compact />
                    </span>
                    <span>
                      <Provider name="slack" compact />
                    </span>
                    <Sparkles size={17} />
                  </div>
                  <h3>
                    One question.
                    <br />
                    The whole picture.
                  </h3>
                  <p>
                    Follow a conversation across apps, find a promise, or get
                    ready for a meeting.
                  </p>
                  <div className="ask-context-counts">
                    <span>
                      <strong>{seed.messages.length}</strong> saved messages
                    </span>
                    <span>
                      <strong>{seed.projects.length}</strong> connected projects
                    </span>
                    <span>
                      <strong>{seed.contacts.length}</strong> people in your
                      world
                    </span>
                  </div>
                  <span className="ask-context-label">
                    A good place to start
                  </span>
                  <button
                    className="ask-context-project"
                    onClick={() => void submit("Catch me up on Project Atlas")}
                    disabled={!loaded}
                  >
                    <span>A</span>Project Atlas
                    <ArrowUpRight size={13} />
                  </button>
                </>
              )}
              <div className="ask-context-foot">
                <ShieldCheck size={15} />
                <p>
                  Every answer has a trail.
                  <br />
                  Open a source to see the original.
                </p>
              </div>
            </div>
          </details>
        </aside>
      </div>
      <span role="status" className="ask-sr-only">
        {!pending && turns.length
          ? "Miyo’s answer is ready. " + latest?.title
          : ""}
      </span>
    </div>
  );
}
