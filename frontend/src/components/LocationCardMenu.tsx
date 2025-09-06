import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Heart, Share2, Copy, Facebook, Twitter, Instagram, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FC } from 'react';
import { toast } from 'sonner';

interface LocationCardMenuProps {
  url: string;
  title?: string;
}

const LocationCardMenu: FC<LocationCardMenuProps> = ({ url, title = "Check out this amazing destination!" }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  const handleShareFacebook = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookShareUrl, "_blank");
  };

  const handleShareTwitter = () => {
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterShareUrl, "_blank");
  };

  const handleShareInstagram = () => {
    toast.info("Sharing on Instagram is not supported via web.");
  };

  const handleOpenInNewTab = () => {
    window.open(url, "_blank");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white hover:text-white transition-colors duration-200"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-gray-900 text-white border-gray-700 rounded-lg shadow-lg w-48"
        align="end"
      >
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:!bg-gray-700 focus:!bg-gray-700 p-2">
          <Heart className="h-4 w-4" />
          <span>Add to Favourites</span>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer hover:!bg-gray-700 focus:!bg-gray-700 p-2">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="bg-gray-900 text-white border-gray-700 rounded-lg shadow-lg w-48">
              <DropdownMenuItem onClick={handleCopyLink} className="flex items-center gap-2 cursor-pointer hover:!bg-gray-700 focus:!bg-gray-700 p-2">
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Link</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareFacebook} className="flex items-center gap-2 cursor-pointer hover:!bg-gray-700 focus:!bg-gray-700 p-2">
                <Facebook className="mr-2 h-4 w-4" />
                <span>Share on Facebook</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareTwitter} className="flex items-center gap-2 cursor-pointer hover:!bg-gray-700 focus:!bg-gray-700 p-2">
                <Twitter className="mr-2 h-4 w-4" />
                <span>Share on Twitter</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareInstagram} className="flex items-center gap-2 cursor-pointer hover:!bg-gray-700 focus:!bg-gray-700 p-2">
                <Instagram className="mr-2 h-4 w-4" />
                <span>Share on Instagram</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenInNewTab} className="flex items-center gap-2 cursor-pointer hover:!bg-gray-700 focus:!bg-gray-700 p-2">
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>Open in New Tab</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocationCardMenu;
