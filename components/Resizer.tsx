import React from 'react';

interface ResizerProps {
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  orientation: 'horizontal' | 'vertical';
}

export const Resizer: React.FC<ResizerProps> = ({ onMouseDown, orientation }) => {
  const baseClasses = "flex-shrink-0 bg-slate-200 dark:bg-slate-700 transition-colors duration-200";
  const hoverClasses = "hover:bg-sky-500 dark:hover:bg-sky-600";
  const orientationClasses = orientation === 'vertical'
    ? "w-1.5 cursor-col-resize"
    : "h-1.5 cursor-row-resize";
  
  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${orientationClasses}`}
      onMouseDown={onMouseDown}
    />
  );
};