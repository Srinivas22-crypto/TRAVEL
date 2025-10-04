import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Copy,  
  Facebook,
  Twitter,
  Instagram,
  Share2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface DestinationShareMenuProps {
  url: string;
  title?: string;
}

const DestinationShareMenu: FC<DestinationShareMenuProps> = ({ url, title = "" }) => {
  const { t } = useTranslation();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success(t("destinationShare.linkCopied"));
  };

  const handleShareFacebook = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(facebookShareUrl, "_blank");
  };

  const handleShareTwitter = () => {
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`;
    window.open(twitterShareUrl, "_blank");
  };

  const handleShareInstagram = () => {
    toast.info(t("destinationShare.instagramNotSupported"));
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
          className="text-white bg-black bg-opacity-50 hover:bg-opacity-75"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="mr-2 h-4 w-4" />
          <span>{t("destinationShare.copyLink")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareFacebook}>
          <Facebook className="mr-2 h-4 w-4" />
          <span>{t("destinationShare.shareFacebook")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareTwitter}>
          <Twitter className="mr-2 h-4 w-4" />
          <span>{t("destinationShare.shareTwitter")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareInstagram}>
          <Instagram className="mr-2 h-4 w-4" />
          <span>{t("destinationShare.shareInstagram")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOpenInNewTab}>
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>{t("destinationShare.openNewTab")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DestinationShareMenu;
