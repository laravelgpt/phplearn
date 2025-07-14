import React, { useState, useEffect, useRef } from 'react';
import { TerminalMessage, MessageType } from '../types';

interface TerminalProps {
  history: TerminalMessage[];
  onCommand: (command: string) => void;
  isExecuting: boolean;
}

const Message: React.FC<{ message: TerminalMessage }> = ({ message }) => {
  const getMessageColor = (type: MessageType) => {
    switch (type) {
      case MessageType.COMMAND:
        return 'text-cyan-600 dark:text-cyan-400';
      case MessageType.OUTPUT:
        return 'text-slate-600 dark:text-slate-300';
      case MessageType.PHP_OUTPUT:
        return 'text-slate-900 dark:text-slate-100';
      case MessageType.ERROR:
        return 'text-red-600 dark:text-red-400';
      case MessageType.SYSTEM:
        return 'text-amber-600 dark:text-amber-400';
      default:
        return 'text-slate-600 dark:text-slate-300';
    }
  };

  return (
    <div className="flex">
        <div className="text-slate-400 dark:text-slate-500 mr-4">{message.timestamp}</div>
        <div className={`flex-1 ${getMessageColor(message.type)}`}>
            {message.type === MessageType.COMMAND && <span className="text-green-600 dark:text-green-400 mr-2">$</span>}
            <pre className="whitespace-pre-wrap font-fira-code">{message.text}</pre>
        </div>
    </div>
  );
};

export const Terminal: React.FC<TerminalProps> = ({ history, onCommand, isExecuting }) => {
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [localCommandHistory, setLocalCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      const command = input.trim();
      onCommand(command);
      if (command && (localCommandHistory.length === 0 || localCommandHistory[localCommandHistory.length - 1] !== command)) {
        const newHistory = [...localCommandHistory, command];
        setLocalCommandHistory(newHistory);
        setHistoryIndex(newHistory.length);
      } else {
        setHistoryIndex(localCommandHistory.length);
      }
      setInput('');
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        e.preventDefault();
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(localCommandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < localCommandHistory.length - 1) {
        e.preventDefault();
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(localCommandHistory[newIndex]);
      } else if (historyIndex === localCommandHistory.length - 1) {
        e.preventDefault();
        setHistoryIndex(localCommandHistory.length);
        setInput('');
      }
    }
  };


  return (
    <div className="bg-slate-100 dark:bg-slate-900 h-full p-4 flex flex-col font-fira-code text-slate-800 dark:text-slate-200 flex-grow">
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {history.map((msg, index) => (
            <Message key={index} message={msg} />
            ))}
            {isExecuting && (
                <div className="flex items-center text-slate-500 dark:text-slate-400">
                    <div className="text-slate-400 dark:text-slate-500 mr-4">--:--:--</div>
                    <span>Executing...</span>
                </div>
            )}
            <div ref={endOfMessagesRef} />
        </div>
        <div className="mt-4 flex items-center">
            <span className="text-green-600 dark:text-green-400 mr-2">$</span>
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent w-full focus:outline-none text-cyan-600 dark:text-cyan-400"
            placeholder="Type a command (e.g. 'run', 'clear', 'help')..."
            disabled={isExecuting}
            />
        </div>
    </div>
  );
};