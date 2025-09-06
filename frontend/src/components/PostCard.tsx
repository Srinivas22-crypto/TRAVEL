import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PostOptionsMenu from './PostOptionsMenu';
import CommentsSection from './CommentsSection';
import postService, { Post, Comment } from '@/services/postService';
import { useAuth } from '@/contexts/AuthContext';
import LocationCardMenu from './LocationCardMenu';

interface PostCardProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
  onPostDelete?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onPostUpdate,
  onPostDelete
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [shareCount, setShareCount] = useState(post.shares || 0);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && post.likes && Array.isArray(post.likes)) {
      setIsLiked(post.likes.includes(user._id));
    }
  }, [post.likes, user]);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like posts",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isLiked) {
        const response = await postService.unlikePost(post._id);
        setLikeCount(response.data.likeCount);
        setIsLiked(false);
      } else {
        const response = await postService.likePost(post._id);
        setLikeCount(response.data.likeCount);
        setIsLiked(true);
        toast({
          title: "Post liked!",
          description: "You liked this post",
          duration: 2000,
        });
      }
    } catch (error: any) {
      console.error('Like error:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update like status";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save posts",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        await postService.unsavePost(post._id);
        setIsSaved(false);
        toast({
          title: "Removed from saved posts",
          description: "Post removed from your saved posts",
          duration: 2000,
        });
      } else {
        await postService.savePost(post._id);
        setIsSaved(true);
        toast({
          title: "Post saved!",
          description: "Post added to your saved posts",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update save status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = () => {
    setShowComments(true);
  };

  const handleShare = async () => {
    try {
      await postService.sharePost(post._id);
      setShareCount(prev => prev + 1);
      
      // Copy post link to clipboard
      const postUrl = `${window.location.origin}/community/post/${post._id}`;
      await navigator.clipboard.writeText(postUrl);
      
      toast({
        title: "Link copied!",
        description: "Post link copied to clipboard",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive",
      });
    }
  };

  const handleCommentsUpdate = (updatedComments: Comment[]) => {
    setComments(updatedComments);
    if (onPostUpdate) {
      const updatedPost = { ...post, comments: updatedComments, commentCount: updatedComments.length };
      onPostUpdate(updatedPost);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  // Safety check for post.author
  if (!post.author) {
    return null;
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={post.author.profileImage}
                alt={`${post.author.firstName || 'Unknown'} ${post.author.lastName || 'User'}`}
              />
              <AvatarFallback>
                {post.author.firstName?.[0] || 'U'}{post.author.lastName?.[0] || 'N'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold hover:underline cursor-pointer">
                  {post.author.firstName || 'Unknown'} {post.author.lastName || 'User'}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {post.location && (
                  <>
                    <MapPin className="h-3 w-3" />
                    {post.location}
                    <span>•</span>
                  </>
                )}
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                disabled={isLoading}
                className={isSaved ? 'text-yellow-500' : 'text-muted-foreground'}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
              <PostOptionsMenu
                postId={post._id}
                onInterested={() => {
                  toast({
                    title: "Preferences updated",
                    description: "We'll show you more content like this",
                  });
                }}
                onNotInterested={() => {
                  toast({
                    title: "Preferences updated",
                    description: "We'll show you less content like this",
                  });
                }}
                onReported={() => {
                  // Optionally hide the post or mark it as reported
                }}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="mb-4 leading-relaxed">{post.content}</p>
          
          {post.images && post.images.length > 0 && (
            <div className="aspect-video overflow-hidden rounded-lg mb-4 cursor-pointer group relative">
              <img
                src={post.images[0]}
                alt="Post image"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <LocationCardMenu />
            </div>
          )}
          
          {post.tags && post.tags.length > 0 && (
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
          )}
          
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLoading}
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
                {comments.length}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-muted-foreground hover:text-green-500 transition-colors"
              >
                <Share2 className="h-4 w-4 mr-1" />
                {shareCount}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Dialog */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <CommentsSection
            postId={post._id}
            comments={comments}
            onCommentsUpdate={handleCommentsUpdate}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostCard;