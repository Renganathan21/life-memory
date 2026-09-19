import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Lock, Mail, User, Eye, EyeOff, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Button } from '../../src/components/ui/Button';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRegister = async () => {
    setLocalError(null);
    clearError();

    if (!name.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
      return;
    }

    const res = await register({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    if (res.success) {
      router.replace('/(tabs)');
    } else {
      setLocalError(res.error || 'Registration failed.');
    }
  };

  const displayError = localError || error;

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6 py-6"
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 items-center justify-center mb-6"
          >
            <ArrowLeft size={20} color="#94a3b8" />
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-extrabold text-white tracking-tight">
              Create Account
            </Text>
            <Text className="text-sm text-slate-400 mt-1.5">
              Start keeping track of everything in your life
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl shadow-black/50 mb-6">
            {/* Error Banner */}
            {displayError && (
              <View className="bg-rose-950/80 border border-rose-800/80 rounded-2xl p-3.5 mb-4">
                <Text className="text-rose-300 text-xs font-medium">
                  {displayError}
                </Text>
              </View>
            )}

            {/* Name Field */}
            <View className="mb-4">
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Your Name
              </Text>
              <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5">
                <User size={18} color="#64748b" />
                <TextInput
                  className="flex-1 ml-3 text-white text-sm"
                  placeholder="Alex Johnson"
                  placeholderTextColor="#475569"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Email Field */}
            <View className="mb-4">
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </Text>
              <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5">
                <Mail size={18} color="#64748b" />
                <TextInput
                  className="flex-1 ml-3 text-white text-sm"
                  placeholder="alex@example.com"
                  placeholderTextColor="#475569"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="mb-6">
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Password (min 8 characters)
              </Text>
              <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5">
                <Lock size={18} color="#64748b" />
                <TextInput
                  className="flex-1 ml-3 text-white text-sm"
                  placeholder="••••••••"
                  placeholderTextColor="#475569"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#64748b" />
                  ) : (
                    <Eye size={18} color="#64748b" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <Button
              title="Create Account"
              size="lg"
              loading={isLoading}
              onPress={handleRegister}
              icon={<ArrowRight size={18} color="#ffffff" />}
            />
          </View>

          {/* Navigation to Login */}
          <View className="flex-row items-center justify-center gap-1.5 pb-8">
            <Text className="text-sm text-slate-400">
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-sm font-bold text-indigo-400">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
