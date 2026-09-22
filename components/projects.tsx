"use client";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowRight,
  Link2,
  Check,
  MessageCircle,
  Clock3,
  Sparkles,
  Users,
  CheckCheck,
} from "lucide-react";
import { seed, projectUrl, useDemo, due, time, type Project } from "./store";
import {
  PageHeading,
  Providers,
  Avatar,
  Summary,
  Provider,
  Button,
  Badge,
  SectionHead,
} from "./ui";
const redesign: Project = {
  id: "client_redesign",
  name: "Client Redesign",
  status: "active",
  providers: ["gmail", "slack"],
  summary:
    "The mobile navigation review is ready. Noah is refining the account menu, and Daniel needs a decision on the onboarding direction before Thursday.",
  latestState: [
    "Mobile navigation review is ready",
    "Account menu refinements are in progress",
    "Onboarding direction needs a decision",
  ],
  decisions: ["Keep the primary navigation to four destinations"],
  openQuestions: [
    "Should the new onboarding start with a product tour or a guided setup?",
  ],
  participantIds: ["contact_noah", "contact_daniel"],
};
const projects = [...seed.projects.slice(0, 2), redesign, seed.projects[2]];
export function Projects() {
  const { state } = useDemo();
  return (
    <>
      <PageHeading
        title="Projects"
        description="Related conversations, together in one place."
      />
      <div className="projects-grid">
        {projects.map((p, i) => (
          <Link
            key={p.id}
            href={projectUrl(p.id)}
            className={"project-card card " + (i === 0 ? "featured" : "")}
          >
            <div className="project-card-top">
              <span className="project-symbol">
                {p.name === "Project Atlas"
                  ? "A"
                  : p.name === "Q4 Launch"
                    ? "Q4"
                    : p.name === "Client Redesign"
                      ? "C"
                      : "I"}
              </span>
              <span className="project-state">
                <span className="active-dot" /> In progress
              </span>
              <ArrowUpRight size={18} />
            </div>
            <h2>{p.name}</h2>
            <p>
              {p.id === "project_atlas" &&
              state.actions.action_approve_atlas_pricing === "done"
                ? "Concept B and final pricing are approved. Tomorrow’s demo starts at 2:30 PM."
                : p.summary}
            </p>
            {i === 0 && (
              <span className="atlas-callout">
                <Sparkles size={14} /> One project, linked across three apps
              </span>
            )}
            <div className="project-card-bottom">
              <Providers names={p.providers} />
              <div className="avatar-stack">
                {p.participantIds.map((id) => (
                  <Avatar
                    key={id}
                    name={seed.contacts.find((c) => c.id === id)!.name}
                    size="small"
                  />
                ))}
              </div>
            </div>
            <div className="project-card-footer">
              <span>
                {p.id === "project_atlas" &&
                state.actions.action_approve_atlas_pricing === "done"
                  ? 0
                  : p.openQuestions.length}{" "}
                open {p.openQuestions.length === 1 ? "question" : "questions"}
              </span>
              <span>
                View project <ArrowRight size={13} />
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="project-explanation">
        <Link2 size={19} />
        <div>
          <strong>Different apps. Shared context.</strong>
          <p>
            Miyo groups conversations by project and keeps the decisions,
            people, and promises together.
          </p>
        </div>
      </div>
    </>
  );
}
export function ProjectDetail({ id }: { id: string }) {
  const { state, completeCommitment, openMessage, act } = useDemo();
  const base = projects.find((x) => x.id === id) || projects[0];
  const pricingDone = state.actions.action_approve_atlas_pricing === "done";
  const p =
    base.id === "project_atlas" && pricingDone
      ? {
          ...base,
          summary: base.summary.replace(
            "final pricing still needs Alex's approval by 1:30 PM.",
            "Alex has approved final pricing.",
          ),
          latestState: base.latestState.map((t) =>
            t.includes("Pricing approval")
              ? "Final pricing approved by Alex"
              : t,
          ),
          openQuestions: [],
        }
      : base;
  const messages = seed.messages
    .filter((m) => m.projectId === p.id)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const commitments = seed.commitments.filter((c) => c.projectId === p.id);
  const actions = seed.actions.filter((a) =>
    messages.some((m) => m.id === a.sourceMessageId),
  );
  return (
    <>
      <Link className="back-link" href="/app/projects">
        <ArrowLeft size={15} />
        All projects
      </Link>
      <PageHeading
        title={p.name}
        description="The full picture, without the app switching."
        action={<Providers names={p.providers} />}
      />
      <div className="project-summary card">
        <div className="summary-title">
          <Sparkles size={18} />
          <strong>Here’s where things stand</strong>
          <span>{p.providers.length} apps connected</span>
        </div>
        <p>{p.summary}</p>
        <div className="project-participants">
          <div className="avatar-stack">
            {p.participantIds.map((id) => (
              <Avatar
                key={id}
                name={seed.contacts.find((c) => c.id === id)!.name}
                size="small"
              />
            ))}
          </div>
          <span>
            {p.participantIds
              .map(
                (id) =>
                  seed.contacts.find((c) => c.id === id)!.name.split(" ")[0],
              )
              .join(", ")}{" "}
            and you
          </span>
          <span className="linked-label">
            <Link2 size={13} />
            Shared context, finally connected
          </span>
        </div>
      </div>
      <div className="project-detail-grid">
        <div>
          <div className="project-state-grid">
            <section className="card padded">
              <SectionHead title="Latest state" icon={<Clock3 size={17} />} />
              {p.latestState.map((t) => (
                <div className="state-line" key={t}>
                  <span className="item-dot" />
                  <p>{t}</p>
                </div>
              ))}
            </section>
            <section className="card padded">
              <SectionHead
                title="Decisions made"
                icon={<CheckCheck size={17} />}
              />
              {p.decisions.length ? (
                p.decisions.map((t) => (
                  <div className="state-line" key={t}>
                    <Check size={15} />
                    <p>{t}</p>
                  </div>
                ))
              ) : (
                <p className="context-copy">
                  The headline decision is still open. Jordan is waiting for
                  your pick.
                </p>
              )}
            </section>
          </div>
          <div className="timeline-heading">
            <SectionHead
              title="One connected conversation"
              icon={<Link2 size={18} />}
            />
            <span className="meta">Oldest to newest</span>
          </div>
          <div className="timeline card">
            {messages.length ? (
              messages.map((m, i) => (
                <button
                  className="timeline-event"
                  key={m.id}
                  onClick={() => openMessage(m.id)}
                >
                  <div className="timeline-rail">
                    <Avatar name={m.senderName} />
                    {i < messages.length - 1 && <span />}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-meta">
                      <strong>{m.senderName}</strong>
                      <Provider name={m.provider} />
                      <span>{time(m.timestamp)}</span>
                    </div>
                    <h3>{m.subject}</h3>
                    <p>{m.summary}</p>
                    <span className="timeline-source">
                      {m.channel || m.accountLabel}
                      <ArrowUpRight size={12} />
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <>
                <div className="timeline-event">
                  <Avatar name="Noah Brooks" />
                  <div className="timeline-content">
                    <div className="timeline-meta">
                      <strong>Noah Brooks</strong>
                      <Provider name="slack" />
                      <span>9:15 AM</span>
                    </div>
                    <h3>Mobile navigation ready for review</h3>
                    <p>
                      The four-destination navigation is ready. Noah is
                      polishing the account menu before the next review.
                    </p>
                  </div>
                </div>
                <div className="timeline-event">
                  <Avatar name="Daniel Ruiz" />
                  <div className="timeline-content">
                    <div className="timeline-meta">
                      <strong>Daniel Ruiz</strong>
                      <Provider name="gmail" />
                      <span>11:05 AM</span>
                    </div>
                    <h3>Let’s settle the onboarding direction</h3>
                    <p>
                      Daniel prefers a guided setup and is waiting for Alex’s
                      feedback before Thursday.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <aside className="project-right">
          <section className="card padded">
            <SectionHead
              title="Open questions"
              icon={<MessageCircle size={17} />}
            />
            {p.openQuestions.length ? (
              p.openQuestions.map((t) => (
                <div className="question-card" key={t}>
                  <span className="badge needs_reply">Waiting on you</span>
                  <p>{t}</p>
                  {p.id === "project_atlas" ? (
                    <Button
                      variant="primary"
                      disabled={
                        state.actions.action_approve_atlas_pricing === "done"
                      }
                      onClick={() =>
                        act("action_approve_atlas_pricing", "done")
                      }
                    >
                      {state.actions.action_approve_atlas_pricing === "done" ? (
                        <>
                          <Check size={14} />
                          Pricing approved
                        </>
                      ) : (
                        "Approve pricing"
                      )}
                    </Button>
                  ) : messages.length > 0 ? (
                    <Button onClick={() => openMessage(messages[0].id)}>
                      Open conversation
                      <ArrowUpRight size={13} />
                    </Button>
                  ) : (
                    <Link className="button secondary" href="/app/inbox">
                      Review conversations
                      <ArrowRight size={13} />
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <div className="state-line">
                <Check size={17} />
                <p>No open decisions. You’re clear here.</p>
              </div>
            )}
          </section>
          <section className="card padded">
            <SectionHead title="Promises to keep" href="/app/commitments" />
            {commitments.length ? (
              commitments.map((c) => (
                <div className="project-commit" key={c.id}>
                  <span className="meta">
                    {c.direction === "i_owe"
                      ? "You → " + c.personName
                      : c.personName + " → You"}
                  </span>
                  <p>{c.text}</p>
                  <div>
                    <span>{due(c.dueAt)}</span>
                    <button
                      className={
                        "check-circle " +
                        (state.commitments.includes(c.id) ? "checked" : "")
                      }
                      aria-label={"Complete " + c.text}
                      onClick={() => completeCommitment(c.id)}
                    >
                      {state.commitments.includes(c.id) && <Check size={13} />}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="context-copy">
                No promises due yet. Miyo is keeping an eye on the conversation.
              </p>
            )}
          </section>
          {actions.length > 0 && (
            <section className="card padded">
              <SectionHead title="Extracted actions" href="/app/actions" />
              {actions.map((a) => (
                <button
                  className="project-action"
                  key={a.id}
                  onClick={() => openMessage(a.sourceMessageId)}
                >
                  <span>{a.title}</span>
                  <ArrowUpRight size={14} />
                </button>
              ))}
            </section>
          )}
          <Link className="button secondary full-width" href="/app/commitments">
            See your commitments
            <ArrowRight size={15} />
          </Link>
        </aside>
      </div>
    </>
  );
}
