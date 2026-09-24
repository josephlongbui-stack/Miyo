export type SourceKind =
  | "message"
  | "project"
  | "contact"
  | "commitment"
  | "action"
  | "briefing";
export interface Source {
  id: string;
  kind: SourceKind;
  title: string;
  detail: string;
  platform?: string;
  timestamp?: string;
  messageId?: string;
  href?: string;
}
export interface AskState {
  messages: Record<string, string>;
  commitments: string[];
  actions: Record<string, string>;
  priorities: Record<string, string>;
}
export interface AskContext {
  projectId?: string;
  contactId?: string;
}
export interface KnowledgeMessage {
  id: string;
  platform: string;
  senderId: string;
  sender: string;
  account: string;
  channel?: string;
  timestamp: string;
  title: string;
  content: string;
  summary: string;
  projectId?: string;
  category: string;
  needsReply: boolean;
  deadline?: string;
  status: string;
}
export interface KnowledgeContact {
  id: string;
  name: string;
  role: string;
  priority: string;
  messageIds: string[];
}
export interface KnowledgeCommitment {
  id: string;
  direction: string;
  person: string;
  contactId?: string;
  title: string;
  dueAt: string;
  revisedDueAt?: string;
  status: string;
  sourceMessageId: string;
  projectId?: string;
  platform: string;
}
export interface KnowledgeAction {
  id: string;
  title: string;
  kind: string;
  dueAt: string;
  status: string;
  projectId?: string;
  contactId?: string;
  sourceMessageId: string;
}
export interface KnowledgeProject {
  id: string;
  name: string;
  summary: string;
  people: string[];
  messageIds: string[];
  decisions: { text: string; sourceIds: string[] }[];
  openQuestions: string[];
}
export interface KnowledgeMeeting {
  title: string;
  startsAt: string;
  contactIds: string[];
  projectId?: string;
  sourceIds: string[];
  confirmed: boolean;
}
export interface Knowledge {
  day: string;
  messages: KnowledgeMessage[];
  contacts: KnowledgeContact[];
  projects: KnowledgeProject[];
  commitments: KnowledgeCommitment[];
  actions: KnowledgeAction[];
  meetings: KnowledgeMeeting[];
  sources: Record<string, Source>;
}
export type Intent =
  | "attention"
  | "project"
  | "waiting"
  | "owe"
  | "overdue"
  | "deadlines"
  | "meeting"
  | "changes"
  | "decisions"
  | "urgency"
  | "find"
  | "ignore"
  | "people"
  | "unresolved"
  | "search";
export interface Retrieval {
  intent: Intent;
  context: AskContext;
  explicitEntity: boolean;
  unknownPerson?: string;
  unsupportedPeriod: boolean;
  messages: KnowledgeMessage[];
  commitments: KnowledgeCommitment[];
  actions: KnowledgeAction[];
  project?: KnowledgeProject;
  contact?: KnowledgeContact;
}
export interface AnswerItem {
  text: string;
  sourceIds: string[];
}
export interface AnswerSection {
  title: string;
  items: AnswerItem[];
}
export interface AskAnswer {
  title: string;
  intro: string;
  sections: AnswerSection[];
  sources: Source[];
  commitmentIds: string[];
  actionIds: string[];
  context: AskContext;
  relatedPeople: string[];
  relatedProjects: string[];
  followUps: string[];
  note?: string;
  meeting?: { title: string; when: string; person: string };
}
export interface AskRequest {
  question: string;
  context: AskContext;
  state: AskState;
  signal?: AbortSignal;
}
export interface AskService {
  ask(request: AskRequest): Promise<AskAnswer>;
}
export interface AskTurn {
  id: string;
  question: string;
  queryContext?: AskContext;
  answer: AskAnswer;
}
