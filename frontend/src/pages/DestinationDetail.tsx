import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import activityService from '@/services/activityService';
import { Activity } from '@/lib/api';
import DestinationActions from '@/components/DestinationActions';
import { 
  MapPin, 
  Star, 
  Users, 
  Calendar, 
  Globe, 
  DollarSign, 
  Clock, 
  Thermometer,
  ArrowLeft,
  Camera,
  Mountain,
  Utensils,
  Plane,
  Check
} from 'lucide-react';
import { get } from 'node:http';

interface DestinationData {
  id: number;
  name: string;
  englishName?: string;
  country: string;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  category: string;
  price: number;
  slug?: string;
  highlights: string[];
  quickFacts: {
    bestTime: string;
    language: string;
    currency: string;
    timezone: string;
  };
  weather: {
    temperature: string;
    condition: string;
    humidity: string;
  };
  activities: Array<{
    name: string;
    image: string;
    price: number;
    duration: string;
    description: string;
  }>;
}

const DestinationDetail = () => {
  const { t, i18n } = useTranslation();
  const { destinationId, destinationName, lang } = useParams<{ destinationId?: string; destinationName?: string; lang?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [destination, setDestination] = useState<DestinationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookedActivities, setBookedActivities] = useState<Set<string>>(new Set());

  // Set language based on URL param
  useEffect(() => {
    if (lang && ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh'].includes(lang)) {
      i18n.changeLanguage(lang);
      localStorage.setItem('travel-app-language', lang);
    }
  }, [lang, i18n]);

  // Helper function to get translation with fallback
  const getTranslation = (key: string, defaultValue: string) => {
    const translation = t(key);
    return translation === key ? defaultValue : translation;
  };

  // Destination data - in a real app, this would come from an API
  const destinationsData: Record<string, DestinationData> = {
    'paris-france': {
      id: 1,
      name: getTranslation('destinations.paris.name', 'Paris'),
      englishName : 'Paris',
      country: getTranslation('destinations.paris.country', 'France'),
      image: "https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.8,
      reviews: 1250,
      description: getTranslation('destinations.paris.description', 'Paris, the City of Light, captivates visitors with its iconic architecture, world-class cuisine, and unparalleled art scene.'),
      category: getTranslation('destinations.paris.category', 'city'),
      price: 1200,
      slug: getTranslation('destinations.paris.slug', 'paris-france'),
      highlights: [
        getTranslation('destinations.paris.highlights.0', 'Eiffel Tower'),
        getTranslation('destinations.paris.highlights.1', 'Louvre Museum'),
        getTranslation('destinations.paris.highlights.2', 'Notre-Dame Cathedral'),
        getTranslation('destinations.paris.highlights.3', 'Montmartre'),
        getTranslation('destinations.paris.highlights.4', 'Seine River Cruise')
      ],
      quickFacts: {
        bestTime: getTranslation('destinations.paris.quickFacts.bestTime', 'April to June and September to October'),
        language: getTranslation('destinations.paris.quickFacts.language', 'French'),
        currency: getTranslation('destinations.paris.quickFacts.currency', 'Euro (€)'),
        timezone: getTranslation('destinations.paris.quickFacts.timezone', 'Central European Time (CET)')
      },
      weather: {
        temperature: "18°C",
        condition: getTranslation('destinations.paris.weather.condition', 'Sunny'),
        humidity: "65%"
      },
      activities: [
        {
          name: t('destinations.paris.activities.0.name'),
          image: "https://images.unsplash.com/photo-1622660515771-2f78f3b7aaba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2VpbmUlMjByaXZlcnxlbnwwfHwwfHx8MA%3D%3D",
          price: 25,
          duration: t('destinations.paris.activities.0.duration'),
          description: t('destinations.paris.activities.0.description')
        },
        {
          name: t('destinations.paris.activities.1.name'),
          image: "https://images.unsplash.com/photo-1567942585146-33d62b775db0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bG91dnJlfGVufDB8fDB8fHww",
          price: 45,
          duration: t('destinations.paris.activities.1.duration'),
          description: t('destinations.paris.activities.1.description')
        },
        {
          name: t('destinations.paris.activities.2.name'),
          image: "https://plus.unsplash.com/premium_photo-1683120751032-41fdd5226ab6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGVpZmZlbCUyMHRvd2VyfGVufDB8fDB8fHww",
          price: 35,
          duration: t('destinations.paris.activities.2.duration'),
          description: t('destinations.paris.activities.2.description')
        },
        {
          name: t('destinations.paris.activities.3.name'),
          image: "https://images.unsplash.com/photo-1589805054722-c407021fa8ef?w=600&auto-format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bW9udG1hcnRyZXxlbnwwfHwwfHx8MA%3D%3D",
          price: 20,
          duration: t('destinations.paris.activities.3.duration'),
          description: t('destinations.paris.activities.3.description')
        }
      ]
    },
    'tokyo-japan': {
      id: 2,
      name: getTranslation('destinations.tokyo.name', 'Tokyo'),
      country: getTranslation('destinations.tokyo.country', 'Japan'),
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
      rating: 4.9,
      reviews: 980,
      description: getTranslation('destinations.tokyo.description', 'Tokyo seamlessly blends ultramodern technology with traditional culture. From ancient temples to neon-lit districts, this metropolis offers a unique glimpse into the future while preserving its rich heritage.'),
      category: getTranslation('destinations.tokyo.category', 'city'),
      price: 1800,
      slug: getTranslation('destinations.tokyo.slug', 'tokyo-japan'),
      highlights: [
        getTranslation('destinations.tokyo.highlights.0', 'Shibuya Crossing'),
        getTranslation('destinations.tokyo.highlights.1', 'Sensoji Temple'),
        getTranslation('destinations.tokyo.highlights.2', 'Tokyo Skytree'),
        getTranslation('destinations.tokyo.highlights.3', 'Tsukiji Fish Market'),
        getTranslation('destinations.tokyo.highlights.4', 'Harajuku District')
      ],
      quickFacts: {
        bestTime: getTranslation('destinations.tokyo.quickFacts.bestTime', 'March to May and September to November'),
        language: getTranslation('destinations.tokyo.quickFacts.language', 'Japanese'),
        currency: getTranslation('destinations.tokyo.quickFacts.currency', 'Japanese Yen (¥)'),
        timezone: getTranslation('destinations.tokyo.quickFacts.timezone', 'Japan Standard Time (JST)')
      },
      weather: {
        temperature: "22°C",
        condition: getTranslation('destinations.tokyo.weather.condition', 'Sunny'),
        humidity: "58%"
      },
      activities: [
        {
          name: t('destinations.tokyo.activities.0.name'),
          image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351",
          price: 80,
          duration: t('destinations.tokyo.activities.0.duration'),
          description: t('destinations.tokyo.activities.0.description')
        },
        {
          name: t('destinations.tokyo.activities.1.name'),
          image: "https://plus.unsplash.com/premium_photo-1715681826184-2b9bf52f69a4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2120",
          price: 65,
          duration: t('destinations.tokyo.activities.1.duration'),
          description: t('destinations.tokyo.activities.1.description')
        },
        {
          name: t('destinations.tokyo.activities.2.name'),
          image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
          price: 40,
          duration: t('destinations.tokyo.activities.2.duration'),
          description: t('destinations.tokyo.activities.2.description')
        },
        {
          name: t('destinations.tokyo.activities.3.name'),
          image: "https://media.gettyimages.com/id/1244052148/photo/semi-humanoid-robot-pepper-is-pictured-with-other-serving-robots-at-a-demonstration-by-japans.jpg?s=612x612&w=0&k=20&c=uxW2pPr6DXB-x5Qrr-Fuv4EVUkrO78V2aUDPuvRfN-k=",
          price: 55,
          duration: t('destinations.tokyo.activities.3.duration'),
          description: t('destinations.tokyo.activities.3.description')
        }
      ]
    },
    'new-york-usa': {
      id: 3,
      name: getTranslation('destinations.newYork.name', 'New York City'),
      country: getTranslation('destinations.newYork.country', 'United States'),
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
      rating: 4.7,
      reviews: 2100,
      description: getTranslation('destinations.newYork.description', 'New York City, the city that never sleeps, is a global hub of art, culture, fashion, and finance. From iconic skyscrapers to diverse neighborhoods, it offers an unmatched urban experience with endless possibilities.'),
      category: getTranslation('destinations.newYork.category', 'city'),
      price: 1500,
      slug: getTranslation('destinations.newYork.slug', 'new-york-usa'),
      highlights: [
        getTranslation('destinations.newYork.highlights.0', 'Statue of Liberty'),
        getTranslation('destinations.newYork.highlights.1', 'Times Square'),
        getTranslation('destinations.newYork.highlights.2', 'Central Park'),
        getTranslation('destinations.newYork.highlights.3', 'Empire State Building'),
        getTranslation('destinations.newYork.highlights.4', 'Broadway Shows')
      ],
      quickFacts: {
        bestTime: getTranslation('destinations.newYork.quickFacts.bestTime', 'April to June and September to November'),
        language: getTranslation('destinations.newYork.quickFacts.language', 'English'),
        currency: getTranslation('destinations.newYork.quickFacts.currency', 'US Dollar ($)'),
        timezone: getTranslation('destinations.newYork.quickFacts.timezone', 'Eastern Standard Time (EST)')
      },
      weather: {
        temperature: "16°C",
        condition: getTranslation('destinations.newYork.weather.condition', 'Cloudy'),
        humidity: "72%"
      },
      activities: [
        {
          name: t('destinations.newYork.activities.0.name'),
          image: "https://plus.unsplash.com/premium_photo-1683219367985-b59ec6e32e5b?w=600&auto-format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnJvYWR3YXl8ZW58MHx8MHx8fDA%3D",
          price: 120,
          duration: t('destinations.newYork.activities.0.duration'),
          description: t('destinations.newYork.activities.0.description')
        },
        {
          name: t('destinations.newYork.activities.1.name'),
          image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74",
          price: 35,
          duration: t('destinations.newYork.activities.1.duration'),
          description: t('destinations.newYork.activities.1.description')
        },
        {
          name: t('destinations.newYork.activities.2.name'),
          image: "https://images.unsplash.com/photo-1600403477955-2b8c2cfab221?w=600&auto-format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGJpa2UlMjB0b3VyfGVufDB8fDB8fHww",
          price: 45,
          duration: t('destinations.newYork.activities.2.duration'),
          description: t('destinations.newYork.activities.2.description')
        },
        {
          name: t('destinations.newYork.activities.3.name'),
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
          price: 75,
          duration: t('destinations.newYork.activities.3.duration'),
          description: t('destinations.newYork.activities.3.description')
        }
      ]
    },
    'bali-indonesia': {
      id: 4,
      name: getTranslation('destinations.bali.name', 'Bali'),
      country: getTranslation('destinations.bali.country', 'Indonesia'),
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1",
      rating: 4.6,
      reviews: 840,
      description: getTranslation('destinations.bali.description', 'Tropical paradise with stunning beaches, lush rice terraces, ancient temples, and rich cultural heritage. Bali offers the perfect blend of relaxation and adventure, from world-class surfing to spiritual retreats.'),
      category: getTranslation('destinations.bali.category', 'adventure'),
      price: 900,
      slug: getTranslation('destinations.bali.slug', 'bali-indonesia'),
      highlights: [
        getTranslation('destinations.bali.highlights.0', 'Tanah Lot Temple - Iconic sea temple on a rock formation'),
        getTranslation('destinations.bali.highlights.1', 'Ubud Rice Terraces - UNESCO World Heritage rice paddies'),
        getTranslation('destinations.bali.highlights.2', 'Mount Batur - Active volcano perfect for sunrise hikes'),
        getTranslation('destinations.bali.highlights.3', 'Seminyak Beach - Trendy beach with great surfing'),
        getTranslation('destinations.bali.highlights.4', 'Monkey Forest Sanctuary - Sacred forest with playful macaques')
      ],
      quickFacts: {
        bestTime: getTranslation('destinations.bali.quickFacts.bestTime', 'April to October'),
        language: getTranslation('destinations.bali.quickFacts.language', 'Indonesian, Balinese'),
        currency: getTranslation('destinations.bali.quickFacts.currency', 'Indonesian Rupiah (IDR)'),
        timezone: getTranslation('destinations.bali.quickFacts.timezone', 'Central Indonesia Time (WITA)')
      },
      weather: {
        temperature: "28°C",
        condition: getTranslation('destinations.bali.weather.condition', 'Sunny'),
        humidity: "78%"
      },
      activities: [
        {
          name: t('destinations.bali.activities.0.name'),
          image: "https://images.unsplash.com/photo-1508591086314-d7deb00cede9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW91bnQlMjBiYXR1cnxlbnwwfHwwfHx8MA%3D%3D",
          price: 50,
          duration: t('destinations.bali.activities.0.duration'),
          description: t('destinations.bali.activities.0.description')
        },
        {
          name: t('destinations.bali.activities.1.name'),
          image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b",
          price: 40,
          duration: t('destinations.bali.activities.1.duration'),
          description: t('destinations.bali.activities.1.description')
        },
        {
          name: t('destinations.bali.activities.2.name'),
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
          price: 35,
          duration: t('destinations.bali.activities.2.duration'),
          description: t('destinations.bali.activities.2.description')
        },
        {
          name: t('destinations.bali.activities.3.name'),
          image: "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2VsbG5lc3MlMjByZXRyZWF0fGVufDB8fDB8fHww",
          price: 60,
          duration: t('destinations.bali.activities.3.duration'),
          description: t('destinations.bali.activities.3.description')
        }
      ]
    },
    'swiss-alps-switzerland': {
      id: 5,
      name: getTranslation('destinations.swissAlps.name', 'Swiss Alps'),
      country: getTranslation('destinations.swissAlps.country', 'Switzerland'),
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      rating: 4.9,
      reviews: 567,
      description: getTranslation('destinations.swissAlps.description', 'Breathtaking mountain views and world-class skiing adventures await in the Swiss Alps. Experience pristine alpine landscapes, charming mountain villages, and outdoor activities year-round.'),
      category: getTranslation('destinations.swissAlps.category', 'adventure'),
      price: 2200,
      highlights: [
        getTranslation('destinations.swissAlps.highlights.0', 'Matterhorn - Iconic pyramid-shaped mountain peak'),
        getTranslation('destinations.swissAlps.highlights.1', 'Jungfraujoch - Top of Europe with glaciers and snow'),
        getTranslation('destinations.swissAlps.highlights.2', 'Lake Geneva - Beautiful alpine lake with vineyards'),
        getTranslation('destinations.swissAlps.highlights.3', 'Zermatt Village - Car-free mountain resort town'),
        getTranslation('destinations.swissAlps.highlights.4', 'Rhine Falls - Europe\'s most powerful waterfall')
      ],
      quickFacts: {
        bestTime: getTranslation('destinations.swissAlps.quickFacts.bestTime', 'December to March (skiing), June to September (hiking)'),
        language: getTranslation('destinations.swissAlps.quickFacts.language', 'German, French, Italian'),
        currency: getTranslation('destinations.swissAlps.quickFacts.currency', 'Swiss Franc (CHF)'),
        timezone: getTranslation('destinations.swissAlps.quickFacts.timezone', 'Central European Time (CET)')
      },
      weather: {
        temperature: "8°C",
        condition: getTranslation('destinations.swissAlps.weather.condition', 'Snow'),
        humidity: "85%"
      },
      activities: [
        {
          name: t('destinations.swissAlps.activities.0.name'),
          image: "https://plus.unsplash.com/premium_photo-1673254848097-84610483ea94?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TWF0dGVyaG9ybiUyMEdsYWNpZXIlMkMlMjBaZXJtYXR0JTJDJTIwU3ZpenplcmF8ZW58MHx8MHx8fDA%3D",
          price: 95,
          duration: t('destinations.swissAlps.activities.0.duration'),
          description: t('destinations.swissAlps.activities.0.description')
        },
        {
          name: t('destinations.swissAlps.activities.1.name'),
          image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWxwaW5lJTIwc2tpaW5nfGVufDB8fDB8fHww",
          price: 120,
          duration: t('destinations.swissAlps.activities.1.duration'),
          description: t('destinations.swissAlps.activities.1.description')
        },
        {
          name: t('destinations.swissAlps.activities.2.name'),
          image: "https://plus.unsplash.com/premium_photo-1661962676870-f87ad4a4c7dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWluJTIwaGlrZXxlbnwwfHwwfHx8MA%3D%3D",
          price: 75,
          duration: t('destinations.swissAlps.activities.2.duration'),
          description: t('destinations.swissAlps.activities.2.description')
        },
        {
          name: t('destinations.swissAlps.activities.3.name'),
          image: "https://images.unsplash.com/photo-1623053045271-e53d909ef33b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3dpc3MlMjBjaG9jb2xhdGV8ZW58MHx8MHx8fDA%3D",
          price: 45,
          duration: t('destinations.swissAlps.activities.3.duration'),
          description: t('destinations.swissAlps.activities.3.description')
        }
      ]
    },
    'london-uk': {
      id: 7,
      name: getTranslation('destinations.london.name', 'London'),
      country: getTranslation('destinations.london.country', 'United Kingdom'),
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad",
      rating: 4.8,
      reviews: 3200,
      description: getTranslation('destinations.london.description', 'London, a city where history meets modernity, offers a unique blend of royal heritage, world-class museums, diverse culture, and innovative architecture. Experience the charm of this global metropolis along the River Thames.'),
      category: getTranslation('destinations.london.category', 'city'),
      price: 1800,
      highlights: [
        getTranslation('destinations.london.highlights.0', 'Big Ben & Houses of Parliament'),
        getTranslation('destinations.london.highlights.1', 'Tower of London'),
        getTranslation('destinations.london.highlights.2', 'Buckingham Palace'),
        getTranslation('destinations.london.highlights.3', 'British Museum'),
        getTranslation('destinations.london.highlights.4', 'London Eye')
      ],
      quickFacts: {
        bestTime: getTranslation('destinations.london.quickFacts.bestTime', 'May to September'),
        language: getTranslation('destinations.london.quickFacts.language', 'English'),
        currency: getTranslation('destinations.london.quickFacts.currency', 'British Pound (£)'),
        timezone: getTranslation('destinations.london.quickFacts.timezone', 'GMT/BST')
      },
      weather: {
        temperature: "18°C",
        condition: getTranslation('destinations.london.weather.condition', 'Cloudy'),
        humidity: "75%"
      },
      activities: [
        {
          name: t('destinations.london.activities.0.name'),
          image: "https://images.unsplash.com/photo-1520986606214-8b456906c813",
          price: 45,
          duration: t('destinations.london.activities.0.duration'),
          description: t('destinations.london.activities.0.description')
        },
        {
          name: t('destinations.london.activities.1.name'),
          image: "https://images.unsplash.com/photo-1574973992954-944d87cc75a7",
          price: 30,
          duration: t('destinations.london.activities.1.duration'),
          description: t('destinations.london.activities.1.description')
        },
        {
          name: t('destinations.london.activities.2.name'),
          image: "https://images.unsplash.com/photo-1520967824495-b529adc3ba69",
          price: 25,
          duration: t('destinations.london.activities.2.duration'),
          description: t('destinations.london.activities.2.description')
        },
        {
          name: t('destinations.london.activities.3.name'),
          image: "https://images.unsplash.com/photo-1525939864518-b171189c9c9b",
          price: 35,
          duration: t('destinations.london.activities.3.duration'),
          description: t('destinations.london.activities.3.description')
        }
      ]
    },
    'tuscany-italy': {
      id: 6,
      name: getTranslation('destinations.tuscany.name', 'Tuscany'),
      country: getTranslation('destinations.tuscany.country', 'Italy'),
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
      rating: 4.8,
      reviews: 734,
      description: getTranslation('destinations.tuscany.description', 'Rolling hills, vineyards, and authentic Italian cuisine define this enchanting region. Tuscany offers Renaissance art, medieval towns, world-renowned wines, and some of the most beautiful countryside in the world.'),
      category: getTranslation('destinations.tuscany.category', 'city'),
      price: 1300,
      highlights: [
        getTranslation('destinations.tuscany.highlights.0', 'Florence Cathedral - Stunning Renaissance architecture'),
        getTranslation('destinations.tuscany.highlights.1', 'Chianti Wine Region - World-famous vineyards and tastings'),
        getTranslation('destinations.tuscany.highlights.2', 'Pisa\'s Leaning Tower - Iconic tilted bell tower'),
        getTranslation('destinations.tuscany.highlights.3', 'Siena Historic Center - Medieval city with Gothic architecture'),
        getTranslation('destinations.tuscany.highlights.4', 'Val d\'Orcia - UNESCO World Heritage landscape')
      ],
      quickFacts: {
        bestTime: getTranslation('destinations.tuscany.quickFacts.bestTime', 'April to June, September to October'),
        language: getTranslation('destinations.tuscany.quickFacts.language', 'Italian'),
        currency: getTranslation('destinations.tuscany.quickFacts.currency', 'Euro (EUR)'),
        timezone: getTranslation('destinations.tuscany.quickFacts.timezone', 'Central European Time (CET)')
      },
      weather: {
        temperature: "24°C",
        condition: t('destinations.tuscany.weather.condition', 'Sunny'),
        humidity: "60%"
      },
      activities: [
        {
          name: t('destinations.tuscany.activities.0.name'),
          image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb",
          price: 85,
          duration: t('destinations.tuscany.activities.0.duration'),
          description: t('destinations.tuscany.activities.0.description')
        },
        {
          name: t('destinations.tuscany.activities.1.name'),
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
          price: 95,
          duration: t('destinations.tuscany.activities.1.duration'),
          description: t('destinations.tuscany.activities.1.description')
        },
        {
          name: t('destinations.tuscany.activities.2.name'),
          image: "https://images.unsplash.com/photo-1476362174823-3a23f4aa6d76?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmxvcmVuY2V8ZW58MHx8MHx8fDA%3D",
          price: 55,
          duration: t('destinations.tuscany.activities.2.duration'),
          description: t('destinations.tuscany.activities.2.description')
        },
        {
          name: t('destinations.tuscany.activities.3.name'),
          image: "https://images.unsplash.com/photo-1650558534001-4d3c1f13ada2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmlrZSUyMHRvdXJ8ZW58MHx8MHx8fDA%3D",
          price: 65,
          duration: t('destinations.tuscany.activities.3.duration'),
          description: t('destinations.tuscany.activities.3.description')
        }
      ]
    },
    'costa-rica': {
      id: 7,
      name: getTranslation('destinations.costarica.name', 'Costa Rica'),
      country: getTranslation('destinations.costarica.country', 'Costa Rica'),
      image: "https://images.unsplash.com/photo-1607287322237-e9eeee4849a8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29zdGElMjByaWNhJTIwYmVhY2h8ZW58MHx8MHx8fDA%3D",
      rating: 4.7,
      reviews: 423,
      description: getTranslation('destinations.costarica.description', 'Rich biodiversity and stunning natural landscapes make Costa Rica a paradise for nature lovers. From pristine beaches to lush rainforests, this Central American gem offers incredible wildlife and adventure activities.'),
      category: getTranslation('destinations.costarica.category', 'nature'),
      price: 1100,
      highlights: [
        getTranslation('destinations.costarica.highlights.0', 'Pristine beaches'),
        getTranslation('destinations.costarica.highlights.1', 'Lush rainforests'),
        getTranslation('destinations.costarica.highlights.2', 'Cultural heritage'),
        getTranslation('destinations.costarica.highlights.3', 'Adventure activities'),
      ],
      quickFacts: {
        bestTime: getTranslation('destinations.costarica.quickFacts.bestTime', 'April to June, September to October'),
        language: getTranslation('destinations.costarica.quickFacts.language', 'Spanish'),
        currency: getTranslation('destinations.costarica.quickFacts.currency', 'Cost Rican Colon (CRC)'),
        timezone: getTranslation('destinations.costarica.quickFacts.timezone', 'Central European Time (CET)')
      },
      weather: {
        temperature: "26°C",
        condition: getTranslation('destinations.costarica.weather.condition', 'Partly Cloudy'),
        humidity: "82%"
      },
      activities: [
        {
          name: t('destinations.costarica.activities.0.name'),
          image: "https://images.unsplash.com/photo-1637511077877-3c6a00eb32ba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8emlwJTIwbGluZXxlbnwwfHwwfHx8MA%3D%3D",
          price: 75,
          duration: t('destinations.costarica.activities.0.duration'),
          description: t('destinations.costarica.activities.0.description')
        },
        {
          name: t('destinations.costarica.activities.1.name'),
          image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5",
          price: 90,
          duration: t('destinations.costarica.activities.1.duration'),
          description: t('destinations.costarica.activities.1.description')
        },
        {
          name: t('destinations.costarica.activities.2.name'),
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
          price: 65,
          duration: t('destinations.costarica.activities.2.duration'),
          description: t('destinations.costarica.activities.2.description')
        },
        {
          name: t('destinations.costarica.activities.3.name'),
          image: "https://images.unsplash.com/photo-1629248564797-8c5ba85da9d3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2hpdGV3YXRlciUyMHJhZnRpbmd8ZW58MHx8MHx8fDA%3D",
          price: 85,
          duration: t('destinations.costarica.activities.3.duration'),
          description: t('destinations.costarica.activities.3.description')
        }
      ]
    },
    'santorini-greece': {
      id: 8,
      name: getTranslation('destinations.santorini.name', 'Santorini'),
      country: getTranslation('destinations.santorini.country', 'Greece'),
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
      rating: 4.8,
      reviews: 1156,
      description: getTranslation('destinations.santorini.description', 'Santorini is a Greek island known for its stunning sunsets, white-washed buildings, and traditional Greek culture. The island offers a perfect blend of natural beauty and cultural heritage, making it a popular destination for travelers seeking a unique and unforgettable experience.'),
      category: getTranslation('destinations.santorini.category', 'culture'),
      price: 1400,
      highlights: [
        getTranslation('destinations.santorini.highlights.0', 'Stunning sunsets'),
        getTranslation('destinations.santorini.highlights.1', 'White-washed buildings'),
        getTranslation('destinations.santorini.highlights.2', 'Traditional Greek culture'),
        getTranslation('destinations.santorini.highlights.3', 'Perfect blend of natural beauty and cultural heritage'),
      ],
      quickFacts: {
        bestTime: getTranslation('destinations.santorini.quickFacts.bestTime', 'April to June, September to October'),
        language: getTranslation('destinations.santorini.quickFacts.language', 'Greek'),
        currency: getTranslation('destinations.santorini.quickFacts.currency', 'Euro (EUR)'),
        timezone: getTranslation('destinations.santorini.quickFacts.timezone', 'Central European Time (CET)'),
      },
      weather: {
        temperature: "25°C",
        condition: getTranslation('destinations.santorini.weather.condition', 'Partly Cloudy'),
        humidity: "68%"
      },
      activities: [
        {
          name: t('destinations.santorini.activities.0.name'),
          image: "https://images.unsplash.com/photo-1656829462099-6a030d23df41?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNhaWxpbmclMjBzdW5zZXR8ZW58MHx8MHx8fDA%3D",
          price: 95,
          duration: t('destinations.santorini.activities.0.duration'),
          description: t('destinations.santorini.activities.0.description')
        },
        {
          name: t('destinations.santorini.activities.1.name'),
          image: "https://images.unsplash.com/photo-1581888517319-570283943d82?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHZvbGNhbm98ZW58MHx8MHx8fDA%3D",
          price: 55,
          duration: t('destinations.santorini.activities.1.duration'),
          description: "Boat trip to active volcanic islands in the caldera"
        },
        {
          name: t('destinations.santorini.activities.2.name'),
          image: "https://plus.unsplash.com/premium_photo-1718146019167-110481171ad2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dG91cnxlbnwwfHwwfHx8MA%3D%3D",
          price: 80,
          duration: t('destinations.santorini.activities.2.duration'),
          description: t('destinations.santorini.activities.2.description')
        },
        {
          name: t('destinations.santorini.activities.3.name'),
          image: "https://plus.unsplash.com/premium_photo-1718146019167-110481171ad2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dG91cnxlbnwwfHwwfHx8MA%3D%3D",
          price: 80,
          duration: t('destinations.santorini.activities.3.duration'),
          description: t('destinations.santorini.activities.3.description')
        }
      ]
    },
    'iceland': {
      id: 9,
      name: getTranslation('destinations.iceland.name', 'Iceland'),
      country: getTranslation('destinations.iceland.country', 'Iceland'),
      image: "https://images.unsplash.com/photo-1657780576805-ea092344358e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aWNlbGFuZCUyMHdhdGVyZmFsbHxlbnwwfHwwfHx8MA%3D%3D",
      rating: 4.8,
      reviews: 654,
      description: getTranslation('destinations.iceland.description', 'Iceland is a country known for its stunning natural beauty, including glaciers, volcanoes, and geysers. The country offers a perfect blend of natural beauty and cultural heritage, making it a popular destination for travelers seeking a unique and unforgettable experience.'),
      category: getTranslation('destinations.iceland.category', 'nature'),
      price: 1900,
      highlights: [
        getTranslation('destinations.iceland.highlights.0', 'Stunning natural beauty'),
        getTranslation('destinations.iceland.highlights.1', 'Glaciers'),
        getTranslation('destinations.iceland.highlights.2', 'Volcanoes'),
        getTranslation('destinations.iceland.highlights.3', 'Geysers'),
      ],
      quickFacts: {
        bestTime: getTranslation('destinations.iceland.quickFacts.bestTime', 'April to June, September to October'),
        language: getTranslation('destinations.iceland.quickFacts.language', 'Icelandic'),
        currency: getTranslation('destinations.iceland.quickFacts.currency', 'Icelandic Krona (ISK)'),
        timezone: getTranslation('destinations.iceland.quickFacts.timezone', 'Greenwich Mean Time (GMT)'),
      },
      weather: {
        temperature: "5°C",
        condition: getTranslation('destinations.iceland.weather.condition', 'Partly Cloudy'),
        humidity: "75%"
      },
      activities: [
        {
          name: t('destinations.iceland.activities.0.name'),
          image: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73",
          price: 120,
          duration: t('destinations.iceland.activities.0.duration'),
          description: t('destinations.iceland.activities.0.description')
        },
        {
          name: t('destinations.iceland.activities.1.name'),
          image: "https://images.unsplash.com/photo-1642760421906-a748c1a45907?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z29sZGVuJTIwY2lyY2xlJTIwaWNlbGFuZHxlbnwwfHwwfHx8MA%3D%3D",
          price: 85,
          duration: t('destinations.iceland.activities.1.duration'),
          description: t('destinations.iceland.activities.1.description')
        },
        {
          name: t('destinations.iceland.activities.2.name'),
          image: "https://images.unsplash.com/photo-1462993340984-49bd9e0f32dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ymx1ZSUyMGxhZ29vbnxlbnwwfHwwfHx8MA%3D%3D",
          price: 65,
          duration: t('destinations.iceland.activities.2.duration'),
          description: t('destinations.iceland.activities.2.description')
        },
        {
          name: t('destinations.iceland.activities.3.name'),
          image: "https://plus.unsplash.com/premium_photo-1661900005779-4ad8baac0f15?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z2xhY2llciUyMGhpa2luZ3xlbnwwfHwwfHx8MA%3D%3D",
          price: 150,
          duration: t('destinations.iceland.activities.3.duration'),
          description: t('destinations.iceland.activities.3.description')
        }
      ]
    },
    'barcelona-spain': {
      id: 10,
      name: getTranslation('destinations.barcelona.name', 'Barcelona'),
      country: getTranslation('destinations.barcelona.country', 'Spain'),
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4",
      rating: 4.7,
      reviews: 1567,
      description: getTranslation('destinations.barcelona.description', 'Barcelona is a city known for its stunning architecture, rich cultural heritage, and vibrant nightlife. The city offers a perfect blend of modernity and tradition, making it a popular destination for travelers seeking a unique and unforgettable experience.'),
      category: getTranslation('destinations.barcelona.category', 'city'),
      price: 1100,
      highlights: [
        getTranslation('destinations.barcelona.highlights.0', 'Stunning architecture'),
        getTranslation('destinations.barcelona.highlights.1', 'Rich cultural heritage'),
        getTranslation('destinations.barcelona.highlights.2', 'Vibrant nightlife'),
        getTranslation('destinations.barcelona.highlights.3', 'Modernity and tradition')
      ],
      quickFacts: {
        bestTime: getTranslation('destinations.barcelona.quickFacts.bestTime', 'April to June, September to October'),
        language: getTranslation('destinations.barcelona.quickFacts.language', 'Spanish'),
        currency: getTranslation('destinations.barcelona.quickFacts.currency', 'Euro (EUR)'),
        timezone: getTranslation('destinations.barcelona.quickFacts.timezone', 'Central European Time (CET)')
      },
      weather: {
        temperature: "22°C",
        condition: getTranslation('destinations.barcelona.weather.condition', 'Partly Cloudy'),
        humidity: "62%"
      },
      activities: [
        {
          name: t('destinations.barcelona.activities.0.name'),
          image: "https://plus.unsplash.com/premium_photo-1661885514351-ad93dcfb25f3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FncmFkYSUyMGZhbWlsaWF8ZW58MHx8MHx8fDA%3D",
          price: 35,
          duration: t('destinations.barcelona.activities.0.duration'),
          description: t('destinations.barcelona.activities.0.description')
        },
        {
          name: t('destinations.barcelona.activities.1.name'),
          image: "https://images.unsplash.com/photo-1656423521731-9665583f100c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGFwYXN8ZW58MHx8MHx8fDA%3D",
          price: 55,
          duration: t('destinations.barcelona.activities.1.duration'),
          description: t('destinations.barcelona.activities.1.description')
        },
        {
          name: t('destinations.barcelona.activities.2.name'),
          image: "https://images.unsplash.com/photo-1700720711555-ad42761e70bb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGZsYW1lbmNvfGVufDB8fDB8fHww",
          price: 45,
          duration: t('destinations.barcelona.activities.2.duration'),
          description: t('destinations.barcelona.activities.2.description')
        },
        {
          name: t('destinations.barcelona.activities.3.name'),
          image: "https://images.unsplash.com/photo-1591537358436-68a8bd90600f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fGdvdGhpYyUyMHF1YXJ0ZXJ8ZW58MHx8MHx8fDA%3D",
          price: 25,
          duration: t('destinations.barcelona.activities.3.duration'),
          description: t('destinations.barcelona.activities.3.description')
        }
      ]
    },
    'dubai-uae': {
      id: 11,
      name: getTranslation('destinations.dubai.name', 'Dubai'),
      country: getTranslation('destinations.dubai.country', 'UAE'),
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
      rating: 4.6,
      reviews: 1340,
      description: getTranslation('destinations.dubai.description', 'Dubai is a city known for its stunning architecture, rich cultural heritage, and vibrant nightlife. The city offers a perfect blend of modernity and tradition, making it a popular destination for travelers seeking a unique and unforgettable experience.'),
      category: getTranslation('destinations.dubai.category', 'city'),
      price: 1600,
      highlights: [
        getTranslation('destinations.dubai.highlights.0', 'Stunning architecture'),
        getTranslation('destinations.dubai.highlights.1', 'Rich cultural heritage'),
        getTranslation('destinations.dubai.highlights.2', 'Vibrant nightlife'),
        getTranslation('destinations.dubai.highlights.3', 'Modernity and tradition')
      ],
      quickFacts: {
        bestTime: getTranslation('destinations.dubai.quickFacts.bestTime', 'April to June, September to October'),
        language: getTranslation('destinations.dubai.quickFacts.language', 'Arabic'),
        currency: getTranslation('destinations.dubai.quickFacts.currency', 'UAE Dirham (AED)'),
        timezone: getTranslation('destinations.dubai.quickFacts.timezone', 'UTC+4')
      },
      weather: {
        temperature: "28°C",
        condition: getTranslation('destinations.dubai.weather.condition', 'Partly Cloudy'),
        humidity: "55%"
      },
      activities: [
        {
          name: t('destinations.dubai.activities.0.name'),
          image: "https://plus.unsplash.com/premium_photo-1694475631307-0f0a85924605?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1cmolMjBraGFsaWZhfGVufDB8fDB8fHww",
          price: 85,
          duration: t('destinations.dubai.activities.0.duration'),
          description: t('destinations.dubai.activities.0.description')
        },
        {
          name: t('destinations.dubai.activities.1.name'),
          image: "https://images.unsplash.com/photo-1624062999726-083e5268525d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGVzZXJ0JTIwc2FmYXJpfGVufDB8fDB8fHww",
          price: 75,
          duration: t('destinations.dubai.activities.1.duration'),
          description: t('destinations.dubai.activities.1.description')
        },
        {
          name: t('destinations.dubai.activities.2.name'),
          image: "https://images.unsplash.com/photo-1609874351819-8a267932ed67?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZHViYWklMjBtYXJpbmF8ZW58MHx8MHx8fDA%3D",
          price: 45,
          duration: t('destinations.dubai.activities.2.duration'),
          description: t('destinations.dubai.activities.2.description')
        },
        {
          name: t('destinations.dubai.activities.3.name'),
          image: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2hvcHBpbmd8ZW58MHx8MHx8fDA%3D",
          price: 40,
          duration: t('destinations.dubai.activities.3.duration'),
          description: t('destinations.dubai.activities.3.description')
        }
      ]
    },
    'goa-india': {
      id: 12,
      name: getTranslation('destinations.goa.name', 'Goa'),
      country: getTranslation('destinations.goa.country', 'India'),
      image: "https://images.unsplash.com/photo-1594801001182-99ee8f8d5db9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fGdvYSUyMGluZGlhfGVufDB8fDB8fHww",
      rating: 4.5,
      reviews: 892,
      description: getTranslation('destinations.goa.description', 'Goa is a coastal state in India known for its beautiful beaches, vibrant nightlife, and rich cultural heritage. The state offers a perfect blend of modernity and tradition, making it a popular destination for travelers seeking a unique and unforgettable experience.'),
      category: getTranslation('destinations.goa.category', 'beach'),
      price: 600,
      highlights: [
        getTranslation('destinations.goa.highlights.0', 'Beautiful beaches'),
        getTranslation('destinations.goa.highlights.1', 'Vibrant nightlife'),
        getTranslation('destinations.goa.highlights.2', 'Rich cultural heritage'),
        getTranslation('destinations.goa.highlights.3', 'Perfect blend of modernity and tradition'),
        getTranslation('destinations.goa.highlights.4', 'Popular destination for travelers seeking a unique and unforgettable experience')
      ],
      quickFacts: {
        bestTime: getTranslation('destinations.goa.quickFacts.bestTime', 'April to June, September to October'),
        language: getTranslation('destinations.goa.quickFacts.language', 'Hindi'),
        currency: getTranslation('destinations.goa.quickFacts.currency', 'Indian Rupee (INR)'),
        timezone: getTranslation('destinations.goa.quickFacts.timezone', 'UTC+5:30')
      },
      weather: {
        temperature: "30°C",
        condition: getTranslation('destinations.goa.weather.condition', 'Partly Cloudy'),
        humidity: "80%"
      },
      activities: [
        {
          name: getTranslation('destinations.goa.activities.0.name', 'Goa Beach'),
          image: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHRyYXZlbCUyMGJlYWNofGVufDB8fDB8fHww",
          price: 35,
          duration: t('destinations.goa.activities.0.duration'),
          description: t('destinations.goa.activities.0.description')
        },
        {
          name: t('destinations.goa.activities.1.name'),
          image: "https://plus.unsplash.com/premium_photo-1678653651313-81305572b508?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3BpY2UlMjBnYXJkZW58ZW58MHx8MHx8fDA%3D",
          price: 25,
          duration: t('destinations.goa.activities.1.duration'),
          description: t('destinations.goa.activities.1.description')
        },
        {
          name: t('destinations.goa.activities.2.name'),
          image: "https://images.unsplash.com/photo-1615301649602-358e40412b81?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d2F0ZXIlMjBzcG9ydHxlbnwwfHwwfHx8MA%3D%3D",
          price: 50,
          duration: t('destinations.goa.activities.2.duration'),
          description: t('destinations.goa.activities.2.description')
        },
        {
          name: t('destinations.goa.activities.3.name'),
          image: "https://images.unsplash.com/photo-1702799464761-29b1200c9549?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b2xkJTIwZ29hfGVufDB8fDB8fHww",
          price: 20,
          duration: t('destinations.goa.activities.3.duration'),
          description: t('destinations.goa.activities.3.description')
        }
      ]
    }
  };

  useEffect(() => {
    let destinationData: DestinationData | undefined;

    if (destinationId) {
      const parts = destinationId.split('-');
      const id = parseInt(parts[0]);
      if (!isNaN(id)) {
        destinationData = Object.values(destinationsData).find(d => d.id === id);
      } else {
        // Treat as slug
        const destinationKey = destinationId;
        destinationData = destinationsData[destinationKey];
      }
    } else if (destinationName) {
      const destinationKey = destinationName;
      destinationData = destinationsData[destinationKey];
    }

    if (destinationData) {
      setDestination(destinationData);
      // Load booked activities for this destination
      loadBookedActivities(destinationData);
    }
    setIsLoading(false);
  }, [destinationId, destinationName, i18n.language]);

  // Load booked activities from localStorage
  const loadBookedActivities = (dest: DestinationData) => {
    const booked = new Set<string>();
    dest.activities.forEach((activity, index) => {
      const activityId = `${dest.id}_${index}`;
      if (activityService.isActivityBooked(activityId)) {
        booked.add(activityId);
      }
    });
    setBookedActivities(booked);
  };

  // Handle activity booking
  const handleActivityBooking = (activity: any, index: number) => {
    if (!destination) return;

    const activityId = `${destination.id}_${index}`;
    
    if (bookedActivities.has(activityId)) {
      // Activity already booked, show message
      toast({
        title: t('destinationDetail.activityAlreadyBooked'),
        description: t('destinationDetail.activityAlreadyBookedDescription', { name: activity.name }),
        variant: "default",
      });
      return;
    }

    // Create activity object for booking
    const activityToBook: Activity = {
      id: activityId,
      name: activity.name,
      image: activity.image,
      price: activity.price,
      duration: activity.duration,
      description: activity.description,
      destination: destination.name
    };

    try {
      // Book the activity
      const booking = activityService.bookActivity(activityToBook);
      
      // Update local state
      setBookedActivities(prev => new Set([...prev, activityId]));

      // Show success message
      toast({
        title: t('destinationDetail.activityBooked'),
        description: t('destinationDetail.activityBookedDescription', { 
          name: activity.name, 
          price: new Intl.NumberFormat(i18n.language, {
            style: 'currency',
            currency: 'USD'
          }).format(activity.price)
        }),
        variant: "default",
      });
    } catch (error) {
      toast({
        title: t('destinationDetail.bookingFailed'),
        description: t('destinationDetail.bookingFailedDescription'),
        variant: "destructive",
      });
    }
  };

const handleBookNow = () => {
  if (destination) {
    navigate('/payment', { 
      state: { 
        type: 'flight',
        destination: {
          id: destination.id,
          name: destination.name,
          price: destination.price,
          image: destination.image
        },
        amount: destination.price
      }
    });
  }
};  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>{t('destinationDetail.loading')}</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('destinationDetail.notFound.title')}</h1>
          <p className="text-muted-foreground mb-6">{t('destinationDetail.notFound.description')}</p>
          <Button onClick={() => navigate('/explore')}>{t('destinationDetail.notFound.cta')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-[72px] md:pb-0">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      {/* Fixed Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50 md:hidden">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">{t('explore.perPerson')}</span>
              <span className="text-xl font-bold text-primary">${destination.price}</span>
            </div>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-white h-14 text-base flex items-center justify-center gap-2"
              onClick={handleBookNow}
            >
              <Plane className="h-4 w-4" />
              {t('destinationDetail.cta.bookNow', { price: destination.price })}
            </Button>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8 pt-16">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/explore')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('destinationDetail.backToExplore')}
        </Button>

        {/* Hero Section */}
        <div className="relative mb-12">
          <img 
            src={destination.image} 
            alt={destination.name}
            className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
          <DestinationActions 
            destinationId={destination.id} 
            destinationName={destination.name} 
          />
          {/* Desktop Book Now Button */}
          <Button 
            className="hidden md:flex absolute bottom-8 right-8 bg-primary hover:bg-primary/90 text-white items-center justify-center gap-2 text-lg px-6 py-3 shadow-lg transition-all duration-200 ease-in-out hover:scale-105"
            onClick={handleBookNow}
          >
            <Plane className="h-5 w-5" />
            {t('destinationDetail.cta.bookNow', { price: destination.price })}
          </Button>
          {/* Mobile Book Now Button - Fixed at bottom */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-50">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 text-base py-6 shadow-lg transition-all duration-200 ease-in-out active:scale-95"
              onClick={handleBookNow}
            >
              <Plane className="h-4 w-4" />
              {t('destinationDetail.cta.bookNow', { price: destination.price })}
            </Button>
          </div>
          <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{destination.name}</h1>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-base md:text-lg">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                <span className="font-semibold">{destination.rating}</span>
                <span className="text-muted-foreground">({destination.reviews} {t('explore.reviews')})</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                <span>{destination.reviews.toLocaleString()} {t('explore.reviews')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('destinationDetail.about.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {destination.description}
              </p>
            </section>

            {/* Highlights */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('destinationDetail.highlights.title')}</h2>
              <div className="space-y-3">
                {destination.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">{highlight}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Popular Activities */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">{t('destinationDetail.activities.title')}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {destination.activities.map((activity, index) => {
                  const activityId = `${destination.id}_${index}`;
                  const isBooked = bookedActivities.has(activityId);
                  
                  return (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={activity.image} 
                          alt={activity.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{activity.name}</h3>
                          <Badge variant="outline">${activity.price}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {activity.duration}
                          </div>
                          <Button 
                            size="sm" 
                            variant={isBooked ? "default" : "outline"}
                            onClick={() => handleActivityBooking(activity, index)}
                            className={isBooked ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                            disabled={isBooked}
                          >
                            {isBooked ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                {t('destinationDetail.activities.booked')}
                              </>
                            ) : (
                              t('destinationDetail.activities.book')
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {t('destinationDetail.quickFacts.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{t('destinationDetail.quickFacts.bestTime')}</p>
                    <p className="text-sm text-muted-foreground">{destination.quickFacts.bestTime}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{t('destinationDetail.quickFacts.language')}</p>
                    <p className="text-sm text-muted-foreground">{destination.quickFacts.language}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{t('destinationDetail.quickFacts.currency')}</p>
                    <p className="text-sm text-muted-foreground">{destination.quickFacts.currency}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{t('destinationDetail.quickFacts.timezone')}</p>
                    <p className="text-sm text-muted-foreground">{destination.quickFacts.timezone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  {t('destinationDetail.weather.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold mb-2">{destination.weather.temperature}</p>
                  <p className="text-muted-foreground mb-4">{destination.weather.condition}</p>
                  <div className="flex justify-between text-sm">
                    <span>{t('destinationDetail.weather.humidity')}</span>
                    <span>{destination.weather.humidity}</span>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>
      </main>
    </div>
  );
};

export default DestinationDetail;