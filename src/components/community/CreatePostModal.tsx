import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ImagePlus, X, UploadCloud } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';

interface CreatePostModalProps {
  boardName: string;
  onClose: () => void;
  onSubmit: (title: string, content: string, url: string, imageObjectKey: string | null) => Promise<void>;
  submitting: boolean;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ boardName, onClose, onSubmit, submitting }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [rulesAgreed, setRulesAgreed] = useState(false);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageObjectKey, setImageObjectKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'].includes(file.type)) {
      toast.error("Unsupported file type. Use JPG, PNG, WEBP, AVIF or GIF.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large. Maximum size is 5MB.");
      return;
    }

    try {
      let finalFile = file;
      if (file.type !== 'image/gif') {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };
        finalFile = await imageCompression(file, options);
      }
      setImageFile(finalFile);
      setImagePreview(URL.createObjectURL(finalFile));
    } catch (error) {
      console.error("Compression error:", error);
      toast.error("Failed to process image.");
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageObjectKey(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadImageToR2 = async (): Promise<string | null> => {
    if (!imageFile) return null;
    if (imageObjectKey) return imageObjectKey; // Already uploaded

    setUploadingImage(true);
    try {
      // Get presigned URL
      const authRes = await fetch('/api/community/posts/upload-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: imageFile.name, contentType: imageFile.type })
      });
      const authData = await authRes.json();
      
      if (!authRes.ok || !authData.uploadUrl) {
        throw new Error(authData.error || 'Failed to get upload authorization');
      }

      // Upload directly to R2
      const uploadRes = await fetch(authData.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': imageFile.type },
        body: imageFile
      });

      if (!uploadRes.ok) {
        throw new Error('Upload to storage failed');
      }

      setImageObjectKey(authData.objectKey);
      return authData.objectKey;
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
       toast.error("Title and Content are required.");
       return;
    }
    if (!rulesAgreed) {
       toast.error("You must agree to the rules.");
       return;
    }

    let uploadedKey = imageObjectKey;
    if (imageFile && !imageObjectKey) {
       uploadedKey = await uploadImageToR2();
       if (!uploadedKey) return; // Upload failed, stop submit
    }

    await onSubmit(newTitle, newContent, newUrl, uploadedKey);
  };

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-border/80 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Create Post in {boardName}</CardTitle>
          <CardDescription className="text-xs">
            Submit links, media, or general posts. Follow the rules to avoid post removal.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="post-title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</Label>
              <Input 
                id="post-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter post title (5-100 characters)"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Content Details</Label>
              <div className="bg-background rounded-md border border-input [&_.ql-container]:min-h-[150px] [&_.ql-editor]:text-sm [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:bg-muted/50 [&_.ql-toolbar]:rounded-t-md">
                <ReactQuill 
                  theme="snow"
                  value={newContent}
                  onChange={setNewContent}
                  modules={quillModules}
                  placeholder="Provide detailed description of your post..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Image Attachment</Label>
                 <div className="flex flex-col gap-2">
                   {!imagePreview ? (
                     <div 
                       onClick={() => fileInputRef.current?.click()}
                       className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all text-center"
                     >
                       <ImagePlus className="w-8 h-8 text-muted-foreground/50" />
                       <p className="text-xs text-muted-foreground font-medium">Click to upload image</p>
                       <p className="text-[10px] text-muted-foreground/70">JPG, PNG, GIF up to 5MB</p>
                     </div>
                   ) : (
                     <div className="relative group rounded-lg overflow-hidden border border-border">
                       <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         <Button type="button" size="sm" variant="destructive" onClick={removeImage} className="h-8 rounded-full">
                           <X className="w-4 h-4 mr-1" /> Remove
                         </Button>
                       </div>
                       {uploadingImage && (
                         <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-2">
                           <UploadCloud className="w-6 h-6 animate-bounce text-primary" />
                           <span className="text-xs font-bold animate-pulse">Uploading direct to R2...</span>
                         </div>
                       )}
                     </div>
                   )}
                   <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                 </div>
               </div>
               
               <div className="space-y-1.5">
                 <Label htmlFor="post-url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                   YouTube / External URL <span className="text-[10px] font-normal text-muted-foreground">(Optional)</span>
                 </Label>
                 <Input 
                   id="post-url"
                   value={newUrl}
                   onChange={(e) => setNewUrl(e.target.value)}
                   placeholder="e.g. https://youtube.com/..."
                   type="url"
                 />
                 <p className="text-[9px] text-muted-foreground">Links will be embedded automatically if supported.</p>
               </div>
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <input 
                type="checkbox" 
                id="agree-rules" 
                checked={rulesAgreed}
                onChange={(e) => setRulesAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="agree-rules" className="text-xs text-muted-foreground cursor-pointer select-none leading-relaxed">
                I agree to the Board Guidelines and confirm that my link/content does not violate general platform rules.
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2.5">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting || uploadingImage}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || uploadingImage} className="font-semibold">
              {uploadingImage ? 'Uploading...' : submitting ? 'Submitting...' : 'Submit Post'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
