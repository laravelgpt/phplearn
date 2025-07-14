import React from 'react';
import { CodeProblem } from '../types';
import { Icon } from './Icon';

interface ProblemsPanelProps {
    problems: CodeProblem[];
    onProblemSelect: (lineNumber: number) => void;
    onAutoFix: (problem: CodeProblem) => void;
    fixingProblemLine: number | null;
    onAutoFixAll: () => void;
    isFixingAll: boolean;
}

const ProblemItem: React.FC<{ problem: CodeProblem; onSelect: () => void; onAutoFix: () => void; isFixing: boolean; isFixingAll: boolean; }> = ({ problem, onSelect, onAutoFix, isFixing, isFixingAll }) => {
    const isError = problem.severity === 'error';

    const handleAutoFixClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // prevent onSelect from firing
        onAutoFix();
    };

    return (
        <div
            onClick={onSelect}
            className="w-full flex items-start gap-3 p-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
        >
            <Icon
                icon="alert-triangle"
                className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isError ? 'text-red-500' : 'text-amber-500'}`}
            />
            <div className="flex-1 flex flex-col gap-1.5">
                <p className="text-slate-800 dark:text-slate-200 leading-snug">{problem.message}</p>
                 <button
                    onClick={handleAutoFixClick}
                    disabled={isFixing || isFixingAll}
                    className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold disabled:opacity-50 disabled:cursor-wait w-fit"
                >
                    {isFixing ? (
                        <>
                            <Icon icon="spinner" className="h-3.5 w-3.5" />
                            <span>Fixing...</span>
                        </>
                    ) : (
                         <>
                            <Icon icon="sparkles" className="h-3.5 w-3.5" />
                            <span>Auto-Fix</span>
                        </>
                    )}
                </button>
            </div>
            <span className="font-fira-code text-slate-500 dark:text-slate-400 text-xs">
                [{problem.line}]
            </span>
        </div>
    );
};

export const ProblemsPanel: React.FC<ProblemsPanelProps> = ({ problems, onProblemSelect, onAutoFix, fixingProblemLine, onAutoFixAll, isFixingAll }) => {
    if (problems.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-slate-500 dark:text-slate-400">
                <p>No problems have been detected.</p>
            </div>
        );
    }

    const isFixingAny = isFixingAll || fixingProblemLine !== null;

    return (
        <div className="h-full flex flex-col">
             <div className="p-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-end">
                <button
                    onClick={onAutoFixAll}
                    disabled={isFixingAny}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-sky-600 text-white hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-wait transition-colors"
                >
                    {isFixingAll ? (
                        <>
                            <Icon icon="spinner" className="h-3.5 w-3.5" />
                            <span>Fixing All...</span>
                        </>
                    ) : (
                        <>
                            <Icon icon="sparkles" className="h-3.5 w-3.5" />
                            <span>Auto-Fix All ({problems.length})</span>
                        </>
                    )}
                </button>
            </div>
            <div className="h-full overflow-y-auto p-2">
                <div className="space-y-1">
                    {problems.map((problem, index) => (
                        <ProblemItem 
                            key={`${problem.line}-${index}`}
                            problem={problem}
                            onSelect={() => onProblemSelect(problem.line)}
                            onAutoFix={() => onAutoFix(problem)}
                            isFixing={fixingProblemLine === problem.line}
                            isFixingAll={isFixingAll}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};