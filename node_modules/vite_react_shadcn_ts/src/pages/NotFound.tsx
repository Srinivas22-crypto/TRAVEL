import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-8xl font-bold text-primary mb-4">{t('notFound.title')}</div>
        <h1 className="text-2xl font-bold mb-2">{t('notFound.subtitle')}</h1>
        <p className="text-muted-foreground mb-8">{t('notFound.message')}</p>
        <Button asChild>
          <Link to="/" className="inline-flex items-center gap-2">
            <Home className="h-4 w-4" />
            {t('notFound.backToHome')}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
