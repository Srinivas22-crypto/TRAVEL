import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  MapPin, 
  Calendar,
  Camera,
  Plus,
  Search,
  Bookmark,
  TrendingUp
} from 'lucide-react';

const Community = () => {
  const { t } = useTranslation();
  const posts = [
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
    }
  ];

  const travelGroups = [
    {
      id: 1,
      name: "Solo Travelers Unite",
      members: 15420,
      description: "Connect with fellow solo travelers and share experiences",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
      category: "Solo Travel"
    },
    {
      id: 2,
      name: "Budget Backpackers",
      members: 8930,
      description: "Tips and tricks for traveling on a budget",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      category: "Budget Travel"
    },
    {
      id: 3,
      name: "Photography Enthusiasts",
      members: 12600,
      description: "Share your travel photography and get inspired",
      image: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81",
      category: "Photography"
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
            {t('community.title')}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('community.subtitle')}
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button className="bg-gradient-hero hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              {t('community.shareStory')}
            </Button>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Join Groups
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="feed" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="feed">Feed</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
                <TabsTrigger value="create">Create Post</TabsTrigger>
              </TabsList>

              {/* Feed Tab */}
              <TabsContent value="feed" className="space-y-6">
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{post.author.name}</h3>
                            <span className="text-muted-foreground text-sm">{post.author.username}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {post.location}
                            <span>•</span>
                            <span>{post.timestamp}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="mb-4">{post.content}</p>
                      
                      {post.image && (
                        <div className="aspect-video overflow-hidden rounded-lg mb-4">
                          <img 
                            src={post.image} 
                            alt="Post image"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                            <Heart className="h-4 w-4 mr-1" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500">
                            <Share2 className="h-4 w-4 mr-1" />
                            {post.shares}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Groups Tab */}
              <TabsContent value="groups" className="space-y-6">
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search groups..." className="pl-10" />
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {travelGroups.map((group) => (
                    <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={group.image} 
                          alt={group.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{group.name}</h3>
                          <Badge variant="outline">{group.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {group.members.toLocaleString()} members
                          </div>
                          <Button size="sm">Join Group</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Create Post Tab */}
              <TabsContent value="create">
                <Card>
                  <CardHeader>
                    <CardTitle>Share Your Travel Experience</CardTitle>
                    <CardDescription>Tell the community about your latest adventure</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="location" placeholder="Where did you go?" className="pl-10" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Your Story</Label>
                      <Textarea 
                        id="content" 
                        placeholder="Share your experience, tips, and memorable moments..."
                        rows={6}
                      />
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Add Photos
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Add Location
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input id="tags" placeholder="adventure, beach, foodie (separate with commas)" />
                    </div>
                    
                    <Button className="w-full bg-gradient-hero hover:opacity-90">
                      Share Your Experience
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;