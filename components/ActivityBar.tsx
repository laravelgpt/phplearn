import React from 'react';
import { Icon } from './Icon';

export type ActiveLeftPanelId = 'workspace' | 'learning' | 'notes';

interface ActivityBarProps {
    activePanel: ActiveLeftPanelId | null;
    onPanelChange: (panel: ActiveLeftPanelId) => void;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({ activePanel, onPanelChange }) => {
    const panels: { id: ActiveLeftPanelId, icon: React.ComponentProps<typeof Icon>['icon'], label: string }[] = [
        { id: 'workspace', icon: 'folder', label: 'Workspace Explorer' },
        { id: 'learning', icon: 'book-open', label: 'PHP Topics' },
        { id: 'notes', icon: 'file-text', label: 'Notes' },
    ];
    
    return (
        <div className="flex flex-col items-center bg-slate-100 dark:bg-slate-800 p-2 gap-4 border-r border-slate-200 dark:border-slate-700">
            {panels.map(panel => (
                 <button
                    key={panel.id}
                    title={panel.label}
                    onClick={() => onPanelChange(panel.id)}
                    className={`p-2 rounded-md transition-colors ${
                        activePanel === panel.id 
                            ? 'bg-sky-500/20 text-sky-600 dark:bg-sky-500/30 dark:text-sky-400'
                            : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-400'
                    }`}
                >
                    <Icon icon={panel.icon} className="h-6 w-6" />
                </button>
            ))}
        </div>
    );
};