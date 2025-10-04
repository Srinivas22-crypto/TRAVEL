import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Settings, 
  LogOut,
  UserPlus
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserMenuProps {
  className?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ className = '' }) => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t('userMenu.toast.logoutSuccess.title'),
        description: t('userMenu.toast.logoutSuccess.description'),
      });
      navigate('/signin');
    } catch (error) {
      toast({
        title: t('userMenu.toast.logoutError.title'),
        description: t('userMenu.toast.logoutError.description'),
        variant: 'destructive',
      });
    }
  };

  const handleProfileSettings = () => {
    navigate('/profile-settings');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const getUserFullName = () => {
    if (!user) return t('userMenu.user');
    return `${user.firstName} ${user.lastName}`.trim() || t('userMenu.user');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`relative ${className}`}>
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {isAuthenticated ? (
          <>
            {/* User Info Section */}
            <div className="px-3 py-2">
              <p className="font-medium text-sm">{getUserFullName()}</p>
              <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
            </div>
            <DropdownMenuSeparator />

            {/* Profile */}
            <DropdownMenuItem 
              onClick={() => navigate('/profile')}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              {t('userMenu.profile')}
            </DropdownMenuItem>

            {/* Profile Settings */}
            <DropdownMenuItem 
              onClick={handleProfileSettings}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              {t('userMenu.profileSettings')}
            </DropdownMenuItem>

            {/* Logout */}
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive"
              disabled={isLoading}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoading ? t('userMenu.loggingOut') : t('userMenu.logout')}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            {/* Sign In */}
            <DropdownMenuItem 
              onClick={handleSignIn}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              {t('userMenu.signIn')}
            </DropdownMenuItem>

            {/* Register */}
            <DropdownMenuItem 
              onClick={handleRegister}
              className="cursor-pointer"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {t('userMenu.register')}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
