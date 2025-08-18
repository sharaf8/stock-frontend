import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Camera, X, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AvatarUploadProps {
  currentAvatar?: string;
  userName: string;
  onAvatarUpdate: (avatarUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function AvatarUpload({ 
  currentAvatar, 
  userName, 
  onAvatarUpdate,
  size = 'md' 
}: AvatarUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-20 w-20', 
    lg: 'h-32 w-32'
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (JPG, PNG, GIF, etc.)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!previewUrl) return;

    setUploading(true);
    
    try {
      // Simulate upload delay - in real app, this would upload to a server/cloud storage
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, use the preview URL as the final avatar URL
      onAvatarUpdate(previewUrl);
      
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated successfully',
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload avatar. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setPreviewUrl(null);
    onAvatarUpdate('');
    setIsDialogOpen(false);
    
    toast({
      title: 'Avatar removed',
      description: 'Your profile picture has been removed',
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={currentAvatar} alt={userName} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {getInitials(userName)}
        </AvatarFallback>
      </Avatar>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Camera className="h-4 w-4 mr-2" />
            Change Avatar
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>
              Upload a new avatar or remove your current one
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current/Preview Avatar */}
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={previewUrl || currentAvatar} alt={userName} />
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Upload Options */}
            <div className="space-y-3">
              <Button
                onClick={triggerFileInput}
                variant="outline"
                className="w-full"
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {currentAvatar && (
                <Button
                  onClick={handleRemoveAvatar}
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700"
                  disabled={uploading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove Avatar
                </Button>
              )}
            </div>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <p>• Use a clear, professional photo</p>
                <p>• Square images work best (1:1 ratio)</p>
                <p>• Maximum file size: 5MB</p>
                <p>• Supported formats: JPG, PNG, GIF</p>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!previewUrl || uploading || previewUrl === currentAvatar}
            >
              {uploading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current mr-2" />
                  Uploading...
                </>
              ) : (
                'Update Avatar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
