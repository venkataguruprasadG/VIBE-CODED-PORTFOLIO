import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Command, Copy, User } from 'lucide-react';
import { motion } from 'motion/react';
import {
  ENGINEERING_NOTES,
  ENGINEER_PROFILE,
  PROJECTS,
  type EngineeringNote,
  type Project,
  type ViewId,
} from '../data';
import { fadeUpItem, staggerContainer, staggerFastContainer } from '../lib/animations';
import { Magnetic } from './Magnetic';
import { ParallaxThumbnail } from './ParallaxThumbnail';
import { SpotlightCard } from './SpotlightCard';

interface OverviewViewProps {
  onNavigate: (view: ViewId) => void;
  onOpenProject: (project: Project) => void;
  onOpenNote: (note: EngineeringNote) => void;
  onOpenCommandPalette: () => void;
  onCopyEmail?: () => void;
}

const HERO_PILLARS = [
  {
    index: '1',
    headline: 'I engineer real-time vision & AI.',
    detail:
      'Built Multi-Face Recognition pipelines with OpenCV & TensorFlow during AI/ML internships at EduSkills & Edunet.',
  },
  {
    index: '2',
    headline: 'I bridge hardware & embedded software.',
    detail:
      'Architected an Arduino & Embedded C++ Biometric Voting terminal with fingerprint-locked ballot integrity.',
  },
  {
    index: '3',
    headline: 'Craft. Precision. Reliability.',
    detail:
      'B.Tech CSO (IoT) · 8.73 CGPA at ACE Engineering College, NPTEL Java & Pearson MePro Level 10 Expert.',
  },
];

export function OverviewView({
  onNavigate,
  onOpenProject,
  onOpenNote,
  onOpenCommandPalette,
  onCopyEmail,
}: OverviewViewProps) {
  const [portraitFailed, setPortraitFailed] = useState(false);
  const featuredProjects = PROJECTS.slice(0, 2);
  const latestNote = ENGINEERING_NOTES[0];
  const cfg = ENGINEER_PROFILE.configManifest;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-16 sm:space-y-20"
    >
      {/* High-End Editorial Portrait Showcase Hero */}
      <motion.section
        variants={fadeUpItem}
        className="relative overflow-hidden rounded-2xl border border-[#1E375C] bg-[#061124] text-[#EDF6FC] shadow-2xl"
      >
        {/* Atmospheric Glacier & Lemon Studio Lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_34%,rgba(59,142,224,0.22),transparent_52%),radial-gradient(circle_at_12%_18%,rgba(59,142,224,0.12),transparent_48%),radial-gradient(circle_at_14%_88%,rgba(239,234,43,0.07),transparent_42%)]"
        />

        {/* Subtle Architectural CAD Grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(rgba(102, 179, 245, 0.35) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Editorial Column: Monumental Name + Three Pillars + Magnetic CTAs */}
          <div className="relative z-10 lg:col-span-7 flex flex-col justify-between p-7 sm:p-10 lg:p-12">
            <div>
              {/* Editorial Lead-in & Display Name */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="font-serif italic text-lg sm:text-xl text-[#66B3F5]">
                  I am
                </span>
                <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#9BB8D9]">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B8EE0] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EFEA2B]" />
                  </span>
                  <span className="text-[#EFEA2B]">{ENGINEER_PROFILE.availability}</span>
                </div>
              </div>

              <h1 className="font-sans text-[clamp(2.35rem,4.9vw,4.15rem)] font-bold leading-[0.98] tracking-[-0.035em] text-[#EDF6FC] text-balance">
                Venkata Guru Prasad
              </h1>

              <p className="mt-2.5 sm:pl-16 font-serif italic text-lg sm:text-xl text-[#9BB8D9]">
                And here are three pillars of my engineering:
              </p>

              {/* Three Numbered High-Craft Engineering Statements */}
              <ol className="mt-8 sm:mt-10 space-y-6">
                {HERO_PILLARS.map((pillar) => (
                  <li key={pillar.index} className="group flex items-start gap-4 sm:gap-5">
                    <span className="mt-0.5 font-mono text-xs tabular-nums text-[#EFEA2B]/90 select-none shrink-0">
                      {pillar.index} /
                    </span>
                    <div>
                      <h2 className="text-base sm:text-[18px] font-semibold tracking-tight text-[#EDF6FC] group-hover:text-[#EFEA2B] transition-colors">
                        {pillar.headline}
                      </h2>
                      <p className="mt-1 text-xs sm:text-[13px] leading-relaxed text-[#9BB8D9]">
                        {pillar.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Magnetic Primary & Secondary CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.22} maxOffset={6}>
                <button
                  type="button"
                  onClick={() => onNavigate('work')}
                  className="inline-flex items-center gap-2 rounded-md border border-[#EFEA2B] bg-[#EFEA2B] px-5 py-2.5 text-sm font-semibold text-[#061124] hover:bg-[#66B3F5] hover:border-[#66B3F5] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFEA2B]"
                >
                  <span>Explore Selected Work</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </Magnetic>

              <Magnetic strength={0.2} maxOffset={5}>
                <button
                  type="button"
                  onClick={onOpenCommandPalette}
                  className="inline-flex items-center gap-2 rounded-md border border-[#1E375C] bg-[#0F2038]/90 px-4 py-2.5 text-sm font-medium text-[#EDF6FC] hover:border-[#66B3F5] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFEA2B]"
                >
                  <Command className="h-3.5 w-3.5 text-[#EFEA2B]" aria-hidden="true" />
                  <span>⌘K Menu</span>
                </button>
              </Magnetic>
            </div>
          </div>

          {/* Right Portrait Column: Seamless Low-Key Studio Integration */}
          <div className="relative lg:col-span-5 h-[420px] sm:h-[480px] lg:h-auto lg:min-h-full overflow-hidden bg-[#040B17]">
            {/* Soft Glacier Backlight Rim Behind Subject */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_58%_40%,rgba(59,142,224,0.24),transparent_62%)]"
            />

            {!portraitFailed ? (
              <img
                src={ENGINEER_PROFILE.profileImageUrl}
                alt="Portrait of Venkata Guru Prasad Gummadi, Computer Science and IoT Engineer"
                referrerPolicy="no-referrer"
                onError={() => setPortraitFailed(true)}
                className="h-full w-full lg:absolute lg:inset-0 object-cover object-[center_12%] mix-blend-lighten opacity-95 select-none"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-[#061124] p-8 text-center">
                <User className="h-12 w-12 text-[#66B3F5]" aria-hidden="true" />
                <span className="mt-3 font-serif text-xl text-[#EDF6FC]">
                  {ENGINEER_PROFILE.name}
                </span>
              </div>
            )}

            {/* Directional Edge Blends for Zero-Seam Integration */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#061124] via-[#061124]/25 to-transparent hidden lg:block"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061124] via-[#061124]/30 to-transparent"
            />

            {/* Crisp Editorial Role & Location Stamp (Bottom Right) */}
            <div className="pointer-events-none absolute bottom-5 right-6 left-6 flex flex-col items-end text-right">
              <div className="border border-[#1E375C] bg-[#061124]/85 backdrop-blur-xs rounded-md px-3 py-1 font-mono text-[11px] font-medium text-[#EFEA2B]">
                Computer Science &amp; IoT Engineer
              </div>
              <div className="mt-2 font-mono text-xs text-[#EDF6FC]/90">
                ACE Engineering College · CGPA 8.73
              </div>
              <div className="font-mono text-[11px] text-[#9BB8D9]">
                Based in {ENGINEER_PROFILE.location}
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Editorial Micro-Footer Strip */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#1E375C] bg-[#040B17]/90 px-7 sm:px-10 lg:px-12 py-3.5 font-mono text-[11px] text-[#9BB8D9]">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => (onCopyEmail ? onCopyEmail() : onNavigate('contact'))}
              className="inline-flex items-center gap-1.5 text-[#EDF6FC] hover:text-[#EFEA2B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFEA2B] rounded"
            >
              <Copy className="h-3 w-3 text-[#66B3F5]" aria-hidden="true" />
              <span>{ENGINEER_PROFILE.email}</span>
            </button>
            <span className="hidden sm:inline text-[#1E375C]" aria-hidden="true">
              /
            </span>
            <span className="tabular-nums">{ENGINEER_PROFILE.phone}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('experience')}
              className="hover:text-[#EFEA2B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFEA2B] rounded"
            >
              Credentials &amp; CV →
            </button>
          </div>
        </div>
      </motion.section>

      {/* Compact Bio + System Spec Manifest Companion Strip */}
      <motion.section
        variants={fadeUpItem}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        <SpotlightCard className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <p className="font-mono text-xs text-[#3B8EE0] dark:text-[#66B3F5]">
              00. Engineering Overview
            </p>
            <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
              Focused on intelligent vision &amp; reliable embedded systems.
            </h2>
            <p className="mt-3 text-sm sm:text-[15px] leading-[1.7] text-[#3A5173] dark:text-[#9BB8D9]">
              {ENGINEER_PROFILE.bio}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 divide-x divide-[#C3DCEF] dark:divide-[#1E375C] border-t border-[#C3DCEF] dark:border-[#1E375C] pt-4">
            <div className="pr-4">
              <div className="font-mono text-lg font-semibold tabular-nums text-[#091933] dark:text-[#EFEA2B]">
                8.73
              </div>
              <div className="font-mono text-[11px] text-[#3A5173] dark:text-[#9BB8D9]">
                B.Tech CGPA
              </div>
            </div>
            <div className="px-4">
              <div className="font-mono text-lg font-semibold tabular-nums text-[#3B8EE0] dark:text-[#66B3F5]">
                2
              </div>
              <div className="font-mono text-[11px] text-[#3A5173] dark:text-[#9BB8D9]">
                AI Internships
              </div>
            </div>
            <div className="pl-4">
              <div className="font-mono text-lg font-semibold tabular-nums text-[#091933] dark:text-[#EDF6FC]">
                5
              </div>
              <div className="font-mono text-[11px] text-[#3A5173] dark:text-[#9BB8D9]">
                Certifications
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* Compact Deep Navy engineer.config.json Card */}
        <div className="lg:col-span-5 flex">
          <div className="flex w-full flex-col justify-between overflow-hidden rounded-xl border border-[#091933] dark:border-[#1E375C] bg-[#091933] dark:bg-[#0F2038] text-[#EDF6FC] shadow-lg">
            <div className="flex items-center justify-between border-b border-[#1E375C] bg-[#061124] dark:bg-[#081426] px-5 py-3">
              <span className="font-mono text-xs font-medium text-[#EFEA2B]">
                engineer.config.json
              </span>
              <span className="font-mono text-[11px] text-[#9BB8D9]">{cfg.location}</span>
            </div>

            <div className="p-5 font-mono text-xs leading-relaxed text-[#EDF6FC] overflow-x-auto">
              <div className="text-[#9BB8D9]">{'{'}</div>
              <div className="pl-4 space-y-1">
                <div>
                  <span className="text-[#66B3F5]">&quot;degree&quot;</span>
                  <span className="text-[#9BB8D9]">: </span>
                  <span>&quot;{cfg.degree}&quot;,</span>
                </div>
                <div>
                  <span className="text-[#66B3F5]">&quot;core_stack&quot;</span>
                  <span className="text-[#9BB8D9]">: [</span>
                  <span className="text-[#EFEA2B]">
                    {cfg.core_stack.map((s) => `"${s}"`).join(', ')}
                  </span>
                  <span className="text-[#9BB8D9]">],</span>
                </div>
                <div>
                  <span className="text-[#66B3F5]">&quot;credentials&quot;</span>
                  <span className="text-[#9BB8D9]">: {'{'}</span>
                  <div className="pl-4">
                    <div>
                      <span className="text-[#9BB8D9]">&quot;mepro&quot;: </span>
                      <span>&quot;{cfg.credentials.english}&quot;,</span>
                    </div>
                    <div>
                      <span className="text-[#9BB8D9]">&quot;nptel&quot;: </span>
                      <span>&quot;{cfg.credentials.java}&quot;</span>
                    </div>
                  </div>
                  <span className="text-[#9BB8D9]">{'}'}</span>
                </div>
              </div>
              <div className="text-[#9BB8D9]">{'}'}</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Work Preview Row */}
      <motion.section
        variants={fadeUpItem}
        className="border-t border-[#C3DCEF] dark:border-[#1E375C] pt-12"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <p className="font-mono text-xs text-[#3B8EE0] dark:text-[#66B3F5]">
              01. Selected Systems
            </p>
            <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
              Featured Architecture Case Studies
            </h2>
          </div>
          <Magnetic strength={0.22} maxOffset={5}>
            <button
              type="button"
              onClick={() => onNavigate('work')}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#091933] dark:text-[#EDF6FC] hover:text-[#3B8EE0] dark:hover:text-[#F2EC38] transition-colors whitespace-nowrap shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0]"
            >
              <span>Explore Work &amp; Blueprints</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </Magnetic>
        </div>

        <motion.div
          variants={staggerFastContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {featuredProjects.map((project) => (
            <motion.div key={project.id} variants={fadeUpItem}>
              <SpotlightCard className="group h-full flex flex-col justify-between overflow-hidden">
                <div>
                  <ParallaxThumbnail
                    project={project}
                    onClick={() => onOpenProject(project)}
                    heightClass="h-44 sm:h-48"
                  />

                  <div className="p-6 pb-5">
                    <div className="flex items-center justify-between gap-2 font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9]">
                      <span>{project.role}</span>
                      <span className="text-[#3B8EE0] dark:text-[#F2EC38]">
                        Architecture Blueprint
                      </span>
                    </div>
                    <h3 className="mt-2.5 font-serif text-2xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
                      <button
                        type="button"
                        onClick={() => onOpenProject(project)}
                        className="text-left hover:text-[#3B8EE0] dark:hover:text-[#F2EC38] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0] rounded"
                      >
                        {project.title}
                      </button>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#3A5173] dark:text-[#9BB8D9]">
                      {project.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 flex items-center justify-between gap-4 border-t border-[#C3DCEF] dark:border-[#1E375C]">
                  <span className="font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9] truncate">
                    {project.stack.join(' · ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenProject(project)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#091933] dark:text-[#F2EC38] hover:text-[#3B8EE0] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0] rounded"
                  >
                    <span>Inspect Diagram</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Recent Engineering Note Preview */}
      <motion.section
        variants={fadeUpItem}
        className="border-t border-[#C3DCEF] dark:border-[#1E375C] pt-12"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="font-mono text-xs text-[#3B8EE0] dark:text-[#66B3F5]">
              02. Field Notes
            </p>
            <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
              Latest Engineering Note
            </h2>
          </div>
          <Magnetic strength={0.22} maxOffset={5}>
            <button
              type="button"
              onClick={() => onNavigate('notes')}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#091933] dark:text-[#EDF6FC] hover:text-[#3B8EE0] dark:hover:text-[#F2EC38] transition-colors whitespace-nowrap shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0]"
            >
              <span>Read all notes</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </Magnetic>
        </div>

        <SpotlightCard className="p-6 sm:p-7">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9]">
                <span className="text-[#3B8EE0] dark:text-[#66B3F5]">{latestNote.topic}</span>
                <span aria-hidden="true">·</span>
                <span>{latestNote.date}</span>
                <span aria-hidden="true">·</span>
                <span>{latestNote.readingTime}</span>
              </div>
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
                {latestNote.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3A5173] dark:text-[#9BB8D9]">
                {latestNote.excerpt}
              </p>
            </div>

            <Magnetic
              strength={0.22}
              maxOffset={6}
              className="inline-flex self-start md:self-center shrink-0"
            >
              <button
                type="button"
                onClick={() => onOpenNote(latestNote)}
                className="inline-flex items-center gap-2 rounded-md border border-[#091933] dark:border-[#F2EC38] bg-[#EFEA2B] dark:bg-[#F2EC38] px-4 py-2.5 text-xs font-semibold text-[#091933] hover:bg-[#091933] hover:text-[#EFEA2B] dark:hover:bg-[#66B3F5] dark:hover:border-[#66B3F5] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0]"
              >
                <span>Read Article</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </Magnetic>
          </div>
        </SpotlightCard>
      </motion.section>
    </motion.div>
  );
}
