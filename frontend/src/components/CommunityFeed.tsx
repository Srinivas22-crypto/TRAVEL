import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, MapPin, Camera, Users, Plus, CameraOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const mockPosts = [
  {
    id: 1,
    user: {
      name: 'Sarah Chen',
      avatar: '',
      verified: true,
      location: 'Tokyo, Japan',
    },
    content: 'Just discovered this amazing hidden ramen shop in Shibuya! The tonkotsu broth is absolutely incredible. Perfect after a long day exploring the city. 🍜✨',
    images: ['/2018b5db-0b62-4e2e-a2d3-3dd8452f3d6f.png'],
    location: 'Shibuya, Tokyo',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    tags: ['food', 'tokyo', 'ramen', 'hidden-gems'],
    type: 'story',
  },
  {
    id: 2,
    user: {
      name: 'Alex Rodriguez',
      avatar: '',
      verified: false,
      location: 'Barcelona, Spain',
    },
    content: '💡 Pro tip: Always book your train tickets in advance when traveling through Europe. Just saved 40% on my Barcelona to Paris journey by booking 2 weeks ahead!',
    images: [],
    location: 'Barcelona, Spain',
    timestamp: '4 hours ago',
    likes: 156,
    comments: 23,
    tags: ['tips', 'europe', 'budget', 'trains'],
    type: 'tip',
  },
  {
    id: 3,
    user: {
      name: 'Maya Patel',
      avatar: '',
      verified: true,
      location: 'Bali, Indonesia',
    },
    content: 'Sunrise at Mount Batur was absolutely breathtaking! Started the hike at 3 AM and it was so worth it. The view over Lake Batur is something I\'ll never forget. 🌄',
    images: ['mountain-sunrise.jpg', 'lake-view.jpg'],
    location: 'Mount Batur, Bali',
    timestamp: '1 day ago',
    likes: 89,
    comments: 15,
    tags: ['adventure', 'bali', 'hiking', 'sunrise'],
    type: 'photo',
  },
];

export const CommunityFeed = () => {
  const { t } = useTranslation();
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState(mockPosts);
  const [selectedTab, setSelectedTab] = useState('all');

  const tabs = [
    { id: 'all', label: t('communityFeed.tabs.all'), icon: Users },
    { id: 'stories', label: t('communityFeed.tabs.stories'), icon: MessageCircle },
    { id: 'tips', label: t('communityFeed.tabs.tips'), icon: Heart },
    { id: 'photos', label: t('communityFeed.tabs.photos'), icon: Camera },
  ];

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post = {
      id: posts.length + 1,
      user: {
        name: t('communityFeed.you'),
        avatar: '',
        verified: false,
        location: t('communityFeed.currentLocation'),
      },
      content: newPost,
      images: [],
      location: t('communityFeed.yourLocation'),
      timestamp: t('communityFeed.justNow'),
      likes: 0,
      comments: 0,
      tags: ['travel'],
      type: 'story',
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const filteredPosts = selectedTab === 'all' 
    ? posts 
    : posts.filter(post => 
        selectedTab === 'stories' ? post.type === 'story' :
        selectedTab === 'tips' ? post.type === 'tip' :
        selectedTab === 'photos' ? post.type === 'photo' :
        true
      );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex space-x-1 bg-muted rounded-lg p-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all ${
                    selectedTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Create Post */}
      <Card className="bg-card border-border shadow-elegant">
        <CardHeader className="bg-gradient-sky text-accent-foreground">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>{t('communityFeed.you')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{t('communityFeed.shareExperience')}</h3>
              <p className="text-sm opacity-90">{t('communityFeed.tellCommunity')}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <Textarea
            placeholder={t('communityFeed.textareaPlaceholder')}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px] mb-4"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                {t('communityFeed.addPhotos')}
              </Button>
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                {t('communityFeed.addLocation')}
              </Button>
            </div>
            <Button onClick={handleCreatePost} variant="hero" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {t('communityFeed.share')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="bg-card border-border shadow-elegant">
            <CardContent className="p-6">
              {/* Post Header */}
              <div className="flex items-start gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={post.user.avatar} />
                  <AvatarFallback>{post.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{post.user.name}</h4>
                    {post.user.verified && (
                      <Badge variant="success" className="h-5 px-2 text-xs">✓</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{t('communityFeed.location', { location: post.user.location })}</p>
                  <p className="text-xs text-muted-foreground">{t('communityFeed.timestamp', { timestamp: post.timestamp })}</p>
                </div>
                <Badge 
                  variant={post.type === 'tip' ? 'warning' : post.type === 'photo' ? 'success' : 'default'}
                  className="capitalize"
                >
                  {t(`communityFeed.postTypes.${post.type}`)}
                </Badge>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-foreground mb-3">{post.content}</p>
                
                {/* Location */}
                {post.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{t('communityFeed.location', { location: post.location })}</span>
                  </div>
                )}

                {/* Images */}
                {post.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {post.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={t('communityFeed.postImageAlt', { index: index + 1 })}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-destructive"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-muted-foreground hover:text-secondary"
                  >
                    <Share2 className="h-4 w-4" />
                    {t('communityFeed.share')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
