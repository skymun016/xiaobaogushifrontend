import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Camera, X, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PhotoUploadProps {
  folder: string; // e.g. "shipping/order-123" or "receive/order-123"
  photos: string[];
  onChange: (urls: string[]) => void;
  maxPhotos?: number;
  className?: string;
}

export function PhotoUpload({ folder, photos, onChange, maxPhotos = 5, className }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = maxPhotos - photos.length;
    if (remaining <= 0) {
      toast.error(`最多上传 ${maxPhotos} 张照片`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remaining);
    setUploading(true);

    try {
      const newUrls: string[] = [];
      for (const file of filesToUpload) {
        const ext = file.name.split('.').pop() || 'jpg';
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const { error } = await supabase.storage
          .from('order-photos')
          .upload(fileName, file, { contentType: file.type });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('order-photos')
          .getPublicUrl(fileName);

        newUrls.push(urlData.publicUrl);
      }
      onChange([...photos, ...newUrls]);
      toast.success(`已上传 ${newUrls.length} 张照片`);
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error('上传失败：' + (err.message || '未知错误'));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {photos.map((url, i) => (
        <div key={i} className="relative group w-20 h-20">
          <img src={url} alt={`照片${i + 1}`} className="w-full h-full rounded-lg object-cover border" />
          <button
            type="button"
            onClick={() => handleRemove(i)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      {photos.length < maxPhotos && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span className="text-[10px]">上传</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  );
}
