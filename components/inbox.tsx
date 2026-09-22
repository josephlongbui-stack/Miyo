"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { sortMessages } from "@/lib/priorities";
import {
  Search,
  X,
  Sparkles,
  Send,
  Clock3,
  Check,
  ArrowUpRight,
  Link2,
  Calendar,
  ListTodo,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import {
  seed,
  useDemo,
  labels,
  time,
  due,
  projectUrl,
  accountConnected,
  allowedInFocus,
} from "./store";
import {
  PageHeading,
  MessageRow,
  Empty,
  Provider,
  Avatar,
  Badge,
  Summary,
  Button,
} from "./ui";
export function Inbox({
  initialCategory = "all",
}: {
  initialCategory?: string;
}) {
  const { state, update, notify } = useDemo();
  const [context, setContext] = useState("all");
  const [category, setCategory] = useState(initialCategory);
  const [provider, setProvider] = useState("all");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("active");
  const [showFilters, setShowFilters] = useState(false);
  const messages = sortMessages(
    seed.messages.filter(
      (m) =>
        accountConnected(m, state) &&
        (status !== "active" || allowedInFocus(m, state)) &&
        (context === "all" || m.context === context) &&
        (category === "all" || m.attentionCategory === category) &&
        (provider === "all" || m.provider === provider) &&
        (!query ||
          [m.senderName, m.subject, m.body, m.summary, m.accountLabel]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase())) &&
        (status === "all" ||
          (status === "active"
            ? !state.messages[m.id]
            : status === "done"
              ? ["done", "replied"].includes(state.messages[m.id])
              : state.messages[m.id] === "snoozed")),
    ),
    state,
  );
  return (
    <>
      <PageHeading
        title="Inbox"
        description="Your conversations, ordered by what matters."
        action={
          <Link className="text-link" href="/app/settings?tab=priorities">
            <SlidersHorizontal size={14} /> Set priorities
          </Link>
        }
      />
      <div className="inbox-tools">
        <div className="segmented" role="group" aria-label="Message context">
          {["all", "work", "personal"].map((x) => (
            <button
              key={x}
              aria-pressed={context === x}
              className={context === x ? "selected" : ""}
              onClick={() => setContext(x)}
            >
              {x === "all" ? "All messages" : labels[x]}
            </button>
          ))}
        </div>
        <div className="search-field">
          <Search size={17} />
          <input
            aria-label="Search messages"
            placeholder="Search your conversations…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button aria-label="Clear search" onClick={() => setQuery("")}>
              <X size={15} />
            </button>
          )}
        </div>
      </div>
      <div className="inbox-layout">
        <section className="card inbox-list">
          <div
            className="category-tabs"
            role="group"
            aria-label="Attention category"
          >
            {[
              "all",
              "urgent",
              "important",
              "needs_reply",
              "casual",
              "low_priority",
            ].map((x) => (
              <button
                aria-pressed={category === x}
                key={x}
                className={category === x ? "selected" : ""}
                onClick={() => setCategory(x)}
              >
                {x === "all" ? "All" : labels[x]}
              </button>
            ))}
          </div>
          <div className="inbox-toolbar">
            <span>{messages.length} conversations</span>
            <button
              className="filter-toggle"
              aria-expanded={showFilters}
              aria-controls="inbox-filters"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={14} /> Filters
              {(provider !== "all" || status !== "active") && (
                <span className="filter-active-dot" />
              )}
            </button>
          </div>
          {showFilters && (
            <div className="inbox-filters" id="inbox-filters">
              <label>
                App
                <select
                  aria-label="Filter by provider"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                >
                  <option value="all">All apps</option>
                  {["gmail", "outlook", "slack"].map((x) => (
                    <option value={x} key={x}>
                      {labels[x]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Status
                <select
                  aria-label="Message status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="snoozed">Snoozed</option>
                  <option value="done">Done</option>
                  <option value="all">All statuses</option>
                </select>
              </label>
            </div>
          )}
          {messages.length ? (
            messages.map((m) => (
              <div key={m.id}>
                <MessageRow message={m} />
                {state.messages[m.id] && (
                  <div className="restore-row">
                    <span>
                      <Check size={12} />
                      {state.messages[m.id] === "snoozed"
                        ? "Snoozed for later"
                        : state.messages[m.id] === "replied"
                          ? "Replied in demo"
                          : "Marked done"}
                    </span>
                    <button
                      onClick={() => {
                        update((s) => {
                          const updated = { ...s.messages };
                          delete updated[m.id];
                          return { ...s, messages: updated };
                        });
                        notify("Message moved back to your inbox.");
                      }}
                    >
                      Restore to inbox
                      <RotateCcw size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <Empty
              title="A little quiet here."
              description="No conversations match these filters."
              action={
                <Button
                  onClick={() => {
                    setContext("all");
                    setCategory("all");
                    setProvider("all");
                    setQuery("");
                    setStatus("active");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          )}
        </section>
      </div>
    </>
  );
}
export function MessageDetail() {
  const {
    selected: m,
    replyIntent,
    closeMessage,
    state,
    update,
    markMessage,
    act,
    notify,
  } = useDemo();
  const dialog = useRef<HTMLDialogElement>(null);
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [reply, setReply] = useState("");
  const [composing, setComposing] = useState(false);
  const [drafting, setDrafting] = useState(false);
  useEffect(() => {
    if (m) {
      dialog.current?.showModal();
      setReply(state.replies[m.id] || "");
      setComposing(!!replyIntent);
      setDrafting(false);
      if (replyIntent === "draft") {
        setDrafting(true);
        draftTimer.current = setTimeout(() => {
          setReply(
            (seed.suggestedReplies as Record<string, string[]>)[m.id]?.[0] ||
              `Thanks, ${m.senderName.split(" ")[0]}. I've seen your message and will follow up shortly.`,
          );
          setDrafting(false);
        }, 850);
      }
    } else dialog.current?.close();
    return () => {
      if (draftTimer.current) clearTimeout(draftTimer.current);
    };
  }, [m?.id]);
  if (!m) return null;
  const actions = seed.actions.filter((a) => a.sourceMessageId === m.id);
  const commitments = seed.commitments.filter(
    (c) => c.sourceMessageId === m.id,
  );
  const replies = (seed.suggestedReplies as Record<string, string[]>)[m.id] || [
    `Thanks, ${m.senderName.split(" ")[0]}. I've seen your message and will follow up shortly.`,
  ];
  function aiDraft() {
    setComposing(true);
    setDrafting(true);
    draftTimer.current = setTimeout(() => {
      setReply(replies[0]);
      setDrafting(false);
    }, 850);
  }
  return (
    <dialog
      ref={dialog}
      className="message-dialog"
      aria-labelledby="message-title"
      onCancel={closeMessage}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeMessage();
      }}
    >
      <div className="dialog-inner">
        <header className="dialog-header">
          <div>
            <Provider name={m.provider} />
            <span className="meta">{m.accountLabel}</span>
          </div>
          <button
            onClick={closeMessage}
            className="icon-button"
            aria-label="Close message"
          >
            <X size={18} />
          </button>
        </header>
        <div className="dialog-body">
          <div className="flex-row message-sender">
            <Avatar name={m.senderName} />
            <div>
              <strong>{m.senderName}</strong>
              <p>{time(m.timestamp)} · September 21</p>
            </div>
            <Badge value={state.priorities[m.senderId] || m.senderPriority} />
          </div>
          <h2 id="message-title">{m.subject}</h2>
          <div className="detail-tags">
            <Badge value={m.attentionCategory} />
            <span>{labels[m.context]}</span>
            {m.deadline && (
              <span>
                <Clock3 size={13} />
                {due(m.deadline)}
              </span>
            )}
          </div>
          <Summary>{m.summary}</Summary>
          <div className="original-message">
            <span className="eyebrow">
              THE ORIGINAL MESSAGE {m.channel && ` · ${m.channel}`}
            </span>
            <p>{m.body}</p>
          </div>
          {m.projectId && (
            <Link
              onClick={closeMessage}
              href={projectUrl(m.projectId)}
              className="related-link"
            >
              <Link2 size={16} />
              {seed.projects.find((p) => p.id === m.projectId)?.name}
              <span>
                Open linked project
                <ArrowUpRight size={14} />
              </span>
            </Link>
          )}
          {actions.length > 0 && (
            <div className="extracted">
              <h3>
                <Sparkles size={15} /> Miyo found a next step
              </h3>
              {actions.map((a) => (
                <div className="extracted-row" key={a.id}>
                  <div>
                    <p>{a.title}</p>
                    <span>{due(a.dueAt)}</span>
                  </div>
                  <Button
                    onClick={() =>
                      act(a.id, a.kind === "approval" ? "done" : "added")
                    }
                    disabled={
                      !!state.actions[a.id] &&
                      state.actions[a.id] !== "suggested"
                    }
                  >
                    {state.actions[a.id] &&
                    state.actions[a.id] !== "suggested" ? (
                      <>
                        <Check size={14} />
                        {state.actions[a.id] === "done" ? "Done" : "Added"}
                      </>
                    ) : a.kind === "meeting" ? (
                      <>
                        <Calendar size={14} />
                        Add to Calendar
                      </>
                    ) : a.kind === "approval" ? (
                      "Approve pricing"
                    ) : (
                      <>
                        <ListTodo size={14} />
                        Create Task
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
          {commitments.map((c) => (
            <Link
              key={c.id}
              onClick={closeMessage}
              href="/app/commitments"
              className="related-link"
            >
              <Check size={15} />
              Commitment: {c.text}
              <ArrowUpRight size={14} />
            </Link>
          ))}
          {state.replies[m.id] && (
            <div className="sent-reply">
              <span>
                <Check size={14} /> Your demo reply
              </span>
              <p>{state.replies[m.id]}</p>
            </div>
          )}
          {composing && (
            <form
              className="reply-composer"
              onSubmit={(e) => {
                e.preventDefault();
                if (!reply.trim()) return;
                update((s) => ({
                  ...s,
                  replies: { ...s.replies, [m.id]: reply.trim() },
                }));
                markMessage(m.id, "replied");
                setComposing(false);
              }}
            >
              <label htmlFor="reply">Reply to {m.senderName}</label>
              {drafting ? (
                <div className="draft-loading">
                  <Sparkles size={16} /> Finding the right words…
                </div>
              ) : (
                <textarea
                  id="reply"
                  autoFocus
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write a reply…"
                />
              )}
              <div>
                <span className="meta">
                  Demo only · nothing is sent externally
                </span>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!reply.trim() || drafting}
                >
                  <Send size={14} />
                  Send reply
                </Button>
              </div>
            </form>
          )}
        </div>
        <footer className="dialog-footer">
          <div>
            <Button variant="primary" onClick={() => setComposing(true)}>
              <Send size={14} />
              Reply
            </Button>
            <Button onClick={aiDraft} disabled={drafting}>
              <Sparkles size={14} />
              AI Draft
            </Button>
          </div>
          <div>
            <Button
              onClick={() => {
                markMessage(m.id, "snoozed");
                closeMessage();
              }}
            >
              <Clock3 size={14} />
              Snooze
            </Button>
            <Button
              onClick={() => {
                markMessage(m.id, "done");
                closeMessage();
              }}
            >
              <Check size={14} />
              Mark Done
            </Button>
          </div>
        </footer>
      </div>
    </dialog>
  );
}
