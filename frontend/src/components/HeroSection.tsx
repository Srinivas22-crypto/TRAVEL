import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar, Users, Plane, ArrowRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// --- Reusable Tab Button Component ---
const TabButton = ({ id, label, icon: Icon, activeTab, setActiveTab }: any) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
      activeTab === id
        ? 'bg-primary text-primary-foreground shadow-sm'
        : 'text-muted-foreground hover:text-foreground'
    }`}
    aria-pressed={activeTab === id}
  >
    <Icon className="h-4 w-4" />
    <span className="font-medium">{label}</span>
  </button>
);

// --- Search Form Component ---
const HeroSearchForm = ({ activeTab, searchQuery, setSearchQuery }: any) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-2">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          {activeTab === 'flights'
            ? t('hero.labels.fromTo')
            : activeTab === 'hotels'
            ? t('hero.labels.destination')
            : t('hero.labels.route')}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              activeTab === 'flights'
                ? t('hero.placeholders.flights')
                : activeTab === 'hotels'
                ? t('hero.placeholders.hotels')
                : t('hero.placeholders.routes')
            }
            value={searchQuery[activeTab]}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, [activeTab]: e.target.value })
            }
            className="pl-10 h-12"
            aria-label={t(`hero.aria.search.${activeTab}`)}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          {activeTab === 'routes' ? t('hero.labels.travelDate') : t('hero.labels.date')}
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="date" className="pl-10 h-12" aria-label={t('hero.aria.date')} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          {activeTab === 'hotels' ? t('hero.labels.guests') : t('hero.labels.travelers')}
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="2 adults" className="pl-10 h-12" aria-label={t('hero.aria.guests')} />
        </div>
      </div>
    </div>
  );
};

// --- Destination Card Component ---
const DestinationCard = ({ name, flag, deals }: any) => (
  <Card className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all cursor-pointer group transform hover:scale-105">
    <CardContent className="p-4 text-center">
      <div className="text-4xl mb-2">{flag}</div>
      <h4 className="font-semibold text-white group-hover:text-yellow-200 transition-colors">
        {name}
      </h4>
      <p className="text-sm text-white/70">{deals}</p>
    </CardContent>
  </Card>
);

// --- Main Hero Section ---
export const HeroSection = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('flights');
  const [searchQuery, setSearchQuery] = useState({ flights: '', hotels: '', routes: '' });

  const tabs = [
    { id: 'flights', label: t('hero.tabs.flights'), icon: Plane },
    { id: 'hotels', label: t('hero.tabs.hotels'), icon: MapPin },
    { id: 'routes', label: t('hero.tabs.routes'), icon: ArrowRight },
  ];

  const popularDestinations = [
    { name: t('hero.destinations.paris'), flag: '🇫🇷', deals: '23 deals' },
    { name: t('hero.destinations.tokyo'), flag: '🇯🇵', deals: '18 deals' },
    { name: t('hero.destinations.newYork'), flag: '🇺🇸', deals: '31 deals' },
    { name: t('hero.destinations.bali'), flag: '🇮🇩', deals: '15 deals' },
  ];

  return (
    <section className="relative bg-gradient-hero text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0 bg-white/10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
            <Star className="h-3 w-3 mr-1" />
            {t('hero.trustedBy')}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t('hero.title.main')}
            <br />
            <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
              {t('hero.title.highlight')}
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Search Card */}
        <Card className="max-w-4xl mx-auto shadow-elegant bg-white/95 backdrop-blur">
          <CardContent className="p-6">
            {/* Tabs */}
            <div className="flex space-x-1 bg-muted rounded-lg p-1 mb-6">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  {...tab}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              ))}
            </div>

            {/* Search Form */}
            <HeroSearchForm
              activeTab={activeTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <Button
              className="w-full mt-6 h-12 text-lg"
              variant="hero"
              size="lg"
              aria-label={t(`hero.aria.search.${activeTab}`)}
            >
              <Search className="h-5 w-5 mr-2" />
              {t(`hero.search.${activeTab}`)}
            </Button>
          </CardContent>
        </Card>

        {/* Popular Destinations */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8">{t('hero.popularDestinations')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {popularDestinations.map((dest, index) => (
              <DestinationCard key={index} {...dest} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
