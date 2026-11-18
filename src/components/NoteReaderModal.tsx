import { useEffect, useState } from 'react';
import { Check, Copy, X } from 'lucide-react';
import type { EngineeringNote } from '../data';

interface NoteReaderModalProps {
  note: EngineeringNote | null;
  onClose: () => void;
}

export function NoteReaderModal({ note, onClose }: NoteReaderModalProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!note) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [note, onClose]);

  if (!note) return null;

  const handleCopyCode = async (code: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIdx(idx);
      window.setTimeout(() => setCopiedIdx(null), 1800);
    } catch {
      // Clipboard fallback ignored if blocked
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#091933]/50 dark:bg-black/70 backdrop-blur-xs p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={note.title}
      onClick={onClose}
    >
      <article
        className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-[#C3DCEF] dark:border-[#1E375C] bg-[#FFFFFF] dark:bg-[#081426] px-6 py-7 sm:px-10 sm:py-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#C3DCEF] dark:border-[#1E375C] pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9]">
              <span className="text-[#3B8EE0] dark:text-[#F2EC38]">{note.topic}</span>
              <span aria-hidden="true">·</span>
              <span>{note.date}</span>
              <span aria-hidden="true">·</span>
              <span>{note.readingTime}</span>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC] text-balance">
              {note.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close article reader"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#C3DCEF] dark:border-[#1E375C] bg-[#EAF4FB] dark:bg-[#0F2038] text-[#091933] dark:text-[#EDF6FC] hover:border-[#3B8EE0] dark:hover:border-[#F2EC38] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-7 space-y-5">
          {note.sections.map((section, idx) => {
            if (section.type === 'subheading') {
              return (
                <h3
                  key={idx}
                  className="pt-3 font-serif text-2xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]"
                >
                  {section.content}
                </h3>
              );
            }

            if (section.type === 'code') {
              const isCopied = copiedIdx === idx;
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-lg border border-[#1E375C] bg-[#091933] text-[#EDF6FC]"
                >
                  <div className="flex items-center justify-between border-b border-[#1E375C] bg-[#061124] px-4 py-2 font-mono text-xs text-[#9BB8D9]">
                    <span>
                      {section.filename || 'snippet'} · {section.language || 'text'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(section.content, idx)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#EDF6FC]/85 hover:text-[#EFEA2B] transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#EFEA2B]" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-xs sm:text-[13px] leading-relaxed text-[#EDF6FC]">
                    <code>{section.content}</code>
                  </pre>
                </div>
              );
            }

            return (
              <p
                key={idx}
                className="text-[15px] sm:text-base leading-[1.72] text-[#091933]/90 dark:text-[#EDF6FC]/90"
              >
                {section.content}
              </p>
            );
          })}
        </div>
      </article>
    </div>
  );
}
