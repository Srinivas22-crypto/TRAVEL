import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Plane, Hotel, Car, Calendar as CalendarIcon, MapPin, Users, Star, Wifi, Car as CarIcon, Utensils } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import bookingService from '@/services/bookingService';

const Book = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Flight search state
  const [flightSearch, setFlightSearch] = useState({
    from: '',
    to: '',
    departureDate: undefined as Date | undefined,
    returnDate: undefined as Date | undefined,
    passengers: '1',
    class: 'economy'
  });

  // Hotel search state
  const [hotelSearch, setHotelSearch] = useState({
    destination: '',
    checkInDate: undefined as Date | undefined,
    checkOutDate: undefined as Date | undefined,
    guests: '2',
    rooms: '1'
  });

  // Car search state
  const [carSearch, setCarSearch] = useState({
    location: '',
    pickupDate: undefined as Date | undefined,
    returnDate: undefined as Date | undefined,
    carType: 'economy'
  });

  // Search results state
  const [searchResults, setSearchResults] = useState<{
    flights?: any[];
    hotels?: any[];
    cars?: any[];
  }>({});

  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Validation functions
  const validateFlightSearch = () => {
    const newErrors: {[key: string]: string} = {};

    if (!flightSearch.from.trim()) {
      newErrors.from = 'Departure city is required';
    }

    if (!flightSearch.to.trim()) {
      newErrors.to = 'Destination city is required';
    }

    if (flightSearch.from.trim() === flightSearch.to.trim()) {
      newErrors.to = 'Destination must be different from departure city';
    }

    if (!flightSearch.departureDate) {
      newErrors.departureDate = 'Departure date is required';
    } else if (flightSearch.departureDate < new Date()) {
      newErrors.departureDate = 'Departure date cannot be in the past';
    }

    if (flightSearch.returnDate && flightSearch.departureDate && flightSearch.returnDate <= flightSearch.departureDate) {
      newErrors.returnDate = 'Return date must be after departure date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateHotelSearch = () => {
    const newErrors: {[key: string]: string} = {};

    if (!hotelSearch.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (!hotelSearch.checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    } else if (hotelSearch.checkInDate < new Date()) {
      newErrors.checkInDate = 'Check-in date cannot be in the past';
    }

    if (!hotelSearch.checkOutDate) {
      newErrors.checkOutDate = 'Check-out date is required';
    } else if (hotelSearch.checkInDate && hotelSearch.checkOutDate <= hotelSearch.checkInDate) {
      newErrors.checkOutDate = 'Check-out date must be after check-in date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCarSearch = () => {
    const newErrors: {[key: string]: string} = {};

    if (!carSearch.location.trim()) {
      newErrors.location = 'Pickup location is required';
    }

    if (!carSearch.pickupDate) {
      newErrors.pickupDate = 'Pickup date is required';
    } else if (carSearch.pickupDate < new Date()) {
      newErrors.pickupDate = 'Pickup date cannot be in the past';
    }

    if (!carSearch.returnDate) {
      newErrors.returnDate = 'Return date is required';
    } else if (carSearch.pickupDate && carSearch.returnDate <= carSearch.pickupDate) {
      newErrors.returnDate = 'Return date must be after pickup date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Search functions
  const handleFlightSearch = async () => {
    if (!validateFlightSearch()) {
      return;
    }

    setIsSearching(true);
    try {
      console.log('🔍 Searching flights:', flightSearch);

      const searchParams = {
        from: flightSearch.from,
        to: flightSearch.to,
        departureDate: flightSearch.departureDate!.toISOString().split('T')[0],
        returnDate: flightSearch.returnDate?.toISOString().split('T')[0],
        passengers: parseInt(flightSearch.passengers),
        class: flightSearch.class as 'economy' | 'business' | 'first'
      };

      const results = await bookingService.searchFlights(searchParams);
      setSearchResults(prev => ({ ...prev, flights: results.outboundFlights }));

      toast({
        title: "Search Complete",
        description: `Found ${results.outboundFlights.length} flights`,
      });
    } catch (error: any) {
      console.error('Flight search failed:', error);
      toast({
        title: "Search Failed",
        description: error.message || "Failed to search flights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleHotelSearch = async () => {
    if (!validateHotelSearch()) {
      return;
    }

    setIsSearching(true);
    try {
      console.log('🔍 Searching hotels:', hotelSearch);

      const searchParams = {
        destination: hotelSearch.destination,
        checkIn: hotelSearch.checkInDate!.toISOString().split('T')[0],
        checkOut: hotelSearch.checkOutDate!.toISOString().split('T')[0],
        guests: parseInt(hotelSearch.guests),
        rooms: parseInt(hotelSearch.rooms)
      };

      const results = await bookingService.searchHotels(searchParams);
      setSearchResults(prev => ({ ...prev, hotels: results.hotels }));

      toast({
        title: "Search Complete",
        description: `Found ${results.hotels.length} hotels`,
      });
    } catch (error: any) {
      console.error('Hotel search failed:', error);
      toast({
        title: "Search Failed",
        description: error.message || "Failed to search hotels. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleCarSearch = async () => {
    if (!validateCarSearch()) {
      return;
    }

    setIsSearching(true);
    try {
      console.log('🔍 Searching cars:', carSearch);

      const searchParams = {
        location: carSearch.location,
        pickupDate: carSearch.pickupDate!.toISOString().split('T')[0],
        returnDate: carSearch.returnDate!.toISOString().split('T')[0],
        carType: carSearch.carType
      };

      const results = await bookingService.searchCars(searchParams);
      setSearchResults(prev => ({ ...prev, cars: results.cars }));

      toast({
        title: "Search Complete",
        description: `Found ${results.cars.length} cars`,
      });
    } catch (error: any) {
      console.error('Car search failed:', error);
      toast({
        title: "Search Failed",
        description: error.message || "Failed to search cars. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const flightDeals = [
    {
      id: 1,
      from: "New York",
      to: "Paris",
      price: 589,
      airline: "Air France",
      duration: "7h 30m",
      rating: 4.5
    },
    {
      id: 2,
      from: "London",
      to: "Tokyo",
      price: 645,
      airline: "British Airways", 
      duration: "11h 45m",
      rating: 4.7
    },
    {
      id: 3,
      from: "Los Angeles",
      to: "Sydney",
      price: 725,
      airline: "Qantas",
      duration: "15h 20m",
      rating: 4.6
    }
  ];

  const hotelDeals = [
    {
      id: 1,
      name: "Grand Palace Hotel",
      location: "Paris, France",
      price: 180,
      rating: 4.8,
      amenities: ["Wifi", "Pool", "Restaurant", "Spa"],
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945"
    },
    {
      id: 2,
      name: "Tokyo Bay Resort",
      location: "Tokyo, Japan",
      price: 145,
      rating: 4.6,
      amenities: ["Wifi", "Gym", "Restaurant", "Bar"],
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"
    },
    {
      id: 3,
      name: "Harbor View Inn",
      location: "Sydney, Australia",
      price: 125,
      rating: 4.4,
      amenities: ["Wifi", "Pool", "Restaurant"],
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            {t('book.title')}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('book.subtitle')}
          </p>
        </div>

        {/* Booking Tabs */}
        <Tabs defaultValue="flights" className="mb-12">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="flights" className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              {t('book.flights')}
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex items-center gap-2">
              <Hotel className="h-4 w-4" />
              {t('book.hotels')}
            </TabsTrigger>
            <TabsTrigger value="cars" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Cars
            </TabsTrigger>
          </TabsList>

          {/* Flights Tab */}
          <TabsContent value="flights">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-primary" />
                  Search Flights
                </CardTitle>
                <CardDescription>Find the best flight deals for your destination</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">From</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="from"
                        placeholder="Departure city"
                        className={`pl-10 ${errors.from ? "border-red-500" : ""}`}
                        value={flightSearch.from}
                        onChange={(e) => setFlightSearch(prev => ({ ...prev, from: e.target.value }))}
                      />
                    </div>
                    {errors.from && <p className="text-sm text-red-500">{errors.from}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="to"
                        placeholder="Destination city"
                        className={`pl-10 ${errors.to ? "border-red-500" : ""}`}
                        value={flightSearch.to}
                        onChange={(e) => setFlightSearch(prev => ({ ...prev, to: e.target.value }))}
                      />
                    </div>
                    {errors.to && <p className="text-sm text-red-500">{errors.to}</p>}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Departure Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !flightSearch.departureDate && "text-muted-foreground", errors.departureDate && "border-red-500")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {flightSearch.departureDate ? format(flightSearch.departureDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={flightSearch.departureDate}
                          onSelect={(date) => setFlightSearch(prev => ({ ...prev, departureDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.departureDate && <p className="text-sm text-red-500">{errors.departureDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Return Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !flightSearch.returnDate && "text-muted-foreground", errors.returnDate && "border-red-500")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {flightSearch.returnDate ? format(flightSearch.returnDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={flightSearch.returnDate}
                          onSelect={(date) => setFlightSearch(prev => ({ ...prev, returnDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.returnDate && <p className="text-sm text-red-500">{errors.returnDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Passengers</Label>
                    <Select value={flightSearch.passengers} onValueChange={(value) => setFlightSearch(prev => ({ ...prev, passengers: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="1 Adult" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Adult</SelectItem>
                        <SelectItem value="2">2 Adults</SelectItem>
                        <SelectItem value="3">3 Adults</SelectItem>
                        <SelectItem value="4">4+ Adults</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button
                  className="w-full bg-gradient-hero hover:opacity-90"
                  onClick={handleFlightSearch}
                  disabled={isSearching}
                >
                  <Plane className="h-4 w-4 mr-2" />
                  {isSearching ? "Searching..." : "Search Flights"}
                </Button>

                {/* Flight Search Results */}
                {searchResults.flights && searchResults.flights.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold">Flight Results ({searchResults.flights.length})</h3>
                    <div className="grid gap-4">
                      {searchResults.flights.map((flight: any) => (
                        <Card key={flight.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-4 mb-2">
                                  <h4 className="font-semibold">{flight.airline}</h4>
                                  {flight.rating && (
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      <span className="text-sm">{flight.rating}</span>
                                    </div>
                                  )}
                                  <Badge variant="outline">{flight.class || 'Economy'}</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {flight.from} → {flight.to}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <CalendarIcon className="h-4 w-4" />
                                    {flight.duration}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-primary">
                                  ${flight.price}
                                </div>
                                <Button
                                  className="mt-2"
                                  onClick={() => navigate('/payment')}
                                >
                                  Book Flight
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hotels Tab */}
          <TabsContent value="hotels">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="h-5 w-5 text-primary" />
                  Search Hotels
                </CardTitle>
                <CardDescription>Find comfortable accommodations for your stay</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="destination"
                      placeholder="Where are you going?"
                      className={`pl-10 ${errors.destination ? "border-red-500" : ""}`}
                      value={hotelSearch.destination}
                      onChange={(e) => setHotelSearch(prev => ({ ...prev, destination: e.target.value }))}
                    />
                  </div>
                  {errors.destination && <p className="text-sm text-red-500">{errors.destination}</p>}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Check-in Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !hotelSearch.checkInDate && "text-muted-foreground", errors.checkInDate && "border-red-500")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {hotelSearch.checkInDate ? format(hotelSearch.checkInDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={hotelSearch.checkInDate}
                          onSelect={(date) => setHotelSearch(prev => ({ ...prev, checkInDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.checkInDate && <p className="text-sm text-red-500">{errors.checkInDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Check-out Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !hotelSearch.checkOutDate && "text-muted-foreground", errors.checkOutDate && "border-red-500")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {hotelSearch.checkOutDate ? format(hotelSearch.checkOutDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={hotelSearch.checkOutDate}
                          onSelect={(date) => setHotelSearch(prev => ({ ...prev, checkOutDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.checkOutDate && <p className="text-sm text-red-500">{errors.checkOutDate}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Guests & Rooms</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="2 guests, 1 room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 guest, 1 room</SelectItem>
                        <SelectItem value="2">2 guests, 1 room</SelectItem>
                        <SelectItem value="3">3 guests, 1 room</SelectItem>
                        <SelectItem value="4">4+ guests, 2 rooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-hero hover:opacity-90">
                  <Hotel className="h-4 w-4 mr-2" />
                  Search Hotels
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cars Tab */}
          <TabsContent value="cars">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  Rent a Car
                </CardTitle>
                <CardDescription>Find the perfect vehicle for your journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pickup">Pick-up Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="pickup" placeholder="Pick-up location" className="pl-10" />
                  </div>
                </div>
                
                {/* <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pick-up Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !checkInDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkInDate ? format(checkInDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={checkInDate} onSelect={setCheckInDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Return Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !checkOutDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOutDate ? format(checkOutDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={checkOutDate} onSelect={setCheckOutDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div> */}
                
                <Button className="w-full bg-gradient-hero hover:opacity-90">
                  <Car className="h-4 w-4 mr-2" />
                  Search Cars
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Flight Deals */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Today's Flight Deals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {flightDeals.map((flight) => (
              <Card key={flight.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold">{flight.from} → {flight.to}</p>
                      <p className="text-sm text-muted-foreground">{flight.airline}</p>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {flight.rating}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-muted-foreground">{flight.duration}</p>
                    <p className="text-2xl font-bold text-primary">${flight.price}</p>
                  </div>
                  <Button className="w-full" variant="outline" onClick={() => navigate('/payment')}>Book Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Hotel Deals */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Featured Hotels</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {hotelDeals.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{hotel.name}</h3>
                      <p className="text-sm text-muted-foreground">{hotel.location}</p>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {hotel.rating}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.amenities.slice(0, 3).map((amenity) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold text-primary">${hotel.price}/night</p>
                    <Button variant="outline" size="sm" onClick={() => navigate('/payment')}>Book</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Book;