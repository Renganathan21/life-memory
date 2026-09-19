import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, CheckCircle2, Clock, AlertTriangle } from 'lucide-react-native';
import { Card } from '../../src/components/ui/Card';

export default function NotificationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <View className="px-5 pt-3 pb-3 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-slate-50 tracking-tight">
            Alerts
          </Text>
          <Text className="text-xs text-slate-400 mt-0.5">
            Reminders and expiration notices
          </Text>
        </View>
        <TouchableOpacity>
          <Text className="text-xs font-semibold text-indigo-400">Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="gap-2.5">
          <Card className="bg-slate-900/90 border-slate-800">
            <View className="flex-row items-start gap-3">
              <View className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-800/50 items-center justify-center mt-0.5">
                <AlertTriangle size={18} color="#f87171" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-100 font-semibold text-sm">
                  Car Insurance Expiration Alert
                </Text>
                <Text className="text-slate-400 text-xs mt-1">
                  Your Policy #99281 expires in 12 days. Tap to review policy documents or renew.
                </Text>
                <Text className="text-[10px] text-slate-500 mt-2 font-medium">
                  2 hours ago
                </Text>
              </View>
            </View>
          </Card>

          <Card className="bg-slate-900/90 border-slate-800">
            <View className="flex-row items-start gap-3">
              <View className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-800/50 items-center justify-center mt-0.5">
                <Clock size={18} color="#fbbf24" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-100 font-semibold text-sm">
                  Upcoming Netflix Billing
                </Text>
                <Text className="text-slate-400 text-xs mt-1">
                  Scheduled payment of $19.99 will be deducted on Sep 25.
                </Text>
                <Text className="text-[10px] text-slate-500 mt-2 font-medium">
                  Yesterday
                </Text>
              </View>
            </View>
          </Card>

          <Card className="bg-slate-900/90 border-slate-800">
            <View className="flex-row items-start gap-3">
              <View className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-800/50 items-center justify-center mt-0.5">
                <CheckCircle2 size={18} color="#34d399" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-100 font-semibold text-sm">
                  Water Filter Replaced
                </Text>
                <Text className="text-slate-400 text-xs mt-1">
                  Marked as completed. Next service reminder set for 6 months later.
                </Text>
                <Text className="text-[10px] text-slate-500 mt-2 font-medium">
                  3 days ago
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
