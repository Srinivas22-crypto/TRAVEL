import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  error?: Error | string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  variant?: 'card' | 'inline';
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title,
  message,
  error,
  onRetry,
  showHomeButton = true,
  variant = 'card'
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const errorMessage = typeof error === 'string' ? error : error?.message;

  const defaultTitle = t('error.defaultTitle', 'Something went wrong');
  const defaultMessage = t(
    'error.defaultMessage',
    'An unexpected error occurred. Please try again.'
  );

  if (variant === 'inline') {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title || defaultTitle}</h3>
        <p className="text-muted-foreground mb-4 max-w-md">{message || defaultMessage}</p>
        {errorMessage && (
          <p className="text-sm text-red-600 mb-4 font-mono bg-red-50 p-2 rounded">
            {errorMessage}
          </p>
        )}
        <div className="flex gap-2">
          {onRetry && (
            <Button onClick={onRetry} size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('error.tryAgain', 'Try Again')}
            </Button>
          )}
          {showHomeButton && (
            <Button variant="outline" onClick={() => navigate('/')} size="sm">
              <Home className="mr-2 h-4 w-4" />
              {t('error.goHome', 'Go Home')}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle>{title || defaultTitle}</CardTitle>
          <CardDescription>{message || defaultMessage}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-800 font-mono">{errorMessage}</p>
            </div>
          )}
          <div className="flex gap-2">
            {onRetry && (
              <Button onClick={onRetry} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                {t('error.tryAgain', 'Try Again')}
              </Button>
            )}
            {showHomeButton && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/')} 
                className="flex-1"
              >
                <Home className="mr-2 h-4 w-4" />
                {t('error.goHome', 'Go Home')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorDisplay;
