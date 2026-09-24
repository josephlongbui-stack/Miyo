import Link from "next/link";
import { MessageCircle } from "lucide-react";
export function AskLink({
  question,
  children = "Ask Miyo",
  className = "",
}: {
  question?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      className={"text-link ask-entry " + className}
      href={
        question ? "/app/ask?q=" + encodeURIComponent(question) : "/app/ask"
      }
    >
      <MessageCircle size={15} />
      {children}
    </Link>
  );
}
