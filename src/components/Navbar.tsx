import { useEffect, useState } from 'react';
import { Command, Menu, Moon, Sun, X } from 'lucide-react';
import { motion } from 'motion/react';
import { ENGINEER_PROFILE, type ViewId } from '../data';
import { Magnetic } from './Magnetic';

interface NavbarProps {
  activeView: ViewId;
  onSelectView: (view: ViewId) => void;
  onOpenCommandPalette: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const NAV_ITEMS: { id: ViewId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'notes', label: 'Notes' },
  { id: 'contact', label: 'Contact' },
];

function getFormattedISTTime(): string {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    return '--:--';
  }
}

export function Navbar({
  activeView,
  onSelectView,
  onOpenCommandPalette,
  isDark,
  onToggleTheme,
}: NavbarProps) {
  const [istTime, setIstTime] = useState<string>(() => getFormattedISTTime());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const updateClock = () => setIstTime(getFormattedISTTime());
    updateClock();
    const interval = window.setInterval(updateClock, 30000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mobileOpen]);

  const handleNavigate = (view: ViewId) => {
    onSelectView(view);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#C3DCEF] dark:border-[#1E375C] bg-[#EAF4FB]/85 dark:bg-[#081426]/85 backdrop-blur-md transition-colors duration-200 no-print">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Identity + Live IST Clock */}
        <div className="flex items-center gap-3 min-w-0">
          <Magnetic strength={0.18} maxOffset={4} className="inline-flex shrink-0">
            <button
              type="button"
              onClick={() => handleNavigate('overview')}
              className="group flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0] rounded-md whitespace-nowrap shrink-0"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-[#091933] dark:border-[#F2EC38] bg-[#EFEA2B] dark:bg-[#F2EC38] font-serif text-sm font-bold tracking-tight text-[#091933] group-hover:scale-105 transition-transform">
                {ENGINEER_PROFILE.initials}
              </span>
              <span className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
                {ENGINEER_PROFILE.shortName}
              </span>
            </button>
          </Magnetic>

          <span
            className="hidden sm:inline-flex items-center gap-1.5 border-l border-[#C3DCEF] dark:border-[#1E375C] pl-3 font-mono text-xs tabular-nums text-[#3A5173] dark:text-[#9BB8D9] whitespace-nowrap shrink-0"
            title="Current local time in Hyderabad, India (IST)"
          >
            <span>IST</span>
            <span>{istTime}</span>
          </span>
        </div>

        {/* Desktop Multi-View Navigation */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <Magnetic key={item.id} strength={0.28} maxOffset={5}>
                <button
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0] ${
                    isActive
                      ? 'text-[#091933] dark:text-[#EDF6FC]'
                      : 'text-[#3A5173] dark:text-[#9BB8D9] hover:text-[#091933] dark:hover:text-[#EDF6FC]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="navActiveUnderline"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      aria-hidden="true"
                      className="absolute inset-x-3 bottom-1 h-[2.5px] rounded-full bg-[#3B8EE0] dark:bg-[#F2EC38]"
                    />
                  )}
                </button>
              </Magnetic>
            );
          })}
        </nav>

        {/* Quick Actions: Command Palette + Theme Toggle + Mobile Drawer Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <Magnetic strength={0.24} maxOffset={4}>
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Open command palette"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-[#C3DCEF] dark:border-[#1E375C] bg-[#FFFFFF] dark:bg-[#0F2038] px-2.5 sm:px-3 text-xs font-medium text-[#3A5173] dark:text-[#9BB8D9] hover:border-[#3B8EE0] dark:hover:border-[#F2EC38] hover:text-[#091933] dark:hover:text-[#EDF6FC] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0]"
            >
              <Command className="h-3.5 w-3.5 text-[#3B8EE0] dark:text-[#F2EC38]" aria-hidden="true" />
              <span className="hidden sm:inline">Menu</span>
              <kbd className="font-mono text-[11px]">⌘K</kbd>
            </button>
          </Magnetic>

          <Magnetic strength={0.24} maxOffset={4}>
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to Glacier Light mode' : 'Switch to Deep Navy Dark mode'}
              title={isDark ? 'Switch to Glacier Light mode' : 'Switch to Deep Navy Dark mode'}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#C3DCEF] dark:border-[#1E375C] bg-[#FFFFFF] dark:bg-[#0F2038] text-[#091933] dark:text-[#EDF6FC] hover:border-[#3B8EE0] dark:hover:border-[#F2EC38] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0]"
            >
              {isDark ? <Sun className="h-4 w-4 text-[#F2EC38]" aria-hidden="true" /> : <Moon className="h-4 w-4 text-[#091933]" aria-hidden="true" />}
            </button>
          </Magnetic>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-md border border-[#C3DCEF] dark:border-[#1E375C] bg-[#FFFFFF] dark:bg-[#0F2038] text-[#091933] dark:text-[#EDF6FC] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0]"
          >
            {mobileOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#C3DCEF] dark:border-[#1E375C] bg-[#EAF4FB] dark:bg-[#081426] px-4 py-3">
          <div className="mb-2 flex items-center justify-between px-2 font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9]">
            <span>{ENGINEER_PROFILE.location}</span>
            <span className="tabular-nums">IST {istTime}</span>
          </div>
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`flex items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#091933] dark:bg-[#F2EC38] text-[#EFEA2B] dark:text-[#081426]'
                      : 'text-[#091933] dark:text-[#EDF6FC] hover:bg-[#D9ECF8] dark:hover:bg-[#0F2038]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="font-mono text-xs">Active</span>}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
