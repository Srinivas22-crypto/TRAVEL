import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Heart,
  Share2,
  Bookmark,
  ExternalLink,
  Copy,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';

interface ActionButtonsProps {
  itemId?: number | string;
  itemTitle?: string;
  itemUrl?: string;
  showFavorites?: boolean;
  showShare?: boolean;
  showBookmark?: boolean;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  itemId,
  itemTitle = 'Amazing Destination',
  itemUrl,
  showFavorites = true,
  showShare = true,
  showBookmark = false,
  className = '',
  size = 'default',
  variant = 'outline'
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const currentUrl = itemUrl || window.location.href;

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    
    const favorites = JSON.parse(localStorage.getItem('travel_favorites') || '[]');
    
    if (!isFavorited) {
      favorites.push({
        id: itemId,
        title: itemTitle,
        url: currentUrl,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem('travel_favorites', JSON.stringify(favorites));
      
      toast({
        title: t("favourites.addedTitle"),
        description: t("favourites.addedDescription", { itemTitle }),
        duration: 3000,
      });
    } else {
      const updatedFavorites = favorites.filter((fav: any) => fav.id !== itemId);
      localStorage.setItem('travel_favorites', JSON.stringify(updatedFavorites));
      
      toast({
        title: t("favourites.removedTitle"),
        description: t("favourites.removedDescription", { itemTitle }),
        duration: 3000,
      });
    }
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    
    toast({
      title: isBookmarked ? t("bookmark.removedTitle") : t("bookmark.addedTitle"),
      description: isBookmarked 
        ? t("bookmark.removedDescription")
        : t("bookmark.addedDescription"),
      duration: 2000,
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast({
        title: t("share.linkCopiedTitle"),
        description: t("share.linkCopiedDescription"),
        duration: 2000,
      });
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: t("share.linkCopiedTitle"),
        description: t("share.linkCopiedDescription"),
        duration: 2000,
      });
    }
  };

  const shareToSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(itemTitle);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'instagram':
        copyToClipboard();
        toast({
          title: t("share.instagramTitle"),
          description: t("share.instagramDescription"),
          duration: 3000,
        });
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    toast({
      title: t("share.sharedTitle"),
      description: t("share.sharedDescription", { platform }),
      duration: 2000,
    });
  };

  React.useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('travel_favorites') || '[]');
    const isFav = favorites.some((fav: any) => fav.id === itemId);
    setIsFavorited(isFav);
  }, [itemId]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showFavorites && (
        <Button
          variant={variant}
          size={size}
          onClick={handleFavoriteToggle}
          className={`transition-all duration-200 ${
            isFavorited 
              ? 'text-red-500 border-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900' 
              : 'hover:text-red-500 hover:border-red-500'
          }`}
        >
          <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
          {isFavorited ? t("favourites.favourited") : t("favourites.add")}
        </Button>
      )}

      {showShare && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={variant}
              size={size}
              className="hover:text-blue-500 hover:border-blue-500 transition-colors"
            >
              <Share2 className="h-4 w-4 mr-2" />
              {t("share.shareButton")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              {t("share.copyLink")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => shareToSocial('facebook')}>
              <Facebook className="h-4 w-4 mr-2" />
              {t("share.facebook")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => shareToSocial('twitter')}>
              <Twitter className="h-4 w-4 mr-2" />
              {t("share.twitter")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => shareToSocial('instagram')}>
              <Instagram className="h-4 w-4 mr-2" />
              {t("share.instagram")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.open(currentUrl, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              {t("share.openInNewTab")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {showBookmark && (
        <Button
          variant={variant}
          size={size}
          onClick={handleBookmarkToggle}
          className={`transition-all duration-200 ${
            isBookmarked 
              ? 'text-yellow-500 border-yellow-500 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-950 dark:hover:bg-yellow-900' 
              : 'hover:text-yellow-500 hover:border-yellow-500'
          }`}
        >
          <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
          {isBookmarked ? t("bookmark.bookmarked") : t("bookmark.add")}
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
