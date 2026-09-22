"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Mail,
  MessageSquare,
  Sparkles,
  Clock3,
  ArrowRight,
  CircleCheck,
  Link2,
} from "lucide-react";
import { type ReactNode, useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type TargetAndTransition,
} from "framer-motion";
import { seed, labels, time, useDemo, type Message } from "./store";
const mascotSource = "/miyo-mascot-selected.png";
type MascotMood =
  | "idle"
  | "hello"
  | "thinking"
  | "celebrate"
  | "focus"
  | "still";
const mascotMotion: Record<MascotMood, TargetAndTransition> = {
  idle: {
    y: [0, -3, 0],
    rotate: [0, -1, 0],
    transition: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
  },
  hello: {
    y: [0, -4, 0],
    rotate: [0, -6, 4, -2, 0],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      repeatDelay: 12,
      ease: "easeInOut",
    },
  },
  thinking: {
    y: [0, -4, 0],
    rotate: [0, -3, 3, 0],
    transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
  },
  celebrate: {
    y: [0, -7, 0, -3, 0],
    rotate: [0, 3, -2, 0],
    transition: { duration: 0.9, repeat: 0, ease: "easeOut" },
  },
  focus: {
    y: [0, -3, 0],
    scale: [1, 1.025, 1],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
  still: { y: 0, rotate: 0, scale: 1, transition: { duration: 0 } },
};
export function Mascot({
  size = 80,
  className = "",
  mood = "idle",
}: {
  size?: number;
  className?: string;
  mood?: MascotMood;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const visible = useInView(ref, { amount: 0.2 });
  const reduce = useReducedMotion();
  const active = reduce === false && visible && mood !== "still";
  return (
    <motion.img
      ref={ref}
      src={mascotSource}
      alt="Miyo, your friendly purple attention assistant"
      width={size}
      height={size}
      className={"mascot " + className}
      data-mood={mood}
      data-motion={active ? "animated" : "still"}
      initial={false}
      animate={active ? mascotMotion[mood] : mascotMotion.still}
      whileHover={
        active
          ? { rotate: [0, -5, 4, 0], transition: { duration: 0.65, repeat: 0 } }
          : undefined
      }
      draggable={false}
    />
  );
}
export function Logo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLImageElement>(null);
  const visible = useInView(ref, { amount: 0.2 });
  const active = reduce === false && visible;
  return (
    <Link href="/" className="logo" aria-label="Miyo home">
      <motion.img
        ref={ref}
        className="logo-mascot"
        src={mascotSource}
        alt=""
        aria-hidden="true"
        width={42}
        height={42}
        initial={false}
        animate={
          active
            ? {
                rotate: [0, -7, 5, -2, 0],
                y: [0, -2, 0],
                transition: {
                  duration: 1.1,
                  repeat: Infinity,
                  repeatDelay: 15,
                  ease: "easeInOut",
                },
              }
            : mascotMotion.still
        }
        whileHover={
          active
            ? { rotate: -6, scale: 1.05, transition: { duration: 0.25 } }
            : undefined
        }
        whileTap={active ? { scale: 0.95 } : undefined}
        data-motion={active ? "animated" : "still"}
        draggable={false}
      />
      miyo<span className="logo-period">.</span>
    </Link>
  );
}
export function Provider({
  name,
  compact = false,
}: {
  name: string;
  compact?: boolean;
}) {
  return (
    <span
      className={"provider provider-" + name + (compact ? " compact" : "")}
      title={labels[name] || name}
    >
      {name === "slack" ? <MessageSquare size={13} /> : <Mail size={13} />}{" "}
      {!compact && (labels[name] || name)}
    </span>
  );
}
export function Providers({
  names = ["gmail", "outlook", "slack"],
}: {
  names?: string[];
}) {
  return (
    <span className="providers">
      {names.map((n) => (
        <Provider key={n} name={n} />
      ))}
    </span>
  );
}
export function Badge({ value }: { value: string }) {
  return (
    <span className={"badge " + value}>
      <span className="badge-dot" />
      {labels[value] || value}
    </span>
  );
}
export function Avatar({ name, size = "" }: { name: string; size?: string }) {
  return (
    <span
      className={"avatar " + size}
      style={
        {
          "--avatar-hue": String(((name.charCodeAt(0) * 7) % 90) + 230),
        } as React.CSSProperties
      }
    >
      {name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}
export function Button({
  children,
  onClick,
  variant = "secondary",
  className = "",
  disabled = false,
  type = "button",
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: string;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
}) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={`button ${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="toggle-row">
      <div>
        <label>{label}</label>
        {description && <p>{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={"switch " + (checked ? "on" : "")}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
export function SectionHead({
  title,
  href,
  label = "View all",
  icon,
}: {
  title: string;
  href?: string;
  label?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="section-head">
      <h2>
        {icon}
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-link"
          aria-label={label || `View ${title.toLowerCase()}`}
        >
          {label}
          <ArrowUpRight size={15} />
        </Link>
      )}
    </div>
  );
}
export function Empty({
  title = "You’re clear for now.",
  description = "Nothing here needs your attention.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <Mascot size={92} />
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function MessageRow({
  message: m,
  preview = false,
}: {
  message: Message;
  preview?: boolean;
}) {
  const { openMessage, state, markMessage } = useDemo();
  return (
    <article
      className={"message-row " + (state.messages[m.id] ? "is-done" : "")}
    >
      <button
        className="message-main"
        onClick={() => openMessage(m.id)}
        aria-label={"Open " + m.subject}
      >
        <Avatar name={m.senderName} />
        <div className="message-content">
          <div className="message-meta">
            <strong>{m.senderName}</strong>
            <Provider name={m.provider} />
            <span className="message-time">{time(m.timestamp)}</span>
          </div>
          <h3>{m.subject}</h3>
          <p className="message-summary">{m.summary}</p>
          <div className="message-tags">
            <Badge value={m.attentionCategory} />
            {m.needsReply && m.attentionCategory !== "needs_reply" && (
              <span className="meta">Reply needed</span>
            )}
          </div>
        </div>
        <ChevronRight size={17} className="row-chevron" />
      </button>
      {!preview && (
        <div className="message-quick">
          <button
            aria-label={"Snooze " + m.subject}
            title="Snooze"
            onClick={() => markMessage(m.id, "snoozed")}
          >
            <Clock3 size={16} />
          </button>
          <button
            aria-label={"Mark done " + m.subject}
            title="Mark done"
            onClick={() => markMessage(m.id, "done")}
          >
            <Check size={17} />
          </button>
        </div>
      )}
    </article>
  );
}
export function Summary({
  children,
  label = "In simple terms",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <div className="summary">
      <span className="summary-label">
        <Sparkles size={15} />
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}
export function CatchCard() {
  return (
    <Link href="/app/catch-up?start=1" className="catch-card">
      <Mascot size={84} />
      <div className="catch-copy">
        <h2>Away for a while?</h2>
        <p>42 messages. Just the parts that matter.</p>
      </div>
      <span className="button primary">
        Catch me up <ArrowRight size={16} />
      </span>
    </Link>
  );
}
export function AtlasMini() {
  const { state } = useDemo();
  return (
    <Link href="/app/projects/project-atlas" className="atlas-mini">
      <div className="flex-row">
        <span className="project-symbol">A</span>
        <div>
          <h3>Project Atlas</h3>
          <span className="meta">3 conversations. One clear picture.</span>
        </div>
        <ArrowUpRight size={18} />
      </div>
      <p>
        {state.actions.action_approve_atlas_pricing === "done"
          ? "Concept B and pricing approved. Tomorrow’s demo starts at 2:30 PM."
          : "Concept B approved. Demo moved to 2:30 PM. One pricing decision needs you."}
      </p>
      <Providers />
    </Link>
  );
}
