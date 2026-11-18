import { useEffect } from 'react';
import { CheckCircle2, Layers, X } from 'lucide-react';
import type { ArchNode, Project } from '../data';

interface ArchitectureDrawerProps {
  project: Project | null;
  onClose: () => void;
}

const NODE_WIDTH = 132;
const NODE_HEIGHT = 54;

function getNodeCenter(node: ArchNode) {
  return {
    cx: node.x + NODE_WIDTH / 2,
    cy: node.y + NODE_HEIGHT / 2,
  };
}

export function ArchitectureDrawer({ project, onClose }: ArchitectureDrawerProps) {
  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [project, onClose]);

  if (!project) return null;

  const nodeMap = new Map(project.architecture.nodes.map((n) => [n.id, n]));

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#091933]/50 dark:bg-black/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} System Architecture`}
      onClick={onClose}
    >
      <div
        className="relative h-full w-full max-w-2xl overflow-y-auto border-l border-[#C3DCEF] dark:border-[#1E375C] bg-[#FFFFFF] dark:bg-[#081426] px-6 py-7 sm:px-9 sm:py-9 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-[#C3DCEF] dark:border-[#1E375C] pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#3A5173] dark:text-[#9BB8D9]">
              <span className="text-[#3B8EE0] dark:text-[#F2EC38]">{project.category}</span>
              <span aria-hidden="true">·</span>
              <span>{project.year}</span>
              <span aria-hidden="true">·</span>
              <span>{project.role}</span>
            </div>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[#091933] dark:text-[#EDF6FC]">
              {project.title}
            </h2>
            <p className="mt-1.5 text-sm text-[#3A5173] dark:text-[#9BB8D9]">{project.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close architecture drawer"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#C3DCEF] dark:border-[#1E375C] bg-[#EAF4FB] dark:bg-[#0F2038] text-[#091933] dark:text-[#EDF6FC] hover:border-[#3B8EE0] dark:hover:border-[#F2EC38] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B8EE0]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Inline SVG System Architecture Blueprint */}
        <section className="mt-7">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#3A5173] dark:text-[#9BB8D9]">
              <Layers className="h-3.5 w-3.5 text-[#3B8EE0] dark:text-[#F2EC38]" aria-hidden="true" />
              <span>System Architecture Diagram</span>
            </h3>
            <span className="font-mono text-[11px] text-[#3A5173] dark:text-[#9BB8D9]">
              Data Flow Blueprint
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#C3DCEF] dark:border-[#1E375C] bg-[#EAF4FB]/70 dark:bg-[#0F2038] p-4">
            <svg
              viewBox="0 0 745 250"
              className="w-full min-w-[540px] h-auto"
              role="img"
              aria-label={`Architecture flow diagram for ${project.title}`}
            >
              <defs>
                <marker
                  id={`arrow-${project.id}`}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" className="fill-[#3B8EE0] dark:fill-[#F2EC38]" />
                </marker>
                <pattern
                  id={`grid-${project.id}`}
                  width="24"
                  height="24"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="1"
                    cy="1"
                    r="0.8"
                    className="fill-[#091933]/15 dark:fill-[#66B3F5]/20"
                  />
                </pattern>
              </defs>

              <rect width="745" height="250" fill={`url(#grid-${project.id})`} rx="8" />

              {project.architecture.edges.map((edge) => {
                const fromNode = nodeMap.get(edge.from);
                const toNode = nodeMap.get(edge.to);
                if (!fromNode || !toNode) return null;

                const start = getNodeCenter(fromNode);
                const end = getNodeCenter(toNode);
                const dx = end.cx - start.cx;
                const dy = end.cy - start.cy;
                const len = Math.sqrt(dx * dx + dy * dy) || 1;
                const ux = dx / len;
                const uy = dy / len;

                const x1 = start.cx + ux * (NODE_WIDTH / 2 + 2);
                const y1 = start.cy + uy * (NODE_HEIGHT / 2 + 2);
                const x2 = end.cx - ux * (NODE_WIDTH / 2 + 6);
                const y2 = end.cy - uy * (NODE_HEIGHT / 2 + 6);

                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;

                return (
                  <g key={`${edge.from}-${edge.to}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      markerEnd={`url(#arrow-${project.id})`}
                      className="stroke-[#3B8EE0] dark:stroke-[#F2EC38]"
                    />
                    <rect
                      x={midX - 30}
                      y={midY - 9}
                      width="60"
                      height="17"
                      rx="4"
                      className="fill-[#FFFFFF] dark:fill-[#081426] stroke-[#C3DCEF] dark:stroke-[#1E375C]"
                      strokeWidth="0.75"
                    />
                    <text
                      x={midX}
                      y={midY + 3}
                      textAnchor="middle"
                      className="fill-[#091933] dark:fill-[#EDF6FC] font-mono text-[9.5px]"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {project.architecture.nodes.map((node) => {
                const isCore = node.kind === 'core' || node.kind === 'gateway';
                return (
                  <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                    <rect
                      width={NODE_WIDTH}
                      height={NODE_HEIGHT}
                      rx="8"
                      strokeWidth={isCore ? '1.5' : '1'}
                      className={
                        isCore
                          ? 'fill-[#091933] dark:fill-[#162B4A] stroke-[#3B8EE0] dark:stroke-[#F2EC38]'
                          : 'fill-[#FFFFFF] dark:fill-[#081426] stroke-[#C3DCEF] dark:stroke-[#1E375C]'
                      }
                    />
                    <text
                      x={NODE_WIDTH / 2}
                      y="23"
                      textAnchor="middle"
                      className={
                        isCore
                          ? 'fill-[#EFEA2B] font-sans text-[11.5px] font-semibold'
                          : 'fill-[#091933] dark:fill-[#EDF6FC] font-sans text-[11.5px] font-semibold'
                      }
                    >
                      {node.label}
                    </text>
                    <text
                      x={NODE_WIDTH / 2}
                      y="39"
                      textAnchor="middle"
                      className={
                        isCore
                          ? 'fill-[#EDF6FC]/85 font-mono text-[9px]'
                          : 'fill-[#3A5173] dark:fill-[#9BB8D9] font-mono text-[9px]'
                      }
                    >
                      {node.sublabel}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="mt-2.5 font-mono text-[11px] text-[#3A5173] dark:text-[#9BB8D9]">
              Figure — {project.architecture.caption}
            </p>
          </div>
        </section>

        {/* System Capabilities */}
        <section className="mt-8">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#3A5173] dark:text-[#9BB8D9] mb-3">
            System Capabilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {project.outcomes.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-[#C3DCEF] dark:border-[#1E375C] bg-[#EAF4FB]/55 dark:bg-[#0F2038] p-4"
              >
                <div className="font-serif text-2xl font-semibold tabular-nums text-[#091933] dark:text-[#F2EC38]">
                  {item.metric}
                </div>
                <div className="mt-1 text-xs leading-relaxed text-[#3A5173] dark:text-[#9BB8D9]">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Engineering Challenge */}
        <section className="mt-8">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#3A5173] dark:text-[#9BB8D9] mb-2">
            Engineering Challenge
          </h3>
          <p className="text-sm sm:text-[15px] leading-relaxed text-[#091933] dark:text-[#EDF6FC]">
            {project.challenge}
          </p>
        </section>

        {/* Key Architectural Decisions */}
        <section className="mt-8">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#3A5173] dark:text-[#9BB8D9] mb-3">
            Key Architectural Decisions
          </h3>
          <div className="space-y-4">
            {project.decisions.map((decision) => (
              <div
                key={decision.title}
                className="rounded-lg border border-[#C3DCEF] dark:border-[#1E375C] bg-[#EAF4FB]/45 dark:bg-[#0F2038]/80 p-4"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#3B8EE0] dark:text-[#F2EC38]"
                    aria-hidden="true"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-[#091933] dark:text-[#EDF6FC]">
                      {decision.title}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-[#3A5173] dark:text-[#9BB8D9]">
                      {decision.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack & Close */}
        <section className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#C3DCEF] dark:border-[#1E375C] pt-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#3A5173] dark:text-[#9BB8D9]">
              Tech Stack
            </div>
            <div className="mt-1.5 font-mono text-xs text-[#091933] dark:text-[#EDF6FC]">
              {project.stack.join(' · ')}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#091933] dark:border-[#F2EC38] bg-[#EFEA2B] dark:bg-[#F2EC38] px-4 py-2 text-xs font-semibold text-[#091933] hover:bg-[#091933] hover:text-[#EFEA2B] dark:hover:bg-[#66B3F5] dark:hover:border-[#66B3F5] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Close Blueprint</span>
          </button>
        </section>
      </div>
    </div>
  );
}
