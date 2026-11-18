import { useRef } from 'react';
import { Layers } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import type { ArchNode, Project } from '../data';

interface ParallaxThumbnailProps {
  project: Project;
  onClick?: () => void;
  heightClass?: string;
}

const NODE_WIDTH = 132;
const NODE_HEIGHT = 54;

function getNodeCenter(node: ArchNode) {
  return {
    cx: node.x + NODE_WIDTH / 2,
    cy: node.y + NODE_HEIGHT / 2,
  };
}

export function ParallaxThumbnail({
  project,
  onClick,
  heightClass = 'h-48 sm:h-52',
}: ParallaxThumbnailProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Subtle multi-plane compositor-only parallax across CAD grid & schematic nodes
  const yGrid = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const yDiagram = useTransform(scrollYProgress, [0, 1], [-14, 14]);

  const nodeMap = new Map(project.architecture.nodes.map((n) => [n.id, n]));

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${heightClass} overflow-hidden border-b border-[#C3DCEF] dark:border-[#1E375C] bg-[#091933]`}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={`Inspect ${project.title} architecture blueprint`}
        className="group relative block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#EFEA2B]"
      >
        {/* Ambient Glacier Radial Depth Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(59,142,224,0.28),transparent_58%),radial-gradient(circle_at_18%_82%,rgba(239,234,43,0.1),transparent_52%)]"
        />

        {/* Parallax Plane 1: Architectural CAD Grid */}
        <motion.div
          aria-hidden="true"
          style={{ y: prefersReducedMotion ? 0 : yGrid }}
          className="pointer-events-none absolute -inset-6 opacity-45 will-change-transform"
        >
          <svg className="h-full w-full">
            <defs>
              <pattern
                id={`thumb-cad-${project.id}`}
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 24 0 L 0 0 0 24"
                  fill="none"
                  stroke="#3B8EE0"
                  strokeOpacity="0.24"
                  strokeWidth="0.6"
                />
                <circle cx="0" cy="0" r="1" fill="#66B3F5" fillOpacity="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#thumb-cad-${project.id})`} />
          </svg>
        </motion.div>

        {/* Parallax Plane 2: Vector System Architecture Schematic */}
        <motion.div
          style={{ y: prefersReducedMotion ? 0 : yDiagram }}
          className="relative flex h-full w-full items-center justify-center px-5 pb-7 pt-5 will-change-transform"
        >
          <svg
            viewBox="0 0 745 250"
            className="h-full w-full max-w-[540px] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            role="img"
            aria-label={`Vector architecture schematic for ${project.title}`}
          >
            <defs>
              <marker
                id={`thumb-arrow-${project.id}`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#EFEA2B" />
              </marker>
            </defs>

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

              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#66B3F5"
                  strokeOpacity="0.85"
                  strokeWidth="1.6"
                  strokeDasharray="4 3"
                  markerEnd={`url(#thumb-arrow-${project.id})`}
                />
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
                    fill={isCore ? '#102749' : '#061124'}
                    stroke={isCore ? '#EFEA2B' : '#3B8EE0'}
                    strokeOpacity={isCore ? '0.95' : '0.65'}
                    strokeWidth={isCore ? '1.6' : '1.1'}
                  />
                  <text
                    x={NODE_WIDTH / 2}
                    y="24"
                    textAnchor="middle"
                    fill={isCore ? '#EFEA2B' : '#EDF6FC'}
                    className="font-sans text-[11px] font-semibold"
                  >
                    {node.label}
                  </text>
                  <text
                    x={NODE_WIDTH / 2}
                    y="40"
                    textAnchor="middle"
                    fill="#9BB8D9"
                    className="font-mono text-[9px]"
                  >
                    {node.sublabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* Bottom Scrim & Authentic Blueprint Metadata Bar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#061124]/95 via-[#061124]/60 to-transparent"
        />

        <div className="pointer-events-none absolute top-3 right-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#9BB8D9]/80">
          <Layers className="h-3 w-3 text-[#66B3F5]" aria-hidden="true" />
          <span>Schematic</span>
        </div>

        <div className="pointer-events-none absolute bottom-3 left-5 right-5 flex items-center justify-between font-mono text-[11px] text-[#EDF6FC]">
          <span className="text-[#EFEA2B]">{project.category}</span>
          <span className="tabular-nums text-[#EDF6FC]/90">{project.year}</span>
        </div>
      </button>
    </div>
  );
}
