import { useMemo, useState } from 'react';
import { ArrowUpRight, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { PROJECTS, type Project, type ProjectCategory } from '../data';
import { fadeUpItem, staggerContainer, staggerFastContainer } from '../lib/animations';
import { GitHubActivity } from './GitHubActivity';
import { Magnetic } from './Magnetic';
import { ParallaxThumbnail } from './ParallaxThumbnail';
import { SpotlightCard } from './SpotlightCard';

interface WorkViewProps {
  onOpenProject: (project: Project) => void;
}

const CATEGORIES: ProjectCategory[] = ['All', 'AI & Vision', 'IoT & Embedded'];

export function WorkView({ onOpenProject }: WorkViewProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return PROJECTS;
    return PROJECTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Header + Filter Controls */}
      <motion.div
        variants={fadeUpItem}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C3DCEF] dark:border-[#1E375C] pb-7"
      >
        <div>
          <p className="font-mono text-xs text-[#3B8EE0] dark:text-[#66B3F5]">Selected Projects</p>
          <h1 className="mt-1.5 font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
            Engineering Work
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#3A5173] dark:text-[#9BB8D9]">
            Applied Computer Vision and IoT hardware-software projects engineered during my B.Tech
            in Computer Science &amp; Engineering (IoT). Select any project to inspect its system
            architecture diagram.
          </p>
        </div>

        {/* Functional Category Filter Bar */}
        <div
          role="tablist"
          aria-label="Filter projects by discipline"
          className="inline-flex items-center gap-1 rounded-lg border border-[#C3DCEF] dark:border-[#1E375C] bg-[#D9ECF8] dark:bg-[#0F2038] p-1 self-start md:self-auto"
        >
          {CATEGORIES.map((category) => {
            const isSelected = activeCategory === category;
            return (
              <Magnetic key={category} strength={0.22} maxOffset={4}>
                <button
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0] ${
                    isSelected
                      ? 'bg-[#091933] dark:bg-[#F2EC38] text-[#EFEA2B] dark:text-[#081426] shadow-xs'
                      : 'text-[#3A5173] dark:text-[#9BB8D9] hover:text-[#091933] dark:hover:text-[#EDF6FC]'
                  }`}
                >
                  {category}
                </button>
              </Magnetic>
            );
          })}
        </div>
      </motion.div>

      {/* Filterable Architectural Grid with Scroll Parallax Thumbnails */}
      <motion.div
        variants={staggerFastContainer}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {filteredProjects.map((project) => (
          <motion.div key={project.id} variants={fadeUpItem}>
            <SpotlightCard className="group h-full flex flex-col justify-between overflow-hidden">
              <div>
                <ParallaxThumbnail
                  project={project}
                  onClick={() => onOpenProject(project)}
                  heightClass="h-52 sm:h-56"
                />

                <div className="p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-3 font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9]">
                    <span className="text-[#3B8EE0] dark:text-[#66B3F5]">{project.role}</span>
                    <span className="tabular-nums">{project.primaryMetric}</span>
                  </div>

                  <h2 className="mt-2.5 font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
                    <button
                      type="button"
                      onClick={() => onOpenProject(project)}
                      className="text-left hover:text-[#3B8EE0] dark:hover:text-[#F2EC38] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0] rounded"
                    >
                      {project.title}
                    </button>
                  </h2>
                  <p className="mt-1 text-sm font-medium text-[#091933]/80 dark:text-[#EDF6FC]/85">
                    {project.subtitle}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-[#3A5173] dark:text-[#9BB8D9]">
                    {project.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-4 border-t border-[#C3DCEF] dark:border-[#1E375C] flex items-center justify-between gap-4">
                <span className="font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9] truncate">
                  {project.stack.join(' · ')}
                </span>

                <Magnetic strength={0.22} maxOffset={5} className="inline-flex shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenProject(project)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#091933] dark:border-[#F2EC38] bg-[#EFEA2B] dark:bg-[#F2EC38] px-3 py-1.5 text-xs font-semibold text-[#091933] hover:bg-[#091933] hover:text-[#EFEA2B] dark:hover:bg-[#66B3F5] dark:hover:border-[#66B3F5] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0]"
                  >
                    <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Architecture</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </Magnetic>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Currently Building & Live GitHub Repositories */}
      <motion.section
        variants={fadeUpItem}
        className="border-t border-[#C3DCEF] dark:border-[#1E375C] pt-12"
      >
        <GitHubActivity variant="work" />
      </motion.section>
    </motion.div>
  );
}
