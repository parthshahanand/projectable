import React, { useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { formatDisplay, formatHref, isUrl } from '@/lib/format-link';

interface LinkBadgeInputProps {
  links: string[];
  onChange: (newLinks: string[]) => void;
  placeholder?: string;
}

export function LinkBadgeInput({ links, onChange, placeholder }: LinkBadgeInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = inputValue.trim();
      if (val && !links.includes(val)) {
        onChange([...links, val]);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && inputValue === '' && links.length > 0) {
      onChange(links.slice(0, -1));
    }
  };

  const removeLink = (linkToRemove: string) => {
    onChange(links.filter(l => l !== linkToRemove));
  };

  return (
    <div className="flex flex-wrap gap-1.5 items-center w-full min-h-[28px]">
      {links.map(link => {
        const isActuallyUrl = isUrl(link);
        return (
          <span 
            key={link} 
            className="flex items-center gap-1.5 bg-muted/50 border border-border hover:border-border-strong text-xs pl-2 pr-6 py-1 rounded-sm max-w-full relative transition-colors"
          >
            {isActuallyUrl ? (
              <a 
                title={link} 
                href={formatHref(link)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline flex items-center gap-1.5 overflow-hidden text-foreground"
              >
                <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-70" />
                <span className="truncate max-w-[150px] font-medium">{formatDisplay(link)}</span>
              </a>
            ) : (
              <span className="flex items-center gap-1.5 overflow-hidden text-foreground">
                <span className="truncate max-w-[150px] font-medium">{link}</span>
              </span>
            )}
            <button 
              type="button"
              onClick={(e) => { e.preventDefault(); removeLink(link); }}
              className="absolute right-1 text-muted-foreground hover:text-destructive opacity-50 hover:opacity-100 p-0.5 rounded-sm"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        );
      })}

      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={links.length === 0 ? placeholder : "Add link..."}
        className="flex-1 min-w-[100px] bg-transparent border-none outline-none focus:ring-0 text-sm py-1 placeholder:text-muted-foreground/60"
        onBlur={() => {
           if (inputValue.trim() && !links.includes(inputValue.trim())) {
             onChange([...links, inputValue.trim()]);
             setInputValue('');
           }
        }}
      />
    </div>
  );
}
