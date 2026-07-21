'use client';
import { useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Upload, X, Crop, Check, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

// ── Canvas crop helper ─────────────────────────────────────────────────────
async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas empty'))), 'image/jpeg', 0.95)
  );
}

// ── Props ──────────────────────────────────────────────────────────────────
interface Props {
  /** Called with the absolute URL of the uploaded image */
  onUploadSuccess: (url: string) => void;
  /** Current image URL to preview */
  currentImage?: string;
  /** Whether to enable cropping (default: false = direct upload) */
  enableCrop?: boolean;
  /** Aspect ratio for cropper (default 16/9) */
  aspectRatio?: number;
  /** Label shown on the button */
  label?: string;
}

// ── Component ──────────────────────────────────────────────────────────────
export default function ImageUploader({
  onUploadSuccess,
  currentImage,
  enableCrop = false,
  aspectRatio = 16 / 9,
  label = 'Upload Image',
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Resolve image URL for display
  const displayUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  // ── Upload a Blob/File to backend ───────────────────────────────────────
  const uploadBlob = async (blob: Blob, filename: string): Promise<string> => {
    const token = (window as any).__accessToken || '';
    const form = new FormData();
    form.append('file', blob, filename);

    const res = await fetch(`${API}/media/upload`, {
      method: 'POST',
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Upload failed');
    }
    const data = await res.json();
    return data.data?.url as string;
  };

  // ── File selected ────────────────────────────────────────────────────────
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const objectUrl = URL.createObjectURL(file);

    if (enableCrop) {
      setPreview(objectUrl);
      setIsCropping(true);
    } else {
      // Direct upload — no crop
      setUploading(true);
      try {
        const url = await uploadBlob(file, file.name);
        onUploadSuccess(url);
        toast.success('Image uploaded!');
      } catch (err: any) {
        toast.error(err.message || 'Upload failed');
      } finally {
        setUploading(false);
      }
    }
  };

  // ── Crop complete ────────────────────────────────────────────────────────
  const onCropComplete = useCallback((_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSaveCrop = async () => {
    if (!preview || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const blob = await getCroppedImg(preview, croppedAreaPixels);
      const url = await uploadBlob(blob, `cropped-${Date.now()}.jpg`);
      onUploadSuccess(url);
      toast.success('Image uploaded!');
      setIsCropping(false);
      setPreview(null);
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      {/* Current image preview */}
      {currentImage && !isCropping && (
        <div className="relative rounded-lg overflow-hidden border border-border bg-black/30 w-full max-w-sm">
          <img
            src={displayUrl(currentImage) || ''}
            alt="Current"
            className="w-full h-auto object-cover max-h-48"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}

      {/* Upload button */}
      {!isCropping && (
        <div className="flex items-center gap-3">
          <input type="file" accept="image/*" ref={fileRef} onChange={onFileChange} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded text-sm text-text hover:bg-surface/80 hover:border-accent transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <RefreshCw className="w-4 h-4 text-accent animate-spin" />
            ) : (
              <Upload className="w-4 h-4 text-accent" />
            )}
            {uploading ? 'Uploading...' : (currentImage ? 'Replace Image' : label)}
          </button>
          {enableCrop && <span className="text-xs text-text-muted">Crop will be applied after selection</span>}
        </div>
      )}

      {/* Crop modal */}
      {isCropping && preview && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Crop className="w-4 h-4 text-accent" /> Crop Image
              </h3>
              <button onClick={() => { setIsCropping(false); setPreview(null); }} className="p-1 text-text-muted hover:text-white rounded transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full bg-black" style={{ height: 380 }}>
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="px-5 py-4 border-t border-border flex items-center justify-between bg-background/40">
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted">Zoom</span>
                <input
                  type="range" value={zoom} min={1} max={3} step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-32 accent-accent"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setIsCropping(false); setPreview(null); }} className="px-4 py-2 text-sm text-text hover:bg-surface rounded transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveCrop} disabled={uploading} className="flex items-center gap-2 px-5 py-2 bg-accent text-white rounded text-sm font-bold hover:bg-accent/90 transition-colors disabled:opacity-50">
                  <Check className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Save & Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
