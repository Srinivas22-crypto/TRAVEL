import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Heart,
  MessageCircle,
  Send,
  Edit,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import postService, { Comment, Reply } from '@/services/postService';
import { useAuth } from '@/contexts/AuthContext';

interface CommentsSectionProps {
  postId: string;
  comments: Comment[];
  onCommentsUpdate: (comments: Comment[]) => void;
}

interface CommentItemProps {
  postId: string;
  comment: Comment;
  onUpdate: (updatedComment: Comment) => void;
  onDelete: (commentId: string) => void;
  currentUserId?: string;
}

interface ReplyItemProps {
  reply: Reply;
  currentUserId?: string;
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, currentUserId }) => {
  return (
    <div className="flex gap-3 mt-3 ml-8">
      <Avatar className="h-6 w-6">
        <AvatarImage src={reply.user.profileImage} alt={reply.user.firstName} />
        <AvatarFallback className="text-xs">
          {reply.user.firstName[0]}{reply.user.lastName[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">
              {reply.user.firstName} {reply.user.lastName}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(reply.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm">{reply.content}</p>
        </div>
      </div>
    </div>
  );
};

const CommentItem: React.FC<CommentItemProps> = ({
  postId,
  comment,
  onUpdate,
  onDelete,
  currentUserId,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Array.isArray(comment.likes) ? comment.likes.length : 0);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [replies, setReplies] = useState<Reply[]>(comment.replies || []);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsLiked(currentUserId && Array.isArray(comment.likes) ? comment.likes.includes(currentUserId) : false);
  }, [comment.likes, currentUserId]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await postService.unlikeComment(postId, comment._id);
        setLikeCount(prev => prev - 1);
      } else {
        await postService.likeComment(postId, comment._id);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    setIsSubmittingReply(true);
    try {
      const response = await postService.addReply(postId, comment._id, replyContent);
      setReplies(prev => [...prev, response.data]);
      setReplyContent('');
      setShowReplyForm(false);
      toast({
        title: "Reply added",
        description: "Your reply has been posted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;

    setIsUpdating(true);
    try {
      const response = await postService.updateComment(postId, comment._id, editContent);
      onUpdate(response.data);
      setIsEditing(false);
      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await postService.deleteComment(postId, comment._id);
      onDelete(comment._id);
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
  };

  const isOwner = currentUserId === comment.user._id;

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={comment.user.profileImage} alt={comment.user.firstName} />
          <AvatarFallback>
            {comment.user.firstName[0]}{comment.user.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {comment.user.firstName} {comment.user.lastName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Edit your comment..."
                  className="min-h-[60px]"
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleEdit}
                    disabled={isUpdating || !editContent.trim()}
                  >
                    {isUpdating ? 'Updating...' : 'Update'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p>{comment.content}</p>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-2">
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
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-muted-foreground hover:text-blue-500"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Reply
            </Button>
          </div>

          {showReplyForm && (
            <div className="mt-3 ml-8">
              <div className="flex gap-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="min-h-[60px]"
                />
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={isSubmittingReply || !replyContent.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {replies.map((reply) => (
            <ReplyItem
              key={reply._id}
              reply={reply}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const CommentsSection: React.FC<CommentsSectionProps> = ({
  postId,
  comments,
  onCommentsUpdate,
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Ensure comments is always an array
  const safeComments = Array.isArray(comments) ? comments : [];

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await postService.addComment(postId, newComment);
      const updatedComments = [...safeComments, response.data];
      onCommentsUpdate(updatedComments);
      setNewComment('');
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentUpdate = (updatedComment: Comment) => {
    const updatedComments = safeComments.map(comment =>
      comment._id === updatedComment._id ? updatedComment : comment
    );
    onCommentsUpdate(updatedComments);
  };

  const handleCommentDelete = (commentId: string) => {
    const updatedComments = safeComments.filter(comment => comment._id !== commentId);
    onCommentsUpdate(updatedComments);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Comments ({safeComments.length})</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new comment */}
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={user?.profileImage} alt={user?.firstName} />
            <AvatarFallback>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[80px]"
            />
            <Button
              onClick={handleAddComment}
              disabled={isSubmitting || !newComment.trim()}
              className="ml-auto"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>

        {/* Comments list */}
        <div className="space-y-4">
          {safeComments.map((comment) => (
            <CommentItem
              key={comment._id}
              postId={postId}
              comment={comment}
              onUpdate={handleCommentUpdate}
              onDelete={handleCommentDelete}
              currentUserId={user?._id}
            />
          ))}
        </div>

        {safeComments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentsSection;