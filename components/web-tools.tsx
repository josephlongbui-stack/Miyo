"use client";
import { useEffect, useRef } from "react";
import { useDemo, seed } from "./store";
type Tool = {
  name: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => unknown | Promise<unknown>;
};
export function WebTools() {
  const demo = useDemo();
  const current = useRef(demo);
  current.current = demo;
  useEffect(() => {
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: Tool,
            options: { signal: AbortSignal },
          ) => void | Promise<void>;
        };
      }
    ).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const definitions: Tool[] = [
      {
        name: "get_miyo_attention",
        description:
          "Read the current local Miyo demo message, commitment, action, and focus state.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: () => {
          const s = current.current.state;
          return {
            commitments: seed.commitments.map((c) => ({
              id: c.id,
              text: c.text,
              status: s.commitments.includes(c.id) ? "completed" : c.status,
            })),
            messageStatuses: s.messages,
            actionStatuses: s.actions,
            focus: s.focus,
          };
        },
      },
      {
        name: "complete_miyo_commitments",
        description:
          "Mark the supplied local demo commitments complete and update their linked actions. Already-completed items are unchanged.",
        inputSchema: {
          type: "object",
          properties: {
            ids: { type: "array", items: { type: "string" }, minItems: 1 },
          },
          required: ["ids"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: async (input) => {
          if (
            !input ||
            typeof input !== "object" ||
            Array.isArray(input) ||
            Object.keys(input).some((k) => k !== "ids")
          )
            throw new Error("Expected an object containing only ids.");
          const ids = (input as { ids?: unknown }).ids;
          if (
            !Array.isArray(ids) ||
            !ids.length ||
            !ids.every(
              (id) =>
                typeof id === "string" &&
                seed.commitments.some((c) => c.id === id),
            )
          )
            throw new Error("Every id must match an existing Miyo commitment.");
          [...new Set(ids)].forEach((id) => {
            if (!current.current.state.commitments.includes(id))
              current.current.completeCommitment(id);
          });
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          );
          return { completedIds: ids };
        },
      },
    ];
    for (const tool of definitions) {
      try {
        void Promise.resolve(
          context.registerTool(tool, { signal: lifecycle.signal }),
        ).catch(() => {});
      } catch {}
    }
    return () => lifecycle.abort();
  }, []);
  return null;
}
