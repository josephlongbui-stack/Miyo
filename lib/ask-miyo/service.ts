import { answerDemo } from "./demo-engine";
import type { AskRequest, AskService } from "./types";

const demoService: AskService = {
  async ask(request) {
    if (request.signal?.aborted)
      throw new DOMException("Cancelled", "AbortError");
    return answerDemo(request);
  },
};
/** Replacement seam: inject a server-backed adapter implementing AskService.
 * Keep credentials and authorized retrieval on the server, and return the same
 * structured, source-validated AskAnswer. The demo never calls a network API.
 */
export function askMiyo(
  question: string,
  context: Omit<AskRequest, "question">,
  service: AskService = demoService,
) {
  return service.ask({ question, ...context });
}
