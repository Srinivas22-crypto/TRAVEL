import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Feed from '@/components/Feed';
import CreatePostModal from '@/components/CreatePostModal';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import communityService from '@/services/communityService';
import {
  Plus,
  TrendingUp
} from 'lucide-react';

const Community = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const response = await communityService.getPosts({ limit: 10 });
      setPosts(response.posts);
    } catch (error) {
      console.error('Failed to load posts:', error);
      // Fall back to mock data
      setPosts(mockPosts);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostCreated = (newPost: any) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    toast({
      title: "Post created!",
      description: "Your travel experience has been shared with the community.",
    });
  };

  // Mock data for fallback
  const mockPosts = [
    {
      id: 1,
      author: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786",
        username: "@sarahj"
      },
      content: "Just had the most amazing sunset in Santorini! The blue domes and white buildings create such a magical atmosphere. Already planning my next visit! 🌅",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
      location: "Santorini, Greece",
      timestamp: "2 hours ago",
      likes: 127,
      comments: 23,
      shares: 8,
      tags: ["sunset", "santorini", "greece", "travel"]
    },
    {
      id: 2,
      author: {
        name: "Mike Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        username: "@mikec"
      },
      content: "Tokyo's street food scene is absolutely incredible! Spent the whole day exploring Shibuya and trying different foods. The ramen here is on another level 🍜",
      image: "https://images.unsplash.com/photo-1613929633558-2448d2d03521",
      location: "Tokyo, Japan",
      timestamp: "5 hours ago",
      likes: 89,
      comments: 15,
      shares: 12,
      tags: ["tokyo", "food", "ramen", "streetfood"]
    },
    {
      id: 3,
      author: {
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        username: "@emmaw"
      },
      content: "Hiking in the Swiss Alps was a dream come true! The views from Matterhorn are absolutely breathtaking. Nature never fails to amaze me 🏔️",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      location: "Swiss Alps, Switzerland",
      timestamp: "1 day ago",
      likes: 203,
      comments: 34,
      shares: 19,
      tags: ["hiking", "alps", "switzerland", "nature"]
    },
    {
      id: 4,
      author: {
        name: "Alex Rivera",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        username: "@alexr"
      },
      content: "Exploring the vibrant markets of Marrakech was an incredible sensory experience! The colors, sounds, and aromas are unforgettable. 🇲🇦",
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e",
      location: "Marrakech, Morocco",
      timestamp: "3 days ago",
      likes: 156,
      comments: 28,
      shares: 15,
      tags: ["morocco", "markets", "culture", "adventure"]
    }
  ];

  
  const trendingTopics = [
    { name: "#SustainableTravel", posts: 2340 },
    { name: "#HiddenGems", posts: 1890 },
    { name: "#FoodieTravel", posts: 3210 },
    { name: "#AdventureTravel", posts: 2760 },
    { name: "#TravelTips", posts: 4120 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Travel Community
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with fellow travelers, share your experiences, and discover amazing destinations together
          </p>
          
          <div className="flex gap-4 justify-center">
            <CreatePostModal onPostCreated={handlePostCreated}>
              <Button className="bg-gradient-hero hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </CreatePostModal>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Feed 
              posts={posts.length > 0 ? posts : mockPosts}
              onRefresh={loadPosts}
              isLoading={isLoading}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic) => (
                    <div key={topic.name} className="flex justify-between items-center">
                      <span className="font-medium text-primary hover:underline cursor-pointer">
                        {topic.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {topic.posts.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">50,000+</p>
                    <p className="text-sm text-muted-foreground">Active Travelers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-secondary">120,000+</p>
                    <p className="text-sm text-muted-foreground">Shared Experiences</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">180+</p>
                    <p className="text-sm text-muted-foreground">Countries Visited</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CreatePostModal onPostCreated={handlePostCreated}>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Share Experience
                  </Button>
                </CreatePostModal>
                                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending Posts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;