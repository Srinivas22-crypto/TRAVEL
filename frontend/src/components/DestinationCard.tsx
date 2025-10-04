import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Users, Plane } from 'lucide-react';

interface DestinationCardProps {
  destination: {
    id: number;
    name: string;
    englishName?: string;
    image: string;
    rating: number;
    reviews: number;
    description: string;
    category: string;
    price: number;
  };
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleDestinationClick = () => {
    const nameForSlug = destination.englishName || destination.name;
    const slug = nameForSlug.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    const routeSegment = i18n.t('routes.destinations');
    navigate(`/${i18n.language || 'en'}/${routeSegment}/${destination.id}-${slug}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Image Section */}
      <div
        className="aspect-video overflow-hidden relative cursor-pointer"
        onClick={handleDestinationClick}
      >
        <img
          src={destination.image}
          alt={t(`destinations.${destination.id}.name`, { defaultValue: destination.name })}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <CardContent className="p-4 flex flex-col h-full">
        {/* Title + Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3
            className="font-semibold text-lg group-hover:text-primary transition-colors cursor-pointer"
            onClick={handleDestinationClick}
          >
            {t(`destinations.${destination.id}.name`, { defaultValue: destination.name })}
          </h3>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            {destination.rating}
          </Badge>
        </div>

        {/* Description */}
        <p
          className="text-sm text-muted-foreground mb-4 cursor-pointer"
          onClick={handleDestinationClick}
        >
          {t(`destinations.${destination.id}.description`, { defaultValue: destination.description })}
        </p>

        {/* Reviews + Category */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {destination.reviews} {t('explore.reviews')}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="capitalize">
                {t(`categories.${destination.category}`, { defaultValue: destination.category })}
              </span>
            </span>
          </div>
        </div>

        {/* Price + Book Button */}
        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">${destination.price}</span>
              <span className="text-sm text-muted-foreground">{t('explore.perPerson')}</span>
            </div>
            <Button
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white transition-colors py-5 sm:py-2 text-sm sm:text-base flex items-center justify-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/book', { state: { destination } });
              }}
            >
              <Plane className="h-4 w-4" />
              {t('explore.bookNow')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
