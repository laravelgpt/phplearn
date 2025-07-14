import React from 'react';
import { FileNode } from '../types';
import { Icon } from './Icon';

interface FileTabsProps {
    openFiles: FileNode[];
    activeFileId: string | null;
    onTabClick: (id: string) => void;
    onTabClose: (id: string) => void;
    onNewTabDoubleClick: () => void;
}

export const FileTabs: React.FC<FileTabsProps> = ({ openFiles, activeFileId, onTabClick, onTabClose, onNewTabDoubleClick }) => {
    
    const handleDoubleClickOnBar = (e: React.MouseEvent<HTMLDivElement>) => {
        // This only fires when clicking the empty space of the bar, not a tab,
        // because the tabs are child elements and will not match e.currentTarget.
        if (e.target === e.currentTarget) {
            onNewTabDoubleClick();
        }
    };

    return (
        <div 
            className="flex-shrink-0 bg-slate-100 dark:bg-slate-800 flex items-end"
            onDoubleClick={handleDoubleClickOnBar}
        >
            <div className="flex items-end overflow-x-auto">
                {openFiles.map(file => (
                    <div
                        key={file.id}
                        onClick={() => onTabClick(file.id)}
                        className={`group flex items-center justify-between text-sm cursor-pointer border-r border-slate-200 dark:border-slate-700 relative
                            ${activeFileId === file.id
                                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
                            }`}
                    >
                        {activeFileId === file.id && <div className="absolute top-0 left-0 w-full h-0.5 bg-sky-500"></div>}
                        <div className="flex items-center space-x-2 pl-3 pr-2 py-2.5">
                           <Icon icon="file" className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                           <span className="whitespace-nowrap">{file.name}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onTabClose(file.id);
                            }}
                            className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-slate-300 dark:hover:bg-slate-600 transition-opacity mr-2"
                            title={`Close ${file.name}`}
                        >
                            <Icon icon="x" className="h-3.5 w-3.5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
