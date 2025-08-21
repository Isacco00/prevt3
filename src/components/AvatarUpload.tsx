import { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Camera, Upload, RotateCcw, ZoomIn, ZoomOut, Move, Save, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarUpdate: (avatarUrl: string) => void;
  onClose: () => void;
}

export function AvatarUpload({ currentAvatarUrl, onAvatarUpdate, onClose }: AvatarUploadProps) {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Errore",
        description: "Seleziona un file immagine valido",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const generateCroppedImage = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      const image = imageRef.current;
      
      if (!canvas || !image || !selectedImage) {
        reject(new Error('Canvas or image not available'));
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Set canvas size to final avatar size
      const size = 300;
      canvas.width = size;
      canvas.height = size;

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Apply transformations
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);

      // Calculate image position to center it
      const imageWidth = image.naturalWidth;
      const imageHeight = image.naturalHeight;
      const aspectRatio = imageWidth / imageHeight;
      
      let drawWidth = size;
      let drawHeight = size;
      
      if (aspectRatio > 1) {
        drawHeight = size / aspectRatio;
      } else {
        drawWidth = size * aspectRatio;
      }

      ctx.drawImage(
        image,
        -drawWidth / 2 + position.x / scale,
        -drawHeight / 2 + position.y / scale,
        drawWidth,
        drawHeight
      );

      ctx.restore();

      // Create circular mask
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
      ctx.fill();

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate image blob'));
        }
      }, 'image/png');
    });
  }, [selectedImage, scale, position, rotation]);

  const handleUpload = async () => {
    if (!selectedImage || !user?.id) return;

    setIsUploading(true);
    
    try {
      const croppedImageBlob = await generateCroppedImage();
      
      // Delete old avatar if exists
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload new avatar
      const fileName = `avatar_${Date.now()}.png`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedImageBlob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      onAvatarUpdate(publicUrl);
      
      toast({
        title: "Successo",
        description: "Avatar aggiornato con successo",
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Errore",
        description: "Errore durante il caricamento dell'avatar",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetTransformations = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Aggiorna foto profilo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedImage ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Seleziona una nuova foto profilo
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Carica file
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Scatta foto
                </Button>
              </div>

              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              
              <Input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview Area */}
              <div className="relative">
                <div 
                  className="mx-auto w-80 h-80 border-2 border-dashed border-gray-300 rounded-full overflow-hidden bg-gray-50 relative cursor-move"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img
                    ref={imageRef}
                    src={selectedImage}
                    alt="Preview"
                    className="absolute"
                    style={{
                      transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                      transformOrigin: 'center center',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    draggable={false}
                  />
                </div>
                
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <ZoomIn className="h-4 w-4" />
                      Zoom: {scale.toFixed(1)}x
                    </Label>
                    <Slider
                      value={[scale]}
                      onValueChange={([value]) => setScale(value)}
                      min={0.5}
                      max={3}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Rotazione: {rotation}°
                    </Label>
                    <Slider
                      value={[rotation]}
                      onValueChange={([value]) => setRotation(value)}
                      min={-180}
                      max={180}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  <Move className="h-3 w-3 inline mr-1" />
                  Trascina l'immagine per riposizionarla
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={resetTransformations}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cambia foto
                  </Button>
                </div>
                
                <Button 
                  onClick={handleUpload} 
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>Caricamento...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salva avatar
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}