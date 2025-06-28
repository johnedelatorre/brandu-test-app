import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Target, TrendingUp, CreditCard as Edit3, Save, X } from 'lucide-react-native';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  goals: string[];
  persona: string;
}

interface ProfileMetrics {
  totalPosts: number;
  engagement: number;
  followers: number;
  brandScore: number;
}

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [metrics, setMetrics] = useState<ProfileMetrics | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      // Load user profile
      const profileResponse = await fetch('/api/v1/profile/user');
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData);
        setEditedProfile(profileData);
      }

      // Load profile metrics
      const metricsResponse = await fetch('/api/v1/profile/metrics');
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const handleSave = async () => {
    if (!editedProfile) return;

    try {
      const response = await fetch('/api/v1/profile/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProfile),
      });

      if (response.ok) {
        setProfile(editedProfile);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  if (!profile || !metrics) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? (
            <Save size={20} color="#000000" />
          ) : (
            <Edit3 size={20} color="#000000" />
          )}
        </TouchableOpacity>
        {isEditing && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <X size={20} color="#666666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <User size={48} color="#000000" />
        </View>
        
        {isEditing ? (
          <View style={styles.editForm}>
            <TextInput
              style={styles.editInput}
              value={editedProfile?.name || ''}
              onChangeText={(text) => setEditedProfile(prev => prev ? {...prev, name: text} : null)}
              placeholder="Full Name"
            />
            <TextInput
              style={[styles.editInput, styles.bioInput]}
              value={editedProfile?.bio || ''}
              onChangeText={(text) => setEditedProfile(prev => prev ? {...prev, bio: text} : null)}
              placeholder="Bio"
              multiline
              numberOfLines={3}
            />
            <TextInput
              style={styles.editInput}
              value={editedProfile?.persona || ''}
              onChangeText={(text) => setEditedProfile(prev => prev ? {...prev, persona: text} : null)}
              placeholder="Brand Persona"
            />
          </View>
        ) : (
          <>
            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.userEmail}>{profile.email}</Text>
            <Text style={styles.userBio}>{profile.bio}</Text>
            <View style={styles.personaContainer}>
              <Text style={styles.personaLabel}>Brand Persona</Text>
              <Text style={styles.personaText}>{profile.persona}</Text>
            </View>
          </>
        )}
      </View>

      {/* Metrics Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Performance Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{metrics.totalPosts}</Text>
            <Text style={styles.metricLabel}>Total Posts</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{metrics.engagement}%</Text>
            <Text style={styles.metricLabel}>Engagement</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{metrics.followers.toLocaleString()}</Text>
            <Text style={styles.metricLabel}>Followers</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{metrics.brandScore}/100</Text>
            <Text style={styles.metricLabel}>Brand Score</Text>
          </View>
        </View>
      </View>

      {/* Goals Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Brand Goals</Text>
        {profile.goals.map((goal, index) => (
          <View key={index} style={styles.goalItem}>
            <Target size={16} color="#000000" />
            <Text style={styles.goalText}>{goal}</Text>
          </View>
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#000000',
  },
  editButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 6,
  },
  cancelButton: {
    padding: 8,
    marginLeft: 8,
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
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#000000',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F5F5F5',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  userBio: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  personaContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 16,
  },
  personaLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  personaText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    lineHeight: 24,
  },
  editForm: {
    gap: 16,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    marginLeft: 12,
    flex: 1,
  },
});