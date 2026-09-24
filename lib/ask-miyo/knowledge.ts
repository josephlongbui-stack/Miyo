import seed from "../../data/seed.json";
import type { AskState, Knowledge, KnowledgeProject, Source } from "./types";

export const DEMO_DAY = "2026-09-21";
export const projectHref = (id: string) =>
  "/app/projects/" + id.replaceAll("_", "-");
export function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  }).format(new Date(value));
}
/** Normalize the original seed without changing it. Apply the live demo state at query time. */
export function buildKnowledge(state: AskState): Knowledge {
  const sources: Record<string, Source> = {};
  const messages = seed.messages.map((m) => {
    sources[m.id] = {
      id: m.id,
      kind: "message",
      title: m.subject,
      detail: m.senderName + (m.channel ? " · " + m.channel : ""),
      platform: m.provider,
      timestamp: m.timestamp,
      messageId: m.id,
    };
    return {
      id: m.id,
      platform: m.provider,
      senderId: m.senderId,
      sender: m.senderName,
      account: m.accountLabel,
      channel: m.channel,
      timestamp: m.timestamp,
      title: m.subject,
      content: m.body,
      summary: m.summary,
      projectId: m.projectId,
      category: m.attentionCategory,
      needsReply: m.needsReply,
      deadline: m.deadline,
      status: state.messages[m.id] || "open",
    };
  });
  const contacts = seed.contacts.map((c) => {
    sources[c.id] = {
      id: c.id,
      kind: "contact",
      title: c.name,
      detail:
        c.role + " · " + (state.priorities[c.id] || c.priority) + " priority",
      href: "/app/settings?tab=priorities",
    };
    return {
      id: c.id,
      name: c.name,
      role: c.role,
      priority: state.priorities[c.id] || c.priority,
      messageIds: messages.filter((m) => m.senderId === c.id).map((m) => m.id),
    };
  });
  sources.contacts = {
    id: "contacts",
    kind: "contact",
    title: "Your demo contacts",
    detail: "People in your saved communication history",
    href: "/app/settings?tab=priorities",
  };
  const commitments = seed.commitments.map((c) => {
    sources[c.id] = {
      id: c.id,
      kind: "commitment",
      title: c.text,
      detail:
        c.personName +
        " · " +
        (c.direction === "i_owe" ? "I owe" : "Owed to me"),
      platform: c.provider,
      href: "/app/commitments?tab=" + c.direction,
    };
    return {
      id: c.id,
      direction: c.direction,
      person: c.personName,
      contactId: contacts.find((p) => p.name === c.personName)?.id,
      title: c.text,
      dueAt: c.dueAt,
      revisedDueAt: c.revisedDueAt,
      status: state.commitments.includes(c.id) ? "completed" : c.status,
      sourceMessageId: c.sourceMessageId,
      projectId: c.projectId,
      platform: c.provider,
    };
  });
  const actions = seed.actions.map((a) => {
    const message = messages.find((m) => m.id === a.sourceMessageId)!;
    sources[a.id] = {
      id: a.id,
      kind: "action",
      title: a.title,
      detail: "Extracted " + a.kind.replaceAll("_", "-"),
      platform: a.provider,
      href: "/app/actions",
    };
    return {
      id: a.id,
      title: a.title,
      kind: a.kind,
      dueAt: a.dueAt,
      status: state.actions[a.id] || a.state,
      sourceMessageId: a.sourceMessageId,
      contactId: message.senderId,
      projectId: message.projectId,
    };
  });
  const pricingDone = actions.some(
    (a) => a.id === "action_approve_atlas_pricing" && a.status === "done",
  );
  const projects: KnowledgeProject[] = seed.projects.map((p) => {
    sources[p.id] = {
      id: p.id,
      kind: "project",
      title: p.name,
      detail: "Project record · decisions and open questions",
      href: projectHref(p.id),
    };
    return {
      id: p.id,
      name: p.name,
      people: p.participantIds,
      messageIds: messages.filter((m) => m.projectId === p.id).map((m) => m.id),
      summary:
        p.id === "project_atlas" && pricingDone
          ? p.summary.replace(
              "final pricing still needs Alex's approval by 1:30 PM.",
              "Alex has approved final pricing.",
            )
          : p.summary,
      openQuestions:
        p.id === "project_atlas" && pricingDone ? [] : p.openQuestions,
      decisions: p.decisions.map((text, i) => ({
        text,
        sourceIds:
          p.id === "project_atlas"
            ? [
                i === 0
                  ? "msg_atlas_gmail_approval"
                  : "msg_atlas_outlook_calendar",
              ]
            : [p.id],
      })),
    };
  });
  sources.catch_up = {
    id: "catch_up",
    kind: "briefing",
    title: "Catch Me Up",
    detail: "September 21 · supplied demo briefing",
    href: "/app/catch-up?start=1",
  };
  // Meeting start times come from message content. An action's dueAt can instead
  // be a reply deadline (e.g. Rivera); do not confuse the two.
  const meetings = [
    {
      title: "Research check-in",
      startsAt: "2026-09-22T11:30:00-04:00",
      contactIds: ["contact_professor"],
      sourceIds: ["msg_professor_outlook"],
      confirmed: false,
    },
    {
      title: "Project Atlas Demo",
      startsAt: "2026-09-22T14:30:00-04:00",
      contactIds: ["contact_daniel", "contact_maya"],
      projectId: "project_atlas",
      sourceIds: ["msg_atlas_outlook_calendar", "msg_atlas_slack_urgent"],
      confirmed: true,
    },
  ];
  return {
    day: DEMO_DAY,
    sources,
    messages,
    contacts,
    commitments,
    actions,
    projects,
    meetings,
  };
}
