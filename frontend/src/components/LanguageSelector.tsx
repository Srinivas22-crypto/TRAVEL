import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', nativeName: 'Português' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'zh', name: '中文', flag: '🇨🇳', nativeName: '中文' },
];

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('travel-app-language');
    if (savedLanguage && languages.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('travel-app-language', languageCode);
    i18n.changeLanguage(languageCode);

    // If on a destination page, redirect to localized URL
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === 'destination' || (pathParts[1] && (pathParts[2] === 'destinations' || pathParts[2] === 'destinos'))) {
      const destinationId = pathParts[1] === 'destination' ? pathParts[2] : pathParts[3];
      if (destinationId) {
        const routeSegment = i18n.t('routes.destinations', { lng: languageCode });
        navigate(`/${languageCode}/${routeSegment}/${destinationId}`);
      }
    }
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-24 sm:w-[140px] h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm bg-card border-border">
        <div className="flex items-center gap-1 sm:gap-2">
          <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm">{currentLang?.flag}</span>
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="text-xs sm:text-sm">
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code} className="text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};