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
import {
  MoreVertical,
  Heart,
  Share2,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FC } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface LocationCardMenuProps {
  url: string;
  title?: string;
  onFavorite?: () => void;
}

const LocationCardMenu: FC<LocationCardMenuProps> = ({
  url,
  title = "Check out this amazing destination!",
  onFavorite,
}) => {
  const { t } = useTranslation();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success(t('locationCard.linkCopied'));
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      '_blank'
    );
  };

  const handleShareInstagram = () => {
    toast.info(t('locationCard.instagramNotSupported'));
  };

  const handleOpenInNewTab = () => {
    window.open(url, '_blank');
  };

  const handleFavorite = () => {
    if (onFavorite) onFavorite();
    toast.success(t('locationCard.addedToFavorites'));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors duration-200"
          aria-label={t('locationCard.menu')}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="bg-gray-900 text-white border-gray-700 rounded-lg shadow-lg w-48"
        align="end"
      >
        <DropdownMenuItem
          onClick={handleFavorite}
          className="flex items-center gap-2 p-2 hover:bg-gray-700 focus:bg-gray-700 rounded-md cursor-pointer transition"
        >
          <Heart className="h-4 w-4" />
          <span>{t('locationCard.addToFavorites')}</span>
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2 p-2 hover:bg-gray-700 focus:bg-gray-700 rounded-md cursor-pointer transition">
            <Share2 className="h-4 w-4" />
            <span>{t('locationCard.share')}</span>
          </DropdownMenuSubTrigger>

          <DropdownMenuPortal>
            <DropdownMenuSubContent className="bg-gray-900 text-white border-gray-700 rounded-lg shadow-lg w-48">
              <DropdownMenuItem
                onClick={handleCopyLink}
                className="flex items-center gap-2 p-2 hover:bg-gray-700 focus:bg-gray-700 rounded-md cursor-pointer transition"
              >
                <Copy className="h-4 w-4" />
                <span>{t('locationCard.copyLink')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleShareFacebook}
                className="flex items-center gap-2 p-2 hover:bg-gray-700 focus:bg-gray-700 rounded-md cursor-pointer transition"
              >
                <Facebook className="h-4 w-4" />
                <span>{t('locationCard.facebook')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleShareTwitter}
                className="flex items-center gap-2 p-2 hover:bg-gray-700 focus:bg-gray-700 rounded-md cursor-pointer transition"
              >
                <Twitter className="h-4 w-4" />
                <span>{t('locationCard.twitter')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleShareInstagram}
                className="flex items-center gap-2 p-2 hover:bg-gray-700 focus:bg-gray-700 rounded-md cursor-pointer transition"
              >
                <Instagram className="h-4 w-4" />
                <span>{t('locationCard.instagram')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleOpenInNewTab}
                className="flex items-center gap-2 p-2 hover:bg-gray-700 focus:bg-gray-700 rounded-md cursor-pointer transition"
              >
                <ExternalLink className="h-4 w-4" />
                <span>{t('locationCard.openInNewTab')}</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocationCardMenu;
