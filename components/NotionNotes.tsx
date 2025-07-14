import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

const LOCAL_STORAGE_KEY = 'php-editor-notes';

export const NotionNotes: React.FC = () => {
    const [notes, setNotes] = useState('');

    // Load notes from local storage on initial render
    useEffect(() => {
        const savedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedNotes) {
            setNotes(savedNotes);
        }
    }, []);

    // Save notes to local storage whenever they change
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newNotes = e.target.value;
        setNotes(newNotes);
        localStorage.setItem(LOCAL_STORAGE_KEY, newNotes);
    };

    return (
        <div className="flex flex-col h-full min-h-0 bg-white dark:bg-slate-900 rounded-lg text-slate-800 dark:text-slate-300 text-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2 p-3 border-b border-slate-200 dark:border-slate-700">
                <Icon icon="file-text" className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Notes</h3>
            </div>
            <div className="flex-grow overflow-hidden p-1">
                <textarea
                    value={notes}
                    onChange={handleNotesChange}
                    className="w-full h-full bg-transparent text-slate-900 dark:text-slate-200 resize-none focus:outline-none font-sans p-3 leading-relaxed"
                    placeholder="Jot down your notes, ideas, or code snippets here... They are saved automatically."
                    spellCheck="false"
                />
            </div>
        </div>
    );
};