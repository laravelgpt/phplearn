import React from 'react';
import { Icon } from './Icon';
import { Dropdown, DropdownItem, DropdownSeparator } from './Dropdown';
import { PhpLogo } from './PhpLogo';

export type MenuAction = 
  'new-file' | 'new-folder' | 'import-files' | 'export-all' |
  'run-code' | 'focus-web-view' | 'focus-terminal' |
  'toggle-learning-path' | 'toggle-workspace' | 'toggle-notes' |
  'toggle-web-view' | 'toggle-code-agent' | 'toggle-output' |
  'clear-terminal' | 'new-terminal' |
  'show-help' | 'toggle-theme'
;

interface HeaderProps {
  onRun: () => void;
  isExecuting: boolean;
  hasActiveFile: boolean;
  onMenuAction: (action: MenuAction) => void;
  theme: 'light' | 'dark';
}

export const Header: React.FC<HeaderProps> = ({ onRun, isExecuting, hasActiveFile, onMenuAction, theme }) => {
  return (
    <header className="flex items-center justify-between px-2 py-1 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex-shrink-0">
      <div className="flex items-center gap-1">
        <PhpLogo className="h-7 w-auto ml-2 text-slate-600 dark:text-slate-400" />
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
            <Dropdown label="File">
              <DropdownItem onClick={() => onMenuAction('new-file')} icon="file-plus">New File</DropdownItem>
              <DropdownItem onClick={() => onMenuAction('new-folder')} icon="folder-plus">New Folder</DropdownItem>
              <DropdownSeparator />
              <DropdownItem onClick={() => onMenuAction('import-files')} icon="upload">Import File(s)...</DropdownItem>
              <DropdownItem onClick={() => onMenuAction('export-all')} icon="download">Export All as ZIP</DropdownItem>
            </Dropdown>
            <Dropdown label="View">
              <DropdownItem onClick={() => onMenuAction('toggle-learning-path')} icon="book-open">Toggle Learning Path</DropdownItem>
              <DropdownItem onClick={() => onMenuAction('toggle-workspace')} icon="folder">Toggle Workspace Explorer</DropdownItem>
              <DropdownItem onClick={() => onMenuAction('toggle-notes')} icon="file-text">Toggle Notes</DropdownItem>
              <DropdownSeparator />
              <DropdownItem onClick={() => onMenuAction('toggle-web-view')} icon="webview">Toggle Web View</DropdownItem>
              <DropdownItem onClick={() => onMenuAction('toggle-code-agent')} icon="message-square">Toggle AI Assistant</DropdownItem>
              <DropdownSeparator />
              <DropdownItem onClick={() => onMenuAction('toggle-output')} icon="terminal">Toggle Output Panel</DropdownItem>
            </Dropdown>
            <Dropdown label="Run">
              <DropdownItem onClick={onRun} shortcut="Ctrl+Enter" icon="play">Run Code</DropdownItem>
              <DropdownSeparator />
              <DropdownItem onClick={() => onMenuAction('focus-web-view')} icon="webview">Focus Web View</DropdownItem>
              <DropdownItem onClick={() => onMenuAction('focus-terminal')} icon="terminal">Focus Terminal</DropdownItem>
            </Dropdown>
            <Dropdown label="Terminal">
              <DropdownItem onClick={() => onMenuAction('new-terminal')} icon="plus">New Terminal</DropdownItem>
              <DropdownSeparator />
              <DropdownItem onClick={() => onMenuAction('clear-terminal')} icon="trash-2">Clear Terminal</DropdownItem>
            </Dropdown>
             <Dropdown label="Help">
              <DropdownItem onClick={() => onMenuAction('show-help')} icon="help-circle">Show Commands</DropdownItem>
            </Dropdown>
        </div>
        
        {/* Mobile Menu */}
        <div className="md:hidden">
            <Dropdown label={<Icon icon="menu" className="h-5 w-5" />}>
                <DropdownItem onClick={() => onMenuAction('new-file')} icon="file-plus">New File</DropdownItem>
                <DropdownItem onClick={() => onMenuAction('new-folder')} icon="folder-plus">New Folder</DropdownItem>
                <DropdownSeparator />
                <DropdownItem onClick={() => onMenuAction('run-code')} icon="play">Run Code</DropdownItem>
                <DropdownItem onClick={() => onMenuAction('focus-web-view')} icon="webview">Focus Web View</DropdownItem>
                <DropdownItem onClick={() => onMenuAction('focus-terminal')} icon="terminal">Focus Terminal</DropdownItem>
                <DropdownItem onClick={() => onMenuAction('new-terminal')} icon="plus">New Terminal</DropdownItem>
                <DropdownSeparator />
                <DropdownItem onClick={() => onMenuAction('toggle-learning-path')} icon="book-open">Toggle Learning Path</DropdownItem>
                <DropdownItem onClick={() => onMenuAction('toggle-workspace')} icon="folder">Toggle Workspace</DropdownItem>
                <DropdownItem onClick={() => onMenuAction('toggle-notes')} icon="file-text">Toggle Notes</DropdownItem>
                <DropdownSeparator />
                <DropdownItem onClick={() => onMenuAction('toggle-web-view')} icon="webview">Toggle Web View</DropdownItem>
                <DropdownItem onClick={() => onMenuAction('toggle-code-agent')} icon="message-square">Toggle AI Assistant</DropdownItem>
                <DropdownItem onClick={() => onMenuAction('toggle-output')} icon="terminal">Toggle Output Panel</DropdownItem>
                <DropdownSeparator />
                <DropdownItem onClick={() => onMenuAction('import-files')} icon="upload">Import File(s)...</DropdownItem>
                <DropdownItem onClick={() => onMenuAction('export-all')} icon="download">Export All as ZIP</DropdownItem>
                <DropdownSeparator />
                <DropdownItem onClick={() => onMenuAction('clear-terminal')} icon="trash-2">Clear Terminal</DropdownItem>
                <DropdownItem onClick={() => onMenuAction('show-help')} icon="help-circle">Show Commands</DropdownItem>
            </Dropdown>
        </div>
      </div>

      <div className="flex-1 flex justify-center">
         <h1 className="text-sm font-semibold text-slate-500 dark:text-slate-400 hidden lg:block">PHP Learning Editor</h1>
      </div>

      <div className="flex items-center gap-2">
         <button
          onClick={onRun}
          disabled={isExecuting || !hasActiveFile}
          className="flex items-center gap-2 px-3 py-1.5 bg-sky-600 text-white rounded-md hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 transition-colors duration-200 disabled:bg-slate-400 dark:disabled:bg-slate-700 disabled:text-slate-600 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          {isExecuting ? <Icon icon="spinner" className="h-4 w-4" /> : <Icon icon="play" className="h-4 w-4" />}
          <span className="text-sm font-semibold hidden sm:inline">{isExecuting ? 'Running...' : 'Run'}</span>
        </button>
        <button onClick={() => onMenuAction('toggle-theme')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
          <Icon icon={theme === 'dark' ? 'sun' : 'moon'} className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};