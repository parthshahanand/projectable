import { useState, useCallback, useEffect } from 'react';

export function useColumnResize(
  storageKey: string, 
  initialWidths: number[] = [300, 200, 200],
  minWidths: number[] = [200, 150, 150]
) {
  const [widths, setWidths] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === initialWidths.length) {
            return parsed;
          }
        } catch (e) {
          console.error("Failed to parse column widths", e);
        }
      }
    }
    return initialWidths;
  });
  const [isResizing, setIsResizing] = useState<number | null>(null);

  // Save to local storage when resizing finishes
  useEffect(() => {
    if (isResizing === null) {
      localStorage.setItem(storageKey, JSON.stringify(widths));
    }
  }, [widths, isResizing, storageKey]);

  const startResize = useCallback((index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(index);

    const startX = e.pageX;
    const startWidth = widths[index];

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.pageX - startX;
      
      setWidths(prev => {
        const next = [...prev];
        next[index] = Math.max(minWidths[index], startWidth + delta);
        return next;
      });
    };

    const onMouseUp = () => {
      setIsResizing(null);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [widths, minWidths]);

  return { widths, startResize, isResizing };
}
