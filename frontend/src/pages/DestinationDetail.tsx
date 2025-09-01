import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ActionButtons from '@/components/ActionButtons';
import { useTranslation } from 'react-i18next';
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
  Plane
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
  const [destination, setDestination] = useState<DestinationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52",
          price: 25,
          duration: "1 hour",
          description: "Romantic boat cruise along the Seine with views of iconic landmarks"
        },
        {
          name: "Louvre Museum Tour",
          image: "https://images.unsplash.com/photo-1566139884456-c9b0b8b3b8b5",
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
          image: "https://images.unsplash.com/photo-1551524164-6cf2ac2d8c9c",
          price: 120,
          duration: "Full day",
          description: "World-class skiing on pristine alpine slopes"
        },
        {
          name: "Mountain Hiking Tour",
          image: "https://images.unsplash.com/photo-1464822759844-d150ad6d1c71",
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
      image: "https://images.unsplash.com/photo-1539066834862-2e0c2e2c9b8e",
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
      }
      setIsLoading(false);
    }
  }, [destinationName]);

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
              variant="secondary"
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
                {destination.activities.map((activity, index) => (
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
                        <Button size="sm" variant="outline">
                          Book Activity
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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