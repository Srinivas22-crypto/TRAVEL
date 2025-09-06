import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ActionButtons from '@/components/ActionButtons';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import activityService from '@/services/activityService';
import { Activity } from '@/lib/api';
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
  Heart,
  Share2,
  Camera,
  Mountain,
  Utensils,
  Plane,
  Check
} from 'lucide-react';

interface DestinationData {
  id: number;
  name: string;
  country: string;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  category: string;
  price: number;
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
  const { t } = useTranslation();
  const { destinationName } = useParams<{ destinationName: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [destination, setDestination] = useState<DestinationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookedActivities, setBookedActivities] = useState<Set<string>>(new Set());

  // Destination data - in a real app, this would come from an API
  const destinationsData: Record<string, DestinationData> = {
    'paris-france': {
      id: 1,
      name: "Paris, France",
      country: "France",
      image: "https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.8,
      reviews: 1250,
      description: "The City of Light awaits with its iconic landmarks, world-class museums, charming cafés, and romantic atmosphere. Paris seamlessly blends historic architecture with modern sophistication, offering visitors an unforgettable experience filled with art, culture, and culinary delights.",
      category: "culture",
      price: 1200,
      highlights: [
        "Eiffel Tower - Iconic iron lattice tower and symbol of Paris",
        "Louvre Museum - World's largest art museum with the Mona Lisa",
        "Notre-Dame Cathedral - Gothic masterpiece on Île de la Cité",
        "Champs-Élysées - Famous avenue for shopping and dining",
        "Montmartre - Artistic district with Sacré-Cœur Basilica"
      ],
      quickFacts: {
        bestTime: "April to June, September to October",
        language: "French",
        currency: "Euro (EUR)",
        timezone: "Central European Time (CET)"
      },
      weather: {
        temperature: "18°C",
        condition: "Partly Cloudy",
        humidity: "65%"
      },
      activities: [
        {
          name: "Seine River Cruise",
          image: "data:image/jpeg;base64,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",
          price: 25,
          duration: "1 hour",
          description: "Romantic boat cruise along the Seine with views of iconic landmarks"
        },
        {
          name: "Louvre Museum Tour",
          image: "data:image/jpeg;base64,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",
          price: 45,
          duration: "3 hours",
          description: "Skip-the-line guided tour of the world's most famous museum"
        },
        {
          name: "Eiffel Tower Experience",
          image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f",
          price: 35,
          duration: "2 hours",
          description: "Visit all levels of the Eiffel Tower with stunning city views"
        },
        {
          name: "Montmartre Walking Tour",
          image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52",
          price: 20,
          duration: "2.5 hours",
          description: "Explore the artistic heart of Paris with local guide"
        }
      ]
    },
    'tokyo-japan': {
      id: 2,
      name: "Tokyo, Japan",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
      rating: 4.9,
      reviews: 980,
      description: "Experience the perfect blend of traditional culture and modern innovation in Japan's bustling capital. Tokyo offers everything from ancient temples and serene gardens to cutting-edge technology, incredible cuisine, and vibrant nightlife.",
      category: "city",
      price: 1800,
      highlights: [
        "Senso-ji Temple - Tokyo's oldest Buddhist temple in Asakusa",
        "Shibuya Crossing - World's busiest pedestrian crossing",
        "Tokyo Skytree - Tallest structure in Japan with panoramic views",
        "Tsukiji Outer Market - Fresh seafood and street food paradise",
        "Meiji Shrine - Peaceful Shinto shrine in the heart of the city"
      ],
      quickFacts: {
        bestTime: "March to May, September to November",
        language: "Japanese",
        currency: "Japanese Yen (JPY)",
        timezone: "Japan Standard Time (JST)"
      },
      weather: {
        temperature: "22°C",
        condition: "Clear",
        humidity: "58%"
      },
      activities: [
        {
          name: "Sushi Making Class",
          image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351",
          price: 80,
          duration: "3 hours",
          description: "Learn to make authentic sushi from a professional chef"
        },
        {
          name: "Tokyo City Tour",
          image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8",
          price: 65,
          duration: "8 hours",
          description: "Full day tour covering major attractions and hidden gems"
        },
        {
          name: "Traditional Tea Ceremony",
          image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
          price: 40,
          duration: "1.5 hours",
          description: "Experience authentic Japanese tea ceremony in traditional setting"
        },
        {
          name: "Robot Restaurant Show",
          image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
          price: 55,
          duration: "1 hour",
          description: "Unique entertainment experience with robots and neon lights"
        }
      ]
    },
    'new-york-usa': {
      id: 3,
      name: "New York, USA",
      country: "United States",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
      rating: 4.7,
      reviews: 2100,
      description: "The city that never sleeps offers endless possibilities and experiences. From world-famous landmarks and Broadway shows to diverse neighborhoods and incredible dining, New York City is a melting pot of culture, art, and ambition.",
      category: "city",
      price: 1500,
      highlights: [
        "Statue of Liberty - Symbol of freedom and democracy",
        "Central Park - 843-acre green oasis in Manhattan",
        "Times Square - Bright lights and Broadway theaters",
        "Brooklyn Bridge - Iconic suspension bridge with city views",
        "9/11 Memorial - Moving tribute to those lost"
      ],
      quickFacts: {
        bestTime: "April to June, September to November",
        language: "English",
        currency: "US Dollar (USD)",
        timezone: "Eastern Time (ET)"
      },
      weather: {
        temperature: "16°C",
        condition: "Overcast",
        humidity: "72%"
      },
      activities: [
        {
          name: "Broadway Show",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
          price: 120,
          duration: "2.5 hours",
          description: "Experience world-class theater in the heart of Times Square"
        },
        {
          name: "Statue of Liberty Tour",
          image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74",
          price: 35,
          duration: "4 hours",
          description: "Ferry ride and guided tour of Liberty Island"
        },
        {
          name: "Central Park Bike Tour",
          image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7",
          price: 45,
          duration: "2 hours",
          description: "Explore Central Park's highlights on a guided bike tour"
        },
        {
          name: "Food Tour",
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
          price: 75,
          duration: "3 hours",
          description: "Taste NYC's diverse culinary scene with local guide"
        }
      ]
    },
    'bali-indonesia': {
      id: 4,
      name: "Bali, Indonesia",
      country: "Indonesia",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1",
      rating: 4.6,
      reviews: 840,
      description: "Tropical paradise with stunning beaches, lush rice terraces, ancient temples, and rich cultural heritage. Bali offers the perfect blend of relaxation and adventure, from world-class surfing to spiritual retreats.",
      category: "beach",
      price: 900,
      highlights: [
        "Tanah Lot Temple - Iconic sea temple on a rock formation",
        "Ubud Rice Terraces - UNESCO World Heritage rice paddies",
        "Mount Batur - Active volcano perfect for sunrise hikes",
        "Seminyak Beach - Trendy beach with great surfing",
        "Monkey Forest Sanctuary - Sacred forest with playful macaques"
      ],
      quickFacts: {
        bestTime: "April to October",
        language: "Indonesian, Balinese",
        currency: "Indonesian Rupiah (IDR)",
        timezone: "Central Indonesia Time (WITA)"
      },
      weather: {
        temperature: "28°C",
        condition: "Sunny",
        humidity: "78%"
      },
      activities: [
        {
          name: "Sunrise Mount Batur Hike",
          image: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23",
          price: 50,
          duration: "6 hours",
          description: "Early morning hike to catch spectacular sunrise from volcano summit"
        },
        {
          name: "Ubud Cultural Tour",
          image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b",
          price: 40,
          duration: "8 hours",
          description: "Explore temples, rice terraces, and traditional villages"
        },
        {
          name: "Surfing Lesson",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
          price: 35,
          duration: "2 hours",
          description: "Learn to surf on Bali's famous waves with expert instructors"
        },
        {
          name: "Spa & Wellness Retreat",
          image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
          price: 60,
          duration: "3 hours",
          description: "Traditional Balinese massage and wellness treatments"
        }
      ]
    },
    'swiss-alps-switzerland': {
      id: 5,
      name: "Swiss Alps, Switzerland",
      country: "Switzerland",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      rating: 4.9,
      reviews: 567,
      description: "Breathtaking mountain views and world-class skiing adventures await in the Swiss Alps. Experience pristine alpine landscapes, charming mountain villages, and outdoor activities year-round.",
      category: "adventure",
      price: 2200,
      highlights: [
        "Matterhorn - Iconic pyramid-shaped mountain peak",
        "Jungfraujoch - Top of Europe with glaciers and snow",
        "Lake Geneva - Beautiful alpine lake with vineyards",
        "Zermatt Village - Car-free mountain resort town",
        "Rhine Falls - Europe's most powerful waterfall"
      ],
      quickFacts: {
        bestTime: "December to March (skiing), June to September (hiking)",
        language: "German, French, Italian",
        currency: "Swiss Franc (CHF)",
        timezone: "Central European Time (CET)"
      },
      weather: {
        temperature: "8°C",
        condition: "Snow",
        humidity: "85%"
      },
      activities: [
        {
          name: "Matterhorn Glacier Paradise",
          image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7",
          price: 95,
          duration: "4 hours",
          description: "Cable car journey to highest cable car station in Europe"
        },
        {
          name: "Alpine Skiing",
          image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWxwaW5lJTIwc2tpaW5nfGVufDB8fDB8fHww",
          price: 120,
          duration: "Full day",
          description: "World-class skiing on pristine alpine slopes"
        },
        {
          name: "Mountain Hiking Tour",
          image: "data:image/jpeg;base64,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",
          price: 75,
          duration: "6 hours",
          description: "Guided hiking tour through scenic mountain trails"
        },
        {
          name: "Swiss Chocolate Workshop",
          image: "https://images.unsplash.com/photo-1511381939415-e44015466834",
          price: 45,
          duration: "2 hours",
          description: "Learn to make authentic Swiss chocolate from master chocolatiers"
        }
      ]
    },
    'tuscany-italy': {
      id: 6,
      name: "Tuscany, Italy",
      country: "Italy",
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
      rating: 4.8,
      reviews: 734,
      description: "Rolling hills, vineyards, and authentic Italian cuisine define this enchanting region. Tuscany offers Renaissance art, medieval towns, world-renowned wines, and some of the most beautiful countryside in the world.",
      category: "food",
      price: 1300,
      highlights: [
        "Florence Cathedral - Stunning Renaissance architecture",
        "Chianti Wine Region - World-famous vineyards and tastings",
        "Pisa's Leaning Tower - Iconic tilted bell tower",
        "Siena Historic Center - Medieval city with Gothic architecture",
        "Val d'Orcia - UNESCO World Heritage landscape"
      ],
      quickFacts: {
        bestTime: "April to June, September to October",
        language: "Italian",
        currency: "Euro (EUR)",
        timezone: "Central European Time (CET)"
      },
      weather: {
        temperature: "24°C",
        condition: "Sunny",
        humidity: "60%"
      },
      activities: [
        {
          name: "Chianti Wine Tour",
          image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb",
          price: 85,
          duration: "8 hours",
          description: "Visit traditional wineries and taste world-class Chianti wines"
        },
        {
          name: "Cooking Class",
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
          price: 95,
          duration: "4 hours",
          description: "Learn to cook authentic Tuscan dishes with local chef"
        },
        {
          name: "Florence Art Tour",
          image: "https://images.unsplash.com/photo-1543429258-3d2e4e2c4c8e",
          price: 55,
          duration: "3 hours",
          description: "Explore Renaissance masterpieces in the Uffizi Gallery"
        },
        {
          name: "Countryside Bike Tour",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
          price: 65,
          duration: "5 hours",
          description: "Cycle through picturesque Tuscan hills and villages"
        }
      ]
    },
    'costa-rica': {
      id: 7,
      name: "Costa Rica",
      country: "Costa Rica",
      image: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23",
      rating: 4.7,
      reviews: 423,
      description: "Rich biodiversity and stunning natural landscapes make Costa Rica a paradise for nature lovers. From pristine beaches to lush rainforests, this Central American gem offers incredible wildlife and adventure activities.",
      category: "nature",
      price: 1100,
      highlights: [
        "Manuel Antonio National Park - Beaches and wildlife",
        "Arenal Volcano - Active volcano with hot springs",
        "Monteverde Cloud Forest - Unique ecosystem with zip-lining",
        "Tortuguero National Park - Sea turtle nesting site",
        "Tamarindo Beach - World-class surfing destination"
      ],
      quickFacts: {
        bestTime: "December to April",
        language: "Spanish",
        currency: "Costa Rican Colón (CRC)",
        timezone: "Central Standard Time (CST)"
      },
      weather: {
        temperature: "26°C",
        condition: "Tropical",
        humidity: "82%"
      },
      activities: [
        {
          name: "Zip-lining Adventure",
          image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8",
          price: 75,
          duration: "3 hours",
          description: "Soar through the canopy on thrilling zip-line courses"
        },
        {
          name: "Wildlife Safari",
          image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5",
          price: 90,
          duration: "6 hours",
          description: "Spot sloths, monkeys, and exotic birds in their natural habitat"
        },
        {
          name: "Volcano Hike",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
          price: 65,
          duration: "4 hours",
          description: "Hike around active Arenal Volcano with stunning views"
        },
        {
          name: "White Water Rafting",
          image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f",
          price: 85,
          duration: "5 hours",
          description: "Navigate exciting rapids through tropical rainforest"
        }
      ]
    },
    'santorini-greece': {
      id: 8,
      name: "Santorini, Greece",
      country: "Greece",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
      rating: 4.8,
      reviews: 1156,
      description: "Iconic white buildings and spectacular sunsets make Santorini one of the world's most romantic destinations. This volcanic island offers stunning caldera views, unique beaches, and exceptional wines.",
      category: "beach",
      price: 1400,
      highlights: [
        "Oia Village - Famous for spectacular sunsets",
        "Red Beach - Unique red volcanic sand beach",
        "Akrotiri Archaeological Site - Ancient Minoan city",
        "Fira Town - Capital with stunning caldera views",
        "Santo Wines Winery - Volcanic soil wine tasting"
      ],
      quickFacts: {
        bestTime: "April to October",
        language: "Greek",
        currency: "Euro (EUR)",
        timezone: "Eastern European Time (EET)"
      },
      weather: {
        temperature: "25°C",
        condition: "Sunny",
        humidity: "68%"
      },
      activities: [
        {
          name: "Sunset Sailing Tour",
          image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e",
          price: 95,
          duration: "5 hours",
          description: "Sail around the caldera with dinner and sunset views"
        },
        {
          name: "Wine Tasting Tour",
          image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb",
          price: 70,
          duration: "4 hours",
          description: "Taste unique volcanic wines at traditional wineries"
        },
        {
          name: "Volcano Excursion",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
          price: 55,
          duration: "3 hours",
          description: "Boat trip to active volcanic islands in the caldera"
        },
        {
          name: "Photography Tour",
          image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
          price: 80,
          duration: "4 hours",
          description: "Capture the most Instagram-worthy spots with professional guide"
        }
      ]
    },
    'iceland': {
      id: 9,
      name: "Iceland",
      country: "Iceland",
      image: "https://plus.unsplash.com/premium_photo-1700346373090-151ac589b07d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aWNlbGFuZCUyMGJlYWNofGVufDB8fDB8fHww",
      rating: 4.8,
      reviews: 654,
      description: "Land of fire and ice with stunning waterfalls, geysers, and northern lights. Iceland offers dramatic landscapes, from glacial lagoons to volcanic fields, making it a photographer's paradise and nature lover's dream destination.",
      category: "nature",
      price: 1900,
      highlights: [
        "Blue Lagoon - Geothermal spa with milky blue waters",
        "Golden Circle - Geysir, Gullfoss waterfall, and Þingvellir National Park",
        "Northern Lights - Aurora borealis viewing from September to March",
        "Jökulsárlón Glacier Lagoon - Icebergs floating in glacial lake",
        "Reynisfjara Black Sand Beach - Dramatic volcanic beach with basalt columns"
      ],
      quickFacts: {
        bestTime: "June to August (summer), September to March (Northern Lights)",
        language: "Icelandic",
        currency: "Icelandic Króna (ISK)",
        timezone: "Greenwich Mean Time (GMT)"
      },
      weather: {
        temperature: "5°C",
        condition: "Partly Cloudy",
        humidity: "75%"
      },
      activities: [
        {
          name: "Northern Lights Tour",
          image: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73",
          price: 120,
          duration: "4 hours",
          description: "Hunt for the magical aurora borealis with expert guides"
        },
        {
          name: "Golden Circle Tour",
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
          price: 85,
          duration: "8 hours",
          description: "Visit Iceland's most famous natural attractions in one day"
        },
        {
          name: "Blue Lagoon Experience",
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
          price: 65,
          duration: "3 hours",
          description: "Relax in the famous geothermal spa with silica mud masks"
        },
        {
          name: "Glacier Hiking",
          image: "https://images.unsplash.com/photo-1464822759844-d150ad6d1c71",
          price: 150,
          duration: "6 hours",
          description: "Explore ancient glaciers with crampons and ice axes"
        }
      ]
    },
    'barcelona-spain': {
      id: 10,
      name: "Barcelona, Spain",
      country: "Spain",
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4",
      rating: 4.7,
      reviews: 1567,
      description: "Gaudi's architectural masterpieces, vibrant culture, and Mediterranean beaches make Barcelona a perfect blend of art, history, and modern life. From the Gothic Quarter to Park Güell, every corner tells a story.",
      category: "culture",
      price: 1100,
      highlights: [
        "Sagrada Familia - Gaudi's unfinished masterpiece basilica",
        "Park Güell - Colorful mosaic park with city views",
        "Las Ramblas - Famous pedestrian street with street performers",
        "Gothic Quarter - Medieval streets and historic architecture",
        "Casa Batlló - Modernist building with unique facade"
      ],
      quickFacts: {
        bestTime: "May to June, September to October",
        language: "Spanish, Catalan",
        currency: "Euro (EUR)",
        timezone: "Central European Time (CET)"
      },
      weather: {
        temperature: "22°C",
        condition: "Sunny",
        humidity: "62%"
      },
      activities: [
        {
          name: "Sagrada Familia Tour",
          image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4",
          price: 35,
          duration: "2 hours",
          description: "Skip-the-line tour of Gaudi's architectural masterpiece"
        },
        {
          name: "Tapas Walking Tour",
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
          price: 55,
          duration: "3 hours",
          description: "Taste authentic Spanish tapas in local neighborhoods"
        },
        {
          name: "Flamenco Show",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
          price: 45,
          duration: "1.5 hours",
          description: "Experience passionate flamenco dancing and music"
        },
        {
          name: "Gothic Quarter Walking Tour",
          image: "https://images.unsplash.com/photo-1543429258-3d2e4e2c4c8e",
          price: 25,
          duration: "2.5 hours",
          description: "Explore medieval streets and hidden squares"
        }
      ]
    },
    'dubai-uae': {
      id: 11,
      name: "Dubai, UAE",
      country: "United Arab Emirates",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
      rating: 4.6,
      reviews: 1340,
      description: "Luxury shopping, ultramodern architecture, and desert adventures in the Middle East. Dubai offers world-class attractions, from the tallest building to artificial islands, blending tradition with futuristic innovation.",
      category: "city",
      price: 1600,
      highlights: [
        "Burj Khalifa - World's tallest building with observation decks",
        "Dubai Mall - Massive shopping center with aquarium and ice rink",
        "Palm Jumeirah - Artificial island with luxury resorts",
        "Dubai Marina - Stunning waterfront with skyscrapers",
        "Gold Souk - Traditional market for gold and jewelry"
      ],
      quickFacts: {
        bestTime: "November to March",
        language: "Arabic, English",
        currency: "UAE Dirham (AED)",
        timezone: "Gulf Standard Time (GST)"
      },
      weather: {
        temperature: "28°C",
        condition: "Clear",
        humidity: "55%"
      },
      activities: [
        {
          name: "Burj Khalifa Experience",
          image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
          price: 85,
          duration: "2 hours",
          description: "Visit the world's tallest building and observation deck"
        },
        {
          name: "Desert Safari",
          image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f",
          price: 75,
          duration: "6 hours",
          description: "Dune bashing, camel riding, and traditional Bedouin dinner"
        },
        {
          name: "Dubai Marina Cruise",
          image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52",
          price: 45,
          duration: "2 hours",
          description: "Luxury yacht cruise with stunning skyline views"
        },
        {
          name: "Shopping Tour",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
          price: 40,
          duration: "4 hours",
          description: "Explore traditional souks and modern shopping malls"
        }
      ]
    },
    'goa-india': {
      id: 12,
      name: "Goa, India",
      country: "India",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
      rating: 4.5,
      reviews: 892,
      description: "Beautiful beaches, Portuguese architecture, and vibrant nightlife in India's coastal paradise. Goa offers a unique blend of Indian and Portuguese cultures, with stunning beaches and laid-back atmosphere.",
      category: "beach",
      price: 600,
      highlights: [
        "Baga Beach - Popular beach with water sports and nightlife",
        "Old Goa Churches - UNESCO World Heritage Portuguese churches",
        "Anjuna Flea Market - Vibrant market with local crafts and food",
        "Dudhsagar Falls - Spectacular four-tiered waterfall",
        "Spice Plantations - Aromatic tours through cardamom and pepper farms"
      ],
      quickFacts: {
        bestTime: "November to February",
        language: "Hindi, English, Konkani",
        currency: "Indian Rupee (INR)",
        timezone: "India Standard Time (IST)"
      },
      weather: {
        temperature: "30°C",
        condition: "Sunny",
        humidity: "80%"
      },
      activities: [
        {
          name: "Beach Hopping Tour",
          image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
          price: 35,
          duration: "8 hours",
          description: "Visit multiple beaches from Baga to Palolem with lunch"
        },
        {
          name: "Spice Plantation Tour",
          image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b",
          price: 25,
          duration: "4 hours",
          description: "Learn about spice cultivation with traditional Goan lunch"
        },
        {
          name: "Water Sports Package",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
          price: 50,
          duration: "3 hours",
          description: "Parasailing, jet skiing, and banana boat rides"
        },
        {
          name: "Old Goa Heritage Tour",
          image: "https://images.unsplash.com/photo-1543429258-3d2e4e2c4c8e",
          price: 20,
          duration: "3 hours",
          description: "Explore Portuguese colonial architecture and churches"
        }
      ]
    }
  };

  useEffect(() => {
    if (destinationName) {
      const destinationKey = destinationName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const destinationData = destinationsData[destinationKey];
      
      if (destinationData) {
        setDestination(destinationData);
        // Load booked activities for this destination
        loadBookedActivities(destinationData);
      }
      setIsLoading(false);
    }
  }, [destinationName]);

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
        title: "Already Booked",
        description: `You have already booked ${activity.name}`,
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
        title: "Activity Booked!",
        description: `Successfully booked ${activity.name} for ${activity.price}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Failed to book activity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBookNow = () => {
    if (destination) {
      navigate('/payment', { state: { destinationId: destination.id } });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Destination Not Found</h1>
          <p className="text-muted-foreground mb-6">The destination you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/explore')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/explore')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Explore
        </Button>

        {/* Hero Section */}
        <div className="relative mb-8">
          <div className="aspect-[21/9] overflow-hidden rounded-lg">
            <img 
              src={destination.image} 
              alt={destination.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-4 right-4">
            <ActionButtons
              itemId={destination.id}
              itemTitle={destination.name}
              showFavorites={true}
              showShare={true}
              size="sm"
              variant="ghost"
              className="bg-white/90 hover:bg-white"
            />
          </div>
        </div>

        {/* Title and Rating */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{destination.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{destination.rating}</span>
                <span className="text-muted-foreground">({destination.reviews} reviews)</span>
              </div>
              <Badge variant="secondary" className="capitalize">
                {destination.category}
              </Badge>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-3xl font-bold text-primary">${destination.price}</p>
            <p className="text-sm text-muted-foreground">per person</p>
            <Button className="mt-2 bg-gradient-hero hover:opacity-90" onClick={handleBookNow}>
              Book Now
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">About this destination</h2>
              <p className="text-muted-foreground leading-relaxed">
                {destination.description}
              </p>
            </section>

            {/* Highlights */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
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
              <h2 className="text-2xl font-semibold mb-6">Popular Activities</h2>
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
                                Booked
                              </>
                            ) : (
                              "Book Activity"
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
                  Quick Facts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Best Time to Visit</p>
                    <p className="text-sm text-muted-foreground">{destination.quickFacts.bestTime}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Language</p>
                    <p className="text-sm text-muted-foreground">{destination.quickFacts.language}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Currency</p>
                    <p className="text-sm text-muted-foreground">{destination.quickFacts.currency}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Time Zone</p>
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
                  Current Weather
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold mb-2">{destination.weather.temperature}</p>
                  <p className="text-muted-foreground mb-4">{destination.weather.condition}</p>
                  <div className="flex justify-between text-sm">
                    <span>Humidity</span>
                    <span>{destination.weather.humidity}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Book Now Card */}
            <Card className="bg-gradient-hero text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Ready to explore?</h3>
                <p className="text-white/90 mb-4">Book your trip to {destination.name} today!</p>
                <Button 
                  className="w-full bg-white text-primary hover:bg-white/90"
                  onClick={handleBookNow}
                >
                  Book Now - ${destination.price}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DestinationDetail;