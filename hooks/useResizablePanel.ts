import { useState, useCallback, useEffect } from 'react';

interface UseResizablePanelProps {
  initialSize: number;
  minSize: number;
  side: 'left' | 'right' | 'top' | 'bottom';
  storageKey?: string;
}

export const useResizablePanel = ({ initialSize, minSize, side, storageKey }: UseResizablePanelProps) => {
  const [size, setSize] = useState(() => {
    if (storageKey) {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved !== null) {
                const parsedSize = JSON.parse(saved);
                if (typeof parsedSize === 'number' && parsedSize >= minSize) {
                    return parsedSize;
                }
            }
        } catch (e) {
            console.error(`Failed to load panel size from localStorage for key "${storageKey}"`, e);
        }
    }
    return initialSize;
  });
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
      if (storageKey) {
          localStorage.setItem(storageKey, JSON.stringify(size));
      }
  }, [size, storageKey]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    let newSize;
    if (side === 'right') {
      newSize = window.innerWidth - e.clientX;
    } else if (side === 'left') {
      newSize = e.clientX;
    } else if (side === 'top') {
        newSize = e.clientY;
    } else { // bottom
      newSize = window.innerHeight - e.clientY;
    }
    
    if (newSize >= minSize) {
      setSize(newSize);
    }
  }, [isResizing, minSize, side]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.pointerEvents = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
       if (document.body) {
        document.body.style.userSelect = '';
        document.body.style.pointerEvents = '';
      }
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return { size, isResizing, handleMouseDown };
};
