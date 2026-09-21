"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  CalendarDays,
  House,
  LogOut,
  Mail,
  Search,
  Settings,
  Trophy,
} from "lucide-react";

import { Avatar } from "@/components/ui";
import { cn } from "@/lib/utils/cn";

const primaryNavigation: Array<{
  label: string;
  icon: typeof House;
  href?: string;
  comingSoon?: boolean;
  mobileLabel?: string;
}> = [
  { label: "Home", mobileLabel: "Home", icon: House, href: "/student/home" },
  {
    label: "Subjects",
    mobileLabel: "Subjects",
    icon: BookOpen,
    href: "/student/subjects",
  },
  {
    label: "Progress",
    mobileLabel: "Progress",
    icon: BarChart3,
    href: "/student/progress",
  },
  {
    label: "Achievements",
    mobileLabel: "Awards",
    icon: Trophy,
    href: "/student/achievements",
  },
  { label: "AI Tutor", mobileLabel: "Tutor", icon: Bot, comingSoon: true },
];

const secondaryNavigation = [
  { label: "Calendar", icon: CalendarDays },
  { label: "Messages", icon: Mail },
];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", compact && "gap-2")}>
      <span className="relative grid size-11 place-items-center rounded-[12px] border-2 border-[#17150f] bg-[#ffd95f] text-[#17150f] shadow-[3px_4px_0_#17150f]">
        <span className="absolute -top-2 size-3 rounded-full border-2 border-[#17150f] bg-[#ff6b5d]" />
        <BookOpen aria-hidden="true" size={25} strokeWidth={2.5} />
      </span>
      {!compact && (
        <span className="leading-none">
          <strong className="game-display block text-2xl font-semibold tracking-[-0.03em] text-[#17150f]">
            Aral <span className="text-[#d5453c]">Tayo</span>
          </strong>
          <small className="mt-1 block text-xs font-bold tracking-[-0.02em] text-[#5d574a]">
            Learn Today. A Brighter Tomorrow.
          </small>
        </span>
      )}
    </div>
  );
}

function NavItem({
  label,
  icon: Icon,
  active = false,
  comingSoon = false,
  href,
}: {
  label: string;
  icon: typeof House;
  active?: boolean;
  comingSoon?: boolean;
  href?: string;
}) {
  const className = cn(
    "flex min-h-11 w-full items-center gap-3 rounded-[10px] px-3 text-left text-sm font-extrabold text-[#17150f] transition focus-visible:outline-3 focus-visible:outline-offset-2 motion-reduce:transition-none",
    active &&
      "border-2 border-[#17150f] bg-[#ffd95f] shadow-[2px_3px_0_#17150f]",
    comingSoon && "cursor-not-allowed opacity-55",
    !active && !comingSoon && "hover:bg-[#fff1b8]",
  );
  const content = (
    <>
      <Icon aria-hidden="true" size={22} strokeWidth={2.35} />
      <span className="flex-1">{label}</span>
      {comingSoon && (
        <span className="text-xs font-bold tracking-wider uppercase">Soon</span>
      )}
    </>
  );

  return href ? (
    <Link
      aria-current={active ? "page" : undefined}
      className={className}
      href={href}
    >
      {content}
    </Link>
  ) : (
    <button
      aria-disabled={comingSoon || undefined}
      className={className}
      disabled={comingSoon}
      type="button"
    >
      {content}
    </button>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/student/home") return pathname === href;
  if (href === "/student/subjects") {
    return pathname.startsWith(href) || pathname.startsWith("/student/lessons");
  }
  return pathname.startsWith(href);
}

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r-2 border-[#17150f] bg-[#fffdf4] px-4 py-6 lg:flex">
      <BrandMark />
      <nav aria-label="Primary navigation" className="mt-8 space-y-1">
        {primaryNavigation.map(({ label, icon, href, comingSoon }) => (
          <NavItem
            active={Boolean(href && isActive(pathname, href))}
            comingSoon={comingSoon}
            href={href}
            icon={icon}
            key={label}
            label={label}
          />
        ))}
      </nav>
      <nav
        aria-label="Upcoming tools"
        className="mt-5 space-y-1 border-t-2 border-[#17150f] pt-5"
      >
        {secondaryNavigation.map(({ label, icon }) => (
          <NavItem comingSoon icon={icon} key={label} label={label} />
        ))}
      </nav>
      <div className="mt-auto space-y-1 border-t-2 border-[#17150f] pt-5">
        <NavItem comingSoon icon={Settings} label="Settings" />
        <NavItem comingSoon icon={LogOut} label="Log out" />
      </div>
    </aside>
  );
}

function TopBar({ learner }: { learner: { name: string; email: string } }) {
  const initial = learner.name.trim().charAt(0).toUpperCase() || "S";

  return (
    <header className="sticky top-0 z-10 flex min-h-[74px] items-center gap-3 border-b-2 border-[#17150f] bg-[#f7f3e8]/95 px-4 py-3 backdrop-blur md:px-7 lg:px-9">
      <div className="relative hidden max-w-xl flex-1 sm:block">
        <Search
          aria-hidden="true"
          className="text-brand absolute top-1/2 left-4 -translate-y-1/2"
          size={20}
        />
        <input
          aria-label="Search lessons, subjects, or topics"
          className="h-11 w-full rounded-[10px] border-2 border-[#17150f] bg-[#fffdf4] py-2 pr-4 pl-11 text-sm text-[#17150f] opacity-65 outline-none placeholder:text-[#5d574a]"
          disabled
          placeholder="Search coming soon"
          readOnly
          type="search"
        />
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <button
          aria-label="Notifications — coming soon"
          className="text-ink relative grid size-11 place-items-center rounded-xl opacity-55"
          disabled
          type="button"
        >
          <Bell aria-hidden="true" size={21} />
          <span className="bg-brand-soft text-brand absolute -bottom-1 rounded-full px-1.5 py-0.5 text-xs font-bold uppercase">
            Soon
          </span>
        </button>
        <button
          aria-label="Profile menu — coming soon"
          className="flex min-h-11 items-center gap-2 rounded-xl px-1 text-left opacity-65"
          disabled
          type="button"
        >
          <Avatar initials={initial} />
          <span className="hidden sm:block">
            <strong className="text-ink block text-sm">{learner.name}</strong>
            <span className="text-ink-muted block max-w-48 truncate text-xs">
              {learner.email}
            </span>
          </span>
          <span className="bg-brand-soft text-brand hidden rounded-full px-2 py-1 text-xs font-bold uppercase sm:inline">
            Soon
          </span>
        </button>
      </div>
    </header>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t-2 border-[#17150f] bg-[#fffdf4]/95 px-1 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(23,21,15,0.08)] backdrop-blur lg:hidden"
    >
      {primaryNavigation.map(
        ({ label, mobileLabel, icon: Icon, href, comingSoon }) => {
          const active = Boolean(href && isActive(pathname, href));
          const content = (
            <>
              <Icon
                aria-hidden="true"
                size={20}
                strokeWidth={active ? 2.8 : 2.2}
              />
              <span className="whitespace-nowrap">{mobileLabel}</span>
            </>
          );
          const className = cn(
            "text-ink-muted focus-visible:outline-brand flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-xs leading-none font-bold tracking-tight focus-visible:outline-3 focus-visible:outline-offset-2",
            active && "text-[#d5453c]",
            comingSoon && "opacity-45",
          );

          return href ? (
            <Link
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={className}
              href={href}
              key={label}
            >
              {content}
            </Link>
          ) : (
            <button
              aria-label={`${label} — coming soon`}
              className={className}
              disabled
              key={label}
              type="button"
            >
              {content}
            </button>
          );
        },
      )}
    </nav>
  );
}

export function AppShell({
  children,
  learner,
}: {
  children: ReactNode;
  learner: { name: string; email: string };
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f7f3e8] text-[#17150f]">
      <Sidebar pathname={pathname} />
      <div className="min-h-screen lg:pl-60">
        <TopBar learner={learner} />
        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 pb-24 md:px-7 lg:px-9 lg:pb-9">
          {children}
        </main>
      </div>
      <MobileNav pathname={pathname} />
    </div>
  );
}

export { BrandMark };
