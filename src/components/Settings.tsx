import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Save, School, Bell, Shield, Database } from 'lucide-react';

const Settings: React.FC = () => {
  const [schoolSettings, setSchoolSettings] = useState({
    name: 'Educ8 Secondary School',
    address: '123 Education Street, Harare, Zimbabwe',
    phone: '+263 4 123 4567',
    email: 'info@educ8school.edu.zw',
    website: 'www.educ8school.edu.zw'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    gradeAlerts: true,
    attendanceAlerts: true
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90'
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <Button className="w-full sm:w-auto">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="school" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="school" className="flex items-center gap-2">
            <School className="w-4 h-4" />
            <span className="hidden sm:inline">School</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    value={schoolSettings.name}
                    onChange={(e) => setSchoolSettings({...schoolSettings, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={schoolSettings.phone}
                    onChange={(e) => setSchoolSettings({...schoolSettings, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={schoolSettings.email}
                    onChange={(e) => setSchoolSettings({...schoolSettings, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={schoolSettings.website}
                    onChange={(e) => setSchoolSettings({...schoolSettings, website: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={schoolSettings.address}
                  onChange={(e) => setSchoolSettings({...schoolSettings, address: e.target.value})}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via SMS</p>
                </div>
                <Switch
                  checked={notifications.smsNotifications}
                  onCheckedChange={(checked) => setNotifications({...notifications, smsNotifications: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Grade Alerts</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when grades are updated</p>
                </div>
                <Switch
                  checked={notifications.gradeAlerts}
                  onCheckedChange={(checked) => setNotifications({...notifications, gradeAlerts: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Attendance Alerts</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about attendance issues</p>
                </div>
                <Switch
                  checked={notifications.attendanceAlerts}
                  onCheckedChange={(checked) => setNotifications({...notifications, attendanceAlerts: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
                </div>
                <Switch
                  checked={security.twoFactorAuth}
                  onCheckedChange={(checked) => setSecurity({...security, twoFactorAuth: checked})}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Select value={security.sessionTimeout} onValueChange={(value) => setSecurity({...security, sessionTimeout: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Select value={security.passwordExpiry} onValueChange={(value) => setSecurity({...security, passwordExpiry: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <Select defaultValue="2024">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Current Term</Label>
                  <Select defaultValue="term1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="term1">Term 1</SelectItem>
                      <SelectItem value="term2">Term 2</SelectItem>
                      <SelectItem value="term3">Term 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  Backup Database
                </Button>
                <Button variant="outline" className="w-full">
                  Export Data
                </Button>
                <Button variant="destructive" className="w-full">
                  Reset System
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;