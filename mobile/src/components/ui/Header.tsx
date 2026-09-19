import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Bell, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showActions?: boolean;
}

export function Header({
  title = 'Life Memory',
  subtitle,
  showActions = true,
}: HeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-5 pt-3 pb-4">
      <View className="flex-1">
        {subtitle && (
          <Text className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-0.5">
            {subtitle}
          </Text>
        )}
        <Text className="text-2xl font-bold text-slate-50 tracking-tight">
          {title}
        </Text>
      </View>

      {showActions && (
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700/60 items-center justify-center active:bg-slate-700"
            onPress={() => router.push('/(tabs)/things')}
            accessibilityLabel="Search"
          >
            <Search size={18} color="#94a3b8" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700/60 items-center justify-center active:bg-slate-700"
            onPress={() => router.push('/(tabs)/notifications')}
            accessibilityLabel="Notifications"
          >
            <Bell size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
