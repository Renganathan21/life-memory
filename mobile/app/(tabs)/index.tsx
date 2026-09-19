import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Car, Package, Snowflake, Bike, CreditCard, FileText, AlertCircle, Clock, ChevronRight } from 'lucide-react-native';
import { Header } from '../../src/components/ui/Header';
import { Card } from '../../src/components/ui/Card';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <Header title="Life Memory" subtitle="Everything you don't want to forget" />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Primary CTA: + Remember Something */}
        <TouchableOpacity
          onPress={() => router.push('/modal/remember')}
          activeOpacity={0.85}
          className="flex-row items-center justify-between bg-gradient-to-r bg-indigo-600 px-5 py-4 rounded-2xl shadow-lg shadow-indigo-500/25 mb-6"
        >
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-xl bg-white/20 items-center justify-center">
              <Plus size={22} color="#ffffff" strokeWidth={2.5} />
            </View>
            <View>
              <Text className="text-white text-base font-bold">
                + Remember Something
              </Text>
              <Text className="text-indigo-100 text-xs">
                Save an item, renewal, task, or location
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#e0e7ff" />
        </TouchableOpacity>

        {/* Section: Needs Attention */}
        <View className="mb-7">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <AlertCircle size={16} color="#f87171" />
              <Text className="text-xs font-bold tracking-wider uppercase text-rose-400">
                Needs Attention
              </Text>
            </View>
            <Text className="text-xs font-medium text-slate-500">3 items</Text>
          </View>

          <View className="gap-2.5">
            {/* Example Card 1 */}
            <Card className="flex-row items-center justify-between bg-slate-900/90 border-slate-800">
              <View className="flex-row items-center gap-3.5 flex-1">
                <View className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-800/50 items-center justify-center">
                  <Car size={20} color="#38bdf8" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-100 font-semibold text-sm">
                    Car Insurance
                  </Text>
                  <Text className="text-rose-400 text-xs font-medium mt-0.5">
                    Expires in 12 days
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color="#475569" />
            </Card>

            {/* Example Card 2 */}
            <Card className="flex-row items-center justify-between bg-slate-900/90 border-slate-800">
              <View className="flex-row items-center gap-3.5 flex-1">
                <View className="w-10 h-10 rounded-xl bg-pink-950/80 border border-pink-800/50 items-center justify-center">
                  <Package size={20} color="#f472b6" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-100 font-semibold text-sm">
                    Running Shoes
                  </Text>
                  <Text className="text-rose-400 text-xs font-medium mt-0.5">
                    Return by tomorrow
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color="#475569" />
            </Card>

            {/* Example Card 3 */}
            <Card className="flex-row items-center justify-between bg-slate-900/90 border-slate-800">
              <View className="flex-row items-center gap-3.5 flex-1">
                <View className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/50 items-center justify-center">
                  <Snowflake size={20} color="#22d3ee" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-100 font-semibold text-sm">
                    AC Filter Service
                  </Text>
                  <Text className="text-amber-400 text-xs font-medium mt-0.5">
                    Due in 5 days
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color="#475569" />
            </Card>
          </View>
        </View>

        {/* Section: Upcoming */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <Clock size={16} color="#818cf8" />
              <Text className="text-xs font-bold tracking-wider uppercase text-indigo-400">
                Upcoming
              </Text>
            </View>
            <Text className="text-xs font-medium text-slate-500">Next 30 days</Text>
          </View>

          <View className="gap-2.5">
            {/* Upcoming 1 */}
            <Card className="flex-row items-center justify-between bg-slate-900/90 border-slate-800">
              <View className="flex-row items-center gap-3.5 flex-1">
                <View className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 items-center justify-center">
                  <Bike size={20} color="#a5b4fc" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-200 font-medium text-sm">
                    Bike Service
                  </Text>
                  <Text className="text-slate-400 text-xs mt-0.5">
                    Sep 22 • 5,000 km check
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-indigo-400 font-semibold">In 3 wks</Text>
            </Card>

            {/* Upcoming 2 */}
            <Card className="flex-row items-center justify-between bg-slate-900/90 border-slate-800">
              <View className="flex-row items-center gap-3.5 flex-1">
                <View className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800/50 items-center justify-center">
                  <CreditCard size={20} color="#fbbf24" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-200 font-medium text-sm">
                    Netflix Premium
                  </Text>
                  <Text className="text-slate-400 text-xs mt-0.5">
                    Sep 25 • $19.99
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-slate-400 font-medium">Sep 25</Text>
            </Card>

            {/* Upcoming 3 */}
            <Card className="flex-row items-center justify-between bg-slate-900/90 border-slate-800">
              <View className="flex-row items-center gap-3.5 flex-1">
                <View className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-800/50 items-center justify-center">
                  <FileText size={20} color="#c084fc" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-200 font-medium text-sm">
                    Passport Renewal
                  </Text>
                  <Text className="text-slate-400 text-xs mt-0.5">
                    Oct 02 • Valid until Nov
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-slate-400 font-medium">Oct 02</Text>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
