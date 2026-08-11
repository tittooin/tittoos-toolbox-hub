import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AxevoraEmojiPicker } from './AxevoraEmojiPicker';
import { AxevoraGifPicker } from './AxevoraGifPicker';
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Link2, RemoveFormatting, 
  Smile, Send, Palette, Highlighter
} from 'lucide-react';
import { toast } from 'sonner';

export interface RichTextComposerProps {
  value?: string;
  onChange?: (html: string) => void;
  onSubmit: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  submitLabel?: string;
  mode?: 'chat' | 'comment';
  disabled?: boolean;
  disabledReason?: string;
  isSubmitting?: boolean;
  className?: string;
}

const COMMON_COLORS = [
  '#0f172a', '#ef4444', '#f97316', '#eab308', 
  '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
];

const HIGHLIGHT_COLORS = [
  'transparent', '#fef08a', '#bbf7d0', '#bfdbfe', 
  '#fbcfe8', '#fed7aa', '#e9d5ff', '#e2e8f0'
];

export const RichTextComposer: React.FC<RichTextComposerProps> = ({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Type a message...',
  minHeight = '90px',
  maxHeight = '180px',
  submitLabel,
  mode = 'comment',
  disabled = false,
  disabledReason,
  isSubmitting = false,
  className = ''
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  // Sync initial value into editor
  useEffect(() => {
    if (editorRef.current) {
      if (!value || value === '<p><br></p>') {
        if (editorRef.current.innerHTML !== '') {
          editorRef.current.innerHTML = '';
          setIsEmpty(true);
        }
      } else if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
        setIsEmpty(editorRef.current.innerText.trim() === '' && !editorRef.current.querySelector('img'));
      }
    }
  }, [value]);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  }, []);

  const restoreSelection = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.focus();
      if (savedRangeRef.current) {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(savedRangeRef.current);
        }
      }
    }
  }, []);

  const handleInput = () => {
    saveSelection();
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const text = editorRef.current.innerText.trim();
      const hasImg = !!editorRef.current.querySelector('img');
      setIsEmpty(text === '' && !hasImg);
      if (onChange) {
        onChange(html);
      }
    }
  };

  const execCmd = (command: string, value: string = '') => {
    restoreSelection();
    document.execCommand(command, false, value);
    saveSelection();
    handleInput();
  };

  const applySpanStyle = (styleProp: string, styleValue: string) => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);

    if (range.collapsed) {
      execCmd(styleProp === 'color' ? 'foreColor' : styleProp === 'backgroundColor' ? 'hiliteColor' : 'styleWithCSS', styleValue);
      return;
    }

    const span = document.createElement('span');
    span.style[styleProp as any] = styleValue;

    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);
      saveSelection();
    } catch {
      document.execCommand(styleProp === 'color' ? 'foreColor' : 'hiliteColor', false, styleValue);
    }
    handleInput();
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    if (!fontFamily) return;
    applySpanStyle('fontFamily', fontFamily);
  };

  const handleFontSizeChange = (fontSize: string) => {
    if (!fontSize) return;
    applySpanStyle('fontSize', fontSize);
  };

  const handleTextColor = (color: string) => {
    applySpanStyle('color', color);
    setShowTextColorPicker(false);
  };

  const handleHighlightColor = (color: string) => {
    applySpanStyle('backgroundColor', color);
    setShowHighlightPicker(false);
  };

  const handleAddLink = () => {
    restoreSelection();
    const url = prompt('Enter URL (e.g. https://example.com):');
    if (url) {
      const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
      execCmd('createLink', formattedUrl);
    }
  };

  const handleInsertEmoji = (emojiData: any) => {
    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(emojiData.emoji);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      sel.removeAllRanges();
      sel.addRange(range);
      saveSelection();
    } else if (editorRef.current) {
      editorRef.current.appendChild(document.createTextNode(emojiData.emoji));
    }
    handleInput();
    setShowEmojiPicker(false);
  };

  const handleInsertGif = (gifUrl: string) => {
    restoreSelection();
    const sel = window.getSelection();
    const img = document.createElement('img');
    img.src = gifUrl;
    img.alt = 'GIF';
    img.style.maxHeight = '180px';
    img.style.borderRadius = '8px';
    img.style.margin = '4px 0';
    img.style.display = 'inline-block';

    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(img);
      range.setStartAfter(img);
      range.setEndAfter(img);
      sel.removeAllRanges();
      sel.addRange(range);
      saveSelection();
    } else if (editorRef.current) {
      editorRef.current.appendChild(img);
    }
    handleInput();
    setShowGifPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    saveSelection();
    if (mode === 'chat' && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = () => {
    if (disabled || isSubmitting) return;
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML.trim();
    const text = editorRef.current.innerText.trim();
    const hasImg = !!editorRef.current.querySelector('img');

    if (text === '' && !hasImg) {
      toast.error('Message cannot be empty');
      return;
    }

    onSubmit(html);
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      setIsEmpty(true);
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative ${className}`}>
      {/* Overlay when disabled or disconnected */}
      {disabled && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex items-center justify-center p-4">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            {disabledReason || 'Composer is disabled'}
          </span>
        </div>
      )}

      {/* Canva-Style Formatting Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-1.5 flex flex-wrap items-center gap-1 text-slate-600 select-none">
        {/* Font Family Dropdown */}
        <select
          onChange={(e) => handleFontFamilyChange(e.target.value)}
          defaultValue=""
          className="h-7 text-xs bg-white border border-slate-200 rounded px-1.5 font-medium hover:border-slate-300 focus:outline-none cursor-pointer"
          title="Font Style"
        >
          <option value="">Font Family</option>
          <option value="sans-serif">Sans Serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
          <option value="cursive">Cursive</option>
          <option value="Impact, sans-serif">Display / Impact</option>
        </select>

        {/* Font Size Dropdown */}
        <select
          onChange={(e) => handleFontSizeChange(e.target.value)}
          defaultValue=""
          className="h-7 text-xs bg-white border border-slate-200 rounded px-1.5 font-medium hover:border-slate-300 focus:outline-none cursor-pointer"
          title="Font Size"
        >
          <option value="">Size</option>
          <option value="12px">Small (12px)</option>
          <option value="14px">Normal (14px)</option>
          <option value="16px">Medium (16px)</option>
          <option value="20px">Large (20px)</option>
          <option value="24px">Huge (24px)</option>
        </select>

        <div className="w-[1px] h-4 bg-slate-300 mx-0.5" />

        {/* Basic Formats */}
        <button
          type="button"
          onClick={() => execCmd('bold')}
          className="p-1 rounded hover:bg-slate-200 transition-colors font-bold text-xs"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('italic')}
          className="p-1 rounded hover:bg-slate-200 transition-colors italic text-xs"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('underline')}
          className="p-1 rounded hover:bg-slate-200 transition-colors underline text-xs"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('strikeThrough')}
          className="p-1 rounded hover:bg-slate-200 transition-colors line-through text-xs"
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-slate-300 mx-0.5" />

        {/* Text Color Picker Popover */}
        <Popover open={showTextColorPicker} onOpenChange={setShowTextColorPicker}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="p-1 rounded hover:bg-slate-200 transition-colors flex items-center gap-0.5 text-xs"
              title="Text Color"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="start" sideOffset={4} className="p-2 border border-slate-200 shadow-xl rounded-xl w-48 z-50 bg-white">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Text Color</div>
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {COMMON_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleTextColor(c)}
                  className="w-6 h-6 rounded-full border border-slate-200 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5 border-t border-slate-100 pt-1.5">
              <span className="text-[10px] text-slate-500 font-semibold">Custom:</span>
              <input
                type="color"
                onChange={(e) => handleTextColor(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* Highlight Color Picker Popover */}
        <Popover open={showHighlightPicker} onOpenChange={setShowHighlightPicker}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="p-1 rounded hover:bg-slate-200 transition-colors flex items-center gap-0.5 text-xs"
              title="Highlight Color"
            >
              <Highlighter className="w-3.5 h-3.5 text-amber-500" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="start" sideOffset={4} className="p-2 border border-slate-200 shadow-xl rounded-xl w-48 z-50 bg-white">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Background Highlight</div>
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              {HIGHLIGHT_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleHighlightColor(c)}
                  className="w-6 h-6 rounded border border-slate-200 hover:scale-110 transition-transform flex items-center justify-center text-[9px]"
                  style={{ backgroundColor: c === 'transparent' ? '#ffffff' : c }}
                >
                  {c === 'transparent' ? '✕' : ''}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 border-t border-slate-100 pt-1.5">
              <span className="text-[10px] text-slate-500 font-semibold">Custom:</span>
              <input
                type="color"
                onChange={(e) => handleHighlightColor(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
              />
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-[1px] h-4 bg-slate-300 mx-0.5" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => execCmd('justifyLeft')}
          className="p-1 rounded hover:bg-slate-200 transition-colors"
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('justifyCenter')}
          className="p-1 rounded hover:bg-slate-200 transition-colors"
          title="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('justifyRight')}
          className="p-1 rounded hover:bg-slate-200 transition-colors"
          title="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-slate-300 mx-0.5" />

        {/* Lists & Link */}
        <button
          type="button"
          onClick={() => execCmd('insertUnorderedList')}
          className="p-1 rounded hover:bg-slate-200 transition-colors"
          title="Bulleted List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('insertOrderedList')}
          className="p-1 rounded hover:bg-slate-200 transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleAddLink}
          className="p-1 rounded hover:bg-slate-200 transition-colors"
          title="Insert Link"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCmd('removeFormat')}
          className="p-1 rounded hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-700"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Contenteditable Text Area */}
      <div className="p-3 bg-white relative flex-1 cursor-text min-h-[80px]" onClick={() => editorRef.current?.focus()}>
        {isEmpty && (
          <div className="absolute top-3 left-3 text-slate-400 text-sm pointer-events-none select-none italic">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
          onBlur={saveSelection}
          className="outline-none text-slate-800 text-sm leading-relaxed max-w-none focus:outline-none min-h-[70px]"
          style={{ minHeight, maxHeight, overflowY: 'auto' }}
        />
      </div>

      {/* Bottom Actions Bar (Emoji, GIF, Send) */}
      <div className="flex items-center justify-between p-2 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center gap-1">
          {/* Emoji Picker Popover */}
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <button
                type="button"
                onClick={saveSelection}
                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-100 transition-colors shrink-0"
                title="Insert Emoji"
              >
                <Smile className="w-5 h-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" sideOffset={8} className="p-0 border border-slate-200 shadow-2xl rounded-2xl w-[330px] z-50 bg-white">
              <AxevoraEmojiPicker onEmojiClick={handleInsertEmoji} />
            </PopoverContent>
          </Popover>

          {/* GIF Picker Popover */}
          <Popover open={showGifPicker} onOpenChange={setShowGifPicker}>
            <PopoverTrigger asChild>
              <button
                type="button"
                onClick={saveSelection}
                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-100 transition-colors shrink-0 font-extrabold text-xs"
                title="Insert GIF"
              >
                GIF
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" sideOffset={8} className="p-0 border border-slate-200 shadow-2xl rounded-2xl w-[330px] z-50 bg-white">
              <AxevoraGifPicker onGifSelect={handleInsertGif} />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          type="button"
          onClick={handleFinalSubmit}
          disabled={isEmpty || disabled || isSubmitting}
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-1.5 px-4 shadow-md shadow-indigo-600/20 disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          {isSubmitting ? 'Sending...' : submitLabel || (mode === 'chat' ? 'Send' : 'Reply')}
        </Button>
      </div>
    </div>
  );
};
