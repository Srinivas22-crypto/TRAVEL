import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Camera, MapPin, Hash, X, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import communityService from '@/services/communityService';

interface ShareStoryModalProps {
  children: React.ReactNode;
  onPostCreated?: () => void;
}

export const ShareStoryModal = ({ children, onPostCreated }: ShareStoryModalProps) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{content?: string; images?: string}>({});
  
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!content.trim()) {
      newErrors.content = 'Please share your story content';
    } else if (content.trim().length < 10) {
      newErrors.content = 'Story content must be at least 10 characters';
    } else if (content.trim().length > 2000) {
      newErrors.content = 'Story content must be less than 2000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, you would upload these to a cloud service
      // For now, we'll create object URLs for preview
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages].slice(0, 4)); // Max 4 images
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setImages(images.filter(img => img !== imageToRemove));
    URL.revokeObjectURL(imageToRemove); // Clean up object URL
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to share your story.",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      console.log('📝 Creating new post:', {
        content: content.trim(),
        location: location.trim(),
        tags,
        imageCount: images.length,
        author: user?.name
      });

      const postData = {
        content: content.trim(),
        location: location.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        images: images.length > 0 ? images : undefined,
      };

      await communityService.createPost(postData);

      console.log('✅ Post created successfully');

      toast({
        title: "Story Shared!",
        description: "Your travel story has been shared with the community.",
      });

      // Reset form
      setContent('');
      setLocation('');
      setTags([]);
      setTagInput('');
      setImages([]);
      setOpen(false);

      // Notify parent component
      onPostCreated?.();

    } catch (error: any) {
      console.error('❌ Failed to create post:', error.message);
      
      toast({
        title: "Failed to Share Story",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Clean up any object URLs
    images.forEach(img => URL.revokeObjectURL(img));
    setImages([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Travel Story</DialogTitle>
          <DialogDescription>
            Share your amazing travel experiences with the community
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Your Story *</Label>
            <Textarea
              id="content"
              placeholder="Tell us about your amazing travel experience..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`min-h-[120px] ${errors.content ? "border-red-500" : ""}`}
              maxLength={2000}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{errors.content && <span className="text-red-500">{errors.content}</span>}</span>
              <span>{content.length}/2000</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Where did this happen?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="tags"
                placeholder="Add tags (press Enter or comma to add)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    #{tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Images (Max 4)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('images')?.click()}
                disabled={images.length >= 4}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Images
              </Button>
              <span className="text-sm text-muted-foreground">
                {images.length}/4 images
              </span>
            </div>
            
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => handleRemoveImage(image)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sharing..." : "Share Story"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
