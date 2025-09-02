import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import authService from '@/services/authService';
import activityService from '@/services/activityService';
import { ActivityBooking } from '@/lib/api';
import {
  User,
  MapPin,
  Calendar,
  Settings,
  ArrowLeft,
  Loader2,
  FileText,
  Heart,
  Bookmark,
  MessageCircle,
  Camera,
  Edit,
  Activity,
  Clock,
  X,
  Users
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Post {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    avatar: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  image?: string;
  location?: string;
  tags?: string[];
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserComment {
  id: number;
  content: string;
  timestamp: string;
  likes: number;
  createdAt: string;
  post: {
    id: number;
    title: string;
    content: string;
    author: {
      name: string;
      avatar: string;
    };
  };
}

interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isLoading: authLoading, updateUser } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('posts');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [userComments, setUserComments] = useState<UserComment[]>([]);
  const [bookedActivities, setBookedActivities] = useState<ActivityBooking[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [stats, setStats] = useState({
    posts: 0,
    liked: 0,
    saved: 0,
    comments: 0,
    activities: 0
  });

  // Get authentication token
  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  };

  // API call helper function
  const apiCall = async (endpoint: string) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`/api${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, redirect to login
        navigate('/signin');
        throw new Error('Authentication failed');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  // Fetch user-specific posts created by the logged-in user
  const fetchUserPosts = async (): Promise<Post[]> => {
    try {
      const response: ApiResponse<Post> = await apiCall('/user/posts');
      return response.data.filter(post => post.author.id === user?.id);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      // Return mock data for demonstration
      return [
        {
          id: 1,
          content: "Just returned from an amazing trip to Tokyo! The cherry blossoms were absolutely stunning. Can't wait to go back next spring! 🌸",
          author: {
            id: user?._id || 1,
            name: getUserFullName(),
            avatar: user?.profileImage || ""
          },
          timestamp: "2 days ago",
          likes: 24,
          comments: 8,
          image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
          location: "Tokyo, Japan",
          tags: ["#Tokyo", "#CherryBlossoms", "#Japan", "#Travel"],
          isLiked: false,
          isBookmarked: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          content: "Sunset views from Santorini never get old. This place is pure magic! ✨",
          author: {
            id: user?._id || 1,
            name: getUserFullName(),
            avatar: user?.profileImage || ""
          },
          timestamp: "1 week ago",
          likes: 42,
          comments: 12,
          image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
          location: "Santorini, Greece",
          tags: ["#Santorini", "#Sunset", "#Greece", "#Paradise"],
          isLiked: true,
          isBookmarked: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
  };

  // Fetch posts liked by the logged-in user
  const fetchLikedPosts = async (): Promise<Post[]> => {
    try {
      const response: ApiResponse<Post> = await apiCall('/user/likes');
      return response.data;
    } catch (error) {
      console.error('Error fetching liked posts:', error);
      // Return mock data for demonstration
      return [
        {
          id: 3,
          content: "Hidden gem in Tuscany! This little village has the best pasta I've ever tasted 🍝",
          author: {
            id: 2,
            name: "Maria Rodriguez",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786"
          },
          timestamp: "3 days ago",
          likes: 18,
          comments: 5,
          image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
          location: "Tuscany, Italy",
          tags: ["#Tuscany", "#Italy", "#Food", "#HiddenGem"],
          isLiked: true,
          isBookmarked: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
  };

  // Fetch posts saved/bookmarked by the logged-in user
  const fetchSavedPosts = async (): Promise<Post[]> => {
    try {
      const response: ApiResponse<Post> = await apiCall('/user/saved');
      return response.data;
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      // Return mock data for demonstration
      return [
        {
          id: 4,
          content: "Ultimate packing guide for backpacking through Southeast Asia! Save this for your next adventure 🎒",
          author: {
            id: 3,
            name: "Travel Pro",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
          },
          timestamp: "5 days ago",
          likes: 156,
          comments: 23,
          location: "Southeast Asia",
          tags: ["#Backpacking", "#PackingTips", "#SoutheastAsia", "#Travel"],
          isLiked: false,
          isBookmarked: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
  };

  // Fetch comments made by the logged-in user
  const fetchUserComments = async (): Promise<UserComment[]> => {
    try {
      const response: ApiResponse<UserComment> = await apiCall('/user/comments');
      return response.data;
    } catch (error) {
      console.error('Error fetching user comments:', error);
      // Return mock data for demonstration
      return [
        {
          id: 1,
          content: "This looks absolutely incredible! Adding it to my bucket list right now 😍",
          timestamp: "1 day ago",
          likes: 5,
          createdAt: new Date().toISOString(),
          post: {
            id: 10,
            title: "Breathtaking Northern Lights in Iceland",
            content: "Just witnessed the most amazing aurora display...",
            author: {
              name: "Arctic Explorer",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
            }
          }
        },
        {
          id: 2,
          content: "Thanks for sharing these tips! Just booked my flight to Bali because of this post 🏝️",
          timestamp: "3 days ago",
          likes: 12,
          createdAt: new Date().toISOString(),
          post: {
            id: 11,
            title: "Best Time to Visit Bali: A Complete Guide",
            content: "After living in Bali for 2 years, here's everything you need to know...",
            author: {
              name: "Bali Local",
              avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786"
            }
          }
        }
      ];
    }
  };

  // Fetch user data based on active tab
  const fetchUserData = async (tab: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      let data;
      switch (tab) {
        case 'posts':
          data = await fetchUserPosts();
          setUserPosts(data);
          break;
        case 'liked':
          data = await fetchLikedPosts();
          setLikedPosts(data);
          break;
        case 'saved':
          data = await fetchSavedPosts();
          setSavedPosts(data);
          break;
        case 'comments':
          data = await fetchUserComments();
          setUserComments(data);
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${tab} data:`, error);
      toast({
        title: "Error",
        description: `Failed to load ${tab}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all stats for the profile header
  const fetchUserStats = async () => {
    if (!user) return;

    try {
      const [posts, liked, saved, comments] = await Promise.all([
        fetchUserPosts(),
        fetchLikedPosts(),
        fetchSavedPosts(),
        fetchUserComments()
      ]);

      const activities = activityService.getBookedActivities();

      setStats({
        posts: posts.length,
        liked: liked.length,
        saved: saved.length,
        comments: comments.length,
        activities: activities.length
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Set default stats with activities
      const activities = activityService.getBookedActivities();
      setStats({
        posts: 2,
        liked: 1,
        saved: 1,
        comments: 2,
        activities: activities.length
      });
    }
  };

  // Load booked activities
  useEffect(() => {
    const loadBookedActivities = () => {
      setIsLoadingActivities(true);
      try {
        const activities = activityService.getBookedActivities();
        setBookedActivities(activities);
      } catch (error) {
        console.error('Failed to load booked activities:', error);
      } finally {
        setIsLoadingActivities(false);
      }
    };

    loadBookedActivities();

    // Listen for activity booking events
    const handleActivityBooked = (event: CustomEvent) => {
      setBookedActivities(prev => [...prev, event.detail]);
      setStats(prev => ({ ...prev, activities: prev.activities + 1 }));
    };

    const handleActivityCancelled = (event: CustomEvent) => {
      setBookedActivities(prev => prev.filter(activity => activity.id !== event.detail.id));
      setStats(prev => ({ ...prev, activities: Math.max(0, prev.activities - 1) }));
    };

    window.addEventListener('activity:booked', handleActivityBooked as EventListener);
    window.addEventListener('activity:cancelled', handleActivityCancelled as EventListener);

    return () => {
      window.removeEventListener('activity:booked', handleActivityBooked as EventListener);
      window.removeEventListener('activity:cancelled', handleActivityCancelled as EventListener);
    };
  }, []);

  // Handle activity cancellation
  const handleCancelActivity = (bookingId: string) => {
    const success = activityService.cancelBooking(bookingId);
    if (success) {
      setBookedActivities(prev => prev.filter(activity => activity.id !== bookingId));
      setStats(prev => ({ ...prev, activities: Math.max(0, prev.activities - 1) }));
      toast({
        title: "Activity cancelled",
        description: "Your activity booking has been cancelled successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to cancel activity booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Load data when tab changes
  useEffect(() => {
    if (user) {
      fetchUserData(activeTab);
    }
  }, [activeTab, user]);

  // Load stats when component mounts
  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
    }
  }, [user, authLoading, navigate]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const getUserFullName = () => {
    if (!user) return 'User';
    return `${user.firstName} ${user.lastName}`.trim() || 'User';
  };

  // Handle profile image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingImage(true);

    try {
      console.log('📸 Uploading profile image:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      const result = await authService.uploadProfileImage(file);
      
      console.log('✅ Profile image uploaded successfully:', result);

      // Update user profile with new image URL
      await updateUser({ profileImage: result.imageUrl });

      toast({
        title: "Profile picture updated!",
        description: "Your profile picture has been successfully updated.",
      });

    } catch (error: any) {
      console.error('❌ Failed to upload profile image:', error.message);
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
      // Clear the input value so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  // Trigger file input click
  const triggerImageUpload = () => {
    const fileInput = document.getElementById('profile-image-upload') as HTMLInputElement;
    fileInput?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/home')}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">View your travel posts and activity</p>
          </div>
        </div>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.profileImage} alt={getUserFullName()} />
                  <AvatarFallback className="text-xl">
                    {getInitials(getUserFullName())}
                  </AvatarFallback>
                </Avatar>
                
                {/* Camera button for profile picture upload */}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={triggerImageUpload}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </Button>
                
                {/* Hidden file input */}
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl font-semibold">{getUserFullName()}</h2>
                      {user.isVerified && (
                        <Badge variant="secondary">Verified</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2">{user.email}</p>
                    {user.bio && (
                      <p className="text-sm text-muted-foreground mb-2">{user.bio}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined March 2024</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>Travel Enthusiast</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/profile-settings')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/profile-settings')}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <Separator className="my-6" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.posts}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.liked}</div>
                <div className="text-sm text-muted-foreground">Liked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.saved}</div>
                <div className="text-sm text-muted-foreground">Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.comments}</div>
                <div className="text-sm text-muted-foreground">Comments</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              My Posts
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              My Activities
            </TabsTrigger>
            <TabsTrigger value="liked" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Liked Posts
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              Saved Posts
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Comments
            </TabsTrigger>
          </TabsList>

          {/* My Posts Tab */}
          <TabsContent value="posts">
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading posts...</span>
                </div>
              ) : userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Share your travel experiences with the community!
                    </p>
                    <Button onClick={() => navigate('/community')}>
                      Create Your First Post
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          
          {/* My Activities Tab */}
          <TabsContent value="activities">
            <div className="space-y-6">
              {isLoadingActivities ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading your activities...</span>
                </div>
              ) : bookedActivities.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Activities Booked Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start exploring destinations and book exciting activities to see them here.
                    </p>
                    <Button 
                      onClick={() => navigate('/explore')}
                      className="bg-gradient-hero hover:opacity-90"
                    >
                      Explore Destinations
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Activity className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-bold">{bookedActivities.length}</div>
                        <div className="text-sm text-muted-foreground">Total Activities</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <MapPin className="h-6 w-6 mx-auto mb-2 text-green-500" />
                        <div className="text-2xl font-bold">
                          {new Set(bookedActivities.map(a => a.destination)).size}
                        </div>
                        <div className="text-sm text-muted-foreground">Destinations</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Calendar className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                        <div className="text-2xl font-bold">
                          ${activityService.getTotalAmountSpent()}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Spent</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Activities List */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your Booked Activities</h3>
                    <div className="grid gap-4">
                      {bookedActivities.map((activity) => (
                        <Card key={activity.id} className="overflow-hidden">
                          <div className="flex">
                            <div className="w-32 h-24 flex-shrink-0">
                              <img 
                                src={activity.activityImage} 
                                alt={activity.activityName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg mb-1">
                                    {activity.activityName}
                                  </h4>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {activity.destination}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {activity.duration}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Booked on {formatDate(activity.bookedAt)}
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-green-600 border-green-600">
                                        ${activity.price}
                                      </Badge>
                                      <Badge variant="secondary">
                                        {activity.status === 'booked' ? 'Active' : 'Cancelled'}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <X className="h-3 w-3 mr-1" />
                                        Cancel
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Cancel Activity Booking</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to cancel your booking for "{activity.activityName}"? 
                                          This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleCancelActivity(activity.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Cancel Booking
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Liked Posts Tab */}
          <TabsContent value="liked">
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading liked posts...</span>
                </div>
              ) : likedPosts.length > 0 ? (
                likedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No liked posts</h3>
                    <p className="text-muted-foreground mb-4">
                      Posts you like will appear here
                    </p>
                    <Button onClick={() => navigate('/community')}>
                      Explore Community
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Saved Posts Tab */}
          <TabsContent value="saved">
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading saved posts...</span>
                </div>
              ) : savedPosts.length > 0 ? (
                savedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No saved posts</h3>
                    <p className="text-muted-foreground mb-4">
                      Posts you bookmark will appear here
                    </p>
                    <Button onClick={() => navigate('/community')}>
                      Find Posts to Save
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments">
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading comments...</span>
                </div>
              ) : userComments.length > 0 ? (
                userComments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profileImage} alt={getUserFullName()} />
                          <AvatarFallback className="text-xs">
                            {getInitials(getUserFullName())}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{getUserFullName()}</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Commented on: <span className="font-medium">{comment.post.title}</span>
                          </p>
                          <p className="text-sm mb-2">{comment.content}</p>
                          <div className="bg-muted/50 p-3 rounded-md">
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={comment.post.author.avatar} alt={comment.post.author.name} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(comment.post.author.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium">{comment.post.author.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{comment.post.content}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                              <Heart className="h-3 w-3" />
                              {comment.likes}
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Your comments on posts will appear here
                    </p>
                    <Button onClick={() => navigate('/community')}>
                      Join Conversations
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;