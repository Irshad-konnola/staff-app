import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import TicketDetailsModal from "@/components/customer/TicketDetailsModal";

const TicketCard = ({ item, index }: { item: any; index: number }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
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
              {/* Header */}
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
                    className={`text-sm ${
                      item.status === "open"
                        ? "text-amber-400"
                        : item.status === "in-progress"
                        ? "text-blue-400"
                        : "text-green-400"
                    }`}
                    fontFamily="KumbhSans-Medium"
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Text>
                </View>
              </View>

              {/* Subject / Project / Date */}
              <View className="mb-4">
                <Text
                  className="text-white text-xl mb-1"
                  fontFamily="KumbhSans-Bold"
                >
                  {item.subject}
                </Text>

                <View className="flex flex-row space-x-2 my-2 items-center">
                  <MaterialIcons name="folder-open" size={20} color="white" />
                  <Text
                    className="text-gray-400 text-sm"
                    fontFamily="KumbhSans"
                  >
                    {item.project}
                  </Text>
                </View>

                <View className="flex flex-row space-x-2 my-2 items-center">
                  <Ionicons name="calendar-outline" size={20} color="white" />
                  <Text
                    className="text-gray-400 text-sm"
                    fontFamily="KumbhSans"
                  >
                    {item.createdDate}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setShowDetails(true)}
                className="mt-2 bg-[#B4925E] rounded-xl px-4 py-2 self-start"
              >
                <Text className="text-white text-sm font-[KumbhSans-Medium]">
                  View Details / Chat
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <TicketDetailsModal
        visible={showDetails}
        onClose={() => setShowDetails(false)}
        ticket={item}
      />
    </>
  );
};

const CustomerTicketing = () => {
  const insets = useSafeAreaInsets();

  // DUMMY DATA WITH MESSAGES + IMAGE SUPPORT
  const dummyData = [
    {
      id: "T-101",
      subject: "Login issue on mobile app",
      project: "Website Redesign",
      createdDate: "2025-10-03",
      priority: "High",
      status: "open",
      messages: [
        {
          id: "m1",
          text: "I'm unable to log in using my credentials.",
          sender: "customer",
          time: "10:30 AM",
        },
        {
          id: "m2",
          text: "We’re investigating this issue, could you confirm your device version?",
          sender: "staff",
          time: "11:00 AM",
        },
        {
          id: "m3",
          text: "It’s Android 14 on Pixel 7.",
          sender: "customer",
          time: "11:05 AM",
        },
      ],
    },
    {
      id: "T-102",
      subject: "Printer not connecting to system",
      project: "CRM Integration",
      createdDate: "2025-10-02",
      priority: "Medium",
      status: "in-progress",
      messages: [
        {
          id: "m1",
          text: "We've checked your printer configuration. Please see attached screenshot.",
          sender: "staff",
          time: "09:40 AM",
          image:
            "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=400",
        },
        {
          id: "m2",
          text: "Got it, thanks! Let me try reconnecting.",
          sender: "customer",
          time: "09:50 AM",
        },
      ],
    },
    {
      id: "T-103",
      subject: "Analytics data mismatch",
      project: "Analytics Dashboard",
      createdDate: "2025-10-01",
      priority: "Low",
      status: "closed",
      messages: [
        {
          id: "m1",
          text: "We found a sync issue in the data pipeline, fixed it now.",
          sender: "staff",
          time: "04:10 PM",
        },
        {
          id: "m2",
          text: "Verified — data looks correct now. Thanks!",
          sender: "customer",
          time: "04:25 PM",
        },
      ],
    },
  ];

  const dummyProjects = [
    "Website Redesign",
    "CRM Integration",
    "Analytics Dashboard",
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const filteredTickets = dummyData.filter((ticket) => {
    const matchesProject =
      !selectedProject || ticket.project === selectedProject;
    const matchesSearch =
      !searchQuery ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesSearch;
  });

  const clearProjectFilter = () => {
    setSelectedProject(null);
    setShowDropdown(false);
  };

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      {/* Background gradient */}
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "transparent"]}
        className="absolute w-full h-full"
      />

      {/* Fixed top content */}
      <View className="px-4 pb-2 z-50" style={{ elevation: 10 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4 mt-2">
          <View>
            <Text
              className="text-2xl text-white mb-1"
              fontFamily="KumbhSans-Bold"
            >
              My Tickets
            </Text>
            <Text className="text-gray-400" fontFamily="KumbhSans">
              {filteredTickets.length} total tickets
            </Text>
          </View>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/add-customer-ticket",
                params: { ticketCount: dummyData.length },
              })
            }
            className="h-10 px-4 rounded-xl flex-row items-center space-x-2 bg-[#B4925E]"
          >
            <AntDesign name="plus" size={20} color="white" />
            <Text className="text-white" fontFamily="KumbhSans-Medium">
              New Ticket
            </Text>
          </Pressable>
        </View>

        {/* Project Filter Dropdown */}
        <View className="relative mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-300 text-[15px] font-medium ml-1">
              Filter by Project
            </Text>
            {selectedProject && (
              <TouchableOpacity onPress={clearProjectFilter}>
                <Text className="text-amber-400 text-sm font-[KumbhSans]">
                  Clear Filter
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <View className="bg-[#18181b] rounded-xl border border-gray-800 flex-row justify-between items-center px-4 py-3.5">
              <Text
                className={`text-[15px] font-[KumbhSans] ${
                  selectedProject ? "text-white" : "text-gray-500"
                }`}
              >
                {selectedProject || "Select a project"}
              </Text>
              <Ionicons
                name={showDropdown ? "chevron-up" : "chevron-down"}
                size={18}
                color="#aaa"
              />
            </View>
          </TouchableOpacity>

          {showDropdown && (
            <View
              className="absolute top-[70px] left-0 right-0 bg-[#1A1A1A] rounded-xl border border-gray-800 max-h-48 shadow-lg shadow-black/50"
              style={{ zIndex: 9999, elevation: 9999 }}
            >
              <FlatList
                data={dummyProjects}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="px-4 py-3 border-b border-gray-800 active:bg-gray-800/50"
                    onPress={() => {
                      setSelectedProject(item);
                      setShowDropdown(false);
                      Keyboard.dismiss();
                    }}
                  >
                    <Text
                      className={`font-[KumbhSans] ${
                        selectedProject === item
                          ? "text-amber-400"
                          : "text-white"
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        {/* Search Bar */}
        <View className="relative mb-2">
          <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
            <Ionicons name="search-outline" size={20} color="#94a3b8" />
          </View>
          <TextInput
            className="h-12 pl-12 pr-4 rounded-xl w-full text-white bg-[#18181b] font-[KumbhSans] text-base"
            placeholder="Search by ticket ID or subject..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Ticket List */}
      <FlatList
        data={filteredTickets}
        renderItem={({ item, index }) => (
          <TicketCard item={item} index={index} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: showDropdown ? 200 : 0,
        }}
        ListEmptyComponent={() => (
          <Text
            className="text-gray-400 text-center mt-10"
            fontFamily="KumbhSans"
          >
            No tickets found.
          </Text>
        )}
      />
    </View>
  );
};

export default CustomerTicketing;
