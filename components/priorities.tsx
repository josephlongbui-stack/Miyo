"use client";
import { AskLink } from "./ask-entry";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Hash } from "lucide-react";
import {
  seed,
  useDemo,
  labels,
  accountConnected,
  allowedInFocus,
} from "./store";
import { Avatar, Provider } from "./ui";
import {
  priorityLevels,
  priorityPlaces,
  messagePriority,
  sortMessages,
} from "@/lib/priorities";

export function PrioritySettings() {
  const { state, update, notify } = useDemo();
  const [tab, setTab] = useState("people");
  const ordered = sortMessages(
    seed.messages.filter(
      (m) =>
        !state.messages[m.id] &&
        accountConnected(m, state) &&
        allowedInFocus(m, state),
    ),
    state,
  );
  function setPriority(
    kind: "person" | "place",
    id: string,
    name: string,
    value: string,
  ) {
    update((s) =>
      kind === "person"
        ? { ...s, priorities: { ...s.priorities, [id]: value } }
        : { ...s, placePriorities: { ...s.placePriorities, [id]: value } },
    );
    notify(
      `${name}: ${value === "inherit" ? "using workspace priority" : labels[value] + " priority"}. Inbox order updated.`,
    );
  }
  return (
    <div className="priority-settings">
      <div className="settings-section-head">
        <div>
          <h2>People & places</h2>
          <p>Choose who and where deserves your attention first.</p>
        </div>
      </div>
      <div className="priority-levels" aria-label="Priority order">
        <span>VIP</span>
        <span aria-hidden="true">→</span>
        <span>High</span>
        <span aria-hidden="true">→</span>
        <span>Normal</span>
        <span aria-hidden="true">→</span>
        <span>Low</span>
      </div>
      <p className="priority-intro">
        Urgent messages stay first. Your priorities order the rest.
      </p>
      <div className="priority-controls">
        <div className="segmented" role="group" aria-label="Priority type">
          <button
            className={tab === "people" ? "selected" : ""}
            aria-pressed={tab === "people"}
            onClick={() => setTab("people")}
          >
            Contacts
          </button>
          <button
            className={tab === "places" ? "selected" : ""}
            aria-pressed={tab === "places"}
            onClick={() => setTab("places")}
          >
            Places
          </button>
        </div>
        <span className="priority-saved">
          <Check size={13} /> Saved automatically
        </span>
      </div>
      {tab === "people" ? (
        <div className="contacts-list">
          {seed.contacts.map((c) => (
            <div className="contact-row" key={c.id}>
              <Avatar name={c.name} />
              <div className="priority-row-copy">
                <h3>{c.name}</h3>
                <AskLink question={`What did ${c.name} ask me to do?`}>
                  Ask about {c.name.split(" ")[0]}
                </AskLink>
                <p>
                  {c.role} · {labels[c.context]}
                </p>
              </div>
              <select
                aria-label={"Priority for " + c.name}
                value={state.priorities[c.id]}
                onChange={(e) =>
                  setPriority("person", c.id, c.name, e.target.value)
                }
              >
                {priorityLevels.map((p) => (
                  <option key={p} value={p}>
                    {labels[p]}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ) : (
        <div className="priority-places">
          {(["account", "channel"] as const).map((kind) => (
            <section className="priority-place-group" key={kind}>
              <h3>
                {kind === "account" ? "Inboxes & workspaces" : "Slack channels"}
              </h3>
              {priorityPlaces
                .filter((p) => p.kind === kind)
                .map((p) => (
                  <div className="place-priority-row" key={p.id}>
                    <span className="place-priority-icon">
                      {kind === "channel" ? (
                        <Hash size={18} />
                      ) : (
                        <Provider name={p.provider} compact />
                      )}
                    </span>
                    <div className="priority-row-copy">
                      <h3>{p.name}</h3>
                      <p>
                        {p.detail}
                        {!state.accounts[p.accountId] && " · Disconnected"}
                      </p>
                    </div>
                    <select
                      aria-label={`Priority for ${p.name}${kind === "channel" ? " in " + p.detail : ""}`}
                      value={state.placePriorities[p.id]}
                      onChange={(e) =>
                        setPriority("place", p.id, p.name, e.target.value)
                      }
                    >
                      {kind === "channel" && (
                        <option value="inherit">
                          Use workspace (
                          {labels[state.placePriorities[p.accountId]] ||
                            "Normal"}
                          )
                        </option>
                      )}
                      {["high", "normal", "low"].map((level) => (
                        <option key={level} value={level}>
                          {labels[level]}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
            </section>
          ))}
        </div>
      )}
      <details className="priority-explanation">
        <summary>How priorities work</summary>
        <p>
          VIP contacts come before High, Normal, and Low. Normal contacts follow
          their place’s priority. When both have a custom priority, the higher
          one wins. A channel can use its workspace’s setting or have its own.
        </p>
        <p>
          Urgent messages always come first. Priority doesn’t change a message’s
          urgency or allow a place to interrupt Focus Mode. Within the same
          priority, Miyo considers the message category, then the newest
          message.
        </p>
      </details>
      <details className="priority-order">
        <summary>
          Preview inbox order <span>{ordered.length} conversations</span>
        </summary>
        <ol aria-label="Inbox priority preview">
          {ordered.map((m, index) => (
            <li key={m.id}>
              <span className="priority-position">{index + 1}</span>
              <div>
                <strong>{m.senderName}</strong>
                <p>{m.subject}</p>
                <span>{m.channel || m.accountLabel}</span>
              </div>
              <span
                className={
                  m.attentionCategory === "urgent" ? "preview-urgent" : ""
                }
              >
                {m.attentionCategory === "urgent"
                  ? "Urgent"
                  : labels[messagePriority(m, state)]}
              </span>
            </li>
          ))}
        </ol>
        {!ordered.length && (
          <p className="priority-intro">
            No active conversations in this view.
          </p>
        )}
      </details>
      <Link className="text-link priority-inbox-link" href="/app/inbox">
        View your inbox <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}
