import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  Camera,
  MapPin,
  Hash,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CreatePostModalProps {
  children: React.ReactNode;
  onPostCreated?: (post: any) => void;
  userAvatar?: string;
  userName?: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  children,
  onPostCreated,
  userAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  userName = "You"
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: t("createPost.errors.contentRequiredTitle"),
        description: t("createPost.errors.contentRequiredDesc"),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newPost = {
        id: Date.now(),
        author: {
          name: userName,
          avatar: userAvatar,
          username: `@${userName.toLowerCase().replace(/\s+/g, '')}`
        },
        content: content.trim(),
        image: imagePreview || undefined,
        location: location.trim() || t("createPost.unknownLocation"),
        timestamp: t("createPost.justNow"),
        likes: 0,
        comments: 0,
        shares: 0,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };

      onPostCreated?.(newPost);

      // Reset form
      setContent('');
      setLocation('');
      setTags('');
      setSelectedImage(null);
      setImagePreview('');
      setIsOpen(false);

      toast({
        title: t("createPost.success.title"),
        description: t("createPost.success.description"),
      });

    } catch (error) {
      toast({
        title: t("createPost.errors.failedTitle"),
        description: t("createPost.errors.failedDesc"),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {t("createPost.title")}
          </DialogTitle>
          <DialogDescription>
            {t("createPost.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{userName}</p>
              <p className="text-sm text-muted-foreground">{t("createPost.sharingToCommunity")}</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">{t("createPost.storyLabel")}</Label>
            <Textarea
              id="content"
              placeholder={t("createPost.storyPlaceholder")}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={500}
            />
            <div className="text-right text-xs text-muted-foreground">
              {content.length}/500
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>{t("createPost.addPhoto")}</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <Upload className="h-4 w-4" />
                    {t("createPost.uploadImage")}
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {t("createPost.fileInfo")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {t("createPost.location")}
            </Label>
            <Input
              id="location"
              placeholder={t("createPost.locationPlaceholder")}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              {t("createPost.tags")}
            </Label>
            <Input
              id="tags"
              placeholder={t("createPost.tagsPlaceholder")}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {t("createPost.tagsInfo")}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t("createPost.cancel")}
            </Button>
            <Button
              type="submit"
              className="bg-gradient-hero hover:opacity-90"
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? t("createPost.sharing") : t("createPost.share")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
