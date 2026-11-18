import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Copy,
  Layers,
  Mail,
  Moon,
  Search,
  Sun,
  Terminal,
  X,
} from 'lucide-react';
import {
  ENGINEERING_NOTES,
  ENGINEER_PROFILE,
  PROJECTS,
  type EngineeringNote,
  type Project,
  type ViewId,
} from '../data';

interface CommandItem {
  id: string;
  group: 'Navigation' | 'Projects' | 'Notes' | 'Actions';
  label: string;
  hint: string;
  keywords: string;
  icon: 'nav' | 'project' | 'note' | 'theme' | 'copy';
  run: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewId) => void;
  onOpenProject: (project: Project) => void;
  onOpenNote: (note: EngineeringNote) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onCopyEmail: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onOpenProject,
  onOpenNote,
  isDark,
  onToggleTheme,
  onCopyEmail,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const items = useMemo<CommandItem[]>(() => {
    const navItems: CommandItem[] = [
      {
        id: 'nav-overview',
        group: 'Navigation',
        label: 'Go to Overview',
        hint: 'Home & Config Manifest',
        keywords: 'overview home hero config',
        icon: 'nav',
        run: () => onNavigate('overview'),
      },
      {
        id: 'nav-work',
        group: 'Navigation',
        label: 'Go to Selected Work',
        hint: '2 Systems & Architecture Blueprints',
        keywords: 'work projects architecture systems',
        icon: 'nav',
        run: () => onNavigate('work'),
      },
      {
        id: 'nav-experience',
        group: 'Navigation',
        label: 'Go to Experience, Education & Skills',
        hint: 'Internships, B.Tech, Certs & Toolkit',
        keywords: 'experience resume cv internships education certifications skills',
        icon: 'nav',
        run: () => onNavigate('experience'),
      },
      {
        id: 'nav-notes',
        group: 'Navigation',
        label: 'Go to Engineering Notes',
        hint: 'Technical Articles',
        keywords: 'notes blog articles writing',
        icon: 'nav',
        run: () => onNavigate('notes'),
      },
      {
        id: 'nav-contact',
        group: 'Navigation',
        label: 'Go to Contact',
        hint: 'Email, Phone & Inquiry Form',
        keywords: 'contact email phone hire message',
        icon: 'nav',
        run: () => onNavigate('contact'),
      },
    ];

    const projectItems: CommandItem[] = PROJECTS.map((project) => ({
      id: `proj-${project.id}`,
      group: 'Projects',
      label: project.title,
      hint: `${project.category} · ${project.stack.slice(0, 3).join(', ')}`,
      keywords: `${project.title} ${project.subtitle} ${project.stack.join(' ')} ${project.category}`,
      icon: 'project',
      run: () => onOpenProject(project),
    }));

    const noteItems: CommandItem[] = ENGINEERING_NOTES.map((note) => ({
      id: `note-${note.id}`,
      group: 'Notes',
      label: note.title,
      hint: `${note.topic} · ${note.readingTime}`,
      keywords: `${note.title} ${note.topic} ${note.excerpt}`,
      icon: 'note',
      run: () => onOpenNote(note),
    }));

    const actionItems: CommandItem[] = [
      {
        id: 'act-theme',
        group: 'Actions',
        label: isDark ? 'Switch to Glacier Light Theme' : 'Switch to Deep Navy Dark Theme',
        hint: 'Toggle Appearance',
        keywords: 'theme dark light glacier navy lemon mode',
        icon: 'theme',
        run: onToggleTheme,
      },
      {
        id: 'act-copy-email',
        group: 'Actions',
        label: 'Copy Email Address',
        hint: ENGINEER_PROFILE.email,
        keywords: 'copy email address mail contact',
        icon: 'copy',
        run: onCopyEmail,
      },
    ];

    return [...navItems, ...projectItems, ...noteItems, ...actionItems];
  }, [isDark, onCopyEmail, onNavigate, onOpenNote, onOpenProject, onToggleTheme]);

  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(trimmed) ||
        item.hint.toLowerCase().includes(trimmed) ||
        item.keywords.toLowerCase().includes(trimmed) ||
        item.group.toLowerCase().includes(trimmed)
    );
  }, [items, query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (filteredItems.length === 0) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const chosen = filteredItems[selectedIndex];
        if (chosen) {
          chosen.run();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredItems, isOpen, onClose, selectedIndex]);

  if (!isOpen) return null;

  const renderIcon = (icon: CommandItem['icon']) => {
    switch (icon) {
      case 'project':
        return <Layers className="h-4 w-4 shrink-0" aria-hidden="true" />;
      case 'note':
        return <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />;
      case 'theme':
        return isDark ? (
          <Sun className="h-4 w-4 shrink-0" aria-hidden="true" />
        ) : (
          <Moon className="h-4 w-4 shrink-0" aria-hidden="true" />
        );
      case 'copy':
        return <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />;
      default:
        return <Terminal className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-[#091933]/50 dark:bg-black/70 backdrop-blur-xs pt-[12vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Global Command Palette"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-[#C3DCEF] dark:border-[#1E375C] bg-[#FFFFFF] dark:bg-[#0F2038] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[#C3DCEF] dark:border-[#1E375C] px-4 py-3.5">
          <Search className="h-4 w-4 text-[#3B8EE0] dark:text-[#66B3F5] shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to view, architecture blueprint, note, or action..."
            aria-label="Search commands"
            className="w-full bg-transparent text-sm text-[#091933] dark:text-[#EDF6FC] placeholder:text-[#3A5173]/70 dark:placeholder:text-[#9BB8D9]/70 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command palette"
            className="rounded p-1 text-[#3A5173] dark:text-[#9BB8D9] hover:text-[#091933] dark:hover:text-[#EDF6FC] transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[54vh] overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Mail className="mx-auto mb-2 h-5 w-5 text-[#3A5173] dark:text-[#9BB8D9] opacity-60" aria-hidden="true" />
              <p className="text-sm text-[#3A5173] dark:text-[#9BB8D9]">
                No matching command for “{query}”.
              </p>
            </div>
          ) : (
            <ul role="listbox" className="space-y-0.5">
              {filteredItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <li key={item.id} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => {
                        item.run();
                        onClose();
                      }}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        isSelected
                          ? 'bg-[#D9ECF8] dark:bg-[#162B4A] text-[#091933] dark:text-[#EDF6FC]'
                          : 'text-[#3A5173] dark:text-[#9BB8D9] hover:bg-[#D9ECF8]/60 dark:hover:bg-[#162B4A]/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={
                            isSelected
                              ? 'text-[#3B8EE0] dark:text-[#F2EC38]'
                              : 'text-[#3A5173] dark:text-[#9BB8D9]'
                          }
                        >
                          {renderIcon(item.icon)}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-[#091933] dark:text-[#EDF6FC]">
                            {item.label}
                          </div>
                          <div className="truncate font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9]">
                            {item.group} · {item.hint}
                          </div>
                        </div>
                      </div>
                      <ArrowRight
                        className={`h-3.5 w-3.5 shrink-0 transition-opacity ${
                          isSelected
                            ? 'opacity-100 text-[#091933] dark:text-[#F2EC38]'
                            : 'opacity-0'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#C3DCEF] dark:border-[#1E375C] bg-[#EAF4FB]/70 dark:bg-[#081426]/80 px-4 py-2 font-mono text-[11px] text-[#3A5173] dark:text-[#9BB8D9]">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span>{filteredItems.length} commands</span>
        </div>
      </div>
    </div>
  );
}
