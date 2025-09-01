import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { Button } from '@/components/ui/button';
import { RefreshCw, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Post {
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
}

interface FeedProps {
  posts: Post[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

const Feed: React.FC<FeedProps> = ({ posts, onRefresh, isLoading = false }) => {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const { toast } = useToast();

  useEffect(() => {
    let sorted = [...posts];
    
    if (sortBy === 'popular') {
      sorted.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
    } else {
      // Sort by recent (assuming timestamp format allows string comparison)
      sorted.sort((a, b) => {
        // Simple timestamp comparison - in real app, use proper date parsing
        const timeA = a.timestamp.includes('hour') ? 1 : a.timestamp.includes('day') ? 24 : 0;
        const timeB = b.timestamp.includes('hour') ? 1 : b.timestamp.includes('day') ? 24 : 0;
        return timeA - timeB;
      });
    }
    
    setFilteredPosts(sorted);
  }, [posts, sortBy]);

  const handleLike = (postId: number) => {
    // In a real app, this would make an API call
    console.log('Liked post:', postId);
  };

  const handleComment = (postId: number) => {
    // In a real app, this would open a comment modal or navigate to post detail
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId: number) => {
    // In a real app, this would handle sharing logic
    console.log('Shared post:', postId);
  };

  const handleRefresh = () => {
    onRefresh?.();
    toast({
      title: "Feed refreshed!",
      description: "Latest posts loaded",
      duration: 2000,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              </div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Feed Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={sortBy === 'recent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('recent')}
          >
            Recent
          </Button>
          <Button
            variant={sortBy === 'popular' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('popular')}
          >
            Popular
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">No posts to show</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Feed
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {filteredPosts.length > 0 && (
        <div className="text-center pt-6">
          <Button variant="outline" onClick={handleRefresh}>
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  );
};

export default Feed;