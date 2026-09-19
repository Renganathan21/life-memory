import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Lock, Mail, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react-native';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Button } from '../../src/components/ui/Button';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLocalError(null);
    clearError();

    if (!email.trim() || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    const res = await login({ email: email.trim(), password });
    if (res.success) {
      router.replace('/(tabs)');
    } else {
      setLocalError(res.error || 'Failed to sign in.');
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
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="px-6 py-8"
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand Header */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-3xl bg-indigo-600 items-center justify-center shadow-lg shadow-indigo-500/40 mb-4">
              <Sparkles size={32} color="#ffffff" />
            </View>
            <Text className="text-3xl font-extrabold text-white tracking-tight">
              Life Memory
            </Text>
            <Text className="text-sm text-slate-400 mt-1.5 text-center">
              Everything you don't want to forget.
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl shadow-black/50 mb-6">
            <Text className="text-xl font-bold text-white mb-1">
              Welcome back
            </Text>
            <Text className="text-xs text-slate-400 mb-6">
              Sign in to access your remembered items and alerts
            </Text>

            {/* Error Banner */}
            {displayError && (
              <View className="bg-rose-950/80 border border-rose-800/80 rounded-2xl p-3.5 mb-4">
                <Text className="text-rose-300 text-xs font-medium">
                  {displayError}
                </Text>
              </View>
            )}

            {/* Email Field */}
            <View className="mb-4">
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </Text>
              <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5">
                <Mail size={18} color="#64748b" />
                <TextInput
                  className="flex-1 ml-3 text-white text-sm"
                  placeholder="you@example.com"
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
                Password
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
              title="Sign In"
              size="lg"
              loading={isLoading}
              onPress={handleLogin}
              icon={<ArrowRight size={18} color="#ffffff" />}
            />
          </View>

          {/* Navigation to Register */}
          <View className="flex-row items-center justify-center gap-1.5">
            <Text className="text-sm text-slate-400">
              Don't have an account yet?
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-sm font-bold text-indigo-400">
                Create one
              </Text>
            </TouchableOpacity>
          </View>

          {/* Guest Demo Option */}
          <TouchableOpacity
            className="mt-6 py-2 items-center"
            onPress={() => router.replace('/(tabs)')}
          >
            <Text className="text-xs text-slate-500 font-medium">
              Continue exploring as guest →
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
