
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';

interface InlineAiPromptProps {
    position: { top: number; left: number };
    mode: 'edit' | 'generate';
    onSubmit: (prompt: string) => Promise<void>;
    onClose: () => void;
}

export const InlineAiPrompt: React.FC<InlineAiPromptProps> = ({ position, mode, onSubmit, onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const promptRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        
        // Adjust position if it would go off-screen
        if (promptRef.current) {
            const rect = promptRef.current.getBoundingClientRect();
            if (rect.right > window.innerWidth - 20) {
                promptRef.current.style.left = `${window.innerWidth - rect.width - 20}px`;
            }
            if (rect.bottom > window.innerHeight - 20) {
                promptRef.current.style.top = `${window.innerHeight - rect.height - 20}px`;
            }
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;
        setIsLoading(true);
        await onSubmit(prompt);
        // No need to set isLoading(false) or onClose() because the component will be unmounted
    };

    return (
        <div 
            ref={promptRef}
            className="fixed z-20 w-96 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col"
            style={{ top: position.top, left: position.left }}
            onClick={e => e.stopPropagation()}
        >
            <form onSubmit={handleSubmit}>
                <div className="p-3">
                    <label htmlFor="ai-prompt" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {mode === 'edit' ? 'Edit selection with AI' : 'Generate code with AI'}
                    </label>
                    <textarea
                        id="ai-prompt"
                        ref={inputRef}
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder={mode === 'edit' ? 'e.g., "Refactor this to a foreach loop"' : 'e.g., "A function that calculates factorial"'}
                        className="mt-2 w-full resize-none bg-slate-100 dark:bg-slate-900 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                        rows={3}
                        disabled={isLoading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                handleSubmit(e);
                            }
                        }}
                    />
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2 flex justify-end items-center gap-2 rounded-b-lg">
                    <span className="text-xs text-slate-500 dark:text-slate-400 mr-auto">
                        <kbd className="font-sans mr-1 p-1 bg-slate-200 dark:bg-slate-600 rounded">Esc</kbd> to close,
                        <kbd className="font-sans ml-2 p-1 bg-slate-200 dark:bg-slate-600 rounded">Cmd</kbd>+
                        <kbd className="font-sans p-1 bg-slate-200 dark:bg-slate-600 rounded">Enter</kbd> to submit
                    </span>
                    <button type="button" onClick={onClose} disabled={isLoading} className="px-3 py-1.5 text-sm rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">Cancel</button>
                    <button type="submit" disabled={isLoading || !prompt.trim()} className="px-3 py-1.5 text-sm rounded-md bg-sky-600 text-white hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 flex items-center gap-2">
                        {isLoading ? <Icon icon="spinner" className="h-4 w-4" /> : <Icon icon="sparkles" className="h-4 w-4" />}
                        {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            </form>
        </div>
    );
};
