import React from 'react';
import { Loader2 } from 'lucide-react';

interface GlobalLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const GlobalLoading: React.FC<GlobalLoadingProps> = ({ 
  message = 'Loading...', 
  size = 'md',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center'
    : 'flex items-center justify-center py-8';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        {message && (
          <p className="text-muted-foreground text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default GlobalLoading;
