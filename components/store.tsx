"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import seed from "@/data/seed.json";
import { defaultPlacePriorities } from "@/lib/priorities";
export { seed };
export type Message = (typeof seed.messages)[number];
export type Action = (typeof seed.actions)[number];
export type Commitment = (typeof seed.commitments)[number];
export type Project = (typeof seed.projects)[number];
export const demoDay = "2026-09-21";
export const labels: Record<string, string> = {
  urgent: "Urgent",
  important: "Important",
  needs_reply: "Needs Reply",
  casual: "Casual",
  low_priority: "Low Priority",
  gmail: "Gmail",
  outlook: "Outlook",
  slack: "Slack",
  work: "Work",
  personal: "Personal",
  vip: "VIP",
  high: "High",
  normal: "Normal",
  low: "Low",
  follow_up: "Follow-up",
  approval: "Approval",
  deadline: "Deadline",
  task: "Task",
  meeting: "Meeting",
};
export const time = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  }).format(new Date(date));
export const due = (date: string) =>
  `${date.startsWith(demoDay) ? "Today" : date.startsWith("2026-09-22") ? "Tomorrow" : "Sep 19"} · ${time(date)}`;
export const projectUrl = (id: string) =>
  "/app/projects/" + id.replaceAll("_", "-");
export interface DemoState {
  version: number;
  accounts: Record<string, boolean>;
  messages: Record<string, "done" | "snoozed" | "replied">;
  read: string[];
  commitments: string[];
  reminders: string[];
  actions: Record<string, string>;
  priorities: Record<string, string>;
  placePriorities: Record<string, string>;
  replies: Record<string, string>;
  focus: {
    active: boolean;
    mode: string;
    minutes: number;
    endAt: number;
    allowUrgent: boolean;
    allowVip: boolean;
    autoReply: boolean;
  };
  professionalReply: string;
  casualReply: string;
  morning: boolean;
  evening: boolean;
}
export const initialState = (): DemoState => ({
  version: 1,
  accounts: Object.fromEntries(
    seed.connectedAccounts.map((a) => [a.id, a.connected]),
  ),
  messages: {},
  read: [],
  commitments: [],
  reminders: [],
  actions: {},
  priorities: Object.fromEntries(seed.contacts.map((c) => [c.id, c.priority])),
  placePriorities: defaultPlacePriorities(),
  replies: {},
  focus: {
    active: false,
    mode: "deep_work",
    minutes: 120,
    endAt: 0,
    allowUrgent: true,
    allowVip: true,
    autoReply: true,
  },
  professionalReply:
    "I'm in focus mode until {endTime}. I'll review this afterward.",
  casualReply: "Busy right now — I'll get back to you later.",
  morning: true,
  evening: true,
});
type Context = {
  state: DemoState;
  ready: boolean;
  update: (fn: (s: DemoState) => DemoState) => void;
  notify: (message: string) => void;
  toast: string;
  selected: Message | null;
  replyIntent: string;
  openMessage: (id: string, intent?: string) => void;
  closeMessage: () => void;
  markMessage: (id: string, status: "done" | "snoozed" | "replied") => void;
  completeCommitment: (id: string) => void;
  act: (id: string, status?: string) => void;
  remind: (id: string) => void;
  reset: () => void;
};
const DemoContext = createContext<Context | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  const [selected, setSelected] = useState<Message | null>(null);
  const [replyIntent, setReplyIntent] = useState("");
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("miyo-demo-v1") || "null");
      if (
        saved?.version === 1 &&
        saved.accounts &&
        saved.focus &&
        Array.isArray(saved.commitments)
      )
        setState({
          ...initialState(),
          ...saved,
          focus: { ...initialState().focus, ...saved.focus },
          priorities: { ...initialState().priorities, ...saved.priorities },
          placePriorities: {
            ...defaultPlacePriorities(),
            ...saved.placePriorities,
          },
        });
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem("miyo-demo-v1", JSON.stringify(state));
      } catch {}
  }, [state, ready]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 3400);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    if (!state.focus.active) return;
    const end = () => {
      if (Date.now() >= state.focus.endAt) {
        setState((s) => ({ ...s, focus: { ...s.focus, active: false } }));
        setToast("Focus session complete. Welcome back.");
      }
    };
    end();
    const id = setInterval(end, 1000);
    return () => clearInterval(id);
  }, [state.focus.active, state.focus.endAt]);
  const notify = useCallback((m: string) => setToast(m), []);
  const update = useCallback(
    (fn: (s: DemoState) => DemoState) => setState(fn),
    [],
  );
  function openMessage(id: string, intent = "") {
    setReplyIntent(intent);
    const m = seed.messages.find((x) => x.id === id);
    if (m) {
      setSelected(m);
      setState((s) => ({ ...s, read: [...new Set([...s.read, id])] }));
    }
  }
  function markMessage(id: string, status: "done" | "snoozed" | "replied") {
    setState((s) => ({ ...s, messages: { ...s.messages, [id]: status } }));
    notify(
      status === "done"
        ? "Message marked done. One less thing on your mind."
        : status === "snoozed"
          ? "Snoozed. Find it in your Snoozed view."
          : "Reply sent in the demo.",
    );
  }
  function completeCommitment(id: string) {
    setState((s) => {
      const completed = s.commitments.includes(id);
      const c = seed.commitments.find((x) => x.id === id);
      const a = seed.actions.find(
        (x) => x.sourceMessageId === c?.sourceMessageId,
      );
      return {
        ...s,
        commitments: completed
          ? s.commitments.filter((x) => x !== id)
          : [...s.commitments, id],
        actions: a
          ? { ...s.actions, [a.id]: completed ? "suggested" : "done" }
          : s.actions,
        messages: c
          ? Object.fromEntries(
              Object.entries({
                ...s.messages,
                ...(!completed ? { [c.sourceMessageId]: "done" as const } : {}),
              }).filter(([key]) => !completed || key !== c.sourceMessageId),
            )
          : s.messages,
      };
    });
    notify(
      state.commitments.includes(id)
        ? "Commitment reopened."
        : "Commitment completed. Nicely done.",
    );
  }
  function act(id: string, status = "added") {
    setState((s) => {
      const a = seed.actions.find((x) => x.id === id);
      const c = seed.commitments.find(
        (x) => x.sourceMessageId === a?.sourceMessageId,
      );
      return {
        ...s,
        actions: { ...s.actions, [id]: status },
        commitments:
          status === "done" && c
            ? [...new Set([...s.commitments, c.id])]
            : s.commitments,
        messages:
          status === "done" && a
            ? { ...s.messages, [a.sourceMessageId]: "done" }
            : s.messages,
      };
    });
    notify(
      status === "done"
        ? "Done. Your progress is saved."
        : status === "reminded"
          ? "Reminder set for the due time."
          : "Added to your demo " +
            (seed.actions.find((x) => x.id === id)?.kind === "meeting"
              ? "calendar."
              : "tasks."),
    );
  }
  function remind(id: string) {
    setState((s) => ({ ...s, reminders: [...new Set([...s.reminders, id])] }));
    notify("Reminder set. Miyo will keep it on your list.");
  }
  function reset() {
    setState(initialState());
    setSelected(null);
    notify("Demo reset. Ready for a fresh walkthrough.");
  }
  return (
    <DemoContext.Provider
      value={{
        state,
        ready,
        update,
        notify,
        toast,
        selected,
        replyIntent,
        openMessage,
        closeMessage: () => setSelected(null),
        markMessage,
        completeCommitment,
        act,
        remind,
        reset,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}
export function useDemo() {
  const c = useContext(DemoContext);
  if (!c) throw new Error("Missing DemoProvider");
  return c;
}
export function accountConnected(m: Message, state: DemoState) {
  return seed.connectedAccounts.some(
    (a) => a.label === m.accountLabel && state.accounts[a.id],
  );
}
export function allowedInFocus(m: Message, state: DemoState) {
  return (
    !state.focus.active ||
    (state.focus.allowUrgent && m.attentionCategory === "urgent") ||
    (state.focus.allowVip &&
      (state.priorities[m.senderId] || m.senderPriority) === "vip")
  );
}
