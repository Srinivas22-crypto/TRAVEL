import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import notificationService, { Notification } from '@/services/notificationService';
import { 
  Bell, 
  X, 
  Plane, 
  Hotel, 
  Calendar, 
  MapPin, 
  AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const NotificationCenter = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  // Listen for notification events
  useEffect(() => {
    const handleNewNotification = () => loadNotifications();
    const handleNotificationRead = () => loadNotifications();
    const handleNotificationRemoved = () => loadNotifications();
    const handleAllRead = () => loadNotifications();

    window.addEventListener('notification:new', handleNewNotification);
    window.addEventListener('notification:read', handleNotificationRead);
    window.addEventListener('notification:removed', handleNotificationRemoved);
    window.addEventListener('notification:all_read', handleAllRead);

    return () => {
      window.removeEventListener('notification:new', handleNewNotification);
      window.removeEventListener('notification:read', handleNotificationRead);
      window.removeEventListener('notification:removed', handleNotificationRemoved);
      window.removeEventListener('notification:all_read', handleAllRead);
    };
  }, []);

  const loadNotifications = () => {
    const allNotifications = notificationService.getNotifications();
    const count = notificationService.getUnreadCount();
    setNotifications(allNotifications);
    setUnreadCount(count);
  };

  const markAsRead = (notificationId: string) => notificationService.markAsRead(notificationId);
  const markAllAsRead = () => notificationService.markAllAsRead();
  const removeNotification = (notificationId: string) => notificationService.removeNotification(notificationId);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      setIsOpen(false);
      navigate(notification.actionUrl);
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    switch (notification.icon) {
      case 'Plane': return Plane;
      case 'Hotel': return Hotel;
      case 'Calendar': return Calendar;
      case 'AlertCircle': return AlertCircle;
      case 'CheckCircle': return Calendar;
      case 'Activity': return MapPin;
      default: return Bell;
    }
  };

  const getNotificationVariant = (notification: Notification) => notification.variant;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label={t('notifications.toggle')}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <Card className="absolute top-12 right-0 w-80 max-h-96 shadow-elegant z-50 bg-card border-border">
          <CardHeader className="bg-gradient-ocean text-primary-foreground">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{t('notifications.title')}</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-primary-foreground hover:bg-primary-light/20 h-6 px-2 text-xs"
                  >
                    {t('notifications.markAllRead')}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-primary-light/20 h-6 w-6"
                  aria-label={t('notifications.close')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <ScrollArea className="max-h-80">
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>{t('notifications.empty')}</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => {
                    const IconComponent = getNotificationIcon(notification);
                    const variant = getNotificationVariant(notification);
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-accent/50 cursor-pointer relative ${!notification.read ? 'bg-accent/20' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${
                            variant === 'success'
                              ? 'bg-success/20 text-success'
                              : variant === 'warning'
                              ? 'bg-warning/20 text-warning'
                              : variant === 'destructive'
                              ? 'bg-destructive/20 text-destructive'
                              : 'bg-primary/20 text-primary'
                          }`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium truncate">{notification.title}</h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                aria-label={t('notifications.remove')}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notificationService.formatTime(notification.timestamp)}</p>
                          </div>
                        </div>
                        {!notification.read && <div className="absolute right-2 top-2 h-2 w-2 bg-primary rounded-full"></div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};
