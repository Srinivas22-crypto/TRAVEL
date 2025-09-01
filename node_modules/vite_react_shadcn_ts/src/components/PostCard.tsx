import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Bookmark,
  MoreHorizontal
} from 'lucide-react';

interface PostCardProps {
  post: {
    id: number;
    author: {
      name: string;
      avatar: string;
      username: string;
    };
    content: string;
    image?: string;
    location: string;
    timestamp: string;
    likes: number;
    comments: number;
    shares: number;
    tags: string[];
  };
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment, onShare }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const { toast } = useToast();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(post.id);
    
    if (!isLiked) {
      toast({
        title: "Post liked!",
        description: "You liked this post",
        duration: 2000,
      });
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked ? "Post removed from your bookmarks" : "Post saved to your bookmarks",
      duration: 2000,
    });
  };

  const handleComment = () => {
    onComment?.(post.id);
    // For now, just show a toast - in a real app, this would open a comment modal
    toast({
      title: "Comments",
      description: "Comment functionality coming soon!",
      duration: 2000,
    });
  };

  const handleShare = () => {
    onShare?.(post.id);
    // Copy post link to clipboard
    const postUrl = `${window.location.origin}/community/post/${post.id}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "Post link copied to clipboard",
        duration: 2000,
      });
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="cursor-pointer">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold hover:underline cursor-pointer">{post.author.name}</h3>
              <span className="text-muted-foreground text-sm">{post.author.username}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {post.location}
              <span>•</span>
              <span>{post.timestamp}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleBookmark}
              className={isBookmarked ? 'text-yellow-500' : 'text-muted-foreground'}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="mb-4 leading-relaxed">{post.content}</p>
        
        {post.image && (
          <div className="aspect-video overflow-hidden rounded-lg mb-4 cursor-pointer group">
            <img 
              src={post.image} 
              alt="Post image"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              #{tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike}
              className={`transition-colors ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {likeCount}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleComment}
              className="text-muted-foreground hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comments}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShare}
              className="text-muted-foreground hover:text-green-500 transition-colors"
            >
              <Share2 className="h-4 w-4 mr-1" />
              {post.shares}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;