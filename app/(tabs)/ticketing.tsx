import { FlatList, Pressable, TextInput, View } from "react-native";
import React from "react";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";

const TicketCard = ({ item, index }: { item: any; index: number }) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(600)}
      className="mb-4 px-4"
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
        className="rounded-2xl p-0.5"
      >
        <View className="bg-[#18181b] rounded-2xl overflow-hidden">
          <View className="p-4">
            {/* Header with ID + Status */}
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center space-x-2">
                <Text className="text-gray-400" fontFamily="KumbhSans">
                  Ticket ID: {item.id}
                </Text>
                <View className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <Text className="text-gray-400" fontFamily="KumbhSans">
                  {item.priority} Priority
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${
                  item.status === "open"
                    ? "bg-amber-500/20"
                    : item.status === "in-progress"
                    ? "bg-blue-500/20"
                    : "bg-green-500/20"
                }`}
              >
                <Text
                  className={`${
                    item.status === "open"
                      ? "text-amber-400"
                      : item.status === "in-progress"
                      ? "text-blue-400"
                      : "text-green-400"
                  } text-sm`}
                  fontFamily="KumbhSans-Medium"
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            </View>

            {/* Client / Subject */}
            <View className="mb-4">
              <Text
                className="text-white text-xl mb-1"
                fontFamily="KumbhSans-Bold"
              >
                {item.subject}
              </Text>

              <View className="flex flex-row space-x-2 my-2 items-center">
                <MaterialIcons name="person-outline" size={20} color="white" />
                <Text className="text-gray-400 text-sm" fontFamily="KumbhSans">
                  {item.raisedBy}
                </Text>
              </View>

              <View className="flex flex-row space-x-2 my-2 items-center">
                <Ionicons name="calendar-outline" size={20} color="white" />
                <Text className="text-gray-400 text-sm" fontFamily="KumbhSans">
                  {item.createdDate}
                </Text>
              </View>
            </View>

            {/* Hidden Actions (future) */}
            <View className="flex-row space-x-2 hidden">
              <Pressable className="flex-1 bg-blue-500/10 p-3 rounded-xl flex-row items-center justify-center space-x-2">
                <Feather name="edit-2" size={18} color="#60a5fa" />
                <Text className="text-blue-400" fontFamily="KumbhSans-Medium">
                  Edit
                </Text>
              </Pressable>
              <Pressable className="w-12 bg-red-500/10 rounded-xl items-center justify-center">
                <FontAwesome5 name="trash-alt" size={18} color="#f87171" />
              </Pressable>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const Ticketing = () => {
  const insets = useSafeAreaInsets();

  const dummyData = [
    {
      id: "T-101",
      subject: "Login issue on mobile app",
      raisedBy: "John Doe",
      createdDate: "2025-10-03",
      priority: "High",
      status: "open",
    },
    {
      id: "T-102",
      subject: "POS printer not working",
      raisedBy: "Acme Corp",
      createdDate: "2025-10-02",
      priority: "Medium",
      status: "in-progress",
    },
  ];

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "transparent"]}
        className="absolute w-full h-full"
      />
      <Animated.View
        entering={FadeInDown.duration(600)}
        className="px-4 py-3 mb-2"
      >
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text
              className="text-2xl text-white mb-1"
              fontFamily="KumbhSans-Bold"
            >
              Support Tickets
            </Text>
            <Text className="text-gray-400" fontFamily="KumbhSans">
              {dummyData.length} total tickets
            </Text>
          </View>
          <Pressable
            onPress={() => router.navigate("/add-ticket")}
            className="h-10 px-4 rounded-xl flex-row items-center space-x-2 bg-[#B4925E]"
          >
            <AntDesign name="plus" size={20} color="white" />
            <Text className="text-white" fontFamily="KumbhSans-Medium">
              New Ticket
            </Text>
          </Pressable>
        </View>

        {/* Search Bar */}
        <View className="relative">
          <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
            <Ionicons name="search-outline" size={20} color="#94a3b8" />
          </View>
          <TextInput
            className="h-12 pl-12 pr-4 rounded-xl w-full text-white bg-[#18181b] font-[KumbhSans] text-base"
            placeholder="Search by ticket ID, subject, client..."
            placeholderTextColor="#94a3b8"
          />
        </View>
      </Animated.View>

      <FlatList
        data={dummyData}
        renderItem={({ item, index }) => (
          <TicketCard item={item} index={index} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Ticketing;
