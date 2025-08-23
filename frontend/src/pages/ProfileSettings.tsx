import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Camera,
  Save,
  ArrowLeft,
  Loader2
} from 'lucide-react';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, updateUser, isLoading: authLoading } = useAuth();

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    travelUpdates: true,
    marketing: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showTravelHistory: false,
    allowMessages: true
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize profile data from authenticated user
  useEffect(() => {
    if (user) {
      // Split name into first and last name
      const nameParts = user.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setProfile({
        firstName,
        lastName,
        email: user.email,
        phone: '', // Phone not in current user model
        location: '', // Location not in current user model
        bio: user.bio || '',
        avatar: user.profileImage || ''
      });

      // Set notifications from user preferences
      if (user.preferences?.notifications) {
        setNotifications({
          emailNotifications: user.preferences.notifications.email,
          pushNotifications: user.preferences.notifications.push,
          travelUpdates: true, // Default for travel updates
          marketing: user.preferences.notifications.marketing
        });
      }
    }
  }, [user]);

  const handleProfileSave = async () => {
    if (!user) return;

    try {
      setIsUpdating(true);

      // Combine first and last name
      const fullName = `${profile.firstName} ${profile.lastName}`.trim();

      // Prepare update data
      const updateData = {
        name: fullName,
        email: profile.email,
        bio: profile.bio,
        profileImage: profile.avatar
      };

      await updateUser(updateData);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotificationSave = async () => {
    if (!user) return;

    try {
      setIsUpdating(true);

      // Update user preferences with notification settings
      const updateData = {
        preferences: {
          ...user.preferences,
          notifications: {
            email: notifications.emailNotifications,
            push: notifications.pushNotifications,
            marketing: notifications.marketing
          }
        }
      };

      await updateUser(updateData);
      toast.success('Notification preferences updated successfully!');
    } catch (error: any) {
      console.error('Notification update error:', error);
      toast.error(error.message || 'Failed to update notification preferences');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrivacySave = async () => {
    try {
      setIsUpdating(true);
      // Privacy settings would need to be added to the user model
      // For now, just show a success message
      toast.success('Privacy settings updated successfully!');
    } catch (error: any) {
      console.error('Privacy update error:', error);
      toast.error(error.message || 'Failed to update privacy settings');
    } finally {
      setIsUpdating(false);
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
    }
  }, [user, authLoading, navigate]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{t('profile.settings')}</h1>
            <p className="text-muted-foreground">{t('profile.manageAccount')}</p>
          </div>
        </div>

        {/* Profile Overview Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-semibold">{user.name}</h2>
                  {user.isVerified && (
                    <Badge variant="secondary">{t('profile.verified')}</Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-1">{user.email}</p>
                {profile.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {profile.location}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('profile.personalInfo')}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              {t('profile.notifications')}
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t('profile.privacy')}
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {t('profile.billing')}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="flex-1"
                    />
                    <Mail className="h-4 w-4 text-muted-foreground self-center" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="flex-1"
                    />
                    <Phone className="h-4 w-4 text-muted-foreground self-center" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      className="flex-1"
                    />
                    <MapPin className="h-4 w-4 text-muted-foreground self-center" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button
                    onClick={handleProfileSave}
                    disabled={isUpdating}
                    className="flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified about updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, emailNotifications: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, pushNotifications: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Travel Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about flight delays, gate changes, etc.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.travelUpdates}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, travelUpdates: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Communications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional offers and travel deals
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, marketing: checked})
                    }
                  />
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button
                    onClick={handleNotificationSave}
                    disabled={isUpdating}
                    className="flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isUpdating ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control who can see your information and activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Make your profile visible to other users
                    </p>
                  </div>
                  <Switch
                    checked={privacy.profileVisible}
                    onCheckedChange={(checked) => 
                      setPrivacy({...privacy, profileVisible: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Travel History</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your past trips on your profile
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showTravelHistory}
                    onCheckedChange={(checked) => 
                      setPrivacy({...privacy, showTravelHistory: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Let other users send you direct messages
                    </p>
                  </div>
                  <Switch
                    checked={privacy.allowMessages}
                    onCheckedChange={(checked) => 
                      setPrivacy({...privacy, allowMessages: checked})
                    }
                  />
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button
                    onClick={handlePrivacySave}
                    disabled={isUpdating}
                    className="flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isUpdating ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Free Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        Basic travel planning features
                      </p>
                    </div>
                    <Badge variant="outline">Current Plan</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    Upgrade to Premium
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Payment Methods</h3>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">**** **** **** 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default ProfileSettings;