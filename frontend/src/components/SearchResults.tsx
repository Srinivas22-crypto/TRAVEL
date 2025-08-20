import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Calendar, 
  Plane, 
  Building2, 
  Users, 
  Clock,
  Star,
  ExternalLink
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'destination' | 'hotel' | 'flight' | 'route' | 'community';
  title: string;
  description: string;
  location?: string;
  price?: string;
  rating?: number;
  image?: string;
  tags?: string[];
}

interface SearchResultsProps {
  query: string;
  onClose: () => void;
}

export const SearchResults = ({ query, onClose }: SearchResultsProps) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock search data
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'destination',
      title: 'Paris, France',
      description: 'The City of Light with iconic landmarks and rich culture',
      location: 'Europe',
      rating: 4.8,
      tags: ['Popular', 'Historical', 'Romance']
    },
    {
      id: '2',
      type: 'hotel',
      title: 'Grand Hotel Paris',
      description: 'Luxury hotel in the heart of Paris',
      location: 'Paris, France',
      price: '$299/night',
      rating: 4.5,
      tags: ['5 Star', 'City Center']
    },
    {
      id: '3',
      type: 'flight',
      title: 'New York to Paris',
      description: 'Round trip flights starting from',
      price: '$649',
      tags: ['Direct', 'Best Price']
    },
    {
      id: '4',
      type: 'route',
      title: 'European Grand Tour',
      description: 'Multi-city route through Europe',
      location: 'Multiple Cities',
      tags: ['Multi-stop', 'Popular']
    },
    {
      id: '5',
      type: 'community',
      title: 'Paris Travel Tips Discussion',
      description: 'Community discussion about best places to visit in Paris',
      tags: ['Discussion', 'Tips']
    }
  ];

  useEffect(() => {
    if (query.length > 2) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const filtered = mockResults.filter(result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase()) ||
          result.location?.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setLoading(false);
      }, 500);
    } else {
      setResults([]);
    }
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'destination': return <MapPin className="h-4 w-4" />;
      case 'hotel': return <Building2 className="h-4 w-4" />;
      case 'flight': return <Plane className="h-4 w-4" />;
      case 'route': return <MapPin className="h-4 w-4" />;
      case 'community': return <Users className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'destination': return 'bg-primary/10 text-primary';
      case 'hotel': return 'bg-secondary/10 text-secondary';
      case 'flight': return 'bg-accent/50 text-accent-foreground';
      case 'route': return 'bg-muted text-muted-foreground';
      case 'community': return 'bg-success/10 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (query.length <= 2) {
    return (
      <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-b-lg shadow-lg z-50">
        <div className="p-6 text-center text-muted-foreground">
          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Type at least 3 characters to start searching...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-b-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {loading ? (
        <div className="p-6 text-center">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-muted-foreground">Searching...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="p-2">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <p className="text-sm text-muted-foreground">
              Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
          
          <div className="space-y-1 mt-2">
            {results.map((result) => (
              <Card key={result.id} className="hover:bg-accent/50 cursor-pointer transition-colors">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                      {getIcon(result.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground truncate">
                          {result.title}
                        </h4>
                        {result.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            <span className="text-xs text-muted-foreground">
                              {result.rating}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {result.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {result.location && (
                            <span className="text-xs text-muted-foreground">
                              {result.location}
                            </span>
                          )}
                          {result.tags && (
                            <div className="flex gap-1">
                              {result.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {result.price && (
                          <span className="text-sm font-medium text-primary">
                            {result.price}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Separator className="my-2" />
          
          <div className="p-3 text-center">
            <Button variant="outline" size="sm" className="w-full">
              View All Results
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-muted-foreground">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No results found for "{query}"</p>
          <p className="text-xs mt-1">Try searching for destinations, hotels, or flights</p>
        </div>
      )}
    </div>
  );
};