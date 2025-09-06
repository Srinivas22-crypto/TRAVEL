import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LocationCardMenu = () => {
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
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:!bg-gray-700 focus:!bg-gray-700 p-2">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocationCardMenu;
