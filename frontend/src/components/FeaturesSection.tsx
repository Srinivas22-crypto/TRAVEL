import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  MessageCircle, 
  Users, 
  Bell, 
  Globe, 
  Moon,
  Plane,
  Route,
  Camera,
  Brain
} from 'lucide-react';

const featuresData = [
  {
    icon: MapPin,
    titleKey: 'features.routePlanner.title',
    descriptionKey: 'features.routePlanner.description',
    badgeKey: 'features.routePlanner.badge',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: Users,
    titleKey: 'features.community.title',
    descriptionKey: 'features.community.description',
    badgeKey: 'features.community.badge',
    gradient: 'from-green-500 to-green-600',
  },
  {
    icon: MessageCircle,
    titleKey: 'features.aiAssistant.title',
    descriptionKey: 'features.aiAssistant.description',
    badgeKey: 'features.aiAssistant.badge',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    icon: Bell,
    titleKey: 'features.notifications.title',
    descriptionKey: 'features.notifications.description',
    badgeKey: 'features.notifications.badge',
    gradient: 'from-orange-500 to-orange-600',
  },
  {
    icon: Globe,
    titleKey: 'features.multiLang.title',
    descriptionKey: 'features.multiLang.description',
    badgeKey: 'features.multiLang.badge',
    gradient: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: Moon,
    titleKey: 'features.darkMode.title',
    descriptionKey: 'features.darkMode.description',
    badgeKey: 'features.darkMode.badge',
    gradient: 'from-gray-500 to-gray-600',
  },
];

const statsData = [
  { labelKey: 'stats.activeTravelers', value: '10M+', icon: Users },
  { labelKey: 'stats.routesPlanned', value: '50M+', icon: Route },
  { labelKey: 'stats.storiesShared', value: '2M+', icon: Camera },
  { labelKey: 'stats.countriesCovered', value: '195', icon: Globe },
];

export const FeaturesSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Brain className="h-3 w-3 mr-1" />
            {t('features.poweredByAI', 'Powered by AI')}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            {t('features.headerLine1', 'Everything You Need for')}
            <br />
            {t('features.headerLine2', 'Perfect Travel Planning')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t(
              'features.headerDescription',
              'From intelligent route planning to community-driven insights, we\'ve built the ultimate travel management platform for modern explorers.'
            )}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-gradient-ocean text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-ocean">
                  <IconComponent className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{t(stat.labelKey)}</div>
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-elegant transition-all duration-300 border-border bg-card hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`bg-gradient-to-r ${feature.gradient} text-white p-3 rounded-lg shadow-lg group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {t(feature.badgeKey)}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {t(feature.titleKey)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {t(feature.descriptionKey)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <Card className="max-w-4xl mx-auto bg-gradient-hero text-white shadow-elegant">
            <CardContent className="p-12">
              <Plane className="h-16 w-16 mx-auto mb-6 text-white/90" />
              <h3 className="text-3xl font-bold mb-4">
                {t('features.ctaTitle', 'Ready to Start Your Journey?')}
              </h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                {t(
                  'features.ctaDescription',
                  'Join millions of travelers who trust TravelHub for their adventures. Plan smarter, travel better, and create unforgettable memories.'
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition-colors shadow-lg">
                  {t('features.ctaStartButton', 'Start Planning Now')}
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  {t('features.ctaDemoButton', 'Watch Demo')}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
