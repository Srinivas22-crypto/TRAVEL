import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, Users, Plane, ArrowRight, Star } from 'lucide-react';

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('flights');

  const tabs = [
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: MapPin },
    { id: 'routes', label: 'Routes', icon: ArrowRight },
  ];

  const popularDestinations = [
    { name: 'Paris, France', image: '🇫🇷', deals: '23 deals' },
    { name: 'Tokyo, Japan', image: '🇯🇵', deals: '18 deals' },
    { name: 'New York, USA', image: '🇺🇸', deals: '31 deals' },
    { name: 'Bali, Indonesia', image: '🇮🇩', deals: '15 deals' },
  ];

  return (
    <section className="relative bg-gradient-hero text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-white/10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
            <Star className="h-3 w-3 mr-1" />
            Trusted by 10M+ travelers
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Dream Journey
            <br />
            <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
              Starts Here
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Discover amazing destinations, plan perfect routes, and connect with fellow travelers. 
            Your next adventure is just a click away.
          </p>
        </div>

        {/* Search Interface */}
        <Card className="max-w-4xl mx-auto shadow-elegant bg-white/95 backdrop-blur">
          <CardContent className="p-6">
            {/* Tabs */}
            <div className="flex space-x-1 bg-muted rounded-lg p-1 mb-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  {activeTab === 'flights' ? 'From / To' : 
                   activeTab === 'hotels' ? 'Destination' : 'Route'}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={
                      activeTab === 'flights' ? 'New York to Paris' :
                      activeTab === 'hotels' ? 'Enter city or hotel name' :
                      'Plan your route'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  {activeTab === 'routes' ? 'Travel Date' : 'Date'}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  {activeTab === 'hotels' ? 'Guests' : 'Travelers'}
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="2 adults"
                    className="pl-10 h-12"
                  />
                </div>
              </div>
            </div>

            <Button className="w-full mt-6 h-12 text-lg" variant="hero" size="lg">
              <Search className="h-5 w-5 mr-2" />
              Search {activeTab === 'flights' ? 'Flights' : activeTab === 'hotels' ? 'Hotels' : 'Routes'}
            </Button>
          </CardContent>
        </Card>

        {/* Popular Destinations */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8">Popular Destinations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {popularDestinations.map((destination, index) => (
              <Card 
                key={index} 
                className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all cursor-pointer group"
              >
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{destination.image}</div>
                  <h4 className="font-semibold text-white group-hover:text-yellow-200 transition-colors">
                    {destination.name}
                  </h4>
                  <p className="text-sm text-white/70">{destination.deals}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};