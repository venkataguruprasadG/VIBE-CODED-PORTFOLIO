import { Award, GraduationCap, Printer } from 'lucide-react';
import { motion } from 'motion/react';
import {
  CERTIFICATIONS,
  EDUCATION,
  ENGINEER_PROFILE,
  INTERNSHIPS,
  TOOLKIT_GROUPS,
} from '../data';
import { fadeUpItem, staggerContainer, staggerFastContainer } from '../lib/animations';
import { Magnetic } from './Magnetic';
import { SpotlightCard } from './SpotlightCard';

interface ExperienceViewProps {
  onPrintCV: () => void;
}

export function ExperienceView({ onPrintCV }: ExperienceViewProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-14"
    >
      {/* Print-Only Classic CV Letterhead */}
      <div className="hidden print-only border-b border-[#D4CFC7] pb-4 mb-6">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-serif text-3xl font-semibold text-[#111111]">
            {ENGINEER_PROFILE.name}
          </h1>
          <span className="font-mono text-xs text-[#444444]">
            {ENGINEER_PROFILE.phone} · {ENGINEER_PROFILE.email} · {ENGINEER_PROFILE.location}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-[#333333]">{ENGINEER_PROFILE.bio}</p>
      </div>

      {/* Screen Header + Print / Download CV Actions */}
      <motion.div
        variants={fadeUpItem}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C3DCEF] dark:border-[#1E375C] pb-7 no-print"
      >
        <div>
          <p className="font-mono text-xs text-[#3B8EE0] dark:text-[#66B3F5]">
            Background &amp; Credentials
          </p>
          <h1 className="mt-1.5 font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
            Experience, Education &amp; Skills
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#3A5173] dark:text-[#9BB8D9]">
            Virtual AI/ML internships, academic progression in Computer Science &amp; IoT, verified
            industry certifications, and technical toolkit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
          <Magnetic strength={0.22} maxOffset={6}>
            <button
              type="button"
              onClick={onPrintCV}
              className="inline-flex items-center gap-2 rounded-md border border-[#091933] dark:border-[#F2EC38] bg-[#EFEA2B] dark:bg-[#F2EC38] px-4 py-2.5 text-xs font-semibold text-[#091933] hover:bg-[#091933] hover:text-[#EFEA2B] dark:hover:bg-[#66B3F5] dark:hover:border-[#66B3F5] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0]"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Print / Save Classic CV</span>
            </button>
          </Magnetic>
        </div>
      </motion.div>

      {/* Internships Timeline */}
      <motion.section variants={fadeUpItem} aria-label="Internships" className="space-y-7">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
          Internships
        </h2>

        <motion.div
          variants={staggerFastContainer}
          className="relative space-y-6 before:absolute before:left-[7px] before:top-3 before:bottom-3 before:w-[1px] before:bg-[#C3DCEF] dark:before:bg-[#1E375C]"
        >
          {INTERNSHIPS.map((item, idx) => (
            <motion.div key={item.id} variants={fadeUpItem} className="relative pl-7">
              <span
                aria-hidden="true"
                className={`absolute left-[3px] top-6 h-[9px] w-[9px] rounded-full border ${
                  idx === 0
                    ? 'border-[#091933] bg-[#EFEA2B] dark:border-[#F2EC38] dark:bg-[#F2EC38]'
                    : 'border-[#3B8EE0] bg-[#EAF4FB] dark:border-[#66B3F5] dark:bg-[#081426]'
                }`}
              />

              <SpotlightCard className="p-6 sm:p-7 print-reset">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
                      {item.role}
                    </h3>
                    <div className="mt-1 font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9]">
                      <span className="text-[#3B8EE0] dark:text-[#66B3F5] font-medium">
                        {item.organization}
                      </span>
                      <span aria-hidden="true"> · </span>
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <div className="font-mono text-xs tabular-nums text-[#3A5173] dark:text-[#9BB8D9] shrink-0">
                    {item.period}
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-[#3A5173] dark:text-[#9BB8D9]">
                  {item.summary}
                </p>

                <ul className="mt-4 space-y-2 border-t border-[#C3DCEF] dark:border-[#1E375C] pt-4">
                  {item.highlights.map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-[#091933] dark:text-[#EDF6FC]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3B8EE0] dark:bg-[#F2EC38]"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-3 border-t border-[#C3DCEF]/60 dark:border-[#1E375C]/70 font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9]">
                  Focus: {item.stack.join(' · ')}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Education & Certifications */}
      <motion.section
        variants={fadeUpItem}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-[#C3DCEF] dark:border-[#1E375C] pt-12"
      >
        {/* Education */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-[#3B8EE0] dark:text-[#66B3F5]" aria-hidden="true" />
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
              Education
            </h2>
          </div>

          <motion.div variants={staggerFastContainer} className="space-y-4">
            {EDUCATION.map((edu) => (
              <motion.div key={edu.id} variants={fadeUpItem}>
                <SpotlightCard className="p-5 print-reset">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
                    <h3 className="font-serif text-xl font-semibold text-[#091933] dark:text-[#EDF6FC]">
                      {edu.institution}
                    </h3>
                    <span className="font-mono text-xs tabular-nums text-[#3A5173] dark:text-[#9BB8D9] shrink-0">
                      {edu.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#3A5173] dark:text-[#9BB8D9]">{edu.degree}</p>
                  <div className="mt-2 font-mono text-xs font-semibold tabular-nums text-[#3B8EE0] dark:text-[#F2EC38]">
                    {edu.score}
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Certifications + Languages */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[#3B8EE0] dark:text-[#66B3F5]" aria-hidden="true" />
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
              Certifications
            </h2>
          </div>

          <SpotlightCard className="p-5 print-reset divide-y divide-[#C3DCEF] dark:divide-[#1E375C]">
            {CERTIFICATIONS.map((cert) => (
              <div key={cert.id} className="py-3 first:pt-0 last:pb-0">
                <div className="text-sm font-medium text-[#091933] dark:text-[#EDF6FC]">
                  {cert.title}
                </div>
                <div className="mt-0.5 font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9]">
                  {cert.issuer}
                </div>
              </div>
            ))}
          </SpotlightCard>

          <SpotlightCard className="p-5 print-reset">
            <h3 className="font-serif text-lg font-semibold text-[#091933] dark:text-[#EDF6FC]">
              Languages &amp; Core Strengths
            </h3>
            <div className="mt-3 space-y-2 border-t border-[#C3DCEF] dark:border-[#1E375C] pt-3">
              <div className="font-mono text-xs text-[#091933] dark:text-[#EDF6FC]">
                {ENGINEER_PROFILE.languagesSpoken
                  .map((l) => `${l.language} (${l.proficiency})`)
                  .join(' · ')}
              </div>
              <div className="text-xs leading-relaxed text-[#3A5173] dark:text-[#9BB8D9]">
                {ENGINEER_PROFILE.softSkills.join(' · ')}
              </div>
            </div>
          </SpotlightCard>
        </div>
      </motion.section>

      {/* Grouped Technical Toolkit */}
      <motion.section
        variants={fadeUpItem}
        aria-label="Technical Toolkit"
        className="border-t border-[#C3DCEF] dark:border-[#1E375C] pt-12"
      >
        <div className="mb-7">
          <p className="font-mono text-xs text-[#3B8EE0] dark:text-[#66B3F5]">Technical Toolkit</p>
          <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
            Languages, Frameworks &amp; Tools
          </h2>
        </div>

        <motion.div
          variants={staggerFastContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {TOOLKIT_GROUPS.map((group) => (
            <motion.div key={group.category} variants={fadeUpItem} className="flex">
              <SpotlightCard className="w-full p-5 print-reset flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#091933] dark:text-[#EDF6FC]">
                    {group.category}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#3A5173] dark:text-[#9BB8D9]">
                    {group.description}
                  </p>
                </div>

                <ul className="mt-4 space-y-2 border-t border-[#C3DCEF] dark:border-[#1E375C] pt-3.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-xs text-[#091933] dark:text-[#EDF6FC]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
