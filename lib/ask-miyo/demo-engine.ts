import { buildKnowledge, dateLabel } from "./knowledge";
import { normalize, retrieve } from "./retrieval";
import type {
  AskAnswer,
  AskRequest,
  AnswerSection,
  KnowledgeCommitment,
  KnowledgeMessage,
} from "./types";

/** Pure, deterministic answer generation. Every claim refers to an existing source ID. */
export function answerDemo({
  question,
  context,
  state,
}: Omit<AskRequest, "signal">): AskAnswer {
  const kb = buildKnowledge(state);
  const found = retrieve(question, context, kb);
  const q = normalize(question);
  const { project, contact, intent } = found;
  const sections: AnswerSection[] = [];
  let commitmentIds: string[] = [],
    actionIds: string[] = [];
  let title = "Here’s what I found",
    intro = "",
    note: string | undefined;
  let meeting: AskAnswer["meeting"];
  const followUps: string[] = [];
  const section = (name: string, items: AnswerSection["items"]) => {
    if (items.length) sections.push({ title: name, items });
  };
  const claim = (text: string, ...sourceIds: string[]) => ({ text, sourceIds });
  const open = (c: KnowledgeCommitment) => c.status !== "completed";
  const messageItem = (m: KnowledgeMessage) =>
    claim(
      m.summary +
        (m.status === "replied"
          ? " You’ve replied in the demo."
          : m.status === "done"
            ? " You’ve marked this done."
            : m.status === "snoozed"
              ? " You’ve snoozed this."
              : ""),
      m.id,
    );
  const pendingActions = found.actions.filter(
    (a) =>
      a.status !== "done" &&
      state.messages[a.sourceMessageId] !== "replied" &&
      state.messages[a.sourceMessageId] !== "done",
  );
  const cardCommitments = (items: KnowledgeCommitment[]) => {
    commitmentIds = items.map((c) => c.id);
  };
  const actionItems = (items = pendingActions) =>
    items.map((a) =>
      claim(
        `${a.title} — ${dateLabel(a.dueAt)}${a.status === "added" ? " · already added to your demo list" : ""}.`,
        a.sourceMessageId,
        a.id,
      ),
    );
  const selectedMessages = found.messages;

  if (found.unknownPerson) {
    title = `I couldn’t find ${found.unknownPerson}`;
    intro =
      "I can’t verify a promise or message for someone who isn’t in this demo’s saved history.";
    section("What I can verify", [
      claim(
        "Your saved contacts include Sarah Patel, Maya Chen, and Daniel Ruiz. James is not listed.".replace(
          "James",
          found.unknownPerson,
        ),
        "contacts",
      ),
    ]);
    section("A useful next step", [
      claim(
        "Check the name in People & places, or ask what you owe across all your saved conversations.",
        "contacts",
      ),
    ]);
    followUps.push("Who is waiting on me?", "What am I waiting on from Sarah?");
  } else if (found.unsupportedPeriod) {
    title = "That time range isn’t in this demo";
    intro =
      "The saved messages cover September 21, 2026. I can show that snapshot, but can’t verify older communication history.";
    section("Available history", selectedMessages.slice(0, 3).map(messageItem));
    followUps.push("What changed today?", "Catch me up on Project Atlas");
  } else if (intent === "meeting") {
    title = contact
      ? `Meeting prep · ${contact.name}`
      : project
        ? `Meeting prep · ${project.name}`
        : "Ready for your next meeting";
    const event = kb.meetings.find(
      (m) =>
        (!contact || m.contactIds.includes(contact.id)) &&
        (!project || m.projectId === project.id),
    );
    if (event) {
      const people = kb.contacts.filter((c) => event.contactIds.includes(c.id));
      meeting = {
        title: event.title,
        when:
          dateLabel(event.startsAt) + (event.confirmed ? "" : " · proposed"),
        person: people.map((p) => `${p.name} · ${p.role}`).join(" / "),
      };
      intro =
        "The context to carry into the conversation, with the original messages one click away.";
      section("Meeting", [
        claim(
          `${event.title}: ${dateLabel(event.startsAt)}${event.confirmed ? "." : ". This change is still a request, not a confirmed calendar booking."}`,
          ...event.sourceIds,
        ),
      ]);
      section(
        "Who",
        people.map((c) => claim(`${c.name} — ${c.role}.`, c.id)),
      );
      const related = kb.messages.filter((m) =>
        event.projectId
          ? m.projectId === event.projectId
          : event.contactIds.includes(m.senderId),
      );
      section("Recent context", related.slice(0, 3).map(messageItem));
      const eventActions = kb.actions.filter(
        (a) =>
          a.status !== "done" &&
          (event.projectId
            ? a.projectId === event.projectId
            : event.contactIds.includes(a.contactId || "")) &&
          !["done", "replied"].includes(state.messages[a.sourceMessageId]),
      );
      section("Open items", actionItems(eventActions));
      actionIds = eventActions.map((a) => a.id);
      const last = [...related].sort((a, b) =>
        b.timestamp.localeCompare(a.timestamp),
      )[0];
      if (last)
        section("Last communication", [
          claim(
            `${last.sender} · ${dateLabel(last.timestamp)} — ${last.title}.`,
            last.id,
          ),
        ]);
    } else {
      meeting = {
        title: contact
          ? `Conversation with ${contact.name}`
          : "Meeting not found",
        when: "No meeting time recorded",
        person: contact
          ? `${contact.role} · ${contact.priority.toUpperCase()} priority`
          : "Check a person or project",
      };
      intro = `I don’t have a scheduled meeting${contact ? " with " + contact.name : " for this project"} in the saved messages. Here’s the context I can verify to help you prepare.`;
      if (contact)
        section("Who", [
          claim(`${contact.name} — ${contact.role}.`, contact.id),
        ]);
      section("Recent context", selectedMessages.slice(0, 3).map(messageItem));
      cardCommitments(found.commitments.filter(open));
      if (contact?.id === "contact_sarah")
        section("Suggested question", [
          claim(
            "Ask whether the final Q3 sheet is still on track for the revised 3:00 PM commitment.",
            "commitment_sarah_q3",
          ),
        ]);
      const last = selectedMessages[0];
      if (last)
        section("Last communication", [
          claim(
            `${last.sender} · ${dateLabel(last.timestamp)} — ${last.title}.`,
            last.id,
          ),
        ]);
    }
    followUps.push(
      contact
        ? `What am I waiting on from ${contact.name}?`
        : "What meetings changed?",
      "Prepare me for the Project Atlas demo",
    );
  } else if (["waiting", "owe", "overdue"].includes(intent)) {
    const direction = intent === "waiting" ? "owed_to_me" : "i_owe";
    const items = found.commitments
      .filter(open)
      .filter((c) =>
        intent === "overdue"
          ? c.status === "overdue"
          : c.direction === direction,
      );
    title =
      intent === "overdue"
        ? "Promises that slipped"
        : intent === "waiting"
          ? "The people you’re waiting on"
          : "Your part of the picture";
    intro = items.length
      ? "Here are the open promises I can verify" +
        (project
          ? ` for ${project.name}.`
          : contact
            ? ` with ${contact.name}.`
            : ".")
      : "I found no open promises matching this question in the current demo state.";
    cardCommitments(items);
    if (intent === "owe") {
      const replies = selectedMessages.filter(
        (m) => m.needsReply && !["done", "replied"].includes(m.status),
      );
      section(
        "Also waiting for your reply",
        replies.map((m) => claim(`${m.sender}: ${m.summary}`, m.id)),
      );
      const extra = pendingActions.filter(
        (a) => !items.some((c) => c.sourceMessageId === a.sourceMessageId),
      );
      section("Related actions", actionItems(extra));
      actionIds = extra.map((a) => a.id);
    }
    if (!items.length)
      section(
        "Checked records",
        found.commitments.length
          ? found.commitments.map((c) =>
              claim(`${c.person}: ${c.title} · ${c.status}.`, c.id),
            )
          : [
              claim(
                "Browse the saved contact list to choose another person.",
                "contacts",
              ),
            ],
      );
    followUps.push(
      project
        ? `What decisions were made on ${project.name}?`
        : "What deadlines do I have today?",
      "What commitments are overdue?",
    );
  } else if (intent === "attention" || intent === "deadlines") {
    title =
      intent === "deadlines"
        ? "Your upcoming deadlines"
        : "A little clarity for your day";
    intro = "Start with time-sensitive replies, then the promises you’ve made.";
    const today = /\btoday|afternoon\b/.test(q);
    const friday = /\bfriday\b/.test(q);
    const inRange = (date: string) =>
      today
        ? date.startsWith(kb.day)
        : friday
          ? date <= "2026-09-25T23:59:59-04:00"
          : true;
    const actions = pendingActions
      .filter((a) => inRange(a.dueAt))
      .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
    section(
      intent === "attention" ? "Needs you" : "Deadlines",
      actionItems(actions),
    );
    actionIds = actions.map((a) => a.id);
    cardCommitments(
      found.commitments.filter(
        (c) => open(c) && inRange(c.revisedDueAt || c.dueAt),
      ),
    );
    if (!actions.length && !commitmentIds.length) {
      intro =
        "No open actions or promises match that date range in this snapshot.";
      section("Checked", [
        claim(
          "You can review the saved briefing and completed items for this demo day.",
          "catch_up",
        ),
      ]);
    }
    note =
      "Dates use the demo day: September 21, 2026. Meeting confirmation deadlines are separate from meeting start times.";
    followUps.push(
      "Why is Project Atlas urgent?",
      "What can I safely ignore right now?",
    );
  } else if (intent === "ignore") {
    title = "These can wait";
    intro =
      "These saved messages have no requested action or reply. You can leave them for later.";
    section(
      "Safe to defer",
      selectedMessages
        .filter(
          (m) =>
            m.category === "low_priority" &&
            !m.needsReply &&
            m.status !== "done",
        )
        .map(messageItem),
    );
    if (!sections.length)
      intro =
        "There are no remaining low-priority messages without a reply request in this context.";
    followUps.push("What needs my attention today?");
  } else if (intent === "urgency") {
    title = project
      ? `Why ${project.name} needs attention`
      : "Why Miyo prioritized this";
    const urgent = selectedMessages.filter((m) => m.category === "urgent");
    section(
      "Why this matters",
      urgent.map((m) =>
        claim(
          `${m.sender} directly asked for ${m.id === "msg_atlas_slack_urgent" ? "confirmation within 20 minutes of the 12:58 PM message — by 1:18 PM" : "pricing approval by 1:30 PM"}. ${["done", "replied"].includes(m.status) ? "You’ve already handled this in the demo." : "This is still open."}`,
          m.id,
        ),
      ),
    );
    section(
      "Your priorities",
      [...new Set(urgent.map((m) => m.senderId))].flatMap((id) => {
        const c = kb.contacts.find((c) => c.id === id);
        return c
          ? [
              claim(
                `${c.name} is currently set to ${c.priority.toUpperCase()} priority.`,
                c.id,
              ),
            ]
          : [];
      }),
    );
    intro = urgent.length
      ? "The original urgency comes from explicit reply windows and deadlines, not just the sender’s name."
      : "I don’t see an urgent message in this context.";
    note =
      "These are deadlines in the saved September 21 story, not a live countdown. Changing contact priority affects ordering, not the seeded urgency label.";
    followUps.push(
      "What am I responsible for?",
      "Find the message where the meeting time changed",
    );
  } else if (intent === "decisions" || intent === "unresolved") {
    title =
      intent === "decisions"
        ? "Decisions, all in one place"
        : "What’s still open";
    const projects = project ? [project] : kb.projects;
    for (const p of projects)
      section(
        p.name,
        intent === "decisions"
          ? p.decisions
          : p.openQuestions.map((text) => claim(text, p.id)),
      );
    intro = sections.length
      ? "Here’s what the linked project records and conversations show."
      : "No matching decisions or unresolved questions are recorded in the current demo state.";
    if (!sections.length && project)
      section("Project record", [claim(project.summary, project.id)]);
    followUps.push(
      "What am I responsible for?",
      "Catch me up on Project Atlas",
    );
  } else if (intent === "changes") {
    title = project
      ? `What changed · ${project.name}`
      : "You’re back in the picture";
    intro = "The changes worth knowing from your saved communication history.";
    const ids = /\bmeeting/.test(q)
      ? ["msg_atlas_outlook_calendar", "msg_professor_outlook"]
      : [
          "msg_atlas_outlook_calendar",
          "msg_atlas_gmail_approval",
          "msg_finance_slack",
        ];
    section(
      "What changed",
      selectedMessages.filter((m) => ids.includes(m.id)).map(messageItem),
    );
    if (!sections.length)
      section("Recent context", selectedMessages.slice(0, 3).map(messageItem));
    followUps.push(
      "What needs my attention today?",
      "What am I responsible for?",
    );
  } else if (intent === "project" && project) {
    title = project.name;
    intro = "One picture, across your conversations.";
    actionIds = pendingActions.map((a) => a.id);
    section("Current status", [claim(project.summary, project.id)]);
    section(
      "Needs you",
      actionItems(pendingActions.filter((a) => a.kind !== "meeting")),
    );
    section("Latest decisions", project.decisions);
    section(
      "Across your apps",
      selectedMessages
        .filter(
          (m) => m.platform === "outlook" || m.id === "msg_atlas_slack_design",
        )
        .map(messageItem),
    );
    cardCommitments(
      found.commitments.filter((c) => c.direction === "owed_to_me" && open(c)),
    );
    followUps.push(
      "What am I responsible for?",
      "Prepare me for my meeting with Sarah",
      `What decisions were made on ${project.name}?`,
    );
    if (/\bweek\b/.test(q))
      note =
        "This demo contains September 21 messages, so this is the available snapshot rather than a complete week of history.";
  } else if (contact && intent === "people") {
    title = `The context with ${contact.name}`;
    intro =
      contact.id === "contact_sarah" && /\bask/.test(q)
        ? "Sarah didn’t assign you a task in the saved message. She updated her own promise to you."
        : "Here’s what I can verify from this person’s saved conversations.";
    section("Recent communication", selectedMessages.map(messageItem));
    cardCommitments(found.commitments.filter(open));
    if (!selectedMessages.length)
      section("Contact record", [
        claim(
          `${contact.name} — ${contact.role}. No saved message from this contact matches the question.`,
          contact.id,
        ),
      ]);
    followUps.push(
      `What am I waiting on from ${contact.name}?`,
      `Prepare me for my meeting with ${contact.name}`,
    );
  } else {
    title = selectedMessages.length
      ? "Found in your conversations"
      : "I don’t have enough to answer that";
    intro = selectedMessages.length
      ? "These are the closest matching saved messages. Open a source to check the exact wording."
      : "Try a person, project, deadline, or a few words from the message. I won’t fill in details that aren’t in the saved records.";
    section("Matching messages", selectedMessages.slice(0, 5).map(messageItem));
    followUps.push("Catch me up on Project Atlas", "Who am I waiting on?");
  }
  const sourceIds = [
    ...new Set([
      ...sections.flatMap((s) => s.items.flatMap((i) => i.sourceIds)),
      ...commitmentIds,
      ...actionIds,
    ]),
  ];
  const sources = sourceIds
    .map((id) => kb.sources[id])
    .filter(Boolean)
    .sort(
      (a, b) => Number(b.kind === "message") - Number(a.kind === "message"),
    );
  const linkedMessages = sources
    .filter((s) => s.messageId)
    .map((s) => kb.messages.find((m) => m.id === s.messageId)!);
  const relatedPeople = [
    ...new Set([
      ...(contact ? [contact.id] : project?.people || []),
      ...linkedMessages.map((m) => m.senderId),
      ...kb.commitments
        .filter((c) => commitmentIds.includes(c.id))
        .map((c) => c.contactId || ""),
    ]),
  ].filter((id) => kb.contacts.some((c) => c.id === id));
  const relatedProjects = [
    ...new Set([
      ...(project ? [project.id] : []),
      ...linkedMessages.map((m) => m.projectId || ""),
      ...kb.commitments
        .filter((c) => commitmentIds.includes(c.id))
        .map((c) => c.projectId || ""),
    ]),
  ].filter(Boolean);
  return {
    title,
    intro,
    sections,
    sources,
    commitmentIds,
    actionIds,
    context: found.unknownPerson ? {} : found.context,
    relatedPeople,
    relatedProjects,
    followUps: [...new Set(followUps)]
      .filter((f) => normalize(f) !== q)
      .slice(0, 3),
    note,
    meeting,
  };
}
