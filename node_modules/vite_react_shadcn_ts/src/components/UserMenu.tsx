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

interface UserMenuProps {
  className?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ className = '' }) => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/signin');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive",
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
    if (!user) return 'User';
    return `${user.firstName} ${user.lastName}`.trim() || 'User';
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
              Profile
            </DropdownMenuItem>
            
            {/* Profile Settings */}
            <DropdownMenuItem 
              onClick={handleProfileSettings}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            
            {/* Logout */}
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive"
              disabled={isLoading}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoading ? 'Logging out...' : 'Logout'}
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
              Sign In
            </DropdownMenuItem>
            
            {/* Register */}
            <DropdownMenuItem 
              onClick={handleRegister}
              className="cursor-pointer"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Register
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;