import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Shield, LogOut, ChevronRight, Moon, Globe, Mail } from 'lucide-react-native';

interface Preferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  autoSync: boolean;
  dataRetention: number;
}

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  weeklyReports: boolean;
  brandAlerts: boolean;
  marketingEmails: boolean;
}

export default function SettingsScreen() {
  const { logout } = useAuth();
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [notifications, setNotifications] = useState<NotificationSettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load preferences
      const prefsResponse = await fetch('/api/v1/settings/preferences');
      if (prefsResponse.ok) {
        const prefsData = await prefsResponse.json();
        setPreferences(prefsData);
      }

      // Load notification settings
      const notifResponse = await fetch('/api/v1/settings/notifications');
      if (notifResponse.ok) {
        const notifData = await notifResponse.json();
        setNotifications(notifData);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updatePreferences = async (newPrefs: Partial<Preferences>) => {
    if (!preferences) return;

    const updatedPrefs = { ...preferences, ...newPrefs };
    setPreferences(updatedPrefs);

    try {
      await fetch('/api/v1/settings/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPrefs),
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const updateNotifications = async (newNotifs: Partial<NotificationSettings>) => {
    if (!notifications) return;

    const updatedNotifs = { ...notifications, ...newNotifs };
    setNotifications(updatedNotifs);

    try {
      await fetch('/api/v1/settings/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNotifs),
      });
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  if (!preferences || !notifications) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Moon size={20} color="#000000" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Theme</Text>
              <Text style={styles.settingDescription}>App appearance</Text>
            </View>
          </View>
          <Text style={styles.settingValue}>{preferences.theme}</Text>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Globe size={20} color="#000000" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingDescription}>App language</Text>
            </View>
          </View>
          <Text style={styles.settingValue}>{preferences.language}</Text>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Shield size={20} color="#000000" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Auto Sync</Text>
              <Text style={styles.settingDescription}>Automatically sync data</Text>
            </View>
          </View>
          <Switch
            value={preferences.autoSync}
            onValueChange={(value) => updatePreferences({ autoSync: value })}
            trackColor={{ false: '#E5E5E5', true: '#000000' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Bell size={20} color="#000000" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Receive push notifications</Text>
            </View>
          </View>
          <Switch
            value={notifications.pushNotifications}
            onValueChange={(value) => updateNotifications({ pushNotifications: value })}
            trackColor={{ false: '#E5E5E5', true: '#000000' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Mail size={20} color="#000000" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Email Notifications</Text>
              <Text style={styles.settingDescription}>Receive email updates</Text>
            </View>
          </View>
          <Switch
            value={notifications.emailNotifications}
            onValueChange={(value) => updateNotifications({ emailNotifications: value })}
            trackColor={{ false: '#E5E5E5', true: '#000000' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Bell size={20} color="#000000" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Weekly Reports</Text>
              <Text style={styles.settingDescription}>Weekly brand performance</Text>
            </View>
          </View>
          <Switch
            value={notifications.weeklyReports}
            onValueChange={(value) => updateNotifications({ weeklyReports: value })}
            trackColor={{ false: '#E5E5E5', true: '#000000' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Bell size={20} color="#000000" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Brand Alerts</Text>
              <Text style={styles.settingDescription}>Important brand mentions</Text>
            </View>
          </View>
          <Switch
            value={notifications.brandAlerts}
            onValueChange={(value) => updateNotifications({ brandAlerts: value })}
            trackColor={{ false: '#E5E5E5', true: '#000000' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#FF0000" />
          <Text style={styles.logoutText}>Sign Out</Text>
          <ChevronRight size={20} color="#FF0000" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#000000',
    padding: 20,
    paddingBottom: 0,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000000',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  settingValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
    textTransform: 'capitalize',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FF0000',
    flex: 1,
    marginLeft: 16,
  },
});