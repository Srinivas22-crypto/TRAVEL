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
          image: "https://images.unsplash.com/photo-1593332934274-8845c859c4a5",
          price: 45,
          duration: "3 hours",
          description: "Skip-the-line guided tour of the world's most famous museum"
        },
        {
          name: "Eiffel Tower Experience",
          image: "https://images.unsplash.com/photo-1511383879784-a960bf40e7f2",
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
          image: "https://images.unsplash.com/photo-1513407030348-c983a97b998d",
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
      image: "https://images.unsplash.com/photo-1496442226666-47ad22581b52",
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
          image: "https://images.unsplash.com/photo-1540555700478-f5c462d49f74",
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
          image: "https://images.unsplash.com/photo-1531366936337-47ad22581b52",
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
          image: "https://images.unsplash.com/photo-1511383879784-a960bf40e7f2",
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
      image: "https://images.unsplash.com/photo-1523906834658-6eab9bab7b23",
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
        </div>

        {/* Title and Rating */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{destination.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 mr-2" />
                <span className="font-semibold">{destination.rating}</span>
                <span className="text-muted-foreground">({destination.reviews} reviews)</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>{destination.reviews.toLocaleString()} Reviews</span>
              </div>
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