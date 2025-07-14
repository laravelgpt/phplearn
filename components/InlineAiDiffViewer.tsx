
import React, { useEffect, useRef } from 'react';
import * as Diff from 'diff';
import { Icon } from './Icon';

interface InlineAiDiffViewerProps {
    position: { top: number; left: number };
    isLoading: boolean;
    oldCode: string;
    newCode: string | null;
    onAccept: (newCode: string) => void;
    onReject: () => void;
}

const renderDiff = (oldCode: string, newCode: string) => {
    const diffResult = Diff.diffWordsWithSpace(oldCode, newCode);

    return diffResult.map((part, index) => {
        const style = {
            backgroundColor: part.added ? 'rgba(67, 158, 86, 0.2)' : part.removed ? 'rgba(219, 57, 57, 0.2)' : 'transparent',
            color: part.removed ? 'rgb(239 68 68 / 0.8)' : 'inherit',
            textDecoration: part.removed ? 'line-through' : 'none',
        };
        // If it's just whitespace, don't wrap in a span to allow normal wrapping
        if (part.value.trim() === '' && !part.added && !part.removed) {
            return part.value;
        }
        return <span key={index} style={style}>{part.value}</span>;
    });
};

export const InlineAiDiffViewer: React.FC<InlineAiDiffViewerProps> = ({ position, isLoading, oldCode, newCode, onAccept, onReject }) => {
    const viewerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Adjust position if it would go off-screen
        if (viewerRef.current) {
            const rect = viewerRef.current.getBoundingClientRect();
            if (rect.right > window.innerWidth - 20) {
                viewerRef.current.style.left = `${window.innerWidth - rect.width - 20}px`;
            }
            if (rect.bottom > window.innerHeight - 20) {
                viewerRef.current.style.top = `${window.innerHeight - rect.height - 20}px`;
            }
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onReject();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onReject]);


    return (
        <div
            ref={viewerRef}
            className="fixed z-20 w-[480px] max-w-[90vw] bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col font-fira-code text-sm"
            style={{ top: position.top, left: position.left }}
            onClick={e => e.stopPropagation()}
        >
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-sans">AI Suggestion</h3>
            </div>
            
            <div className="p-3 max-h-80 overflow-y-auto">
                {isLoading && (
                    <div className="flex items-center justify-center p-8 gap-2 text-slate-500 dark:text-slate-400">
                        <Icon icon="spinner" className="h-5 w-5" />
                        <span>AI is thinking...</span>
                    </div>
                )}
                {!isLoading && newCode && (
                    <pre className="whitespace-pre-wrap">
                        <code>
                            {renderDiff(oldCode, newCode)}
                        </code>
                    </pre>
                )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2 flex justify-end items-center gap-2 rounded-b-lg">
                <button 
                    onClick={onReject} 
                    disabled={isLoading}
                    className="px-3 py-1.5 text-sm rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                    Reject
                </button>
                <button 
                    onClick={() => onAccept(newCode!)}
                    disabled={isLoading || !newCode} 
                    className="px-3 py-1.5 text-sm rounded-md bg-sky-600 text-white hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 flex items-center gap-2"
                >
                    <Icon icon="check-circle" className="h-4 w-4" />
                    Accept
                </button>
            </div>
        </div>
    );
};
