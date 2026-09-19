import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  User,
  Shield,
  Bell,
  HardDrive,
  Smartphone,
  LogOut,
  LogIn,
  ChevronRight,
  Moon,
  X,
  Edit2,
  Lock,
} from 'lucide-react-native';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { useThemeStore } from '../../src/store/useThemeStore';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user, isAuthenticated, logout, updateProfile, changePassword } = useAuthStore();

  // Edit Profile Modal
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Change Password Modal
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSignOut = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const openEditProfile = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    setEditName(user?.name || '');
    setShowEditProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty.');
      return;
    }
    setIsUpdatingProfile(true);
    const res = await updateProfile({ name: editName.trim() });
    setIsUpdatingProfile(false);
    if (res.success) {
      setShowEditProfile(false);
    } else {
      Alert.alert('Error', res.error || 'Failed to update profile');
    }
  };

  const openChangePassword = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setPasswordError(null);
    setShowChangePassword(true);
  };

  const handleSavePassword = async () => {
    setPasswordError(null);
    if (!currentPassword || !newPassword) {
      setPasswordError('Please fill in both fields.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    setIsChangingPassword(true);
    const res = await changePassword({ currentPassword, newPassword });
    setIsChangingPassword(false);
    if (res.success) {
      setShowChangePassword(false);
      Alert.alert('Success', 'Password updated successfully. Please sign in with your new password.', [
        { text: 'OK', onPress: handleSignOut },
      ]);
    } else {
      setPasswordError(res.error || 'Failed to change password.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <View className="px-5 pt-3 pb-3">
        <Text className="text-2xl font-bold text-slate-50 tracking-tight">
          Account & Settings
        </Text>
        <Text className="text-xs text-slate-400 mt-0.5">
          Manage your preferences and security
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* User Card */}
        <Card className="flex-row items-center gap-4 bg-slate-900/90 border-slate-800 mb-6">
          <View className="w-14 h-14 rounded-2xl bg-indigo-600 items-center justify-center shadow-md shadow-indigo-500/30">
            <User size={28} color="#ffffff" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-slate-50 font-bold text-base">
                {isAuthenticated && user ? user.name : 'Guest User'}
              </Text>
              {isAuthenticated && (
                <TouchableOpacity onPress={openEditProfile}>
                  <Edit2 size={14} color="#818cf8" />
                </TouchableOpacity>
              )}
            </View>
            <Text className="text-slate-400 text-xs mt-0.5">
              {isAuthenticated && user ? user.email : 'Local offline mode'}
            </Text>
            <Text className="text-[11px] text-emerald-400 font-medium mt-1">
              • {isAuthenticated ? 'Cloud Synchronized' : 'Offline Ready'}
            </Text>
          </View>
          {!isAuthenticated && (
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              className="bg-indigo-600 px-3 py-2 rounded-xl"
            >
              <Text className="text-white text-xs font-semibold">Sign In</Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Preferences Section */}
        <Text className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-2.5">
          Preferences
        </Text>
        <Card className="bg-slate-900/90 border-slate-800 mb-6 p-0 overflow-hidden divide-y divide-slate-800/80">
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <Moon size={18} color="#94a3b8" />
              <Text className="text-slate-200 font-medium text-sm">Dark Theme</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#334155', true: '#4f46e5' }}
              thumbColor={isDarkMode ? '#ffffff' : '#94a3b8'}
            />
          </View>

          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <Bell size={18} color="#94a3b8" />
              <Text className="text-slate-200 font-medium text-sm">Notification Timing</Text>
            </View>
            <ChevronRight size={18} color="#475569" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <HardDrive size={18} color="#94a3b8" />
              <Text className="text-slate-200 font-medium text-sm">Local Storage & Cache</Text>
            </View>
            <ChevronRight size={18} color="#475569" />
          </TouchableOpacity>
        </Card>

        {/* Security Section */}
        <Text className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-2.5">
          Security & Privacy
        </Text>
        <Card className="bg-slate-900/90 border-slate-800 mb-6 p-0 overflow-hidden divide-y divide-slate-800/80">
          <TouchableOpacity
            onPress={openChangePassword}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center gap-3">
              <Shield size={18} color="#94a3b8" />
              <Text className="text-slate-200 font-medium text-sm">
                {isAuthenticated ? 'Change Password' : 'Sign in to sync data'}
              </Text>
            </View>
            <ChevronRight size={18} color="#475569" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <Smartphone size={18} color="#94a3b8" />
              <Text className="text-slate-200 font-medium text-sm">App Permissions</Text>
            </View>
            <ChevronRight size={18} color="#475569" />
          </TouchableOpacity>
        </Card>

        {/* Action Button: Sign In or Sign Out */}
        {isAuthenticated ? (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleSignOut}
            className="flex-row items-center justify-center gap-2 bg-rose-950/40 border border-rose-900/40 py-3.5 rounded-2xl"
          >
            <LogOut size={16} color="#f87171" />
            <Text className="text-rose-400 font-semibold text-sm">
              Sign Out
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => router.push('/(auth)/login')}
            className="flex-row items-center justify-center gap-2 bg-indigo-950/50 border border-indigo-800/50 py-3.5 rounded-2xl"
          >
            <LogIn size={16} color="#818cf8" />
            <Text className="text-indigo-300 font-semibold text-sm">
              Sign In to Your Account
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showEditProfile} transparent animationType="fade">
        <View className="flex-1 bg-black/70 justify-center px-6">
          <View className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-white">Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Full Name
            </Text>
            <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 mb-6">
              <TextInput
                className="flex-1 text-white text-sm"
                value={editName}
                onChangeText={setEditName}
                placeholder="Your Name"
                placeholderTextColor="#64748b"
              />
            </View>

            <Button
              title="Save Changes"
              loading={isUpdatingProfile}
              onPress={handleSaveProfile}
            />
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={showChangePassword} transparent animationType="fade">
        <View className="flex-1 bg-black/70 justify-center px-6">
          <View className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-white">Change Password</Text>
              <TouchableOpacity onPress={() => setShowChangePassword(false)}>
                <X size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {passwordError && (
              <View className="bg-rose-950/80 border border-rose-800/80 rounded-2xl p-3 mb-4">
                <Text className="text-rose-300 text-xs font-medium">
                  {passwordError}
                </Text>
              </View>
            )}

            <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Current Password
            </Text>
            <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 mb-4">
              <Lock size={16} color="#64748b" />
              <TextInput
                className="flex-1 ml-3 text-white text-sm"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Current Password"
                placeholderTextColor="#64748b"
                secureTextEntry
              />
            </View>

            <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              New Password (min 8 chars)
            </Text>
            <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 mb-6">
              <Lock size={16} color="#64748b" />
              <TextInput
                className="flex-1 ml-3 text-white text-sm"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New Password"
                placeholderTextColor="#64748b"
                secureTextEntry
              />
            </View>

            <Button
              title="Update Password"
              loading={isChangingPassword}
              onPress={handleSavePassword}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
