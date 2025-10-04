import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Heart, MessageCircle, Edit, Trash2, ExternalLink, Reply } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import userService, { UserComment } from '@/services/userService';
import postService from '@/services/postService';

const MyCommentsSection: React.FC = () => {
  const { t } = useTranslation();
  const [comments, setComments] = useState<UserComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deleteComment, setDeleteComment] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUserComments();
      setComments(response.data);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failed_load_comments'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (comment: UserComment) => {
    setEditingComment(comment._id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async (comment: UserComment) => {
    if (!editContent.trim()) return;

    setIsUpdating(true);
    try {
      await postService.updateComment(comment.post._id, comment._id, editContent);
      
      setComments(prev => prev.map(c => 
        c._id === comment._id 
          ? { ...c, content: editContent, updatedAt: new Date().toISOString() }
          : c
      ));
      
      setEditingComment(null);
      setEditContent('');
      
      toast({
        title: t('comment_updated'),
        description: t('comment_update_success'),
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failed_update_comment'),
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (comment: UserComment) => {
    try {
      await postService.deleteComment(comment.post._id, comment._id);
      
      setComments(prev => prev.filter(c => c._id !== comment._id));
      
      toast({
        title: t('comment_deleted'),
        description: t('comment_delete_success'),
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failed_delete_comment'),
        variant: 'destructive',
      });
    }
    setDeleteComment(null);
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return t('just_now');
    if (diffInHours < 24) return t('hours_ago', { count: diffInHours });
    if (diffInHours < 168) return t('days_ago', { count: Math.floor(diffInHours / 24) });
    return date.toLocaleDateString();
  };

  const navigateToPost = (postId: string) => {
    window.open(`/community/post/${postId}`, '_blank');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('my_comments')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t('my_comments')}
            <Badge variant="secondary">{comments.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('no_comments_yet')}</p>
              <p className="text-sm">{t('start_engaging')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {comment.isReply && (
                          <Reply className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">
                          {comment.isReply ? t('reply_to_comment') : t('comment_on_post')}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigateToPost(comment.post._id)}
                          className="h-auto p-0 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>

                      <div className="bg-muted rounded p-2 mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={comment.post.author.profileImage} />
                            <AvatarFallback className="text-xs">
                              {comment.post.author.firstName[0]}{comment.post.author.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">
                            {comment.post.author.firstName} {comment.post.author.lastName}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {comment.post.content}
                        </p>
                      </div>

                      {comment.isReply && comment.parentComment && (
                        <div className="bg-blue-50 border-l-2 border-blue-200 pl-3 py-2 mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={comment.parentComment.user.profileImage} />
                              <AvatarFallback className="text-xs">
                                {comment.parentComment.user.firstName[0]}{comment.parentComment.user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">
                              {comment.parentComment.user.firstName} {comment.parentComment.user.lastName}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {comment.parentComment.content}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(comment)}
                        disabled={editingComment === comment._id}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteComment(comment._id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-background border rounded-lg p-3">
                    {editingComment === comment._id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(comment)}
                            disabled={isUpdating || !editContent.trim()}
                          >
                            {isUpdating ? t('saving') : t('save')}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            {t('cancel')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="mb-2">{comment.content}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {comment.likes}
                            </span>
                            {!comment.isReply && (
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {comment.replies}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{formatDate(comment.createdAt)}</span>
                            {comment.updatedAt !== comment.createdAt && (
                              <span className="text-xs">({t('edited')})</span>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteComment} onOpenChange={() => setDeleteComment(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_comment')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('delete_comment_confirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const comment = comments.find(c => c._id === deleteComment);
                if (comment) handleDelete(comment);
              }}
              className="bg-destructive text-destructive-foreground"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyCommentsSection;
