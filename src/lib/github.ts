import { ENGINEER_PROFILE } from '../data';

export interface GitHubContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubContributionsResponse {
  total: Record<string, number>;
  contributions: GitHubContributionDay[];
  source: 'calendar' | 'events-fallback';
}

export interface GitHubRepoItem {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  languageColor?: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  pushedAt: string;
  isFork: boolean;
  isPinned: boolean;
  topics: string[];
}

export interface GitHubUserProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
}

export interface DetectedGitHubContext {
  username: string | null;
  currentRepo: string | null;
}

interface RawPinnedRepo {
  author?: string;
  name?: string;
  description?: string;
  language?: string;
  languageColor?: string;
  stars?: number;
  forks?: number;
}

export function detectDefaultGitHubContext(): DetectedGitHubContext {
  const configuredUser = ENGINEER_PROFILE.githubUsername.trim().replace(/^@/, '') || null;
  const configuredRepo = ENGINEER_PROFILE.portfolioRepoName.trim() || null;

  const envUser =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_GITHUB_USERNAME
      ? String(import.meta.env.VITE_GITHUB_USERNAME).trim().replace(/^@/, '')
      : null;
  const envRepo =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_GITHUB_REPO
      ? String(import.meta.env.VITE_GITHUB_REPO).trim()
      : null;

  let hostUser: string | null = null;
  let pathRepo: string | null = null;

  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    if (host.endsWith('.github.io')) {
      const subdomain = host.replace(/\.github\.io$/, '');
      if (subdomain && !subdomain.includes('.')) {
        hostUser = subdomain;
      }
      const segments = window.location.pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        pathRepo = segments[0];
      }
    }
  }

  return {
    username: configuredUser || envUser || hostUser || null,
    currentRepo: configuredRepo || envRepo || pathRepo || null,
  };
}

async function fetchPinnedRepoEntries(
  username: string,
  signal?: AbortSignal
): Promise<RawPinnedRepo[]> {
  const cleanUser = encodeURIComponent(username.trim().replace(/^@/, ''));
  try {
    const res = await fetch(`https://pinned.berrysauce.dev/get/${cleanUser}`, { signal });
    if (!res.ok) return [];
    const data = (await res.json()) as unknown;
    return Array.isArray(data) ? (data as RawPinnedRepo[]) : [];
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err;
    return [];
  }
}

export async function fetchGitHubUserAndRepos(
  username: string,
  signal?: AbortSignal
): Promise<{
  user: GitHubUserProfile;
  pinnedRepos: GitHubRepoItem[];
  recentRepos: GitHubRepoItem[];
}> {
  const cleanUser = encodeURIComponent(username.trim().replace(/^@/, ''));
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
  };

  const [userRes, reposRes, rawPinned] = await Promise.all([
    fetch(`https://api.github.com/users/${cleanUser}`, { headers, signal }),
    fetch(`https://api.github.com/users/${cleanUser}/repos?sort=pushed&per_page=50&type=owner`, {
      headers,
      signal,
    }),
    fetchPinnedRepoEntries(username, signal),
  ]);

  if (userRes.status === 404) {
    throw new Error(`GitHub user "${username}" was not found.`);
  }
  if (userRes.status === 403 || userRes.status === 429) {
    throw new Error('GitHub public API rate limit reached. Please retry in a few minutes.');
  }
  if (!userRes.ok) {
    throw new Error(`Unable to load GitHub profile (${userRes.status}).`);
  }

  const userJson = (await userRes.json()) as {
    login: string;
    name: string | null;
    avatar_url: string;
    html_url: string;
    public_repos: number;
    followers: number;
  };

  let recentRepos: GitHubRepoItem[] = [];
  if (reposRes.ok) {
    const reposJson = (await reposRes.json()) as Array<{
      id: number;
      name: string;
      full_name: string;
      description: string | null;
      html_url: string;
      homepage: string | null;
      language: string | null;
      stargazers_count: number;
      forks_count: number;
      updated_at: string;
      pushed_at: string;
      fork: boolean;
      topics?: string[];
    }>;

    recentRepos = reposJson.map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      htmlUrl: r.html_url,
      homepage: r.homepage,
      language: r.language,
      languageColor: null,
      stars: r.stargazers_count,
      forks: r.forks_count,
      updatedAt: r.updated_at,
      pushedAt: r.pushed_at,
      isFork: r.fork,
      isPinned: false,
      topics: Array.isArray(r.topics) ? r.topics : [],
    }));
  }

  const pinnedRepos: GitHubRepoItem[] = [];
  const seenFullNames = new Set<string>();

  for (let idx = 0; idx < rawPinned.length; idx += 1) {
    const item = rawPinned[idx];
    if (!item.name) continue;
    const owner = item.author || userJson.login;
    const fullName = `${owner}/${item.name}`;
    if (seenFullNames.has(fullName.toLowerCase())) continue;
    seenFullNames.add(fullName.toLowerCase());

    const matched = recentRepos.find(
      (r) =>
        r.fullName.toLowerCase() === fullName.toLowerCase() ||
        r.name.toLowerCase() === item.name?.toLowerCase()
    );

    if (matched) {
      matched.isPinned = true;
      matched.languageColor = item.languageColor ?? matched.languageColor;
      pinnedRepos.push({ ...matched, isPinned: true });
    } else {
      pinnedRepos.push({
        id: -(idx + 1),
        name: item.name,
        fullName,
        description: item.description ?? null,
        htmlUrl: `https://github.com/${fullName}`,
        homepage: null,
        language: item.language ?? null,
        languageColor: item.languageColor ?? null,
        stars: Number(item.stars ?? 0),
        forks: Number(item.forks ?? 0),
        updatedAt: '',
        pushedAt: '',
        isFork: false,
        isPinned: true,
        topics: [],
      });
    }
  }

  return {
    user: {
      login: userJson.login,
      name: userJson.name,
      avatarUrl: userJson.avatar_url,
      htmlUrl: userJson.html_url,
      publicRepos: userJson.public_repos,
      followers: userJson.followers,
    },
    pinnedRepos,
    recentRepos,
  };
}

function getLevelFromCount(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

async function fetchEventsFallbackCalendar(
  username: string,
  signal?: AbortSignal
): Promise<GitHubContributionsResponse> {
  const cleanUser = encodeURIComponent(username.trim().replace(/^@/, ''));
  const res = await fetch(
    `https://api.github.com/users/${cleanUser}/events/public?per_page=100`,
    {
      headers: { Accept: 'application/vnd.github+json' },
      signal,
    }
  );

  if (!res.ok) {
    throw new Error('Unable to retrieve GitHub contribution calendar.');
  }

  const events = (await res.json()) as Array<{
    type: string;
    created_at: string;
    payload?: { size?: number; commits?: unknown[] };
  }>;

  const countsByDate = new Map<string, number>();
  for (const ev of events) {
    if (!ev.created_at) continue;
    const dateKey = ev.created_at.slice(0, 10);
    const weight =
      ev.type === 'PushEvent'
        ? Math.max(1, ev.payload?.size ?? ev.payload?.commits?.length ?? 1)
        : 1;
    countsByDate.set(dateKey, (countsByDate.get(dateKey) ?? 0) + weight);
  }

  const today = new Date();
  const contributions: GitHubContributionDay[] = [];
  let totalCount = 0;

  for (let offset = 364; offset >= 0; offset -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    const iso = d.toISOString().slice(0, 10);
    const count = countsByDate.get(iso) ?? 0;
    totalCount += count;
    contributions.push({
      date: iso,
      count,
      level: getLevelFromCount(count),
    });
  }

  return {
    total: { lastYear: totalCount },
    contributions,
    source: 'events-fallback',
  };
}

export async function fetchGitHubContributions(
  username: string,
  year: string = 'last',
  signal?: AbortSignal
): Promise<GitHubContributionsResponse> {
  const cleanUser = encodeURIComponent(username.trim().replace(/^@/, ''));
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${cleanUser}?y=${encodeURIComponent(year)}`,
      { signal }
    );
    if (res.ok) {
      const data = (await res.json()) as {
        total?: Record<string, number>;
        contributions?: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }>;
      };
      if (Array.isArray(data.contributions) && data.contributions.length > 0) {
        return {
          total: data.total ?? {},
          contributions: data.contributions,
          source: 'calendar',
        };
      }
    }
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err;
  }

  return fetchEventsFallbackCalendar(username, signal);
}

export interface WeekColumn {
  days: (GitHubContributionDay | null)[];
}

export interface MonthLabel {
  label: string;
  weekIndex: number;
}

export interface MonthlyTotal {
  key: string;
  label: string;
  count: number;
}

export interface ContributionMatrixResult {
  weeks: WeekColumn[];
  monthLabels: MonthLabel[];
  monthlyTotals: MonthlyTotal[];
  totalCount: number;
  activeDays: number;
  last30DaysCount: number;
  currentStreak: number;
  longestStreak: number;
  weeklyAverage: number;
}

export function buildContributionMatrix(
  contributions: GitHubContributionDay[]
): ContributionMatrixResult {
  if (contributions.length === 0) {
    return {
      weeks: [],
      monthLabels: [],
      monthlyTotals: [],
      totalCount: 0,
      activeDays: 0,
      last30DaysCount: 0,
      currentStreak: 0,
      longestStreak: 0,
      weeklyAverage: 0,
    };
  }

  const sorted = [...contributions].sort((a, b) => a.date.localeCompare(b.date));
  const firstDate = new Date(`${sorted[0].date}T00:00:00Z`);
  const leadingEmptyDays = firstDate.getUTCDay();

  const padded: (GitHubContributionDay | null)[] = [
    ...Array<null>(leadingEmptyDays).fill(null),
    ...sorted,
  ];

  const weeks: WeekColumn[] = [];
  for (let i = 0; i < padded.length; i += 7) {
    const slice = padded.slice(i, i + 7);
    while (slice.length < 7) slice.push(null);
    weeks.push({ days: slice });
  }

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthLabels: MonthLabel[] = [];
  const monthlyMap = new Map<string, MonthlyTotal>();

  let lastMonthSeen = '';
  weeks.forEach((week, weekIndex) => {
    const firstValidDay = week.days.find((d) => d !== null);
    if (firstValidDay) {
      const d = new Date(`${firstValidDay.date}T00:00:00Z`);
      const monthIdx = d.getUTCMonth();
      const yearMonth = firstValidDay.date.slice(0, 7);
      if (yearMonth !== lastMonthSeen) {
        const prev = monthLabels[monthLabels.length - 1];
        if (!prev || weekIndex - prev.weekIndex >= 2) {
          monthLabels.push({ label: monthNames[monthIdx], weekIndex });
        }
        lastMonthSeen = yearMonth;
      }
    }
  });

  let totalCount = 0;
  let activeDays = 0;
  let longestStreak = 0;
  let runningStreak = 0;

  for (const day of sorted) {
    totalCount += day.count;
    if (day.count > 0) {
      activeDays += 1;
      runningStreak += 1;
      if (runningStreak > longestStreak) {
        longestStreak = runningStreak;
      }
    } else {
      runningStreak = 0;
    }

    const key = day.date.slice(0, 7);
    const monthIdx = Number(day.date.slice(5, 7)) - 1;
    const existing = monthlyMap.get(key);
    if (existing) {
      existing.count += day.count;
    } else {
      monthlyMap.set(key, {
        key,
        label: monthNames[monthIdx] ?? key,
        count: day.count,
      });
    }
  }

  // Current streak allowing today to be 0 if no push yet today
  let currentStreak = 0;
  let idx = sorted.length - 1;
  if (idx >= 0 && sorted[idx].count === 0) {
    idx -= 1;
  }
  while (idx >= 0 && sorted[idx].count > 0) {
    currentStreak += 1;
    idx -= 1;
  }

  const last30DaysCount = sorted.slice(-30).reduce((sum, day) => sum + day.count, 0);
  const weeklyAverage = weeks.length > 0 ? Math.round((totalCount / weeks.length) * 10) / 10 : 0;
  const monthlyTotals = Array.from(monthlyMap.values()).slice(-12);

  return {
    weeks,
    monthLabels,
    monthlyTotals,
    totalCount,
    activeDays,
    last30DaysCount,
    currentStreak,
    longestStreak,
    weeklyAverage,
  };
}

export type RepoCategoryKey = 'all' | 'projects' | 'dsa' | 'ai-iot';

export type ClassifiedRepoBucket = Exclude<RepoCategoryKey, 'all'>;

const DSA_WORD_PATTERN =
  /(^|[^a-z])dsa([^a-z]|$)|learn[-_\s]?dsa|data[-_\s]?structures?|algorithms?|leetcode|hackerrank|codechef|codeforces|geeksforgeeks|\bgfg\b|competitive[-_\s]?programming|problem[-_\s]?solving|interview[-_\s]?prep|coding[-_\s]?practice/i;

const AI_IOT_PATTERN =
  /(^|[^a-z])(ai|ml|iot)([^a-z]|$)|aiml|machine[-_\s]?learning|deep[-_\s]?learning|computer[-_\s]?vision|opencv|tensorflow|pytorch|face[-_\s]?recognition|neural|arduino|embedded|sensor|esp32|esp8266|raspberry|hardware|biometric|voting[-_\s]?machine/i;

export function classifyGitHubRepo(repo: GitHubRepoItem): ClassifiedRepoBucket {
  const haystack = `${repo.name} ${repo.description ?? ''} ${repo.topics.join(' ')}`;

  if (
    DSA_WORD_PATTERN.test(haystack) ||
    /(?:^|[^A-Z])DSA(?:$|[^a-z])/.test(repo.name)
  ) {
    return 'dsa';
  }
  if (AI_IOT_PATTERN.test(haystack) || repo.language === 'Jupyter Notebook') {
    return 'ai-iot';
  }
  return 'projects';
}

export function formatShortDate(isoDate: string): string {
  try {
    const d = new Date(`${isoDate}T00:00:00Z`);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(d);
  } catch {
    return isoDate;
  }
}

export function formatRelativeMonthYear(isoTimestamp: string): string {
  if (!isoTimestamp) return '';
  try {
    const d = new Date(isoTimestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return '';
  }
}
