// Exercise the pure TypeScript engine with Node's test runner; no extra dependency.
const ts = require("typescript");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const { test } = require("node:test");
require.extensions[".ts"] = (mod, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  mod._compile(outputText, filename);
};
const { answerDemo } = require("../lib/ask-miyo/demo-engine.ts");
const { buildKnowledge } = require("../lib/ask-miyo/knowledge.ts");
const { askMiyo } = require("../lib/ask-miyo/service.ts");
const state = () => ({
  messages: {},
  commitments: [],
  actions: {},
  priorities: {},
});
const ask = (question, context = {}, s = state()) =>
  answerDemo({ question, context, state: s });
const text = (answer) => JSON.stringify(answer);
const samples = [
  ["What needs my attention today?", "msg_atlas_slack_urgent"],
  ["Catch me up on Project Atlas.", "msg_atlas_gmail_approval"],
  ["What happened with Project Atlas this week?", "msg_atlas_outlook_calendar"],
  ["Who am I waiting on?", "commitment_sarah_q3"],
  ["Who is waiting on me?", "commitment_approve_atlas_pricing"],
  ["What commitments are overdue?", "commitment_sarah_q3"],
  ["What did Sarah ask me to do?", "msg_finance_slack"],
  ["What have I promised James?", "contacts"],
  ["What deadlines do I have today?", "action_send_investor_deck"],
  ["Prepare me for my meeting with Sarah.", "msg_finance_slack"],
  ["What changed while I was away?", "msg_atlas_outlook_calendar"],
  ["What decisions were made on Project Atlas?", "msg_atlas_gmail_approval"],
  ["Why is Project Atlas urgent?", "msg_atlas_slack_urgent"],
  [
    "Find the message where the meeting time changed.",
    "msg_atlas_outlook_calendar",
  ],
  ["What can I safely ignore right now?", "msg_newsletter_gmail"],
];
for (const [question, sourceId] of samples)
  test(question, () => {
    const a = ask(question);
    assert(a.title && a.intro);
    assert(
      a.sources.some((s) => s.id === sourceId),
      `Missing evidence: ${sourceId}`,
    );
    const knowledge = buildKnowledge(state());
    for (const section of a.sections)
      for (const item of section.items) {
        assert(item.sourceIds.length, `Unsupported claim: ${item.text}`);
        for (const id of item.sourceIds)
          assert(a.sources.some((s) => s.id === id));
      }
    for (const source of a.sources) {
      assert(knowledge.sources[source.id]);
      assert(source.messageId || source.href?.startsWith("/app/"));
    }
  });
test("Atlas follow-up keeps its project; a named person switches scope", () => {
  const a = ask("Catch me up on Project Atlas");
  assert.equal(a.context.projectId, "project_atlas");
  const follow = ask("What am I responsible for?", a.context);
  assert.deepEqual(follow.commitmentIds, ["commitment_approve_atlas_pricing"]);
  assert(follow.actionIds.includes("action_confirm_atlas_time"));
  assert(!text(follow).includes("action_send_investor_deck"));
  const sarah = ask("Prepare me for my meeting with Sarah", follow.context);
  assert.equal(sarah.context.contactId, "contact_sarah");
  assert.equal(sarah.context.projectId, undefined);
  assert.equal(sarah.meeting.when, "No meeting time recorded");
  assert(!text(sarah).includes("Sarah Chen"));
  assert(!text(sarah).includes("2:00 PM"));
});
test("Global questions clear project scope", () => {
  const a = ask("Who am I waiting on?", { projectId: "project_atlas" });
  assert(a.commitmentIds.includes("commitment_sarah_q3"));
  assert.equal(a.context.projectId, undefined);
});
test("Do not invent James, Sarah pricing, or a Sarah calendar change", () => {
  assert.match(ask("What have I promised James?").intro, /can’t verify/);
  assert.equal(
    ask("Find the email where Sarah changed the meeting time").sources.filter(
      (s) => s.kind === "message",
    ).length,
    0,
  );
  assert.equal(
    ask("What did Sarah say about pricing?").sources.filter(
      (s) => s.kind === "message",
    ).length,
    0,
  );
});
test("Completed commitments and actions leave open lists", () => {
  const s = state();
  s.commitments = ["commitment_approve_atlas_pricing", "commitment_sarah_q3"];
  s.actions.action_approve_atlas_pricing = "done";
  s.messages.msg_atlas_gmail_approval = "done";
  assert(
    !ask(
      "What am I responsible for?",
      { projectId: "project_atlas" },
      s,
    ).commitmentIds.includes("commitment_approve_atlas_pricing"),
  );
  assert.equal(
    ask("What commitments are overdue?", {}, s).commitmentIds.length,
    0,
  );
  assert.match(
    text(ask("Catch me up on Project Atlas", {}, s)),
    /approved final pricing/,
  );
  assert(
    !ask("What needs my attention today?", {}, s).actionIds.includes(
      "action_approve_atlas_pricing",
    ),
  );
});
test("Urgency explanation uses the current contact priority and handled state", () => {
  const s = state();
  s.priorities.contact_maya = "low";
  s.messages.msg_atlas_slack_urgent = "replied";
  const a = ask("Why is Project Atlas urgent?", {}, s);
  assert.match(text(a), /Maya Chen is currently set to LOW/);
  assert.match(text(a), /already handled/);
});
test("Revised deadlines are distinct from original overdue status", () => {
  const a = ask("What deadlines do I have today?");
  assert(a.commitmentIds.includes("commitment_sarah_q3"));
  const c = buildKnowledge(state()).commitments.find(
    (c) => c.id === "commitment_sarah_q3",
  );
  assert.equal(c.status, "overdue");
  assert.equal(c.revisedDueAt, "2026-09-21T15:00:00-04:00");
});
test("Meeting preparation never uses a reply deadline as its meeting start", () => {
  const a = ask("Prepare me for my next meeting");
  assert.match(a.meeting.when, /Sep 22.*11:30 AM/);
  assert.doesNotMatch(a.meeting.when, /11:59 PM/);
});
test("Unknown topics and unsupported historical ranges do not fabricate answers", () => {
  assert.equal(ask("quantum optics patents").sources.length, 0);
  assert.match(
    ask("What happened with Project Atlas last month?").title,
    /isn’t in this demo/,
  );
});
test("Source links preserve canonical provenance, including commitment records", () => {
  const a = ask("Who am I waiting on?");
  const c = a.sources.find((s) => s.id === "commitment_maya_deck");
  assert.equal(c.kind, "commitment");
  assert.equal(c.href, "/app/commitments?tab=owed_to_me");
});
test("Service supports an interchangeable adapter and cancellation", async () => {
  let called = false;
  const expected = ask("What needs my attention today?");
  const result = await askMiyo(
    "question",
    { state: state(), context: {} },
    {
      ask: async (request) => {
        called = true;
        assert.equal(request.question, "question");
        return expected;
      },
    },
  );
  assert(called);
  assert.equal(result, expected);
  const signal = AbortSignal.abort();
  await assert.rejects(
    askMiyo("question", { state: state(), context: {}, signal }),
    { name: "AbortError" },
  );
});
