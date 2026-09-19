import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Card } from '../../src/components/ui/Card';

export default function CalendarScreen() {
  const [selectedDay, setSelectedDay] = useState(19);

  const days = [
    { day: 'Mon', date: 15, active: false },
    { day: 'Tue', date: 16, active: false },
    { day: 'Wed', date: 17, active: false },
    { day: 'Thu', date: 18, active: false },
    { day: 'Fri', date: 19, active: true },
    { day: 'Sat', date: 20, active: false },
    { day: 'Sun', date: 21, active: false },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      {/* Calendar Header */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-3">
        <View>
          <Text className="text-2xl font-bold text-slate-50 tracking-tight">
            September 2026
          </Text>
          <Text className="text-xs text-slate-400 mt-0.5">
            Your schedule & due dates
          </Text>
        </View>

        <View className="flex-row items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
          <TouchableOpacity className="p-1.5 active:bg-slate-800 rounded-lg">
            <ChevronLeft size={16} color="#94a3b8" />
          </TouchableOpacity>
          <TouchableOpacity className="p-1.5 active:bg-slate-800 rounded-lg">
            <ChevronRight size={16} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Week Strip */}
      <View className="flex-row justify-between px-5 py-3 border-b border-slate-900 mb-4">
        {days.map((item) => {
          const isSelected = selectedDay === item.date;
          return (
            <TouchableOpacity
              key={item.date}
              onPress={() => setSelectedDay(item.date)}
              className={`items-center py-2.5 px-3 rounded-2xl ${
                isSelected
                  ? 'bg-indigo-600 shadow-md shadow-indigo-500/30'
                  : 'bg-slate-900/60 border border-slate-800/60'
              }`}
            >
              <Text className={`text-[10px] font-semibold uppercase ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                {item.day}
              </Text>
              <Text className={`text-base font-bold mt-0.5 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                {item.date}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-3">
          Events for Sep {selectedDay}
        </Text>

        <View className="gap-3">
          <Card className="flex-row items-center justify-between bg-slate-900/90 border-slate-800">
            <View className="flex-row items-center gap-3">
              <View className="w-2 h-10 rounded-full bg-rose-500" />
              <View>
                <Text className="text-slate-100 font-semibold text-sm">
                  Return Online Order
                </Text>
                <Text className="text-slate-400 text-xs mt-0.5">
                  Due before 5:00 PM • Courier pickup
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1">
              <Clock size={14} color="#94a3b8" />
              <Text className="text-xs text-slate-300">5:00 PM</Text>
            </View>
          </Card>

          <Card className="flex-row items-center justify-between bg-slate-900/90 border-slate-800">
            <View className="flex-row items-center gap-3">
              <View className="w-2 h-10 rounded-full bg-emerald-500" />
              <View>
                <Text className="text-slate-100 font-semibold text-sm">
                  Blood Pressure Medicine Refill
                </Text>
                <Text className="text-slate-400 text-xs mt-0.5">
                  Pharmacy reorder threshold reached
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1">
              <Clock size={14} color="#94a3b8" />
              <Text className="text-xs text-slate-300">8:00 PM</Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
