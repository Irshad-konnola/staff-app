import React, { useState } from "react";
import { View, TouchableOpacity, Modal, Pressable, ScrollView, SafeAreaView } from "react-native";
import { Text } from "@/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Add this array of your apps
const OUR_APPS = [
  { id: 1, name: "POS", icon: "cart-outline", color: "#B4925E" },
  { id: 2, name: "E-Commerce", icon: "storefront-outline", color: "#10b981" },
  { id: 3, name: "Inventory", icon: "file-tray-stacked-outline", color: "#ef4444" },
  { id: 4, name: "Accounting", icon: "calculator-outline", color: "#8b5cf6" },
  { id: 5, name: "HR Management", icon: "people-outline", color: "#f97316" },
  { id: 6, name: "CRM", icon: "briefcase-outline", color: "#06b6d4" },
];

export default function FloatingAppsButton() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <View 
        className="absolute bottom-6 right-6 z-50"
        pointerEvents="box-none"
      >
        <TouchableOpacity
          className="w-14 h-14 rounded-full bg-[#B4925E] justify-center items-center"
          onPress={() => setIsExpanded(true)}
          activeOpacity={0.8}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="apps" size={26} color="white" />
        </TouchableOpacity>
      </View>

      {/* Apps Modal */}
      <Modal
        visible={isExpanded}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => setIsExpanded(false)}
      >
        <SafeAreaView className="flex-1">
          <Pressable
            className="flex-1 bg-black/70 justify-center items-center px-5"
            onPress={() => setIsExpanded(false)}
          >
            <Pressable
              className="bg-[#18181b] rounded-2xl w-full max-w-md border border-gray-800 overflow-hidden"
              onPress={(e) => e.stopPropagation()}
            >
              <LinearGradient
                colors={["rgba(180,146,94,0.1)", "transparent"]}
                className="absolute w-full h-full"
              />

              {/* Header */}
              <View className="flex-row justify-between items-center px-5 pt-5 pb-4 border-b border-gray-800">
                <Text className="text-white text-xl" fontFamily="KumbhSans-Bold">
                  Our Products
                </Text>
                <TouchableOpacity 
                  onPress={() => setIsExpanded(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={24} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              {/* Apps Grid */}
              <View className="px-5 py-6">
                <View className="flex-row flex-wrap justify-between">
                  {OUR_APPS.map((app) => (
                    <View key={app.id} className="w-[30%] items-center mb-5">
                      <View
                        className="w-16 h-16 rounded-2xl justify-center items-center mb-2"
                        style={{ backgroundColor: `${app.color}20` }}
                      >
                        <Ionicons name={app.icon as any} size={28} color={app.color} />
                      </View>
                      <Text className="text-gray-300 text-xs text-center" fontFamily="KumbhSans">
                        {app.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Footer */}
              <View className="px-5 py-4 border-t border-gray-800">
                <Text className="text-gray-400 text-xs text-center" fontFamily="KumbhSans">
                  Explore our complete suite of business solutions
                </Text>
              </View>
            </Pressable>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </>
  );
}