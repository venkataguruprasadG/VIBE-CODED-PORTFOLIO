import { useCallback, useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { ArchitectureDrawer } from './components/ArchitectureDrawer';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { CommandPalette } from './components/CommandPalette';
import { ContactView } from './components/ContactView';
import { ExperienceView } from './components/ExperienceView';
import { Navbar } from './components/Navbar';
import { NoteReaderModal } from './components/NoteReaderModal';
import { NotesView } from './components/NotesView';
import { OverviewView } from './components/OverviewView';
import { WorkView } from './components/WorkView';
import {
  ENGINEER_PROFILE,
  type EngineeringNote,
  type Project,
  type ViewId,
} from './data';

const THEME_STORAGE_KEY = 'vg_portfolio_theme';

export default function App() {
  const [activeView, setActiveView] = useState<ViewId>('overview');
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) === 'dark';
    } catch {
      return false;
    }
  });
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedNote, setSelectedNote] = useState<EngineeringNote | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage failures
    }
  }, [isDark]);

  useEffect(() => {
    const handleGlobalKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(ENGINEER_PROFILE.email);
      showToast(`Copied ${ENGINEER_PROFILE.email}`);
    } catch {
      showToast(`Email: ${ENGINEER_PROFILE.email}`);
    }
  }, [showToast]);

  const handlePrintCV = useCallback(() => {
    if (activeView !== 'experience') {
      setActiveView('experience');
      window.setTimeout(() => window.print(), 220);
    } else {
      window.print();
    }
  }, [activeView]);

  const handleOpenProject = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleOpenNote = useCallback((note: EngineeringNote) => {
    setSelectedNote(note);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen flex flex-col bg-[#EAF4FB] dark:bg-[#081426] text-[#091933] dark:text-[#EDF6FC] transition-colors duration-200">
        <BackgroundCanvas isDark={isDark} />

        <Navbar
          activeView={activeView}
          onSelectView={setActiveView}
          onOpenCommandPalette={() => setIsPaletteOpen(true)}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
        />

        <main className="relative z-10 flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
            {activeView === 'overview' && (
              <OverviewView
                onNavigate={setActiveView}
                onOpenProject={handleOpenProject}
                onOpenNote={handleOpenNote}
                onOpenCommandPalette={() => setIsPaletteOpen(true)}
                onCopyEmail={handleCopyEmail}
              />
            )}
            {activeView === 'work' && <WorkView onOpenProject={handleOpenProject} />}
            {activeView === 'experience' && <ExperienceView onPrintCV={handlePrintCV} />}
            {activeView === 'notes' && <NotesView onOpenNote={handleOpenNote} />}
            {activeView === 'contact' && (
              <ContactView onCopyEmail={handleCopyEmail} onNotify={showToast} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="relative z-10 border-t border-[#C3DCEF] dark:border-[#1E375C] bg-[#EAF4FB]/75 dark:bg-[#081426]/75 backdrop-blur-xs no-print">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-6 text-xs text-[#3A5173] dark:text-[#9BB8D9]">
          <div className="font-mono">
            © {new Date().getFullYear()} {ENGINEER_PROFILE.name} · {ENGINEER_PROFILE.location}
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <span className="font-mono tabular-nums">{ENGINEER_PROFILE.phone}</span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="hover:text-[#091933] dark:hover:text-[#F2EC38] transition-colors"
            >
              {ENGINEER_PROFILE.email}
            </button>
          </div>
        </div>
      </footer>

      {/* Global Overlays */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onNavigate={setActiveView}
        onOpenProject={handleOpenProject}
        onOpenNote={handleOpenNote}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onCopyEmail={handleCopyEmail}
        onPrintCV={handlePrintCV}
      />

      <ArchitectureDrawer
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <NoteReaderModal
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-[#1E375C] bg-[#091933] dark:bg-[#F2EC38] px-4 py-2.5 text-xs font-medium text-[#EDF6FC] dark:text-[#081426] shadow-lg no-print"
          >
            <Check className="h-3.5 w-3.5 text-[#EFEA2B] dark:text-[#081426]" aria-hidden="true" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
