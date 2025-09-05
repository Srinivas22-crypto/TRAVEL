import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Bookmark } from 'lucide-react';
import PostCard from './PostCard';
import userService from '@/services/userService';
import { Post } from '@/services/postService';

const SavedPostsSection: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedPosts();
  }, []);

  const loadSavedPosts = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getSavedPosts();
      setSavedPosts(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your saved posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setSavedPosts(prev => prev.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handlePostDelete = (postId: string) => {
    setSavedPosts(prev => prev.filter(post => post._id !== postId));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Saved Posts
          <Badge variant="secondary">{savedPosts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {savedPosts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>You haven't saved any posts yet.</p>
            <p className="text-sm">Save posts you want to read later by clicking the bookmark icon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostUpdate={handlePostUpdate}
                onPostDelete={handlePostDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedPostsSection;