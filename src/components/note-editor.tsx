'use client';

import React, { useEffect } from 'react';
import { Pencil, Bold, Italic, List, ListOrdered } from 'lucide-react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Report } from '@/types';
import { cn } from '@/lib/utils';

interface NoteEditorProps {
  report: Report;
  isEditingNote: boolean;
  setIsEditingNote: (val: boolean) => void;
  handleSaveNote: (content: string | null) => void;
  className?: string;
  title?: string;
}

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 p-1 bg-muted/50 border-b border-border rounded-t-md">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn(
          "p-1 rounded hover:bg-background transition-colors",
          editor.isActive('bold') && "bg-background shadow-sm text-primary"
        )}
        type="button"
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(
          "p-1 rounded hover:bg-background transition-colors",
          editor.isActive('italic') && "bg-background shadow-sm text-primary"
        )}
        type="button"
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-4 bg-border mx-1 self-center" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "p-1 rounded hover:bg-background transition-colors",
          editor.isActive('bulletList') && "bg-background shadow-sm text-primary"
        )}
        type="button"
        title="Bullet List"
      >
        <List className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "p-1 rounded hover:bg-background transition-colors",
          editor.isActive('orderedList') && "bg-background shadow-sm text-primary"
        )}
        type="button"
        title="Ordered List"
      >
        <ListOrdered className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

const extensions = [
  StarterKit.configure({}),
];

export function NoteEditor({
  report,
  isEditingNote,
  setIsEditingNote,
  handleSaveNote,
  className,
  title = "Notes"
}: NoteEditorProps) {
  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    content: report.notes || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[80px] p-2 text-sm leading-relaxed',
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
          internalSave();
          return true;
        }
        return false;
      },
    },
    onBlur: () => {
      // Auto-save on blur if focus leaves the editor area and toolbar
      setTimeout(() => {
        if (!document.activeElement?.closest('.tiptap-editor-container')) {
          internalSave();
        }
      }, 100);
    }
  });

  const internalSave = () => {
    if (!editor) return;
    
    // If editor is empty or just contains whitespace/empty tags, mark as null for deletion
    if (editor.isEmpty || editor.getText().trim().length === 0) {
      handleSaveNote(null);
    } else {
      handleSaveNote(editor.getHTML());
    }
  };

  // Switch content when switching reports or external data changes
  useEffect(() => {
    if (editor && editor.getHTML() !== (report.notes || '')) {
      editor.commands.setContent(report.notes || '');
    }
  }, [report.notes, editor]);

  // Focus editor when entering edit mode
  useEffect(() => {
    if (isEditingNote && editor) {
      editor.commands.focus();
    }
  }, [isEditingNote, editor]);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {title && <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">{title}</h4>}
      
      {isEditingNote ? (
        <div className="flex flex-col border border-input rounded-md bg-white/50 focus-within:ring-1 focus-within:ring-ring transition-shadow tiptap-editor-container">
          <Toolbar editor={editor} />
          <EditorContent editor={editor} className="bg-transparent" />
          <div className="flex justify-end p-1.5 border-t border-border bg-muted/20">
            <button
              onClick={internalSave}
              className="text-[10px] uppercase font-bold px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      ) : report.notes && report.notes.trim().length > 0 ? (
        <div className="bg-amber-100 border border-amber-300 rounded-md p-2 text-sm text-amber-950 break-words flex justify-between items-start gap-2 group relative">
          <div 
            className="leading-relaxed prose prose-sm prose-amber prose-p:my-0 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 max-w-none w-full pr-6"
            dangerouslySetInnerHTML={{ __html: report.notes }}
          />
          <button 
            onClick={() => {
              setIsEditingNote(true);
            }}
            className="p-1 hover:bg-amber-200/50 rounded-sm transition-colors text-amber-700 hover:text-amber-900 opacity-0 group-hover:opacity-100 flex-shrink-0 absolute top-2 right-2"
          >
            <Pencil className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button 
          onClick={() => {
            setIsEditingNote(true);
          }}
          className="text-xs font-medium text-muted-foreground hover:text-foreground w-fit flex items-center gap-1 transition-colors"
        >
          <Pencil className="w-3 h-3" />
          Add Note
        </button>
      )}
      
      {isEditingNote && (
        <p className="text-[10px] text-muted-foreground px-1">
          <kbd className="font-sans">Ctrl</kbd>+<kbd className="font-sans">Enter</kbd> to save
        </p>
      )}

      <style jsx global>{`
        .prose ul { list-style-type: disc; padding-left: 1.25rem; }
        .prose ol { list-style-type: decimal; padding-left: 1.25rem; }
        .prose p { margin-bottom: 0.5rem; }
        .prose p:last-child { margin-bottom: 0; }
        u { text-underline-offset: 2px; }
      `}</style>
    </div>
  );
}
