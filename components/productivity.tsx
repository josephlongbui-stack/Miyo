"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Clock3,
  Bell,
  ArrowUpRight,
  ArrowRight,
  Calendar,
  ListTodo,
  Flag,
  Sun,
  Moon,
  Sparkles,
  CheckCheck,
  MessageCircle,
} from "lucide-react";
import { seed, useDemo, due, labels, projectUrl } from "./store";
import {
  PageHeading,
  Button,
  Provider,
  Avatar,
  Badge,
  Empty,
  SectionHead,
  Summary,
  Mascot,
} from "./ui";
export function Commitments({ initialTab = "i_owe" }: { initialTab?: string }) {
  const { state, completeCommitment, remind, openMessage } = useDemo();
  const [tab, setTab] = useState(initialTab);
  const [filter, setFilter] = useState("all");
  const items = seed.commitments
    .filter((c) => c.direction === tab)
    .filter((c) =>
      filter === "completed"
        ? state.commitments.includes(c.id)
        : !state.commitments.includes(c.id) &&
          (filter === "all" ||
            (filter === "overdue" && c.status === "overdue") ||
            (filter === "today" && c.dueAt.startsWith("2026-09-21")) ||
            (filter === "upcoming" && c.dueAt > "2026-09-21T23:59")),
    );
  return (
    <>
      <PageHeading
        title="Commitments"
        description="The promises you make, and the ones you’re waiting on."
        action={
          <Link href="/app/focus" className="button secondary">
            <Moon size={16} />
            Make time to focus
          </Link>
        }
      />
      <div className="commitments-controls">
        <div
          className="segmented"
          role="group"
          aria-label="Commitment direction"
        >
          {[
            ["i_owe", "I Owe"],
            ["owed_to_me", "Owed to Me"],
          ].map(([v, l]) => (
            <button
              key={v}
              aria-pressed={tab === v}
              className={tab === v ? "selected" : ""}
              onClick={() => setTab(v)}
            >
              {l}
              <span>
                {
                  seed.commitments.filter(
                    (c) =>
                      c.direction === v && !state.commitments.includes(c.id),
                  ).length
                }
              </span>
            </button>
          ))}
        </div>
        <div
          className="filter-pills"
          role="group"
          aria-label="Commitment status"
        >
          {[
            ["all", "All open"],
            ["today", "Due today"],
            ["upcoming", "Upcoming"],
            ["overdue", "Overdue"],
            ["completed", "Completed"],
          ].map(([v, l]) => (
            <button
              aria-pressed={filter === v}
              key={v}
              onClick={() => setFilter(v)}
              className={filter === v ? "selected" : ""}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="commitment-list">
        {items.length ? (
          items.map((c) => (
            <article className="card commitment-row" key={c.id}>
              <button
                className={
                  "check-circle " +
                  (state.commitments.includes(c.id) ? "checked" : "")
                }
                aria-label={
                  (state.commitments.includes(c.id) ? "Reopen " : "Complete ") +
                  c.text
                }
                onClick={() => completeCommitment(c.id)}
              >
                {state.commitments.includes(c.id) && <Check size={15} />}
              </button>
              <div className="commitment-copy">
                <div className="flex-row">
                  <Avatar name={c.personName} size="small" />
                  <span>
                    {tab === "i_owe"
                      ? "You owe " + c.personName
                      : c.personName + " owes you"}
                  </span>
                  <Provider name={c.provider} />
                </div>
                <h2
                  className={
                    state.commitments.includes(c.id) ? "completed-text" : ""
                  }
                >
                  {c.text}
                </h2>
                <div className="commitment-meta">
                  <span
                    className={
                      c.status === "overdue" &&
                      !state.commitments.includes(c.id)
                        ? "overdue-label"
                        : ""
                    }
                  >
                    <Clock3 size={13} />
                    {due(c.dueAt)}
                  </span>
                  {c.status === "overdue" &&
                    !state.commitments.includes(c.id) && (
                      <Badge value="Overdue" />
                    )}
                  {c.projectId && (
                    <Link href={projectUrl(c.projectId)}>
                      {seed.projects.find((p) => p.id === c.projectId)?.name}
                      <ArrowUpRight size={12} />
                    </Link>
                  )}
                </div>
                {"revisedDueAt" in c && c.revisedDueAt && (
                  <p className="revised-due">
                    New promised time: {due(c.revisedDueAt)}
                  </p>
                )}
              </div>
              <div className="commitment-buttons">
                <Button
                  onClick={() => remind(c.id)}
                  disabled={state.reminders.includes(c.id)}
                >
                  <Bell size={14} />
                  {state.reminders.includes(c.id) ? "Reminder set" : "Remind"}
                </Button>
                <button
                  className="text-link"
                  onClick={() => openMessage(c.sourceMessageId)}
                >
                  Open conversation
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="card">
            <Empty
              title={
                filter === "completed"
                  ? "Good things take a first step."
                  : filter === "upcoming"
                    ? "Nothing coming up just yet."
                    : "Nothing you owe here. Nice."
              }
              description={
                filter === "completed"
                  ? "Completed commitments will be waiting right here."
                  : "Miyo will keep track when a new promise appears."
              }
            />
          </div>
        )}
      </div>
      <div className="reassurance">
        <Sparkles size={16} /> Little promises deserve a place outside your
        head.
      </div>
    </>
  );
}
export function Actions() {
  const { state, act, openMessage } = useDemo();
  const [filter, setFilter] = useState("all");
  const groups = [
    ["meeting", "Meetings", Calendar],
    ["task", "Tasks", ListTodo],
    ["approval", "Approvals", CheckCheck],
    ["deadline", "Deadlines", Flag],
    ["follow_up", "Follow-ups", Bell],
  ] as const;
  return (
    <>
      <PageHeading
        title="Actions"
        description="Meetings, tasks, and deadlines — already found for you."
      />
      <div className="action-overview">
        <span>
          <Sparkles size={18} />
          Extracted from your conversations
        </span>
        <div className="segmented" role="group" aria-label="Action status">
          {["all", "suggested", "added", "done"].map((x) => (
            <button
              key={x}
              className={filter === x ? "selected" : ""}
              aria-pressed={filter === x}
              onClick={() => setFilter(x)}
            >
              {x[0].toUpperCase() + x.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="actions-grid">
        {groups.map(([kind, label, Icon]) => {
          const items = seed.actions.filter(
            (a) =>
              a.kind === kind &&
              (filter === "all" ||
                (state.actions[a.id] || "suggested") === filter),
          );
          if (!items.length) return null;
          return (
            <section key={kind} className="action-group">
              <SectionHead title={label} icon={<Icon size={18} />} />
              {items.map((a) => {
                const status = state.actions[a.id] || "suggested";
                return (
                  <article
                    className={
                      "card action-card " + (status === "done" ? "is-done" : "")
                    }
                    key={a.id}
                  >
                    <div className="flex-row">
                      <Provider name={a.provider} />
                      <span className={"action-state " + status}>
                        {status === "suggested"
                          ? "Ready when you are"
                          : status === "reminded"
                            ? "Reminder set"
                            : status === "done"
                              ? "Completed"
                              : "Added"}
                      </span>
                    </div>
                    <h3>{a.title}</h3>
                    <p className="action-due">
                      <Clock3 size={13} />
                      {due(a.dueAt)}
                    </p>
                    <button
                      className="text-link"
                      onClick={() => openMessage(a.sourceMessageId)}
                    >
                      See where this came from
                      <ArrowUpRight size={12} />
                    </button>
                    <div className="action-buttons">
                      {status === "done" ? (
                        <Button disabled>
                          <Check size={15} />
                          Done
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant={
                              status === "suggested" ? "primary" : "secondary"
                            }
                            onClick={() =>
                              act(
                                a.id,
                                status === "added" || a.kind === "approval"
                                  ? "done"
                                  : "added",
                              )
                            }
                          >
                            {status === "added" ? (
                              <>
                                <Check size={14} />
                                Mark Done
                              </>
                            ) : kind === "meeting" ? (
                              <>
                                <Calendar size={14} />
                                Add to Calendar
                              </>
                            ) : kind === "approval" ? (
                              <>
                                <Check size={14} />
                                Approve
                              </>
                            ) : (
                              <>
                                <ListTodo size={14} />
                                Create Task
                              </>
                            )}
                          </Button>
                          <button
                            className="icon-button"
                            disabled={status === "reminded"}
                            aria-label={"Remind me: " + a.title}
                            onClick={() => act(a.id, "reminded")}
                          >
                            <Bell size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>
          );
        })}
      </div>
      {!seed.actions.some(
        (a) =>
          filter === "all" || (state.actions[a.id] || "suggested") === filter,
      ) && (
        <div className="card">
          <Empty
            title="A clear view of what’s next."
            description="No actions in this view. Your suggested actions are ready when you are."
            action={
              <Button onClick={() => setFilter("suggested")}>
                See suggested actions
              </Button>
            }
          />
        </div>
      )}
    </>
  );
}
export function Briefings() {
  const [tab, setTab] = useState("morning");
  const { state, openMessage } = useDemo();
  const evening = tab === "evening";
  const data = evening ? seed.briefings.evening : seed.briefings.morning;
  return (
    <>
      <PageHeading
        title="Briefings"
        description="Start with a clear plan. Finish with a lighter mind."
      />
      <div
        className="segmented briefing-tabs"
        role="group"
        aria-label="Briefing time"
      >
        <button
          className={!evening ? "selected" : ""}
          aria-pressed={!evening}
          onClick={() => setTab("morning")}
        >
          <Sun size={16} />
          Morning Briefing
        </button>
        <button
          className={evening ? "selected" : ""}
          aria-pressed={evening}
          onClick={() => setTab("evening")}
        >
          <Moon size={16} />
          Evening Wrap-Up
        </button>
      </div>
      <div className={"daily-briefing " + (evening ? "evening" : "morning")}>
        <div className="daily-briefing-header">
          <span className="day-icon">
            {evening ? <Moon size={28} /> : <Sun size={30} />}
          </span>
          <span className="eyebrow">MONDAY, SEPTEMBER 21</span>
          <h2>{data.title}.</h2>
          <p>{data.subtitle}</p>
        </div>
        <div className="daily-stat-row">
          {(evening
            ? [
                [seed.briefings.evening.unansweredImportant, "important reply"],
                [
                  seed.briefings.evening.commitmentsRemaining,
                  "promise for tonight",
                ],
                [
                  seed.briefings.evening.safeUntilTomorrow,
                  "can wait until tomorrow",
                ],
                [
                  seed.briefings.evening.completedToday +
                    state.commitments.length,
                  "tasks completed",
                ],
              ]
            : [
                [seed.briefings.morning.urgentCount, "urgent items"],
                [
                  seed.briefings.morning.commitmentsDue -
                    state.commitments.length,
                  "commitments due",
                ],
                ["10:30", "first meeting"],
                [seed.briefings.morning.peopleWaiting, "people waiting"],
              ]
          ).map(([n, l]) => (
            <div key={l}>
              <strong>{n}</strong>
              <span>{l}</span>
            </div>
          ))}
        </div>
        <div className="daily-content">
          <section>
            <SectionHead
              title={evening ? "A few loose ends" : "Your priorities today"}
              icon={<Sparkles size={17} />}
            />
            {data.highlights.map((h, i) => (
              <button
                className="daily-highlight"
                key={h}
                onClick={() =>
                  openMessage(
                    (evening
                      ? [
                          "msg_professor_outlook",
                          "msg_mom_personal",
                          "msg_newsletter_gmail",
                        ]
                      : [
                          "msg_atlas_gmail_approval",
                          "msg_investor_gmail",
                          "msg_professor_outlook",
                        ])[i],
                  )
                }
              >
                <span className="number-bubble">{i + 1}</span>
                <p>{h}</p>
                <ArrowUpRight size={15} />
              </button>
            ))}
          </section>
          <aside>
            <h3>
              {evening ? "Permission to sign off." : "A little room for you."}
            </h3>
            <p>
              {evening
                ? "You moved things forward today. Let the lower-priority messages wait until morning."
                : "Your first meeting is the 10:30 AM Product sync. There’s space to settle the Atlas pricing decision before lunch."}
            </p>
            <Link
              href={evening ? "/app/commitments" : "/app/actions"}
              className="text-link"
            >
              {evening ? "Review your commitments" : "See your next steps"}
              <ArrowRight size={15} />
            </Link>
          </aside>
        </div>
        <div className="daily-footer">
          <Mascot size={59} />
          <p>
            {evening
              ? "Close the tabs. You’ve done enough for today."
              : "You know what matters. Let’s make it a good day."}
          </p>
          <Link href="/app/focus" className="button secondary">
            {evening ? "Wind down" : "Make time to focus"}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </>
  );
}
