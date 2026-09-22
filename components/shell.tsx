"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  Inbox,
  Sparkles,
  Layers3,
  Handshake,
  Sun,
  ListTodo,
  Moon,
  Settings,
  Menu,
  X,
  CircleCheck,
  Focus,
  ArrowUpRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo, Avatar } from "./ui";
import { seed, useDemo } from "./store";
export const nav = [
  ["dashboard", "Home", Home],
  ["inbox", "Inbox", Inbox],
  ["catch-up", "Catch Me Up", Sparkles],
  ["projects", "Projects", Layers3],
  ["commitments", "Commitments", Handshake],
  ["briefings", "Briefings", Sun],
  ["actions", "Actions", ListTodo],
  ["focus", "Focus", Moon],
] as const;
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { state, toast } = useDemo();
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    if (!mobile) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobile(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [mobile]);
  const current =
    nav.find(([id]) => path.includes("/" + id))?.[1] || "Settings";
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <AnimatePresence>
        {mobile && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="nav-scrim"
            aria-label="Close navigation"
            onClick={() => setMobile(false)}
          />
        )}
      </AnimatePresence>
      <aside
        id="workspace-navigation"
        className={"sidebar " + (mobile ? "mobile-open" : "")}
      >
        <div className="sidebar-brand">
          <Logo />
          <button
            className="icon-button mobile-only"
            onClick={() => setMobile(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>
        <nav aria-label="Main navigation">
          {[
            {
              label: "Daily",
              ids: ["dashboard", "inbox", "catch-up", "focus"],
            },
            {
              label: "Organize",
              ids: ["projects", "commitments", "actions", "briefings"],
            },
          ].map((group) => (
            <div className="nav-group" key={group.label}>
              <span className="nav-label">{group.label}</span>
              {group.ids.map((id) => {
                const [, label, Icon] = nav.find((item) => item[0] === id)!;
                return (
                  <Link
                    key={id}
                    href={"/app/" + id}
                    onClick={() => setMobile(false)}
                    aria-current={path.includes("/" + id) ? "page" : undefined}
                    className={
                      "nav-item " + (path.includes("/" + id) ? "active" : "")
                    }
                  >
                    <Icon size={18} />
                    {label}
                    {id === "inbox" && (
                      <span className="nav-count">
                        {
                          seed.messages.filter(
                            (m) =>
                              !state.messages[m.id] &&
                              m.attentionCategory === "urgent",
                          ).length
                        }
                      </span>
                    )}
                    {id === "focus" && state.focus.active && (
                      <span className="active-dot" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link
            className={
              "nav-item " + (path.includes("/settings") ? "active" : "")
            }
            href="/app/settings"
            onClick={() => setMobile(false)}
          >
            <Settings size={18} />
            Settings
          </Link>
          <div className="profile">
            <Avatar name="Alex Morgan" />
            <div>
              <strong>Alex Morgan</strong>
              <span>Product lead</span>
            </div>
            <span className="demo-pill">Demo</span>
          </div>
        </div>
      </aside>
      <div className="app-workspace">
        <header className="topbar">
          <div className="flex-row">
            <button
              className="icon-button mobile-only"
              onClick={() => setMobile(true)}
              aria-label="Open navigation"
              aria-expanded={mobile}
              aria-controls="workspace-navigation"
            >
              <Menu size={21} />
            </button>
            <span className="breadcrumb">
              <strong>{current}</strong>
            </span>
          </div>
          <div className="topbar-actions">
            <Link
              className={
                "focus-button " + (state.focus.active ? "is-active" : "")
              }
              href="/app/focus"
            >
              <Focus size={16} />
              {state.focus.active ? "Focusing" : "Focus mode"}
            </Link>
          </div>
        </header>
        <main id="main" className="main-content">
          {state.focus.active && !path.includes("/focus") && (
            <Link className="focus-banner" href="/app/focus">
              <Moon size={16} /> Focus is on. Everyday messages are held for
              later.
              <span>
                Manage focus <ArrowUpRight size={14} />
              </span>
            </Link>
          )}
          {children}
        </main>
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            role="status"
            className="toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <CircleCheck size={19} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
