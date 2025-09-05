import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import {
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Flag,
  AlertTriangle,
} from 'lucide-react';
import postService from '@/services/postService';

interface PostOptionsMenuProps {
  postId: string;
  onInterested?: () => void;
  onNotInterested?: () => void;
  onReported?: () => void;
}

const PostOptionsMenu: React.FC<PostOptionsMenuProps> = ({
  postId,
  onInterested,
  onNotInterested,
  onReported,
}) => {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'interested' | 'not-interested' | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const reportReasons = [
    'Spam or misleading content',
    'Inappropriate or offensive content',
    'Harassment or bullying',
    'False information',
    'Copyright violation',
    'Other',
  ];

  const handleInterested = async () => {
    try {
      await postService.markInterested(postId);
      onInterested?.();
      toast({
        title: "Marked as interested",
        description: "We'll show you more content like this",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as interested",
        variant: "destructive",
      });
    }
  };

  const handleNotInterested = async () => {
    try {
      await postService.markNotInterested(postId);
      onNotInterested?.();
      toast({
        title: "Marked as not interested",
        description: "We'll show you less content like this",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as not interested",
        variant: "destructive",
      });
    }
  };

  const handleReport = async () => {
    if (!reportReason) {
      toast({
        title: "Please select a reason",
        description: "You must select a reason for reporting this post",
        variant: "destructive",
      });
      return;
    }

    if (reportReason === 'Other' && !customReason.trim()) {
      toast({
        title: "Please provide details",
        description: "Please provide details for your report",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const reason = reportReason === 'Other' ? customReason : reportReason;
      await postService.reportPost(postId, reason);
      onReported?.();
      setShowReportDialog(false);
      setReportReason('');
      setCustomReason('');
      toast({
        title: "Post reported",
        description: "Thank you for your report. We'll review it shortly.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAction = () => {
    if (confirmAction === 'interested') {
      handleInterested();
    } else if (confirmAction === 'not-interested') {
      handleNotInterested();
    }
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const openConfirmDialog = (action: 'interested' | 'not-interested') => {
    setConfirmAction(action);
    setShowConfirmDialog(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => openConfirmDialog('interested')}>
            <ThumbsUp className="h-4 w-4 mr-2" />
            Interested
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openConfirmDialog('not-interested')}>
            <ThumbsDown className="h-4 w-4 mr-2" />
            Not Interested
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowReportDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Flag className="h-4 w-4 mr-2" />
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === 'interested' ? 'Mark as Interested' : 'Mark as Not Interested'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === 'interested' 
                ? "We'll use this to show you more similar content in your feed."
                : "We'll use this to show you less similar content in your feed."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Report Post
            </DialogTitle>
            <DialogDescription>
              Help us understand what's wrong with this post. Your report is anonymous.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason for reporting</Label>
              <RadioGroup
                value={reportReason}
                onValueChange={setReportReason}
                className="mt-2"
              >
                {reportReasons.map((reason) => (
                  <div key={reason} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason} id={reason} />
                    <Label htmlFor={reason} className="text-sm font-normal">
                      {reason}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {reportReason === 'Other' && (
              <div>
                <Label htmlFor="custom-reason">Please provide details</Label>
                <Textarea
                  id="custom-reason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Describe the issue..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowReportDialog(false);
                setReportReason('');
                setCustomReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReport}
              disabled={isSubmitting || !reportReason}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Reporting...' : 'Report Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostOptionsMenu;