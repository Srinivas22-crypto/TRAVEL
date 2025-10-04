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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'interested' | 'not-interested' | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const reportReasons = [
    t('postOptions.spam'),
    t('postOptions.inappropriate'),
    t('postOptions.harassment'),
    t('postOptions.falseInfo'),
    t('postOptions.copyright'),
    t('postOptions.other'),
  ];

  const handleInterested = async () => {
    try {
      await postService.markInterested(postId);
      onInterested?.();
      toast({
        title: t('postOptions.markedInterested'),
        description: t('postOptions.showMore'),
      });
    } catch (error) {
      toast({
        title: t('postOptions.error'),
        description: t('postOptions.markInterestedError'),
        variant: 'destructive',
      });
    }
  };

  const handleNotInterested = async () => {
    try {
      await postService.markNotInterested(postId);
      onNotInterested?.();
      toast({
        title: t('postOptions.markedNotInterested'),
        description: t('postOptions.showLess'),
      });
    } catch (error) {
      toast({
        title: t('postOptions.error'),
        description: t('postOptions.markNotInterestedError'),
        variant: 'destructive',
      });
    }
  };

  const handleReport = async () => {
    if (!reportReason) {
      toast({
        title: t('postOptions.selectReasonTitle'),
        description: t('postOptions.selectReasonDesc'),
        variant: 'destructive',
      });
      return;
    }

    if (reportReason === t('postOptions.other') && !customReason.trim()) {
      toast({
        title: t('postOptions.provideDetailsTitle'),
        description: t('postOptions.provideDetailsDesc'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const reason = reportReason === t('postOptions.other') ? customReason : reportReason;
      await postService.reportPost(postId, reason);
      onReported?.();
      setShowReportDialog(false);
      setReportReason('');
      setCustomReason('');
      toast({
        title: t('postOptions.reportedTitle'),
        description: t('postOptions.reportedDesc'),
      });
    } catch (error) {
      toast({
        title: t('postOptions.error'),
        description: t('postOptions.reportError'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAction = () => {
    if (confirmAction === 'interested') handleInterested();
    else if (confirmAction === 'not-interested') handleNotInterested();
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
            {t('postOptions.interested')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openConfirmDialog('not-interested')}>
            <ThumbsDown className="h-4 w-4 mr-2" />
            {t('postOptions.notInterested')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowReportDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Flag className="h-4 w-4 mr-2" />
            {t('postOptions.report')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === 'interested' 
                ? t('postOptions.markInterested') 
                : t('postOptions.markNotInterested')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === 'interested' 
                ? t('postOptions.markInterestedDesc') 
                : t('postOptions.markNotInterestedDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('postOptions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              {t('postOptions.confirm')}
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
              {t('postOptions.reportPost')}
            </DialogTitle>
            <DialogDescription>
              {t('postOptions.reportDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">{t('postOptions.reason')}</Label>
              <RadioGroup
                value={reportReason}
                onValueChange={setReportReason}
                className="mt-2"
              >
                {reportReasons.map(reason => (
                  <div key={reason} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason} id={reason} />
                    <Label htmlFor={reason} className="text-sm font-normal">
                      {reason}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {reportReason === t('postOptions.other') && (
              <div>
                <Label htmlFor="custom-reason">{t('postOptions.customDetails')}</Label>
                <Textarea
                  id="custom-reason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder={t('postOptions.describeIssue')}
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
              {t('postOptions.cancel')}
            </Button>
            <Button
              onClick={handleReport}
              disabled={isSubmitting || !reportReason}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? t('postOptions.reporting') : t('postOptions.reportPost')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostOptionsMenu;
