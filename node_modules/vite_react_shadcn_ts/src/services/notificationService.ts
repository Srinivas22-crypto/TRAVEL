export interface TravelNotification {
  id: string;
  type: 'booking' | 'reminder' | 'offer' | 'alert' | 'weather';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: string;
  variant: 'success' | 'warning' | 'destructive' | 'default';
  actionUrl?: string;
}

export type Notification = TravelNotification;

class NotificationService {
  private readonly STORAGE_KEY = 'user_notifications';

  // Mock travel notifications
  private mockTravelNotifications: TravelNotification[] = [
    {
      id: 'travel_1',
      type: 'booking',
      title: 'Flight Booking Confirmed',
      message: 'Your flight to Paris has been confirmed for March 15th, 2024',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      read: false,
      icon: 'Plane',
      variant: 'success',
    },
    {
      id: 'travel_2',
      type: 'reminder',
      title: 'Check-in Reminder',
      message: 'Don\'t forget to check in online for your flight tomorrow',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
      icon: 'Calendar',
      variant: 'warning',
    },
    {
      id: 'travel_3',
      type: 'offer',
      title: 'Special Hotel Deal',
      message: '30% off luxury hotels in Rome - Limited time offer!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      read: true,
      icon: 'Hotel',
      variant: 'default',
    }
  ];

  constructor() {
    this.initializeEventListeners();
  }

  // Initialize event listeners for travel activities
  private initializeEventListeners(): void {
    // Listen for booking confirmations
    window.addEventListener('booking:confirmed', (event: CustomEvent) => {
      const { booking } = event.detail;
      this.addBookingNotification(booking);
    });

    // Listen for activity bookings
    window.addEventListener('activity:booked', (event: CustomEvent) => {
      const { activity } = event.detail;
      this.addActivityBookingNotification(activity);
    });
  }

  // Get all notifications
  getNotifications(): Notification[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const storedNotifications: TravelNotification[] = stored ? JSON.parse(stored) : [];
    
    // Combine stored notifications with mock travel notifications
    const allNotifications = [
      ...storedNotifications,
      ...this.mockTravelNotifications
    ];

    // Sort by timestamp (newest first)
    return allNotifications.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Get unread notification count
  getUnreadCount(): number {
    const notifications = this.getNotifications();
    return notifications.filter(n => !n.read).length;
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification && !notification.read) {
      notification.read = true;
      
      if (notificationId.startsWith('travel_')) {
        // Update mock travel notifications
        const travelNotification = this.mockTravelNotifications.find(n => n.id === notificationId);
        if (travelNotification) {
          travelNotification.read = true;
        }
      } else {
        // Update stored notifications
        const storedNotifications = this.getStoredNotifications();
        const index = storedNotifications.findIndex(n => n.id === notificationId);
        if (index !== -1) {
          storedNotifications[index].read = true;
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedNotifications));
        }
      }

      // Dispatch event for UI updates
      window.dispatchEvent(new CustomEvent('notification:read', { 
        detail: { notificationId } 
      }));
    }
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    // Mark stored notifications as read
    const storedNotifications = this.getStoredNotifications();
    storedNotifications.forEach(n => n.read = true);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedNotifications));

    // Mark travel notifications as read
    this.mockTravelNotifications.forEach(n => n.read = true);

    // Dispatch event for UI updates
    window.dispatchEvent(new CustomEvent('notification:all_read'));
  }

  // Remove notification
  removeNotification(notificationId: string): void {
    if (notificationId.startsWith('travel_')) {
      // Remove travel notification
      const index = this.mockTravelNotifications.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        this.mockTravelNotifications.splice(index, 1);
      }
    } else {
      // Remove stored notification
      const storedNotifications = this.getStoredNotifications();
      const filteredNotifications = storedNotifications.filter(n => n.id !== notificationId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredNotifications));
    }

    // Dispatch event for UI updates
    window.dispatchEvent(new CustomEvent('notification:removed', { 
      detail: { notificationId } 
    }));
  }

  // Add booking notification
  private addBookingNotification(booking: any): void {
    const notification: TravelNotification = {
      id: `booking_${booking.id}_${Date.now()}`,
      type: 'booking',
      title: 'Booking Confirmed',
      message: `Your booking for ${booking.destination} has been confirmed!`,
      timestamp: new Date().toISOString(),
      read: false,
      icon: 'CheckCircle',
      variant: 'success',
      actionUrl: `/bookings/${booking.id}`
    };

    this.addNotification(notification);
  }

  // Add activity booking notification
  private addActivityBookingNotification(activity: any): void {
    const notification: TravelNotification = {
      id: `activity_${activity.id}_${Date.now()}`,
      type: 'booking',
      title: 'Activity Booked',
      message: `You've successfully booked "${activity.name}" in ${activity.destination}`,
      timestamp: new Date().toISOString(),
      read: false,
      icon: 'Activity',
      variant: 'success',
      actionUrl: `/profile?tab=activities`
    };

    this.addNotification(notification);
  }

  // Add notification to storage
  private addNotification(notification: TravelNotification): void {
    const notifications = this.getStoredNotifications();
    notifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications.splice(50);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));

    // Dispatch event for UI updates
    window.dispatchEvent(new CustomEvent('notification:new', { 
      detail: { notification } 
    }));
  }

  // Get stored notifications from localStorage
  private getStoredNotifications(): TravelNotification[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Format notification time
  formatTime(timestamp: string): string {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diff = now.getTime() - notificationTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  // Clear all notifications
  clearAllNotifications(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.mockTravelNotifications.length = 0;
    
    window.dispatchEvent(new CustomEvent('notification:cleared'));
  }
}

// Create and export singleton instance
const notificationService = new NotificationService();
export default notificationService;