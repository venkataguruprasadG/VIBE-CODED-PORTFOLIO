import { ArrowUpRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { ENGINEERING_NOTES, type EngineeringNote } from '../data';
import { fadeUpItem, staggerContainer, staggerFastContainer } from '../lib/animations';
import { Magnetic } from './Magnetic';
import { SpotlightCard } from './SpotlightCard';

interface NotesViewProps {
  onOpenNote: (note: EngineeringNote) => void;
}

export function NotesView({ onOpenNote }: NotesViewProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <motion.div
        variants={fadeUpItem}
        className="border-b border-[#C3DCEF] dark:border-[#1E375C] pb-7"
      >
        <p className="font-mono text-xs text-[#3B8EE0] dark:text-[#66B3F5]">Technical Writing</p>
        <h1 className="mt-1.5 font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
          Engineering Notes
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#3A5173] dark:text-[#9BB8D9]">
          Technical notes covering multi-face Computer Vision pipelines, Arduino Embedded C++
          biometric state machines, and Java/MySQL fundamentals.
        </p>
      </motion.div>

      <motion.div variants={staggerFastContainer} className="space-y-5">
        {ENGINEERING_NOTES.map((note) => (
          <motion.article key={note.id} variants={fadeUpItem}>
            <SpotlightCard className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9]">
                    <span className="text-[#3B8EE0] dark:text-[#66B3F5]">{note.topic}</span>
                    <span aria-hidden="true">·</span>
                    <span>{note.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{note.readingTime}</span>
                  </div>

                  <h2 className="mt-2.5 font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
                    <button
                      type="button"
                      onClick={() => onOpenNote(note)}
                      className="text-left hover:text-[#3B8EE0] dark:hover:text-[#F2EC38] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0] rounded"
                    >
                      {note.title}
                    </button>
                  </h2>

                  <p className="mt-2.5 text-sm sm:text-[15px] leading-relaxed text-[#3A5173] dark:text-[#9BB8D9]">
                    {note.excerpt}
                  </p>
                </div>

                <Magnetic strength={0.22} maxOffset={5} className="inline-flex self-start shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenNote(note)}
                    className="inline-flex items-center gap-2 rounded-md border border-[#091933] dark:border-[#F2EC38] bg-[#EFEA2B] dark:bg-[#F2EC38] px-4 py-2 text-xs font-semibold text-[#091933] hover:bg-[#091933] hover:text-[#EFEA2B] dark:hover:bg-[#66B3F5] dark:hover:border-[#66B3F5] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0]"
                  >
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Read Note</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </Magnetic>
              </div>
            </SpotlightCard>
          </motion.article>
        ))}
      </motion.div>
    </motion.div>
  );
}
