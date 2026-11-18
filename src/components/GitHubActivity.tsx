import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  Flame,
  GitBranch,
  GitFork,
  Github,
  Pin,
  RefreshCw,
  Sparkles,
  Star,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  buildContributionMatrix,
  detectDefaultGitHubContext,
  fetchGitHubContributions,
  fetchGitHubUserAndRepos,
  formatRelativeMonthYear,
  formatShortDate,
  type GitHubContributionDay,
  type GitHubContributionsResponse,
  type GitHubRepoItem,
  type GitHubUserProfile,
} from '../lib/github';
import { fadeUpItem, staggerFastContainer } from '../lib/animations';
import { Magnetic } from './Magnetic';
import { SpotlightCard } from './SpotlightCard';

interface GitHubActivityProps {
  variant?: 'overview' | 'work';
  onOpenWork?: () => void;
}

const LEVEL_CLASSES: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'bg-[#DCEBF7] dark:bg-[#132644]',
  1: 'bg-[#9BE9A8] dark:bg-[#0E4429]',
  2: 'bg-[#40C463] dark:bg-[#006D32]',
  3: 'bg-[#30A14E] dark:bg-[#26A641]',
  4: 'bg-[#216E39] dark:bg-[#39D353]',
};

const LANGUAGE_DOT: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  Python: '#3572A5',
  Java: '#B07219',
  'C++': '#F34B7D',
  C: '#555555',
  'C#': '#178600',
  HTML: '#E34C26',
  CSS: '#563D7C',
  'Jupyter Notebook': '#DA5B0B',
};

export function GitHubActivity({ variant = 'overview', onOpenWork }: GitHubActivityProps) {
  const initialContext = useMemo(() => detectDefaultGitHubContext(), []);
  const username = initialContext.username;

  const [userProfile, setUserProfile] = useState<GitHubUserProfile | null>(null);
  const [pinnedRepos, setPinnedRepos] = useState<GitHubRepoItem[]>([]);
  const [recentRepos, setRecentRepos] = useState<GitHubRepoItem[]>([]);
  const [calendar, setCalendar] = useState<GitHubContributionsResponse | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('last');
  const [hoveredDay, setHoveredDay] = useState<GitHubContributionDay | null>(null);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    if (!username) {
      setUserProfile(null);
      setPinnedRepos([]);
      setRecentRepos([]);
      setCalendar(null);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      setAvatarFailed(false);
      try {
        const [{ user, pinnedRepos: fetchedPinned, recentRepos: fetchedRecent }, contribData] =
          await Promise.all([
            fetchGitHubUserAndRepos(username, controller.signal),
            fetchGitHubContributions(username, selectedYear, controller.signal),
          ]);
        if (cancelled) return;
        setUserProfile(user);
        setPinnedRepos(fetchedPinned);
        setRecentRepos(fetchedRecent);
        setCalendar(contribData);
      } catch (err) {
        if (cancelled || (err as Error).name === 'AbortError') return;
        setError((err as Error).message || 'Could not load GitHub activity.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [username, selectedYear, reloadNonce]);

  const matrix = useMemo(
    () => buildContributionMatrix(calendar?.contributions ?? []),
    [calendar]
  );

  const maxMonthlyCount = useMemo(
    () => Math.max(1, ...matrix.monthlyTotals.map((m) => m.count)),
    [matrix.monthlyTotals]
  );

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return ['last', String(currentYear), String(currentYear - 1)];
  }, []);

  const currentPortfolioRepo = useMemo(() => {
    if (!initialContext.currentRepo) return null;
    const allRepos = [...pinnedRepos, ...recentRepos];
    return (
      allRepos.find((r) => r.name.toLowerCase() === initialContext.currentRepo?.toLowerCase()) ??
      null
    );
  }, [initialContext.currentRepo, pinnedRepos, recentRepos]);

  // Prefer pinned repositories first, then supplement with active owner repositories
  const displayedRepos = useMemo(() => {
    const limit = variant === 'overview' ? 3 : 6;
    const combined: GitHubRepoItem[] = [];
    const seen = new Set<string>();

    const pushIfNew = (repo: GitHubRepoItem) => {
      if (currentPortfolioRepo && repo.name.toLowerCase() === currentPortfolioRepo.name.toLowerCase()) {
        return;
      }
      const key = repo.fullName.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(repo);
      }
    };

    pinnedRepos.forEach(pushIfNew);
    recentRepos.forEach(pushIfNew);

    return combined.slice(0, limit);
  }, [currentPortfolioRepo, pinnedRepos, recentRepos, variant]);

  const hasPinnedRepos = pinnedRepos.length > 0;

  const currentPortfolioRepoUrl =
    currentPortfolioRepo?.htmlUrl ||
    (username && initialContext.currentRepo
      ? `https://github.com/${username}/${initialContext.currentRepo}`
      : username
      ? `https://github.com/${username}`
      : null);

  const vibeCodedCard = (
    <SpotlightCard className="h-full p-6 flex flex-col justify-between border-[#3B8EE0]/45 dark:border-[#66B3F5]/45">
      <div>
        <div className="flex items-center justify-between gap-2 font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9]">
          <span className="inline-flex items-center gap-1.5 text-[#3B8EE0] dark:text-[#F2EC38]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Active Build · Vibe-Coded</span>
          </span>
          <span className="tabular-nums">2026</span>
        </div>

        <h3 className="mt-2.5 font-serif text-2xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
          {currentPortfolioRepo?.name || initialContext.currentRepo || 'Architectural Portfolio'}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-[#3A5173] dark:text-[#9BB8D9]">
          {currentPortfolioRepo?.description ||
            'This live portfolio web application—iteratively engineered and vibe-coded with React 19, TypeScript, Vite 8, Tailwind CSS v4, Framer Motion, and automated GitHub Actions Pages CI/CD.'}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-[#C3DCEF] dark:border-[#1E375C] flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9] truncate">
          React · TypeScript · Tailwind · Motion
        </span>
        {currentPortfolioRepoUrl && (
          <a
            href={currentPortfolioRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#091933] dark:text-[#F2EC38] hover:text-[#3B8EE0] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0] rounded"
          >
            <span>Source Repo</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
      </div>
    </SpotlightCard>
  );

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-[#3B8EE0] dark:text-[#66B3F5]">
            {variant === 'overview' ? '02. Open Source & Engineering Velocity' : 'Currently Building'}
          </p>
          <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
            {variant === 'overview'
              ? 'GitHub Activity & Pinned Repositories'
              : 'Vibe-Coded Build & GitHub Repositories'}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {username && (
            <a
              href={userProfile?.htmlUrl || `https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9] hover:text-[#091933] dark:hover:text-[#F2EC38] transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0]"
            >
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              <span>@{username}</span>
            </a>
          )}
          {variant === 'overview' && onOpenWork && (
            <Magnetic strength={0.22} maxOffset={5}>
              <button
                type="button"
                onClick={onOpenWork}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#091933] dark:text-[#EDF6FC] hover:text-[#3B8EE0] dark:hover:text-[#F2EC38] transition-colors whitespace-nowrap shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0]"
              >
                <span>View all repositories</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </Magnetic>
          )}
        </div>
      </div>

      {/* Automatic Sync Notice when previewing off GitHub Pages without a configured handle */}
      {!username && (
        <SpotlightCard className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-[#3B8EE0] dark:text-[#F2EC38]">
                <Github className="h-4 w-4" aria-hidden="true" />
                <span>Automatic GitHub Telemetry</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-[#3A5173] dark:text-[#9BB8D9]">
                When hosted on GitHub Pages, your daily contribution heatmap, project velocity
                metrics, and pinned repositories hydrate automatically from the GitHub API for
                every visitor.
              </p>
            </div>
            <div className="font-mono text-xs text-[#091933] dark:text-[#EDF6FC] shrink-0">
              Auto-sync on GitHub Pages
            </div>
          </div>
        </SpotlightCard>
      )}

      {/* Error State */}
      {username && error && !loading && (
        <SpotlightCard className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-mono text-xs text-[#3B8EE0] dark:text-[#F2EC38]">
                GitHub Sync Notice
              </div>
              <p className="mt-1 text-sm text-[#091933] dark:text-[#EDF6FC]">{error}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Magnetic strength={0.2} maxOffset={4}>
                <button
                  type="button"
                  onClick={() => setReloadNonce((n) => n + 1)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#091933] dark:border-[#F2EC38] bg-[#EFEA2B] dark:bg-[#F2EC38] px-3.5 py-2 text-xs font-semibold text-[#091933] hover:bg-[#091933] hover:text-[#EFEA2B] transition-colors whitespace-nowrap"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Retry</span>
                </button>
              </Magnetic>
            </div>
          </div>
        </SpotlightCard>
      )}

      {/* Green Daily Contribution Heatmap & Velocity Summary */}
      {username && !error && (
        <SpotlightCard className="p-6 sm:p-7">
          {/* Chart Header + Year Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C3DCEF] dark:border-[#1E375C] pb-5">
            <div className="flex items-center gap-3.5">
              {userProfile?.avatarUrl && !avatarFailed ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={`GitHub avatar for ${userProfile.login}`}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                  className="h-10 w-10 rounded-lg border border-[#C3DCEF] dark:border-[#1E375C] object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#C3DCEF] dark:border-[#1E375C] bg-[#D9ECF8] dark:bg-[#081426] text-[#091933] dark:text-[#F2EC38]">
                  <Github className="h-5 w-5" aria-hidden="true" />
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={userProfile?.htmlUrl || `https://github.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif text-xl sm:text-2xl font-semibold text-[#091933] dark:text-[#EDF6FC] hover:text-[#3B8EE0] dark:hover:text-[#F2EC38] transition-colors"
                  >
                    {userProfile?.name || `@${username}`}
                  </a>
                  <span className="font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9]">
                    · @{userProfile?.login || username}
                  </span>
                </div>
                <div className="mt-0.5 font-mono text-xs tabular-nums text-[#3A5173] dark:text-[#9BB8D9]">
                  {loading ? (
                    'Loading contribution calendar...'
                  ) : (
                    <>
                      <span className="font-semibold text-[#091933] dark:text-[#EDF6FC]">
                        {matrix.totalCount.toLocaleString()}
                      </span>{' '}
                      contributions across{' '}
                      <span className="font-semibold text-[#091933] dark:text-[#EDF6FC]">
                        {matrix.activeDays}
                      </span>{' '}
                      active days
                      {calendar?.source === 'events-fallback' && ' · Recent public push activity'}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Year Selector */}
            <div
              role="group"
              aria-label="Contribution year selector"
              className="inline-flex items-center gap-1 rounded-lg border border-[#C3DCEF] dark:border-[#1E375C] bg-[#D9ECF8] dark:bg-[#081426] p-1 self-start sm:self-auto"
            >
              {availableYears.map((yr) => {
                const isActive = selectedYear === yr;
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSelectedYear(yr)}
                    className={`rounded-md px-2.5 py-1 font-mono text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0] ${
                      isActive
                        ? 'bg-[#091933] dark:bg-[#F2EC38] text-[#EFEA2B] dark:text-[#081426]'
                        : 'text-[#3A5173] dark:text-[#9BB8D9] hover:text-[#091933] dark:hover:text-[#EDF6FC]'
                    }`}
                  >
                    {yr === 'last' ? 'Last 12m' : yr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Velocity Metrics Strip */}
          {!loading && (
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#C3DCEF] dark:divide-[#1E375C] border-b border-[#C3DCEF] dark:border-[#1E375C] py-3.5">
              <div className="py-1.5 sm:py-0 sm:pr-4">
                <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#3A5173] dark:text-[#9BB8D9]">
                  <Activity className="h-3 w-3 text-[#26A641] dark:text-[#39D353]" aria-hidden="true" />
                  <span>30-Day Velocity</span>
                </div>
                <div className="mt-0.5 font-mono text-base font-semibold tabular-nums text-[#091933] dark:text-[#EDF6FC]">
                  {matrix.last30DaysCount} pushes
                </div>
              </div>
              <div className="py-1.5 sm:py-0 sm:px-4">
                <div className="font-mono text-[11px] text-[#3A5173] dark:text-[#9BB8D9]">
                  Weekly Average
                </div>
                <div className="mt-0.5 font-mono text-base font-semibold tabular-nums text-[#3B8EE0] dark:text-[#66B3F5]">
                  {matrix.weeklyAverage} / wk
                </div>
              </div>
              <div className="py-1.5 sm:py-0 sm:px-4">
                <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#3A5173] dark:text-[#9BB8D9]">
                  <Flame className="h-3 w-3 text-[#3B8EE0] dark:text-[#F2EC38]" aria-hidden="true" />
                  <span>Current Streak</span>
                </div>
                <div className="mt-0.5 font-mono text-base font-semibold tabular-nums text-[#091933] dark:text-[#EDF6FC]">
                  {matrix.currentStreak} {matrix.currentStreak === 1 ? 'day' : 'days'}
                </div>
              </div>
              <div className="py-1.5 sm:py-0 sm:pl-4">
                <div className="font-mono text-[11px] text-[#3A5173] dark:text-[#9BB8D9]">
                  Longest Streak
                </div>
                <div className="mt-0.5 font-mono text-base font-semibold tabular-nums text-[#091933] dark:text-[#EFEA2B]">
                  {matrix.longestStreak} {matrix.longestStreak === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>
          )}

          {/* 52-Week Green Contribution Grid */}
          <div className="mt-5 overflow-x-auto pb-2">
            {loading ? (
              <div className="h-32 w-full rounded-lg bg-[#D9ECF8]/60 dark:bg-[#081426]/60 animate-pulse" />
            ) : (
              <div className="inline-block min-w-max">
                {/* Month Labels Row */}
                <div className="relative mb-2 ml-8 h-4 font-mono text-[10px] text-[#3A5173] dark:text-[#9BB8D9]">
                  {matrix.monthLabels.map((m) => (
                    <span
                      key={`${m.label}-${m.weekIndex}`}
                      style={{ left: `${m.weekIndex * 15}px` }}
                      className="absolute top-0 whitespace-nowrap"
                    >
                      {m.label}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  {/* Weekday Labels */}
                  <div className="grid grid-rows-7 gap-[3px] pr-1 font-mono text-[10px] leading-[12px] text-[#3A5173] dark:text-[#9BB8D9] select-none">
                    <span className="opacity-0">Sun</span>
                    <span>Mon</span>
                    <span className="opacity-0">Tue</span>
                    <span>Wed</span>
                    <span className="opacity-0">Thu</span>
                    <span>Fri</span>
                    <span className="opacity-0">Sat</span>
                  </div>

                  {/* Week Columns */}
                  <div className="flex gap-[3px]" role="grid" aria-label="Daily GitHub contributions">
                    {matrix.weeks.map((week, wIdx) => (
                      <div key={wIdx} className="grid grid-rows-7 gap-[3px]">
                        {week.days.map((day, dIdx) =>
                          day ? (
                            <button
                              key={day.date}
                              type="button"
                              onMouseEnter={() => setHoveredDay(day)}
                              onFocus={() => setHoveredDay(day)}
                              aria-label={`${day.count} contributions on ${formatShortDate(day.date)}`}
                              className={`h-[12px] w-[12px] rounded-[2.5px] transition-transform duration-100 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0] ${LEVEL_CLASSES[day.level]}`}
                            />
                          ) : (
                            <span key={`empty-${wIdx}-${dIdx}`} className="h-[12px] w-[12px]" />
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Readout + Intensity Legend */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#C3DCEF]/70 dark:border-[#1E375C]/70 pt-3 font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9]">
            <div className="tabular-nums">
              {hoveredDay ? (
                <span>
                  <strong className="text-[#091933] dark:text-[#EDF6FC]">
                    {hoveredDay.count} {hoveredDay.count === 1 ? 'contribution' : 'contributions'}
                  </strong>{' '}
                  on {formatShortDate(hoveredDay.date)}
                </span>
              ) : (
                <span>Hover or focus any square to inspect daily push count.</span>
              )}
            </div>

            <div className="inline-flex items-center gap-1.5 select-none">
              <span>Less</span>
              {([0, 1, 2, 3, 4] as const).map((lvl) => (
                <span
                  key={lvl}
                  className={`h-[11px] w-[11px] rounded-[2px] ${LEVEL_CLASSES[lvl]}`}
                  aria-hidden="true"
                />
              ))}
              <span>More</span>
            </div>
          </div>

          {/* Monthly Contribution Totals */}
          {!loading && matrix.monthlyTotals.length > 0 && (
            <div className="mt-5 border-t border-[#C3DCEF] dark:border-[#1E375C] pt-4">
              <div className="mb-2.5 font-mono text-[11px] text-[#3A5173] dark:text-[#9BB8D9]">
                Monthly Contribution Totals
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2.5">
                {matrix.monthlyTotals.map((m) => {
                  const pct =
                    m.count > 0 ? Math.max(14, Math.round((m.count / maxMonthlyCount) * 100)) : 0;
                  return (
                    <div key={m.key} className="space-y-1">
                      <div className="flex items-baseline justify-between font-mono text-[11px]">
                        <span className="text-[#3A5173] dark:text-[#9BB8D9]">{m.label}</span>
                        <span className="font-semibold tabular-nums text-[#091933] dark:text-[#EDF6FC]">
                          {m.count}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#DCEBF7] dark:bg-[#132644]">
                        <div
                          className="h-full rounded-full bg-[#26A641] dark:bg-[#39D353]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </SpotlightCard>
      )}

      {/* Vibe-Coded Build Spotlight + Pinned & Active GitHub Repositories */}
      <div>
        {displayedRepos.length > 0 && (
          <div className="mb-4 flex items-center justify-between gap-2 font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9]">
            <span>
              {hasPinnedRepos ? 'Pinned & Active Repositories' : 'Recent Public Repositories'}
            </span>
            {userProfile && (
              <span className="tabular-nums">{userProfile.publicRepos} public repos</span>
            )}
          </div>
        )}

        <motion.div
          variants={staggerFastContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div variants={fadeUpItem}>{vibeCodedCard}</motion.div>

          {displayedRepos.map((repo) => {
            const dotColor =
              repo.languageColor ||
              (repo.language && LANGUAGE_DOT[repo.language]) ||
              '#3B8EE0';
            return (
              <motion.div key={`${repo.fullName}-${repo.id}`} variants={fadeUpItem}>
                <SpotlightCard className="h-full p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9]">
                      <span className="inline-flex items-center gap-1.5">
                        {repo.isPinned ? (
                          <Pin
                            className="h-3.5 w-3.5 text-[#3B8EE0] dark:text-[#F2EC38]"
                            aria-hidden="true"
                          />
                        ) : (
                          <GitBranch
                            className="h-3.5 w-3.5 text-[#3B8EE0] dark:text-[#66B3F5]"
                            aria-hidden="true"
                          />
                        )}
                        <span>
                          {repo.isPinned
                            ? 'Pinned Repository'
                            : repo.isFork
                            ? 'Forked Repository'
                            : 'GitHub Repository'}
                        </span>
                      </span>
                      {repo.pushedAt && (
                        <span className="tabular-nums">
                          Updated {formatRelativeMonthYear(repo.pushedAt)}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2.5 font-serif text-2xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#3B8EE0] dark:hover:text-[#F2EC38] transition-colors"
                      >
                        {repo.name}
                      </a>
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-[#3A5173] dark:text-[#9BB8D9]">
                      {repo.description || 'Public software repository hosted on GitHub.'}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#C3DCEF] dark:border-[#1E375C] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9] truncate">
                      {repo.language && (
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: dotColor }}
                            aria-hidden="true"
                          />
                          <span>{repo.language}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Star className="h-3 w-3" aria-hidden="true" />
                        <span>{repo.stars}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <GitFork className="h-3 w-3" aria-hidden="true" />
                        <span>{repo.forks}</span>
                      </span>
                    </div>

                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#091933] dark:text-[#F2EC38] hover:text-[#3B8EE0] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0] rounded"
                    >
                      <span>Open Repo</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
