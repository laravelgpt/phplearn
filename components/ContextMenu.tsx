import React, { useEffect, useRef } from 'react';
import { Icon } from './Icon';

type IconName = React.ComponentProps<typeof Icon>['icon'];

interface MenuItem {
    label: string;
    icon: IconName;
    onClick: () => void;
    className?: string;
}

interface ContextMenuProps {
    x: number;
    y: number;
    items: MenuItem[];
    onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            className="fixed w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-50 p-1"
            style={{ top: y, left: x }}
            onClick={(e) => e.stopPropagation()}
        >
            {items.map((item, index) => (
                <button
                    key={index}
                    onClick={() => {
                        item.onClick();
                        onClose();
                    }}
                    className={`w-full flex items-center space-x-2 px-2 py-1.5 text-sm text-left rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 ${item.className || 'text-slate-800 dark:text-slate-200'}`}
                >
                    <Icon icon={item.icon} className="h-4 w-4" />
                    <span>{item.label}</span>
                </button>
            ))}
        </div>
    );
};