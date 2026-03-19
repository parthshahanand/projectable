import React, { useState, useRef, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSuggestions } from '@/lib/use-suggestions';
import { cn } from '@/lib/utils';

interface NameBadgeInputProps {
  names: string[];
  onChange: (names: string[]) => void;
  availableSuggestions: string[];
  placeholder?: string;
  className?: string;
  theme?: 'blue' | 'amber' | 'gray';
}

export function NameBadgeInput({ 
  names, 
  onChange, 
  availableSuggestions, 
  placeholder = "Add...", 
  className = "",
  theme = 'gray'
}: NameBadgeInputProps) {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const suggestions = useSuggestions(input, availableSuggestions).filter(s => !names.includes(s));

  const addName = (name: string) => {
    if (!name.trim()) return;
    if (!names.includes(name.trim())) {
      onChange([...names, name.trim()]);
    }
    setInput('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const removeName = (nameToRemove: string) => {
    onChange(names.filter(n => n !== nameToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0 && input.trim()) {
        addName(suggestions[0]);
      } else {
        addName(input);
      }
    } else if (e.key === 'Backspace' && input === '' && names.length > 0) {
      removeName(names[names.length - 1]);
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-1 min-h-[32px] p-1 -mx-1 rounded-sm focus-within:ring-1 ring-border relative ${className}`}>
      {names.map(name => (
        <Badge 
          key={name} 
          variant="secondary" 
          className={cn(
            "px-2 py-0.5 text-[11px] font-medium border transition-colors flex items-center gap-1",
            theme === 'blue' && "bg-[var(--blue-3)] text-[var(--blue-11)] border-[var(--blue-7)] hover:bg-[var(--blue-4)]",
            theme === 'amber' && "bg-[var(--amber-3)] text-[var(--amber-11)] border-[var(--amber-7)] hover:bg-[var(--amber-4)]",
            theme === 'gray' && "bg-secondary text-secondary-foreground"
          )}
        >
          {name}
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeName(name);
            }}
            className="text-muted-foreground hover:text-foreground opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        onKeyDown={handleKeyDown}
        placeholder={names.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[60px] bg-transparent border-none outline-none text-sm p-1"
      />
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 z-50 w-full max-w-[200px] mt-1 bg-popover border rounded-md shadow-md py-1">
          {suggestions.slice(0, 5).map(suggestion => (
            <button
              key={suggestion}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted"
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent blur
                addName(suggestion);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
