import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { AxevoraEmojiPicker } from './AxevoraEmojiPicker';
import { AxevoraGifPicker } from './AxevoraGifPicker';
import { Smile, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CommentComposerProps {
  postId: string;
  onCommentAdded: (comment: any) => void;
}

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ],
};

const formats = [
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link'
];

export const CommentComposer: React.FC<CommentComposerProps> = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const { user } = useAuth();
  const quillRef = React.useRef<ReactQuill>(null);

  const handleSubmit = async () => {
    if (!content.trim() || content === '<p><br></p>') {
      toast.error('Reply cannot be empty');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to reply');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post reply');
      }

      const data = await res.json();
      toast.success('Reply posted successfully!');
      setContent('');
      onCommentAdded(data.comment);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEmojiClick = (emojiData: any) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection();
      const position = range ? range.index : editor.getLength();
      editor.insertText(position, emojiData.emoji);
      editor.setSelection(position + emojiData.emoji.length, 0);
    }
    setShowEmojiPicker(false);
  };

  const onGifClick = (gifUrl: string) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection();
      const position = range ? range.index : editor.getLength();
      editor.insertEmbed(position, 'image', gifUrl);
      editor.setSelection(position + 1, 0);
    }
    setShowGifPicker(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6 flex flex-col">
      <div className="p-3 border-b border-slate-100 bg-slate-50">
        <h3 className="text-sm font-bold text-slate-700">Write a Reply</h3>
      </div>
      <div className="p-0">
        <ReactQuill 
          ref={quillRef}
          theme="snow" 
          value={content} 
          onChange={setContent} 
          modules={modules}
          formats={formats}
          className="comment-quill-editor"
          placeholder="Share your thoughts..."
        />
      </div>
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center relative">
        <div className="flex gap-2">
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <button 
                onClick={() => { setShowGifPicker(false); }}
                className="text-slate-500 hover:text-indigo-600 transition-colors p-1.5 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                type="button"
                title="Add Emoji"
              >
                <Smile className="h-5 w-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-auto p-0 border-none shadow-none bg-transparent" sideOffset={10}>
              <AxevoraEmojiPicker onEmojiClick={onEmojiClick} />
            </PopoverContent>
          </Popover>
          
          <Popover open={showGifPicker} onOpenChange={setShowGifPicker}>
            <PopoverTrigger asChild>
              <button 
                onClick={() => { setShowEmojiPicker(false); }}
                className="text-slate-500 hover:text-indigo-600 transition-colors p-1.5 rounded-md hover:bg-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                type="button"
                title="Add GIF"
              >
                GIF
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-auto p-0 border-border bg-white rounded-xl shadow-xl overflow-hidden" sideOffset={10}>
              <AxevoraGifPicker onGifSelect={onGifClick} />
            </PopoverContent>
          </Popover>
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          size="sm"
          className="gap-1.5 font-semibold"
        >
          {isSubmitting ? 'Posting...' : <><Send className="h-3.5 w-3.5"/> Reply</>}
        </Button>
      </div>
      <style>{`
        .comment-quill-editor .ql-container {
          border: none !important;
          font-family: inherit;
          font-size: 14px;
          min-height: 100px;
        }
        .comment-quill-editor .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #e2e8f0 !important;
          background: #f8fafc;
        }
      `}</style>
    </div>
  );
};
