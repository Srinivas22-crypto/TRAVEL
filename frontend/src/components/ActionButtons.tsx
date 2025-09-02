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

  // Get current page URL if not provided
  const currentUrl = itemUrl || window.location.href;

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    
    // Store in localStorage for persistence
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
        title: "❤️ Added to Favourites",
        description: `${itemTitle} has been added to your favourites`,
        duration: 3000,
      });
    } else {
      const updatedFavorites = favorites.filter((fav: any) => fav.id !== itemId);
      localStorage.setItem('travel_favorites', JSON.stringify(updatedFavorites));
      
      toast({
        title: "💔 Removed from Favourites",
        description: `${itemTitle} has been removed from your favourites`,
        duration: 3000,
      });
    }
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    
    toast({
      title: isBookmarked ? "Bookmark Removed" : "Bookmarked!",
      description: isBookmarked 
        ? "Removed from your bookmarks" 
        : "Saved to your bookmarks",
      duration: 2000,
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast({
        title: "🔗 Link copied!",
        description: "The link has been copied to your clipboard",
        duration: 2000,
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "🔗 Link copied!",
        description: "The link has been copied to your clipboard",
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
        // Instagram doesn't support direct URL sharing, so we'll copy the link
        copyToClipboard();
        toast({
          title: "Instagram Sharing",
          description: "Link copied! You can paste it in your Instagram story or bio",
          duration: 3000,
        });
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    toast({
      title: "Shared!",
      description: `Shared to ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
      duration: 2000,
    });
  };

  // Check localStorage on component mount
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
          {isFavorited ? 'Favourited' : 'Add to Favourites'}
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
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => shareToSocial('facebook')}>
              <Facebook className="h-4 w-4 mr-2" />
              Share on Facebook
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => shareToSocial('twitter')}>
              <Twitter className="h-4 w-4 mr-2" />
              Share on Twitter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => shareToSocial('instagram')}>
              <Instagram className="h-4 w-4 mr-2" />
              Share on Instagram
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.open(currentUrl, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
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
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;