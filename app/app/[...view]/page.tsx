import { Shell } from "@/components/shell";
import { Dashboard } from "@/components/dashboard";
import { Inbox } from "@/components/inbox";
import { CatchUp } from "@/components/catch-up";
import { Projects, ProjectDetail } from "@/components/projects";
import { Commitments, Actions, Briefings } from "@/components/productivity";
import { FocusPage } from "@/components/focus";
import { Settings, Onboarding } from "@/components/settings";
import { notFound } from "next/navigation";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ view: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { view } = await params;
  // Only project detail pages have a second path segment.
  if (view.length > (view[0] === "projects" ? 2 : 1)) notFound();
  const query = await searchParams;
  const value = (key: string) =>
    typeof query[key] === "string" ? (query[key] as string) : undefined;
  if (view[0] === "onboarding") return <Onboarding />;
  let screen: React.ReactNode;
  switch (view[0]) {
    case "dashboard":
      screen = <Dashboard />;
      break;
    case "inbox":
      screen = <Inbox initialCategory={value("category")} />;
      break;
    case "catch-up":
      screen = <CatchUp autoStart={value("start") === "1"} />;
      break;
    case "projects":
      if (view[1]) {
        const id = view[1].replaceAll("-", "_");
        if (
          ![
            "project_atlas",
            "project_q4_launch",
            "project_investor_deck",
            "client_redesign",
          ].includes(id)
        )
          notFound();
        screen = <ProjectDetail id={id} />;
      } else screen = <Projects />;
      break;
    case "commitments":
      screen = <Commitments initialTab={value("tab")} />;
      break;
    case "actions":
      screen = <Actions />;
      break;
    case "briefings":
      screen = <Briefings />;
      break;
    case "focus":
      screen = <FocusPage />;
      break;
    case "settings":
      screen = (
        <Settings
          key={value("tab") || "connected-apps"}
          initialTab={value("tab")}
        />
      );
      break;
    default:
      notFound();
  }
  return <Shell>{screen}</Shell>;
}
