import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function TabLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <View style={{ 
              width: size, 
              height: size, 
              backgroundColor: color, 
              borderRadius: size / 2,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>D</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <View style={{ 
              width: size, 
              height: size, 
              backgroundColor: color, 
              borderRadius: size / 2,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>P</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <View style={{ 
              width: size, 
              height: size, 
              backgroundColor: color, 
              borderRadius: size / 2,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>S</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}