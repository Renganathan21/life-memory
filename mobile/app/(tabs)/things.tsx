import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Wrench, FileText, Pill, CreditCard, ShoppingBag, Users, MapPin, Bell, ChevronRight } from 'lucide-react-native';
import { Card } from '../../src/components/ui/Card';

const CATEGORIES = [
  { id: 'home_vehicle', name: 'Home & Vehicles', count: 4, icon: Wrench, color: '#38bdf8', bg: 'bg-sky-950/70 border-sky-800/40' },
  { id: 'document', name: 'Documents', count: 6, icon: FileText, color: '#a78bfa', bg: 'bg-violet-950/70 border-violet-800/40' },
  { id: 'medicine', name: 'Medicines', count: 3, icon: Pill, color: '#34d399', bg: 'bg-emerald-950/70 border-emerald-800/40' },
  { id: 'subscription', name: 'Subscriptions', count: 5, icon: CreditCard, color: '#fbbf24', bg: 'bg-amber-950/70 border-amber-800/40' },
  { id: 'purchase', name: 'Purchases & Warranties', count: 8, icon: ShoppingBag, color: '#f472b6', bg: 'bg-pink-950/70 border-pink-800/40' },
  { id: 'family', name: 'Family Responsibilities', count: 2, icon: Users, color: '#60a5fa', bg: 'bg-blue-950/70 border-blue-800/40' },
  { id: 'parking', name: 'Parking Spots', count: 1, icon: MapPin, color: '#818cf8', bg: 'bg-indigo-950/70 border-indigo-800/40' },
  { id: 'reminder', name: 'General Reminders', count: 9, icon: Bell, color: '#2dd4bf', bg: 'bg-teal-950/70 border-teal-800/40' },
];

export default function ThingsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      {/* Title */}
      <View className="px-5 pt-3 pb-3">
        <Text className="text-2xl font-bold text-slate-50 tracking-tight">
          Things
        </Text>
        <Text className="text-xs text-slate-400 mt-0.5">
          Everything you are keeping track of
        </Text>
      </View>

      {/* Global Search Bar */}
      <View className="px-5 mb-4">
        <View className="flex-row items-center bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3">
          <Search size={18} color="#64748b" />
          <TextInput
            className="flex-1 ml-3 text-slate-100 text-sm"
            placeholder="Search items, stores, names, or tags..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-3">
          Categories ({filteredCategories.length})
        </Text>

        <View className="gap-2.5">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <TouchableOpacity key={cat.id} activeOpacity={0.75}>
                <Card className="flex-row items-center justify-between bg-slate-900/90 border-slate-800">
                  <View className="flex-row items-center gap-3.5 flex-1">
                    <View className={`w-11 h-11 rounded-xl border items-center justify-center ${cat.bg}`}>
                      <Icon size={20} color={cat.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-100 font-semibold text-sm">
                        {cat.name}
                      </Text>
                      <Text className="text-slate-400 text-xs mt-0.5">
                        {cat.count} saved {cat.count === 1 ? 'item' : 'items'}
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
