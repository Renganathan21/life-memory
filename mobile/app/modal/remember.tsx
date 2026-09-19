import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  X,
  Wrench,
  FileText,
  Pill,
  CreditCard,
  ShoppingBag,
  Users,
  MapPin,
  Bell,
  ChevronRight,
} from 'lucide-react-native';
import { Card } from '../../src/components/ui/Card';

const REMEMBER_OPTIONS = [
  {
    id: 'home_vehicle',
    title: 'Home / Vehicle',
    description: 'Maintenance, service intervals, appliance & vehicle records',
    icon: Wrench,
    iconColor: '#38bdf8',
    bg: 'bg-sky-950/70 border-sky-800/40',
  },
  {
    id: 'document',
    title: 'Document',
    description: 'IDs, passport, insurance policies, contracts & renewal alerts',
    icon: FileText,
    iconColor: '#a78bfa',
    bg: 'bg-violet-950/70 border-violet-800/40',
  },
  {
    id: 'medicine',
    title: 'Medicine',
    description: 'Stock refills, dosages, and expiry reminders',
    icon: Pill,
    iconColor: '#34d399',
    bg: 'bg-emerald-950/70 border-emerald-800/40',
  },
  {
    id: 'subscription',
    title: 'Subscription',
    description: 'Recurring services, billing dates & monthly/yearly costs',
    icon: CreditCard,
    iconColor: '#fbbf24',
    bg: 'bg-amber-950/70 border-amber-800/40',
  },
  {
    id: 'purchase',
    title: 'Purchase',
    description: 'Receipts, warranties, price history & return deadlines',
    icon: ShoppingBag,
    iconColor: '#f472b6',
    bg: 'bg-pink-950/70 border-pink-800/40',
  },
  {
    id: 'family',
    title: 'Family',
    description: 'Responsibilities, birthdays & key dates for loved ones',
    icon: Users,
    iconColor: '#60a5fa',
    bg: 'bg-blue-950/70 border-blue-800/40',
  },
  {
    id: 'parking',
    title: 'Parking',
    description: 'Remember parked slot, floor, section & GPS coordinate',
    icon: MapPin,
    iconColor: '#818cf8',
    bg: 'bg-indigo-950/70 border-indigo-800/40',
  },
  {
    id: 'reminder',
    title: 'General Reminder',
    description: 'One-off or recurring personal to-dos and follow-ups',
    icon: Bell,
    iconColor: '#2dd4bf',
    bg: 'bg-teal-950/70 border-teal-800/40',
  },
];

export default function RememberModal() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      {/* Modal Header */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-4 border-b border-slate-900">
        <View>
          <Text className="text-xl font-bold text-slate-50">
            Remember Something
          </Text>
          <Text className="text-xs text-slate-400 mt-0.5">
            Select what you would like to remember
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 items-center justify-center active:bg-slate-800"
          accessibilityLabel="Close"
        >
          <X size={18} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Options List */}
      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View className="gap-2.5">
          {REMEMBER_OPTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.75}
                onPress={() => {
                  // Category form routing will be hooked up in respective feature phases
                  router.back();
                }}
              >
                <Card className="flex-row items-center justify-between bg-slate-900/90 border-slate-800 py-3.5">
                  <View className="flex-row items-center gap-3.5 flex-1 pr-2">
                    <View className={`w-11 h-11 rounded-xl border items-center justify-center ${item.bg}`}>
                      <Icon size={20} color={item.iconColor} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-100 font-semibold text-sm">
                        {item.title}
                      </Text>
                      <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={1}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color="#475569" />
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
