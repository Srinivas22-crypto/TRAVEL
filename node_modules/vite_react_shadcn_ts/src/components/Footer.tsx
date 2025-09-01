import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plane, 
  MapPin, 
  Mail, 
  Phone, 
  Twitter, 
  Facebook, 
  Instagram, 
  Youtube,
  Heart
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-hero p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  TravelHub
                </h3>
                <p className="text-xs text-muted-foreground">Your Journey Starts Here</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              The ultimate travel management platform for modern explorers. 
              Plan, book, and share your adventures with confidence.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Destinations</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Route Planner</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Travel Guide</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Popular Routes</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Local Tips</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Flight Booking</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Hotel Reservations</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Car Rentals</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Travel Insurance</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">AI Assistant</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <p className="text-muted-foreground mb-4">
              Get the latest travel deals and destination insights delivered to your inbox.
            </p>
            <div className="space-y-3">
              <Input placeholder="Enter your email" type="email" />
              <Button className="w-full" variant="ocean">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <Card className="mb-8 bg-accent/20 border-accent/30">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <h5 className="font-medium">Email Support</h5>
                  <p className="text-sm text-muted-foreground">support@travelhub.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <h5 className="font-medium">24/7 Hotline</h5>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <h5 className="font-medium">Headquarters</h5>
                  <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Accessibility
              </a>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>© {currentYear} TravelHub. Made with</span>
              <Heart className="h-4 w-4 text-destructive fill-current" />
              <span>for travelers worldwide.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};