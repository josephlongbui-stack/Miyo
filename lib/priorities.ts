import seed from "../data/seed.json";

export type Priority = "vip" | "high" | "normal" | "low";
export type PriorityMessage = (typeof seed.messages)[number];
export type PriorityPreferences = {
  priorities: Record<string, string>;
  placePriorities: Record<string, string>;
};
export const priorityLevels: Priority[] = ["vip", "high", "normal", "low"];
const rank: Record<Priority, number> = { vip: 3, high: 2, normal: 1, low: 0 };
const categoryRank: Record<string, number> = {
  urgent: 4,
  important: 3,
  needs_reply: 2,
  casual: 1,
  low_priority: 0,
};
export const channelKey = (accountId: string, channel: string) =>
  `${accountId}:${channel}`;
export const priorityPlaces = [
  ...seed.connectedAccounts.map((a) => ({
    id: a.id,
    name: a.label,
    detail: a.address,
    accountId: a.id,
    provider: a.provider,
    kind: "account" as const,
  })),
  ...seed.messages
    .flatMap((m) => {
      const account = seed.connectedAccounts.find(
        (a) => a.label === m.accountLabel,
      );
      return m.channel && account
        ? [
            {
              id: channelKey(account.id, m.channel),
              name: m.channel,
              detail: account.label,
              accountId: account.id,
              provider: m.provider,
              kind: "channel" as const,
            },
          ]
        : [];
    })
    .filter(
      (place, index, all) => all.findIndex((p) => p.id === place.id) === index,
    ),
];
export function defaultPlacePriorities(): Record<string, string> {
  return Object.fromEntries(
    priorityPlaces.map((p) => [
      p.id,
      p.kind === "channel" ? "inherit" : "normal",
    ]),
  );
}
function asPriority(value: string | undefined): Priority {
  return priorityLevels.includes(value as Priority)
    ? (value as Priority)
    : "normal";
}
export function placePriority(
  m: PriorityMessage,
  preferences: PriorityPreferences,
): Priority {
  const account = seed.connectedAccounts.find(
    (a) => a.label === m.accountLabel,
  );
  if (!account) return "normal";
  const channel = m.channel
    ? preferences.placePriorities[channelKey(account.id, m.channel)]
    : undefined;
  return asPriority(
    channel && channel !== "inherit"
      ? channel
      : preferences.placePriorities[account.id],
  );
}
export function messagePriority(
  m: PriorityMessage,
  preferences: PriorityPreferences,
): Priority {
  const contact = asPriority(
    preferences.priorities[m.senderId] ?? m.senderPriority,
  );
  const place = placePriority(m, preferences);
  // Normal is the default; only explicit higher/lower preferences compete.
  if (contact === "normal") return place;
  if (place === "normal") return contact;
  return rank[contact] >= rank[place] ? contact : place;
}
export function sortMessages<T extends PriorityMessage>(
  messages: readonly T[],
  preferences: PriorityPreferences,
): T[] {
  return [...messages].sort(
    (a, b) =>
      Number(b.attentionCategory === "urgent") -
        Number(a.attentionCategory === "urgent") ||
      rank[messagePriority(b, preferences)] -
        rank[messagePriority(a, preferences)] ||
      (categoryRank[b.attentionCategory] ?? 0) -
        (categoryRank[a.attentionCategory] ?? 0) ||
      Date.parse(b.timestamp) - Date.parse(a.timestamp) ||
      a.id.localeCompare(b.id),
  );
}
