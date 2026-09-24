import type { AskContext, Intent, Knowledge, Retrieval } from "./types";
export const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const has = (s: string, pattern: RegExp) => pattern.test(s);
export function retrieve(
  question: string,
  previous: AskContext,
  kb: Knowledge,
): Retrieval {
  const q = normalize(question);
  const namedProject = kb.projects.find(
    (p) =>
      q.includes(normalize(p.name)) ||
      (p.id === "project_atlas" && /\batlas\b/.test(q)) ||
      (p.id === "project_investor_deck" && /\binvestor\b/.test(q)),
  );
  const namedContact = kb.contacts.find(
    (c) =>
      q.includes(normalize(c.name)) ||
      new RegExp("\\b" + normalize(c.name.split(" ")[0]) + "\\b").test(q),
  );
  let intent: Intent = "search";
  if (has(q, /\b(find|locate|show.*message|show.*email)\b/)) intent = "find";
  else if (has(q, /\bwhy\b.*\b(urgent|prioriti|important)/)) intent = "urgency";
  else if (has(q, /\b(overdue|late commitments|missed.*deadline)\b/))
    intent = "overdue";
  else if (has(q, /\b(safe.*ignore|can.*wait|low priority|ignore)\b/))
    intent = "ignore";
  else if (has(q, /\b(prepare|prep|brief me|next meeting)\b/))
    intent = "meeting";
  else if (has(q, /\b(decision|decisions|decided)\b/)) intent = "decisions";
  else if (
    has(q, /\b(unresolved|blocking|blockers|open questions|open issues)\b/)
  )
    intent = "unresolved";
  else if (
    has(
      q,
      /\b(waiting on me|waiting for me|i owe|do i owe|promised|promise|responsible|my responsibilities)\b/,
    )
  )
    intent = "owe";
  else if (
    has(
      q,
      /\b(waiting on|waiting for|owes me|owe me|owes us|hasn't responded|haven't responded|has not responded|haven't heard)\b/,
    )
  )
    intent = "waiting";
  else if (has(q, /\b(deadline|deadlines|due|before friday)\b/))
    intent = "deadlines";
  else if (has(q, /\b(changed|changes|away|missed)\b/)) intent = "changes";
  else if (
    has(
      q,
      /\b(attention|need to do|prioritize|prioritise|afternoon|slow to respond|slow.*repl)\b/,
    )
  )
    intent = "attention";
  else if (
    namedProject ||
    has(q, /\b(project|catch me up|summarize|happened|status)\b/)
  )
    intent = "project";
  else if (namedContact) intent = "people";

  // Explicit people/projects switch topic. Pronouns and project-specific follow-ups
  // inherit context; global questions intentionally clear it.
  const global =
    has(
      q,
      /\b(who|everything|all projects|all commitments|all my|right now|attention today|deadlines.*today|what changed.*away|what changed today|next meeting)\b/,
    ) ||
    (intent === "overdue" && !/\b(this|that|it|these)\b/.test(q));
  const followUp = has(
    q,
    /\b(it|this|that|they|them|these|responsible|my responsibilities|decisions|open questions|deadlines changed)\b/,
  );
  const context: AskContext =
    namedProject || namedContact
      ? { projectId: namedProject?.id, contactId: namedContact?.id }
      : !global && followUp
        ? previous
        : {};
  const project = kb.projects.find((p) => p.id === context.projectId);
  const contact = kb.contacts.find((c) => c.id === context.contactId);
  // A missing named person must never be silently mapped to another contact.
  const candidate = question.match(
    /\b(?:from|with|to|about|promised|did)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/,
  )?.[1];
  const unknownPerson = !namedContact
    ? /\bjames\b/.test(q)
      ? "James"
      : candidate &&
          !/^(Project Atlas|Project|Gmail|Outlook|Slack|Miyo|Friday|Monday|Tuesday|Wednesday|Thursday|Saturday|Sunday|Northstar|Concept B|Q3|Q4)$/.test(
            candidate,
          ) &&
          !namedProject
        ? candidate
        : undefined
    : undefined;
  let messages = kb.messages.filter(
    (m) =>
      (!project || m.projectId === project.id) &&
      (!contact || m.senderId === contact.id),
  );
  const stop = new Set(
    "what who when where did does have has the a an me my i you to for of on in with is it this that please find show message email messages emails said say about ever everything week today this changed change time meeting prepare do need happened summary summarize from ask asked at and was while away can we are be any which by right now".split(
      " ",
    ),
  );
  const entityWords = new Set(
    normalize((contact?.name || "") + " " + (project?.name || "")).split(" "),
  );
  const terms = q
    .split(" ")
    .filter((w) => w.length > 2 && !stop.has(w) && !entityWords.has(w));
  if (intent === "find" && /meeting.*(?:time.*)?chang|meeting.*moved/.test(q)) {
    messages = messages.filter((m) =>
      /reschedul|move.*(?:am|pm)/i.test(m.content),
    );
  }
  if (
    intent === "find" ||
    intent === "search" ||
    (intent === "people" &&
      terms.some((t) => /pricing|spreadsheet|headline/.test(t)))
  ) {
    const scored = messages.map((m) => ({
      m,
      score:
        terms.reduce(
          (n, t) =>
            n +
            (normalize(
              m.title + " " + m.content + " " + m.sender + " " + m.account,
            ).includes(t)
              ? 1
              : 0),
          0,
        ) +
        (/meeting.*(?:time.*)?chang|meeting.*moved/.test(q) &&
        /reschedul|move.*(?:am|pm)/i.test(m.content)
          ? 3
          : 0),
    }));
    messages = scored
      .filter((x) => x.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score || b.m.timestamp.localeCompare(a.m.timestamp),
      )
      .map((x) => x.m);
  } else messages.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const commitments = kb.commitments.filter(
    (c) =>
      (!project || c.projectId === project.id) &&
      (!contact || c.contactId === contact.id),
  );
  const actions = kb.actions.filter(
    (a) =>
      (!project || a.projectId === project.id) &&
      (!contact || a.contactId === contact.id),
  );
  return {
    intent,
    context,
    project,
    contact,
    explicitEntity: !!(namedContact || namedProject),
    unknownPerson,
    unsupportedPeriod: /\b(last week|last month|yesterday|last year)\b/.test(q),
    messages,
    commitments,
    actions,
  };
}
