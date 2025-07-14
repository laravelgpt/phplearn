import React, { useRef, useEffect } from 'react';
import { Icon } from './Icon';

interface WebViewProps {
  htmlContent: string;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
  theme: 'light' | 'dark';
}

export const WebView: React.FC<WebViewProps> = ({ htmlContent, isFullScreen, onToggleFullScreen, theme }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const applyTheme = () => {
        try {
            if (iframe.contentDocument) {
                if (theme === 'dark') {
                    iframe.contentDocument.documentElement.classList.add('dark');
                } else {
                    iframe.contentDocument.documentElement.classList.remove('dark');
                }
            }
        } catch (e) {
            console.warn("Could not access iframe contentDocument for theming.", e);
        }
    };
    
    // Apply theme on load and when theme changes
    iframe.addEventListener('load', applyTheme);
    applyTheme();

    return () => {
        if (iframe) {
            iframe.removeEventListener('load', applyTheme);
        }
    };
  }, [theme, htmlContent]); // Rerun when content changes (reloads iframe) or theme changes

  return (
    <div className="w-full flex flex-col h-full min-h-0 bg-white dark:bg-slate-900 rounded-lg text-slate-800 dark:text-slate-300 text-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <div className="flex items-center space-x-2">
            <Icon icon="webview" className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Web View</h3>
        </div>
        <button 
          onClick={onToggleFullScreen} 
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400" 
          title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
        >
            <Icon icon={isFullScreen ? "minimize" : "maximize"} className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-grow overflow-hidden p-1 bg-slate-100 dark:bg-slate-800">
        <iframe
          ref={iframeRef}
          srcDoc={htmlContent}
          title="Web View"
          className="w-full h-full border-0 bg-white dark:bg-slate-950 rounded-sm"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};