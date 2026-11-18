import { useCallback, useRef, type MouseEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** Pull strength relative to cursor offset from element center (0.15 - 0.35 recommended) */
  strength?: number;
  /** Maximum pixel displacement along X/Y axes */
  maxOffset?: number;
}

const SPRING_CONFIG = {
  stiffness: 320,
  damping: 24,
  mass: 0.35,
};

export function Magnetic({
  children,
  className = 'inline-flex',
  strength = 0.22,
  maxOffset = 6,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !ref.current) return;
      if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const offsetX = event.clientX - (rect.left + rect.width / 2);
      const offsetY = event.clientY - (rect.top + rect.height / 2);

      const clampedX = Math.max(-maxOffset, Math.min(maxOffset, offsetX * strength));
      const clampedY = Math.max(-maxOffset, Math.min(maxOffset, offsetY * strength));

      rawX.set(clampedX);
      rawY.set(clampedY);
    },
    [prefersReducedMotion, maxOffset, strength, rawX, rawY]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`${className} will-change-transform`}
    >
      {children}
    </motion.div>
  );
}
