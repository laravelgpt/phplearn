import React from 'react';
import { Icon } from './Icon';
import { Terminal } from './Terminal';
import { ProblemsPanel } from './ProblemsPanel';
import { TerminalMessage, BottomTabId, CodeProblem, TerminalInstance } from '../types';

interface BottomPanelProps {
    terminals: TerminalInstance[];
    problems: CodeProblem[];
    activeTab: BottomTabId;
    isExecuting: boolean;
    onTabChange: (tabId: BottomTabId) => void;
    onProblemSelect: (lineNumber: number) => void;
    onAutoFix: (problem: CodeProblem) => void;
    fixingProblemLine: number | null;
    onAutoFixAll: () => void;
    isFixingAll: boolean;
    onTerminalCommand: (command: string) => void;
    onClosePanel: () => void;
    onNewTerminal: () => void;
    onCloseTerminal: (terminalId: string) => void;
    onClearTerminal: () => void;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
    terminals,
    problems,
    activeTab,
    isExecuting,
    onTabChange,
    onProblemSelect,
    onAutoFix,
    fixingProblemLine,
    onAutoFixAll,
    isFixingAll,
    onTerminalCommand,
    onClosePanel,
    onNewTerminal,
    onCloseTerminal,
    onClearTerminal
}) => {

    const problemCount = problems.length;
    const activeTerminal = terminals.find(t => t.id === activeTab);

    return (
        <div className="flex flex-col h-full min-h-0 bg-white dark:bg-slate-900 rounded-lg text-slate-800 dark:text-slate-300 text-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                <div className="flex items-end">
                    {/* Problems Tab */}
                    <button
                        key="problems"
                        onClick={() => onTabChange('problems')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm border-r border-slate-200 dark:border-slate-700 transition-colors relative
                            ${activeTab === 'problems'
                                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200'
                                : 'text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-700/50 dark:text-slate-400'
                            }`}
                    >
                        {activeTab === 'problems' && <div className="absolute top-0 left-0 w-full h-0.5 bg-sky-500"></div>}
                        <Icon icon="shield-alert" className="h-4 w-4" />
                        <span>Problems</span>
                        {problemCount > 0 && (
                            <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-medium text-white bg-red-500 rounded-full">
                                {problemCount}
                            </span>
                        )}
                    </button>
                    {/* Terminal Tabs */}
                    {terminals.map(terminal => (
                         <div
                            key={terminal.id}
                            onClick={() => onTabChange(terminal.id)}
                            className={`group flex items-center justify-between text-sm cursor-pointer border-r border-slate-200 dark:border-slate-700 relative
                                ${activeTab === terminal.id
                                    ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
                                }`}
                        >
                            {activeTab === terminal.id && <div className="absolute top-0 left-0 w-full h-0.5 bg-sky-500"></div>}
                            <div className="flex items-center space-x-2 pl-3 pr-2 py-2.5">
                               <Icon icon="terminal" className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                               <span className="whitespace-nowrap">{terminal.name}</span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCloseTerminal(terminal.id);
                                }}
                                className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-slate-300 dark:hover:bg-slate-600 transition-opacity mr-2"
                                title={`Close ${terminal.name}`}
                            >
                                <Icon icon="x" className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                    {/* New Terminal Button */}
                    <button 
                      onClick={onNewTerminal} 
                      className="px-3 py-2 text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-700/50 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700"
                      title="New Terminal"
                    >
                        <Icon icon="plus" className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center space-x-1 pr-2">
                    {activeTerminal && (
                        <button
                            onClick={onClearTerminal}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
                            title="Clear Terminal"
                        >
                            <Icon icon="trash-2" className="h-4 w-4" />
                        </button>
                    )}
                    <button
                        onClick={onClosePanel}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
                        title="Close Panel"
                    >
                        <Icon icon="x" className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="flex-grow min-h-0">
                {activeTab === 'problems' && (
                    <ProblemsPanel
                        problems={problems}
                        onProblemSelect={onProblemSelect}
                        onAutoFix={onAutoFix}
                        fixingProblemLine={fixingProblemLine}
                        onAutoFixAll={onAutoFixAll}
                        isFixingAll={isFixingAll}
                    />
                )}
                {activeTerminal ? (
                    <Terminal
                        history={activeTerminal.history}
                        onCommand={onTerminalCommand}
                        isExecuting={isExecuting}
                    />
                ) : (
                    activeTab !== 'problems' && (
                         <div className="flex h-full items-center justify-center text-slate-500 dark:text-slate-400">
                            <p>No active terminal. Click the '+' to create one.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};