import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Settings,
  Save,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
  Trash2,
  BarChart3,
  Calendar,
  MapPin,
  Route
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AccountStats } from '@/services/authService';

const ProfileSettings = () => {
  const { t } = useTranslation();
  const { 
    user, 
    updateUser, 
    updatePassword, 
    getAccountStats, 
    deleteAccount,
    logout 
  } = useAuth();

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: user?.bio || ''
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Account Stats State
  const [accountStats, setAccountStats] = useState<AccountStats | null>(null);

  // Delete Account State
  const [deleteAccountData, setDeleteAccountData] = useState({
    password: '',
    confirmationText: ''
  });

  // UI State
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Responsive Settings Navigation
  const [settingsTab, setSettingsTab] = useState<'personal' | 'notifications' | 'privacy' | 'account' | 'billing'>('personal');

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    travelUpdates: true,
    marketingCommunications: false
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showTravelHistory: true,
    allowMessages: true
  });

  // Load account statistics
  useEffect(() => {
    const loadAccountStats = async () => {
      if (!user) return;
      
      setIsLoadingStats(true);
      try {
        const stats = await getAccountStats();
        setAccountStats(stats);
      } catch (error) {
        console.error('Failed to load account stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadAccountStats();
  }, [user, getAccountStats]);

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await updateUser({
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        bio: personalInfo.bio
      });
      toast.success(t('profile.saveChanges'));
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t('auth.passwordsNoMatch'));
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteAccountData.confirmationText !== 'DELETE MY ACCOUNT') {
      toast.error('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }

    if (!deleteAccountData.password) {
      toast.error('Please enter your password');
      return;
    }

    setIsDeletingAccount(true);

    try {
      await deleteAccount({
        password: deleteAccountData.password,
        confirmationText: deleteAccountData.confirmationText
      });
      
      toast.success('Account deleted successfully');
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete account');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 text-center md:text-left">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              {t('profile.settings')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('profile.manageAccount')}
            </p>
          </div>

          {/* Mobile dropdown for Settings Sections */}
          <div className="md:hidden mb-4">
            <Select value={settingsTab} onValueChange={(v) => setSettingsTab(v as any)}>
              <SelectTrigger className="w-full bg-card border-border rounded-md">
                <SelectValue placeholder="Settings Sections" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-sm">
                <SelectItem value="personal">Personal Information</SelectItem>
                <SelectItem value="notifications">Notifications</SelectItem>
                <SelectItem value="privacy">Privacy</SelectItem>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={settingsTab} onValueChange={(v) => setSettingsTab(v as any)} className="space-y-6">
            <TabsList className="hidden md:grid w-full grid-cols-5">
              <TabsTrigger value="personal" className="flex items-center gap-2">
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
              <TabsTrigger value="account" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {t('profile.billing')}
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.personalInfo')}</CardTitle>
                  <CardDescription>
                    {t('profile.updatePersonalDetails')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t('profile.firstName')}</Label>
                        <Input
                          id="firstName"
                          value={personalInfo.firstName}
                          onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t('profile.lastName')}</Label>
                        <Input
                          id="lastName"
                          value={personalInfo.lastName}
                          onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('profile.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">{t('profile.bio')}</Label>
                      <Textarea
                        id="bio"
                        placeholder={t('profile.bioPlaceholder')}
                        value={personalInfo.bio}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                      />
                    </div>

                    <Button type="submit" disabled={isUpdating} className="w-full">
                      {isUpdating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {t('profile.saveChanges')}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isUpdatingPassword}>
                      {isUpdatingPassword ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.notificationPreferences')}</CardTitle>
                  <CardDescription>
                    {t('profile.chooseNotifications')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('profile.emailNotifications')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('profile.emailNotificationsDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('profile.pushNotifications')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('profile.pushNotificationsDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('profile.travelUpdates')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('profile.travelUpdatesDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={notifications.travelUpdates}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, travelUpdates: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('profile.marketingCommunications')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('profile.marketingCommunicationsDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketingCommunications}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, marketingCommunications: checked }))
                      }
                    />
                  </div>

                  <Button className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {t('profile.savePreferences')}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.privacySettings')}</CardTitle>
                  <CardDescription>
                    {t('profile.controlPrivacy')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('profile.publicProfile')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('profile.publicProfileDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={privacy.publicProfile}
                      onCheckedChange={(checked) => 
                        setPrivacy(prev => ({ ...prev, publicProfile: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('profile.showTravelHistory')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('profile.showTravelHistoryDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showTravelHistory}
                      onCheckedChange={(checked) => 
                        setPrivacy(prev => ({ ...prev, showTravelHistory: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('profile.allowMessages')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('profile.allowMessagesDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={privacy.allowMessages}
                      onCheckedChange={(checked) => 
                        setPrivacy(prev => ({ ...prev, allowMessages: checked }))
                      }
                    />
                  </div>

                  <Button className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {t('profile.saveSettings')}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Management Tab */}
            <TabsContent value="account">
              <div className="space-y-6">
                {/* Account Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Account Statistics
                    </CardTitle>
                    <CardDescription>
                      Overview of your account activity and data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingStats ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : accountStats ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-accent/50 rounded-lg">
                          <Route className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                          <div className="text-2xl font-bold">{accountStats.totalTrips}</div>
                          <div className="text-sm text-muted-foreground">Total Trips</div>
                        </div>
                        <div className="text-center p-4 bg-accent/50 rounded-lg">
                          <MapPin className="h-6 w-6 mx-auto mb-2 text-green-500" />
                          <div className="text-2xl font-bold">{accountStats.plannedTrips}</div>
                          <div className="text-sm text-muted-foreground">Planned</div>
                        </div>
                        <div className="text-center p-4 bg-accent/50 rounded-lg">
                          <Calendar className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                          <div className="text-2xl font-bold">{accountStats.completedTrips}</div>
                          <div className="text-sm text-muted-foreground">Completed</div>
                        </div>
                        <div className="text-center p-4 bg-accent/50 rounded-lg">
                          <User className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                          <div className="text-2xl font-bold">{accountStats.accountAge}</div>
                          <div className="text-sm text-muted-foreground">Days Active</div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Failed to load account statistics
                      </p>
                    )}
                    
                    {accountStats && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          Member since {formatDate(accountStats.memberSince)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription>
                      Irreversible actions that will permanently affect your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                        <h4 className="font-semibold text-destructive mb-2">Delete Account</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Permanently delete your account and all associated data. This action cannot be undone.
                          All your trips, saved routes, and profile information will be permanently removed.
                        </p>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete My Account
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-md">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                                Delete Account
                              </AlertDialogTitle>
                              <AlertDialogDescription className="space-y-4">
                                <p>
                                  This will permanently delete your account and all associated data including:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  <li>All saved trips and routes</li>
                                  <li>Profile information and settings</li>
                                  <li>Account history and statistics</li>
                                </ul>
                                <p className="font-semibold text-destructive">
                                  This action cannot be undone.
                                </p>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="deletePassword">Enter your password</Label>
                                <div className="relative">
                                  <Input
                                    id="deletePassword"
                                    type={showDeletePassword ? 'text' : 'password'}
                                    value={deleteAccountData.password}
                                    onChange={(e) => setDeleteAccountData(prev => ({ ...prev, password: e.target.value }))}
                                    placeholder="Enter your password"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                                  >
                                    {showDeletePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="confirmationText">
                                  Type "DELETE MY ACCOUNT" to confirm
                                </Label>
                                <Input
                                  id="confirmationText"
                                  value={deleteAccountData.confirmationText}
                                  onChange={(e) => setDeleteAccountData(prev => ({ ...prev, confirmationText: e.target.value }))}
                                  placeholder="DELETE MY ACCOUNT"
                                />
                              </div>
                            </div>

                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setDeleteAccountData({ password: '', confirmationText: '' })}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteAccount}
                                disabled={isDeletingAccount}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                {isDeletingAccount ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                  </>
                                ) : (
                                  'Delete Account'
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.billingSubscription')}</CardTitle>
                  <CardDescription>
                    {t('profile.manageBilling')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{t('profile.freePlan')}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t('profile.freePlanDesc')}
                      </p>
                    </div>
                    <Badge variant="secondary">{t('profile.currentPlan')}</Badge>
                  </div>

                  <Button className="w-full" variant="outline">
                    {t('profile.upgradeToPremium')}
                  </Button>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-4">{t('profile.paymentMethods')}</h4>
                    <Button variant="outline" className="w-full">
                      {t('profile.addPaymentMethod')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfileSettings;