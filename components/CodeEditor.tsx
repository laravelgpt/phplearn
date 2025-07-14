

import React, { useState, useEffect, useRef } from 'react';
import { InlineAiPrompt } from './InlineAiPrompt';
import { InlineAiDiffViewer } from './InlineAiDiffViewer';
import { CodeProblem } from '../types';
import { Icon } from './Icon';
import { ContextMenu } from './ContextMenu';

const LINE_HEIGHT = 24; // Should match --line-height in CSS

interface CodeEditorProps {
  code: string | null;
  setCode: (code: string) => void;
  jumpToLine: number | null;
  onJumpComplete: () => void;
  problems: CodeProblem[];
  onAutoFix: (problem: CodeProblem) => void;
  onGenerateCodeInline: (prompt: string, position: number) => Promise<void>;
  onGetAiEditSuggestion: (prompt: string, codeToEdit: string) => Promise<string | null>;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, jumpToLine, onJumpComplete, problems, onAutoFix, onGenerateCodeInline, onGetAiEditSuggestion }) => {
  const [lineCount, setLineCount] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [showAiPrompt, setShowAiPrompt] = useState<{ range: {start: number, end: number}, position: {top: number, left: number} } | null>(null);
  const mirrorRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const [aiSuggestion, setAiSuggestion] = useState<{
      range: { start: number; end: number };
      newCode: string | null;
      isLoading: boolean;
      position: { top: number; left: number };
  } | null>(null);

  const [gutterMenu, setGutterMenu] = useState<{
    x: number;
    y: number;
    problem: CodeProblem;
  } | null>(null);

  useEffect(() => {
    const lines = code?.split('\n').length || 1;
    setLineCount(lines);
  }, [code]);

  useEffect(() => {
    if (jumpToLine !== null && textareaRef.current && highlightRef.current) {
      const editor = textareaRef.current;
      const highlight = highlightRef.current;
      
      const scrollTop = (jumpToLine - 1) * LINE_HEIGHT;
      editor.scrollTop = scrollTop;
      if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = scrollTop;
      
      highlight.style.transform = `translateY(${editor.scrollTop}px)`;
      highlight.style.opacity = '1';
      editor.focus();

      // Fade out the highlight
      const timer = setTimeout(() => {
        if(highlightRef.current) highlightRef.current.style.opacity = '0';
        onJumpComplete();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [jumpToLine, onJumpComplete]);

  const getLineInfo = (lineNumber: number): { range: { start: number; end: number }; position: { top: number; left: number } } | null => {
    if (!textareaRef.current || code === null) return null;
    
    const lines = code.split('\n');
    const lineIndex = lineNumber - 1;
    if (lineIndex < 0 || lineIndex >= lines.length) return null;

    const selectionStart = lines.slice(0, lineIndex).join('\n').length + (lineIndex > 0 ? 1 : 0);
    const selectionEnd = selectionStart + lines[lineIndex].length;

    const mirror = mirrorRef.current;
    if (!mirror) return null;

    const textUpToLine = code.substring(0, selectionStart);
    mirror.textContent = textUpToLine;
    const span = document.createElement('span');
    span.innerHTML = '&nbsp;';
    mirror.appendChild(span);

    const rect = span.getBoundingClientRect();
    const top = rect.top;
    const left = rect.left;

    mirror.textContent = ''; // clear mirror

    return {
        range: { start: selectionStart, end: selectionEnd },
        position: { top, left }
    };
  };

  const handleEditFromGutter = (problem: CodeProblem) => {
    const lineInfo = getLineInfo(problem.line);
    if (lineInfo) {
      setShowAiPrompt(lineInfo);
    }
  };

  const handleAutoFixSuggestion = async (problem: CodeProblem) => {
    const lineInfo = getLineInfo(problem.line);
    if (lineInfo && code) {
        const { range, position } = lineInfo;
        const codeToEdit = code.substring(range.start, range.end);
        const prompt = `Fix this line of code. The problem is: "${problem.message}". Return only the corrected line of code.`;
        
        setAiSuggestion({ range, position, isLoading: true, newCode: null });
        const result = await onGetAiEditSuggestion(prompt, codeToEdit);

        if (result !== null) {
            setAiSuggestion(prev => prev ? { ...prev, newCode: result, isLoading: false } : null);
        } else {
            setAiSuggestion(null); // Failure is handled in App.tsx with a modal
        }
    }
  };
  
  const handleAiTrigger = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea || code === null || aiSuggestion || gutterMenu) return;

        const { selectionStart, selectionEnd } = textarea;

        // --- Position calculation logic ---
        const textUpToCursor = code.substring(0, selectionEnd);
        const mirror = mirrorRef.current;
        if (mirror) {
            // A non-breaking space is used to ensure the span has dimensions
            mirror.textContent = textUpToCursor;
            const span = document.createElement('span');
            span.innerHTML = '&nbsp;';
            mirror.appendChild(span);

            // For a selection, position the prompt near the start of the selection
            const startPosText = code.substring(0, selectionStart);
            mirror.textContent = startPosText;
            mirror.appendChild(span);
            const startRect = span.getBoundingClientRect();
            
            const top = startRect.top;
            const left = startRect.left;

            mirror.textContent = ''; // clear mirror
            setShowAiPrompt({
                range: { start: selectionStart, end: selectionEnd },
                position: { top, left }
            });
        }
    }
  };

  const handleAiSubmit = async (prompt: string) => {
    if (!showAiPrompt || code === null) return;
    
    const { range, position } = showAiPrompt;
    setShowAiPrompt(null); // Close prompt immediately for better UX
    
    if (range.start === range.end) {
        // Generate mode
        await onGenerateCodeInline(prompt, range.start);
    } else {
        // Edit mode: show diff viewer
        setAiSuggestion({ range, position, isLoading: true, newCode: null });
        const codeToEdit = code.substring(range.start, range.end);
        const result = await onGetAiEditSuggestion(prompt, codeToEdit);

        if (result !== null) {
            setAiSuggestion(prev => prev ? { ...prev, newCode: result, isLoading: false } : null);
        } else {
            // Failure is handled in App.tsx with a modal, just close the viewer
            setAiSuggestion(null);
        }
    }
  };

  const handleAcceptSuggestion = (newCode: string) => {
    if (!aiSuggestion || code === null) return;
    const { range } = aiSuggestion;
    const fullNewCode = code.slice(0, range.start) + newCode + code.slice(range.end);
    setCode(fullNewCode);
    setAiSuggestion(null);
  };

  const handleRejectSuggestion = () => {
    setAiSuggestion(null);
  };


  if (code === null) {
    return (
        <div className="flex h-full items-center justify-center text-slate-500 dark:text-slate-400">
            <p>Select a file to begin editing.</p>
        </div>
    );
  }

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = scrollTop;
    }
    if (highlightRef.current) {
        highlightRef.current.style.transform = `translateY(${scrollTop}px)`;
    }
     if (aiSuggestion || gutterMenu) {
      handleRejectSuggestion();
      setGutterMenu(null);
    }
  };

  return (
    <div className="relative flex h-full overflow-hidden bg-white dark:bg-slate-900" onClick={() => setGutterMenu(null)}>
       <pre 
          ref={mirrorRef}
          className="absolute font-fira-code invisible whitespace-pre-wrap p-4 pointer-events-none"
          style={{ 
            top: 0,
            left: 'calc(1rem + 2rem + 1rem + 0.5rem)', /* gutter pl + width + pr + gap */
            lineHeight: `${LINE_HEIGHT}px`,
            padding: 0,
            margin: 0,
            border: 'none'
          }}
      />
      {showAiPrompt && (
          <InlineAiPrompt 
              position={showAiPrompt.position}
              mode={showAiPrompt.range.start === showAiPrompt.range.end ? 'generate' : 'edit'}
              onSubmit={handleAiSubmit}
              onClose={() => setShowAiPrompt(null)}
          />
      )}
       {aiSuggestion && (
            <InlineAiDiffViewer
                isLoading={aiSuggestion.isLoading}
                oldCode={code.substring(aiSuggestion.range.start, aiSuggestion.range.end)}
                newCode={aiSuggestion.newCode}
                position={aiSuggestion.position}
                onAccept={handleAcceptSuggestion}
                onReject={handleRejectSuggestion}
            />
       )}
        {gutterMenu && (
            <ContextMenu
                x={gutterMenu.x}
                y={gutterMenu.y}
                onClose={() => setGutterMenu(null)}
                items={[
                    {
                        label: 'Auto-Fix with AI',
                        icon: 'sparkles',
                        onClick: () => handleAutoFixSuggestion(gutterMenu.problem)
                    },
                    {
                        label: 'Edit with AI...',
                        icon: 'edit',
                        onClick: () => handleEditFromGutter(gutterMenu.problem)
                    }
                ]}
            />
        )}
      <div 
        ref={highlightRef} 
        className="absolute top-0 left-0 w-full bg-sky-500/10 dark:bg-sky-400/10 pointer-events-none transition-opacity duration-500 opacity-0" 
        style={{ height: `${LINE_HEIGHT}px` }}
      />
      <div
        ref={lineNumbersRef}
        className="line-numbers text-right pr-2 pl-4 pt-4 text-slate-500 dark:text-slate-400 font-fira-code select-none overflow-y-hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {Array.from({ length: lineCount }, (_, i) => {
           const problem = problems.find(p => p.line === i + 1);
           return (
            <div key={i} style={{ height: `${LINE_HEIGHT}px` }} className="flex items-center justify-end gap-2">
                 {problem ? (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setGutterMenu({ x: e.clientX, y: e.clientY, problem });
                        }}
                        title={`AI Actions for: ${problem.message}`}
                        className="text-sky-500 hover:text-sky-400"
                    >
                        <Icon icon="sparkles" className="h-4 w-4" />
                    </button>
                 ) : (
                    <div className="w-4" />
                 )}
                <span style={{ minWidth: '1.5rem' }}>{i + 1}</span>
            </div>
          )}
        )}
      </div>
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 p-4 bg-transparent text-slate-900 dark:text-slate-200 resize-none focus:outline-none font-fira-code"
        spellCheck="false"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        onScroll={handleScroll}
        onKeyDown={handleAiTrigger}
      />
    </div>
  );
};