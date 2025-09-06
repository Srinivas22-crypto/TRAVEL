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
  ExternalLink,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";

interface ShareMenuProps {
  url: string;
  title?: string;
}

const ShareMenu: FC<ShareMenuProps> = ({ url, title = "" }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
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
    // Instagram does not support direct web sharing with pre-filled content.
    // A common approach is to show a modal with instructions.
    toast.info("Sharing on Instagram is not supported via web.");
  };

  const handleOpenInNewTab = () => {
    window.open(url, "_blank");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy Link</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareFacebook}>
          <Facebook className="mr-2 h-4 w-4" />
          <span>Share on Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareTwitter}>
          <Twitter className="mr-2 h-4 w-4" />
          <span>Share on Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareInstagram}>
          <Instagram className="mr-2 h-4 w-4" />
          <span>Share on Instagram</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOpenInNewTab}>
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>Open in New Tab</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareMenu;
