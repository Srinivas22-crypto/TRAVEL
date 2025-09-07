import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import DestinationShareMenu from './DestinationShareMenu';

interface DestinationActionsProps {
  destinationId: number;
  destinationName: string;
}

const DestinationActions: React.FC<DestinationActionsProps> = ({ destinationId, destinationName }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const url = `${window.location.origin}/destination/${destinationName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()}`;

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFavorite}
        className="text-white bg-black bg-opacity-50 hover:bg-opacity-75"
      >
        <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
      </Button>
      <DestinationShareMenu
        url={url}
        title={destinationName}
      />
    </div>
  );
};

export default DestinationActions;
