import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

interface DropdownProps {
  label: React.ReactNode;
  children: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pass setIsOpen to children so they can close the dropdown on click
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { setIsOpen } as any);
    }
    return child;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggle}
        className="px-2 py-1 text-sm rounded hover:bg-slate-200 dark:hover:bg-slate-700"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {label}
      </button>
      <div 
        className={`absolute left-0 mt-2 w-64 origin-top-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-50 
                   transition-all ease-out duration-100
                   ${isOpen ? 'transform opacity-100 scale-100' : 'transform opacity-0 scale-95 pointer-events-none'}`}
      >
        <div className="py-1" role="menu" aria-orientation="vertical">
          {childrenWithProps}
        </div>
      </div>
    </div>
  );
};

interface DropdownItemProps {
    onClick?: () => void;
    children: React.ReactNode;
    shortcut?: string;
    setIsOpen?: (isOpen: boolean) => void;
    icon?: React.ComponentProps<typeof Icon>['icon'];
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ onClick, children, shortcut, setIsOpen, icon }) => {
  const handleClick = () => {
    if (onClick) onClick();
    if (setIsOpen) setIsOpen(false);
  };
  
  return (
    <button
      onClick={handleClick}
      className="flex justify-between items-center w-full px-3 py-1.5 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-left"
      role="menuitem"
    >
      <div className="flex items-center gap-3">
        {icon ? 
          <Icon icon={icon} className="h-4 w-4 text-slate-500 dark:text-slate-400" /> : 
          <span className="w-4 h-4"></span>
        }
        <span>{children}</span>
      </div>
      {shortcut && <span className="text-xs text-slate-500 dark:text-slate-400">{shortcut}</span>}
    </button>
  );
}

export const DropdownSeparator: React.FC = () => {
    return <hr className="border-slate-200 dark:border-slate-700 my-1 mx-2" />;
}