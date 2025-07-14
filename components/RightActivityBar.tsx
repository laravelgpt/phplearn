import React from 'react';
import { Icon } from './Icon';

export type ActiveRightPanelId = 'webview' | 'agent';

interface RightActivityBarProps {
    activePanel: ActiveRightPanelId | null;
    onPanelChange: (panel: ActiveRightPanelId) => void;
}

export const RightActivityBar: React.FC<RightActivityBarProps> = ({ activePanel, onPanelChange }) => {
    const panels: { id: ActiveRightPanelId, icon: React.ComponentProps<typeof Icon>['icon'], label: string }[] = [
        { id: 'webview', icon: 'webview', label: 'Web View' },
        { id: 'agent', icon: 'message-square', label: 'AI Assistant' },
    ];
    
    return (
        <div className="flex flex-col items-center bg-slate-100 dark:bg-slate-800 p-2 gap-4 border-l border-slate-200 dark:border-slate-700">
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