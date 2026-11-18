import type { MouseEvent, ReactNode } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SpotlightCard({ children, className = '', onClick }: SpotlightCardProps) {
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    event.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    event.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`spotlight-card rounded-xl border border-[#C3DCEF] dark:border-[#1E375C] bg-[#FFFFFF]/92 dark:bg-[#0F2038]/92 transition-colors duration-200 ${className}`}
    >
      {children}
    </div>
  );
}
