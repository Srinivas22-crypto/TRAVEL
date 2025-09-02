import { Activity, ActivityBooking } from '../lib/api';

class ActivityService {
  private bookedActivities: ActivityBooking[] = [];

  constructor() {
    // Load booked activities from localStorage on initialization
    this.loadBookedActivities();
  }

  // Load booked activities from localStorage
  private loadBookedActivities(): void {
    try {
      const stored = localStorage.getItem('booked_activities');
      if (stored) {
        this.bookedActivities = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load booked activities:', error);
      this.bookedActivities = [];
    }
  }

  // Save booked activities to localStorage
  private saveBookedActivities(): void {
    try {
      localStorage.setItem('booked_activities', JSON.stringify(this.bookedActivities));
    } catch (error) {
      console.error('Failed to save booked activities:', error);
    }
  }

  // Book an activity
  bookActivity(activity: Activity): ActivityBooking {
    const booking: ActivityBooking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      activityId: activity.id,
      activityName: activity.name,
      activityImage: activity.image,
      price: activity.price,
      duration: activity.duration,
      destination: activity.destination,
      bookedAt: new Date().toISOString(),
      status: 'booked'
    };

    this.bookedActivities.push(booking);
    this.saveBookedActivities();

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('activity:booked', { 
      detail: booking 
    }));

    return booking;
  }

  // Get all booked activities
  getBookedActivities(): ActivityBooking[] {
    return this.bookedActivities.filter(booking => booking.status === 'booked');
  }

  // Check if an activity is already booked
  isActivityBooked(activityId: string): boolean {
    return this.bookedActivities.some(
      booking => booking.activityId === activityId && booking.status === 'booked'
    );
  }

  // Cancel a booking
  cancelBooking(bookingId: string): boolean {
    const bookingIndex = this.bookedActivities.findIndex(
      booking => booking.id === bookingId
    );

    if (bookingIndex !== -1) {
      this.bookedActivities[bookingIndex].status = 'cancelled';
      this.saveBookedActivities();

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('activity:cancelled', { 
        detail: this.bookedActivities[bookingIndex] 
      }));

      return true;
    }

    return false;
  }

  // Get booking by ID
  getBooking(bookingId: string): ActivityBooking | undefined {
    return this.bookedActivities.find(booking => booking.id === bookingId);
  }

  // Get total number of booked activities
  getTotalBookedActivities(): number {
    return this.getBookedActivities().length;
  }

  // Get total amount spent on activities
  getTotalAmountSpent(): number {
    return this.getBookedActivities().reduce((total, booking) => total + booking.price, 0);
  }

  // Clear all bookings (for testing or reset purposes)
  clearAllBookings(): void {
    this.bookedActivities = [];
    this.saveBookedActivities();
    
    window.dispatchEvent(new CustomEvent('activity:cleared'));
  }
}

// Create and export a singleton instance
const activityService = new ActivityService();
export default activityService;