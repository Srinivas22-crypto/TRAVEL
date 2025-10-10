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
      newErrors.from = t('book.errors.departureCityRequired');
    }

    if (!flightSearch.to.trim()) {
      newErrors.to = t('book.errors.destinationCityRequired');
    }

    if (flightSearch.from.trim() === flightSearch.to.trim()) {
      newErrors.to = t('book.errors.destinationDifferent');
    }

    if (!flightSearch.departureDate) {
      newErrors.departureDate = t('book.errors.departureDateRequired');
    } else if (flightSearch.departureDate < new Date()) {
      newErrors.departureDate = t('book.errors.departureDatePast');
    }

    if (flightSearch.returnDate && flightSearch.departureDate && flightSearch.returnDate <= flightSearch.departureDate) {
      newErrors.returnDate = t('book.errors.returnDateAfterDeparture');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateHotelSearch = () => {
    const newErrors: {[key: string]: string} = {};

    if (!hotelSearch.destination.trim()) {
      newErrors.destination = t('book.errors.destinationRequired');
    }

    if (!hotelSearch.checkInDate) {
      newErrors.checkInDate = t('book.errors.checkInDateRequired');
    } else if (hotelSearch.checkInDate < new Date()) {
      newErrors.checkInDate = t('book.errors.checkInDatePast');
    }

    if (!hotelSearch.checkOutDate) {
      newErrors.checkOutDate = t('book.errors.checkOutDateRequired');
    } else if (hotelSearch.checkInDate && hotelSearch.checkOutDate <= hotelSearch.checkInDate) {
      newErrors.checkOutDate = t('book.errors.checkOutDateAfterCheckIn');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCarSearch = () => {
    const newErrors: {[key: string]: string} = {};

    if (!carSearch.location.trim()) {
      newErrors.location = t('book.errors.pickupLocationRequired');
    }

    if (!carSearch.pickupDate) {
      newErrors.pickupDate = t('book.errors.pickupDateRequired');
    } else if (carSearch.pickupDate < new Date()) {
      newErrors.pickupDate = t('book.errors.pickupDatePast');
    }

    if (!carSearch.returnDate) {
      newErrors.returnDate = t('book.errors.returnDateRequired');
    } else if (carSearch.pickupDate && carSearch.returnDate <= carSearch.pickupDate) {
      newErrors.returnDate = t('book.errors.returnDateAfterPickup');
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
        title: t('book.searchComplete'),
        description: t('book.foundFlights', { count: results.outboundFlights.length }),
      });
    } catch (error: any) {
      console.error('Flight search failed:', error);
      toast({
        title: t('book.errors.searchFailed'),
        description: error.message || t('book.errors.flightsError'),
        variant: 'destructive'
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
        title: t('book.searchComplete'),
        description: t('book.foundHotels', { count: results.hotels.length }),
      });
    } catch (error: any) {
      console.error('Hotel search failed:', error);
      toast({
        title: t('book.errors.searchFailed'),
        description: error.message || t('book.errors.hotelsError'),
        variant: 'destructive'
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
        title: t('book.searchComplete'),
        description: t('book.foundCars', { count: results.cars.length }),
      });
    } catch (error: any) {
      console.error('Car search failed:', error);
      toast({
        title: t('book.errors.searchFailed'),
        description: error.message || t('book.errors.carsError'),
        variant: 'destructive'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const flightDeals = [
    {
      id: 1,
      from: 'New York',
      to: 'Paris',
      price: 589,
      airline: 'Air France',
      duration: '7h 30m',
      rating: 4.5
    },
    {
      id: 2,
      from: 'London',
      to: 'Tokyo',
      price: 645,
      airline: 'British Airways', 
      duration: '11h 45m',
      rating: 4.7
    },
    {
      id: 3,
      from: 'Los Angeles',
      to: 'Sydney',
      price: 725,
      airline: 'Qantas',
      duration: '15h 20m',
      rating: 4.6
    }
  ];

  const hotelDeals = [
    {
      id: 1,
      name: 'Grand Palace Hotel',
      location: 'Paris, France',
      price: 180,
      rating: 4.8,
      amenities: ['Wifi', 'Pool', 'Restaurant', 'Spa'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945'
    },
    {
      id: 2,
      name: 'Tokyo Bay Resort',
      location: 'Tokyo, Japan',
      price: 145,
      rating: 4.6,
      amenities: ['Wifi', 'Gym', 'Restaurant', 'Bar'],
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'
    },
    {
      id: 3,
      name: 'Harbor View Inn',
      location: 'Sydney, Australia',
      price: 125,
      rating: 4.4,
      amenities: ['Wifi', 'Pool', 'Restaurant'],
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'
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
              {t('book.cars')}
            </TabsTrigger>
          </TabsList>

          {/* Flights Tab */}
          <TabsContent value="flights">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-primary" />
                  {t('book.searchFlightsTitle')}
                </CardTitle>
                <CardDescription>{t('book.searchFlightsDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">{t('book.from')}</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="from"
                        placeholder={t('book.placeholders.departureCity')}
                        className={`pl-10 ${errors.from ? 'border-red-500' : ''}`}
                        value={flightSearch.from}
                        onChange={(e) => setFlightSearch(prev => ({ ...prev, from: e.target.value }))}
                      />
                    </div>
                    {errors.from && <p className="text-sm text-red-500">{errors.from}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">{t('book.to')}</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="to"
                        placeholder={t('book.placeholders.destinationCity')}
                        className={`pl-10 ${errors.to ? 'border-red-500' : ''}`}
                        value={flightSearch.to}
                        onChange={(e) => setFlightSearch(prev => ({ ...prev, to: e.target.value }))}
                      />
                    </div>
                    {errors.to && <p className="text-sm text-red-500">{errors.to}</p>}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t('book.departureDate')}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !flightSearch.departureDate && 'text-muted-foreground', errors.departureDate && 'border-red-500')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {flightSearch.departureDate ? format(flightSearch.departureDate, 'PPP') : t('book.placeholders.pickADate')}
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
                    <Label>{t('book.returnDate')}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !flightSearch.returnDate && 'text-muted-foreground', errors.returnDate && 'border-red-500')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {flightSearch.returnDate ? format(flightSearch.returnDate, 'PPP') : t('book.placeholders.pickADate')}
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
                    <Label>{t('book.passengers')}</Label>
                    <Select value={flightSearch.passengers} onValueChange={(value) => setFlightSearch(prev => ({ ...prev, passengers: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('book.placeholders.selectAdults')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">{t('book.adults.one')}</SelectItem>
                        <SelectItem value="2">{t('book.adults.two')}</SelectItem>
                        <SelectItem value="3">{t('book.adults.three')}</SelectItem>
                        <SelectItem value="4">{t('book.adults.fourPlus')}</SelectItem>
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
                  {isSearching ? t('book.searching') : t('book.searchFlightsButton')}
                </Button>

                {/* Flight Search Results */}
                {searchResults.flights && searchResults.flights.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold">{t('book.flightResults', { count: searchResults.flights.length })}</h3>
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
                                  <Badge variant="outline">{flight.class || t('book.class.economy')}</Badge>
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
                                  {t('book.bookFlight')}
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
                  {t('book.searchHotelsTitle')}
                </CardTitle>
                <CardDescription>{t('book.searchHotelsDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="destination">{t('book.destination')}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="destination"
                      placeholder={t('book.placeholders.whereGoing')}
                      className={`pl-10 ${errors.destination ? 'border-red-500' : ''}`}
                      value={hotelSearch.destination}
                      onChange={(e) => setHotelSearch(prev => ({ ...prev, destination: e.target.value }))}
                    />
                  </div>
                  {errors.destination && <p className="text-sm text-red-500">{errors.destination}</p>}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t('book.checkIn')}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !hotelSearch.checkInDate && 'text-muted-foreground', errors.checkInDate && 'border-red-500')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {hotelSearch.checkInDate ? format(hotelSearch.checkInDate, 'PPP') : t('book.placeholders.pickADate')}
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
                    <Label>{t('book.checkOut')}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !hotelSearch.checkOutDate && 'text-muted-foreground', errors.checkOutDate && 'border-red-500')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {hotelSearch.checkOutDate ? format(hotelSearch.checkOutDate, 'PPP') : t('book.placeholders.pickADate')}
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
                    <Label>{t('book.guestsRoomsLabel')}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t('book.placeholders.guestsRooms')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">{t('book.guestsRoomsOptions.oneOne')}</SelectItem>
                        <SelectItem value="2">{t('book.guestsRoomsOptions.twoOne')}</SelectItem>
                        <SelectItem value="3">{t('book.guestsRoomsOptions.threeOne')}</SelectItem>
                        <SelectItem value="4">{t('book.guestsRoomsOptions.fourPlusTwo')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-hero hover:opacity-90" onClick={handleHotelSearch} disabled={isSearching}>
                  <Hotel className="h-4 w-4 mr-2" />
                  {t('book.searchHotelsButton')}
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
                  {t('book.rentACarTitle')}
                </CardTitle>
                <CardDescription>{t('book.rentACarDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pickup">{t('book.pickupLocation')}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="pickup" placeholder={t('book.placeholders.pickupLocation')} className="pl-10" />
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
                
                <Button className="w-full bg-gradient-hero hover:opacity-90" onClick={handleCarSearch} disabled={isSearching}>
                  <Car className="h-4 w-4 mr-2" />
                  {t('book.searchCars')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Flight Deals */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{t('book.todaysFlightDeals')}</h2>
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
                  <Button className="w-full" variant="outline" onClick={() => navigate('/payment')}>{t('common.bookNow')}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Hotel Deals */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">{t('book.featuredHotels')}</h2>
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
                        {t(`book.amenities.${amenity.toLowerCase()}`)}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold text-primary">${hotel.price}{t('book.perNightSuffix')}</p>
                    <Button variant="outline" size="sm" onClick={() => navigate('/payment')}>{t('book.book')}</Button>
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
