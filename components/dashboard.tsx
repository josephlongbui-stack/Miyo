"use client";
import Link from "next/link";
import { sortMessages } from "@/lib/priorities";
import { ArrowUpRight, CircleCheck } from "lucide-react";
import {
  CatchCard,
  AtlasMini,
  SectionHead,
  PageHeading,
  MessageRow,
  Empty,
} from "./ui";
import { seed, useDemo, due, accountConnected, allowedInFocus } from "./store";

export function Dashboard({ preview = false }: { preview?: boolean }) {
  const { state, completeCommitment } = useDemo();
  const messages = seed.messages.filter(
    (m) =>
      !state.messages[m.id] &&
      accountConnected(m, state) &&
      allowedInFocus(m, state),
  );
  const priority = sortMessages(
    messages.filter((m) => m.attentionCategory === "urgent"),
    state,
  );
  const needsYou = seed.messages.filter(
    (m) =>
      [
        "msg_atlas_slack_urgent",
        "msg_atlas_gmail_approval",
        "msg_investor_gmail",
      ].includes(m.id) && !state.messages[m.id],
  ).length;
  const counts = [
    {
      key: "urgent",
      label: "Urgent",
      count: Math.max(
        0,
        2 -
          seed.messages.filter(
            (m) => m.attentionCategory === "urgent" && state.messages[m.id],
          ).length,
      ),
    },
    {
      key: "important",
      label: "Important",
      count: Math.max(
        0,
        5 -
          seed.messages.filter(
            (m) => m.attentionCategory === "important" && state.messages[m.id],
          ).length,
      ),
    },
    {
      key: "needs_reply",
      label: "Needs reply",
      count: Math.max(
        0,
        7 -
          seed.messages.filter((m) => m.needsReply && state.messages[m.id])
            .length,
      ),
    },
  ];
  return (
    <div className={preview ? "dashboard-preview" : "dashboard-page"}>
      <PageHeading
        eyebrow="Monday, September 21"
        title="Good morning, Alex."
        description={
          needsYou
            ? `${needsYou} ${needsYou === 1 ? "thing needs" : "things need"} you today. The rest can wait.`
            : "You’re clear for now. The rest can wait."
        }
        action={
          <Link href="/app/briefings" className="text-link morning-link">
            Morning briefing <ArrowUpRight size={14} />
          </Link>
        }
      />
      <CatchCard />
      <section className="home-section" aria-label="Needs attention">
        <SectionHead
          title="Needs attention"
          href="/app/inbox"
          label="Open inbox"
        />
        <div className="attention-overview">
          <div>
            {counts.map(({ key, label, count }) => (
              <Link
                href={`/app/inbox?category=${key}`}
                key={key}
                className={key}
              >
                <span className="attention-dot" />
                <b>{count}</b> {label}
              </Link>
            ))}
          </div>
          <Link
            href="/app/inbox?category=low_priority"
            className="deferred-link"
          >
            31 can wait <ArrowUpRight size={13} />
          </Link>
        </div>
        <div className="priority-list">
          {priority.length ? (
            priority.map((m) => <MessageRow key={m.id} message={m} preview />)
          ) : (
            <Empty
              title="Nothing urgent right now."
              description="You can keep focusing."
            />
          )}
        </div>
      </section>
      <section className="home-section" aria-label="Your commitments">
        <SectionHead title="Your commitments" href="/app/commitments" />
        <div className="commitments-mini">
          {seed.commitments
            .filter((c) => c.direction === "i_owe")
            .map((c) => (
              <div className="mini-commitment" key={c.id}>
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
                  {state.commitments.includes(c.id) && (
                    <CircleCheck size={18} />
                  )}
                </button>
                <div>
                  <h3
                    className={
                      state.commitments.includes(c.id) ? "completed-text" : ""
                    }
                  >
                    {c.text}
                  </h3>
                  <p>For {c.personName}</p>
                </div>
                <span className="due-label">{due(c.dueAt)}</span>
              </div>
            ))}
        </div>
      </section>
      <section className="home-section" aria-label="Projects">
        <SectionHead title="Projects" href="/app/projects" />
        <AtlasMini />
      </section>
    </div>
  );
}
