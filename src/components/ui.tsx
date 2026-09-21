import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function buttonStyles(
  variant: "primary" | "secondary" | "ghost" = "primary",
) {
  return cn(
    "focus-visible:outline-brand inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition focus-visible:outline-3 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:active:translate-y-0 motion-reduce:transition-none",
    {
      primary:
        "game-chip border-2 border-[#17150f] bg-[#ff6b5d] text-[#17150f] shadow-none hover:bg-[#ff8074] active:translate-y-px",
      secondary:
        "game-chip border-2 border-[#17150f] bg-[#fffdf4] text-[#17150f] shadow-none hover:bg-[#fff1b8]",
      ghost:
        "text-[#17150f] underline decoration-2 underline-offset-4 hover:bg-[#fff1b8]",
    }[variant],
  );
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return <button className={cn(buttonStyles(variant), className)} {...props} />;
}

export function LinkButton({
  href,
  children,
  className,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <Link className={cn(buttonStyles(variant), className)} href={href}>
      {children}
    </Link>
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("game-paper rounded-[16px] bg-[#fffdf4]", className)}
      {...props}
    />
  );
}

export function Avatar({ initials = "A" }: { initials?: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-[#17150f] bg-[#ffd95f] text-sm font-black text-[#17150f]"
    >
      {initials}
    </span>
  );
}

export function ProgressBar({
  value,
  label,
  className,
}: {
  value: number;
  label: string;
  className?: string;
}) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div
      aria-label={label}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={safeValue}
      className={cn(
        "h-3.5 overflow-hidden rounded-full border-2 border-[#17150f] bg-[#fffdf4]",
        className,
      )}
      role="progressbar"
    >
      <div
        className="h-full rounded-full bg-[#5cc98c] transition-[width] duration-300 motion-reduce:transition-none"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

export function BadgeCard({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/80 bg-white/80 p-4",
        className,
      )}
    >
      <span className="bg-sun-soft text-sun mb-3 grid size-10 place-items-center rounded-xl">
        <Star aria-hidden="true" fill="currentColor" size={20} />
      </span>
      <p className="text-ink font-bold">{title}</p>
      <p className="text-ink-muted mt-1 text-sm leading-5">{description}</p>
    </div>
  );
}
