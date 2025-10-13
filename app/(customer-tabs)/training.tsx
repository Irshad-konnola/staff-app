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
import { AntDesign, Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { format, isAfter, isBefore } from "date-fns";

const TrainingCard = ({ item, index }: { item: any; index: number }) => {
  const getStatusInfo = (session: any) => {
    const now = new Date();
    const sessionDate = new Date(session.date);
    const sessionTime = new Date(`${session.date}T${session.time}`);

    if (session.status === "completed") {
      return { status: "Completed", color: "bg-green-500/20", textColor: "text-green-400" };
    }
    if (session.status === "cancelled") {
      return { status: "Cancelled", color: "bg-red-500/20", textColor: "text-red-400" };
    }
    if (isBefore(sessionTime, now)) {
      return { status: "Missed", color: "bg-gray-500/20", textColor: "text-gray-400" };
    }
    if (session.status === "confirmed") {
      return { status: "Confirmed", color: "bg-blue-500/20", textColor: "text-blue-400" };
    }
    return { status: "Scheduled", color: "bg-amber-500/20", textColor: "text-amber-400" };
  };

  const statusInfo = getStatusInfo(item);

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
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center space-x-2">
                <Text className="text-gray-400" fontFamily="KumbhSans">
                  Session {item.sessionNumber}/12
                </Text>
                <View className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <Text className="text-gray-400" fontFamily="KumbhSans">
                  {item.duration}
                </Text>
              </View>

              <View className={`px-3 py-1 rounded-full ${statusInfo.color}`}>
                <Text className={`text-sm ${statusInfo.textColor}`} fontFamily="KumbhSans-Medium">
                  {statusInfo.status}
                </Text>
              </View>
            </View>

            {/* Title / Project / Trainer */}
            <View className="mb-4">
              <Text
                className="text-white text-xl mb-1"
                fontFamily="KumbhSans-Bold"
              >
                {item.title}
              </Text>

              {/* Project */}
              <View className="flex flex-row space-x-2 my-2 items-center">
                <MaterialIcons name="folder-open" size={20} color="white" />
                <Text className="text-gray-400 text-sm" fontFamily="KumbhSans">
                  {item.project}
                </Text>
              </View>

              {/* Trainer */}
              <View className="flex flex-row space-x-2 my-2 items-center">
                <FontAwesome5 name="chalkboard-teacher" size={16} color="white" />
                <Text className="text-gray-400 text-sm" fontFamily="KumbhSans">
                  {item.trainer}
                </Text>
              </View>

              {/* Date and Time */}
              <View className="flex flex-row space-x-2 my-2 items-center">
                <Ionicons name="calendar-outline" size={20} color="white" />
                <Text className="text-gray-400 text-sm" fontFamily="KumbhSans">
                  {format(new Date(item.date), "MMM dd, yyyy")} at {item.time}
                </Text>
              </View>

              {/* Join Method */}
              <View className="flex flex-row space-x-2 my-2 items-center">
                <MaterialIcons 
                  name={item.joinMethod === "in-person" ? "person" : "video-call"} 
                  size={20} 
                  color="white" 
                />
                <Text className="text-gray-400 text-sm" fontFamily="KumbhSans">
                  {item.joinMethod === "in-person" ? "In-Person" : "Virtual Meeting"}
                </Text>
              </View>
            </View>

            {/* Description */}
            <View className="mb-3">
              <Text className="text-gray-300 text-sm" fontFamily="KumbhSans">
                {item.description.length > 120
                  ? `${item.description.substring(0, 120)}...`
                  : item.description}
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row space-x-3">
              {item.status === "confirmed" && (
                <TouchableOpacity className="flex-1 bg-[#B4925E] rounded-xl px-4 py-2">
                  <Text className="text-white text-center text-sm font-[KumbhSans-Medium]">
                    Join Session
                  </Text>
                </TouchableOpacity>
              )}
              
              {item.status === "scheduled" && (
                <>
                  <TouchableOpacity className="flex-1 bg-[#B4925E] rounded-xl px-4 py-2">
                    <Text className="text-white text-center text-sm font-[KumbhSans-Medium]">
                      Confirm
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-gray-600 rounded-xl px-4 py-2">
                    <Text className="text-white text-center text-sm font-[KumbhSans-Medium]">
                      Reschedule
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {item.status === "completed" && (
                <TouchableOpacity className="flex-1 bg-gray-600 rounded-xl px-4 py-2">
                  <Text className="text-white text-center text-sm font-[KumbhSans-Medium]">
                    View Recording
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const Training = () => {
  const insets = useSafeAreaInsets();

  // DUMMY DATA FOR TRAINING SESSIONS
  const dummyData = [
    {
      id: "TR-101",
      sessionNumber: 1,
      title: "Introduction to Dashboard Features",
      project: "Analytics Dashboard",
      description: "Learn how to navigate the main dashboard, understand key metrics, and use basic reporting features. We'll cover data visualization tools and custom report generation.",
      trainer: "Sarah Johnson",
      date: "2025-10-15",
      time: "10:00 AM",
      duration: "2 hours",
      joinMethod: "virtual",
      status: "completed",
      materials: ["User Guide.pdf", "Dashboard Overview.mp4"]
    },
    {
      id: "TR-102",
      sessionNumber: 2,
      title: "Advanced Reporting Techniques",
      project: "Analytics Dashboard",
      description: "Deep dive into advanced reporting features, custom metrics, and automated report scheduling. Learn how to create complex queries and share insights with your team.",
      trainer: "Mike Chen",
      date: "2025-10-22",
      time: "2:00 PM",
      duration: "2.5 hours",
      joinMethod: "virtual",
      status: "confirmed",
      materials: ["Advanced Reporting Guide.pdf"]
    },
    {
      id: "TR-103",
      sessionNumber: 3,
      title: "CRM User Management",
      project: "CRM Integration",
      description: "Comprehensive training on user management, permission settings, and team collaboration features within the CRM system.",
      trainer: "Emily Davis",
      date: "2025-10-29",
      time: "11:00 AM",
      duration: "1.5 hours",
      joinMethod: "in-person",
      status: "scheduled",
      materials: []
    },
    {
      id: "TR-104",
      sessionNumber: 4,
      title: "E-commerce Platform Setup",
      project: "E-commerce Platform",
      description: "Step-by-step guidance on setting up your online store, configuring payment gateways, and managing product catalogs.",
      trainer: "Alex Rodriguez",
      date: "2025-09-20",
      time: "9:00 AM",
      duration: "3 hours",
      joinMethod: "virtual",
      status: "cancelled",
      materials: []
    },
    {
      id: "TR-105",
      sessionNumber: 5,
      title: "Mobile App Features Overview",
      project: "Mobile App",
      description: "Learn about all the features available in the mobile application and how to optimize your workflow on mobile devices.",
      trainer: "Jessica Williams",
      date: "2025-11-05",
      time: "3:00 PM",
      duration: "2 hours",
      joinMethod: "virtual",
      status: "scheduled",
      materials: ["Mobile App Guide.pdf"]
    }
  ];

  const dummyProjects = [
    "Analytics Dashboard",
    "CRM Integration",
    "E-commerce Platform",
    "Mobile App",
    "Website Redesign"
  ];

  const statusFilters = [
    "All",
    "Scheduled",
    "Confirmed",
    "Completed",
    "Cancelled"
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const filteredSessions = dummyData.filter((session) => {
    const matchesProject = !selectedProject || session.project === selectedProject;
    const matchesStatus = selectedStatus === "All" || session.status === selectedStatus.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.trainer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesStatus && matchesSearch;
  });

  const clearProjectFilter = () => {
    setSelectedProject(null);
    setShowProjectDropdown(false);
  };

  const clearAllFilters = () => {
    setSelectedProject(null);
    setSelectedStatus("All");
    setShowProjectDropdown(false);
    setShowStatusDropdown(false);
  };

  const hasActiveFilters = selectedProject || selectedStatus !== "All";

  // Calculate session statistics
  const completedSessions = dummyData.filter(s => s.status === "completed").length;
  const upcomingSessions = dummyData.filter(s => 
    s.status === "scheduled" || s.status === "confirmed"
  ).length;

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
              Training Sessions
            </Text>
            <Text className="text-gray-400" fontFamily="KumbhSans">
              {completedSessions}/12 sessions completed • {upcomingSessions} upcoming
            </Text>
          </View>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/request-training",
                params: { sessionCount: dummyData.length },
              })
            }
            className="h-10 px-4 rounded-xl flex-row items-center space-x-2 bg-[#B4925E]"
          >
            <AntDesign name="plus" size={20} color="white" />
            <Text className="text-white" fontFamily="KumbhSans-Medium">
              Request
            </Text>
          </Pressable>
        </View>

        {/* Filter Header */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-300 text-[15px] font-medium ml-1">
            Filters
          </Text>
          {hasActiveFilters && (
            <TouchableOpacity onPress={clearAllFilters}>
              <Text className="text-amber-400 text-sm font-[KumbhSans]">
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Project and Status Filters in Row */}
        <View className="flex-row space-x-3 mb-4">
          {/* Project Filter */}
          <View className="flex-1">
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setShowProjectDropdown(!showProjectDropdown);
                setShowStatusDropdown(false);
              }}
            >
              <View className="bg-[#18181b] rounded-xl border border-gray-800 flex-row justify-between items-center px-4 py-3.5">
                <Text
                  className={`text-[15px] font-[KumbhSans] ${
                    selectedProject ? "text-white" : "text-gray-500"
                  }`}
                >
                  {selectedProject || "Project"}
                </Text>
                <Ionicons
                  name={showProjectDropdown ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#aaa"
                />
              </View>
            </TouchableOpacity>

            {showProjectDropdown && (
              <View
                className="absolute top-[55px] left-0 right-0 bg-[#1A1A1A] rounded-xl border border-gray-800 max-h-48 shadow-lg shadow-black/50"
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
                        setShowProjectDropdown(false);
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

          {/* Status Filter */}
          <View className="flex-1">
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowProjectDropdown(false);
              }}
            >
              <View className="bg-[#18181b] rounded-xl border border-gray-800 flex-row justify-between items-center px-4 py-3.5">
                <Text
                  className={`text-[15px] font-[KumbhSans] ${
                    selectedStatus !== "All" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {selectedStatus}
                </Text>
                <Ionicons
                  name={showStatusDropdown ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#aaa"
                />
              </View>
            </TouchableOpacity>

            {showStatusDropdown && (
              <View
                className="absolute top-[55px] left-0 right-0 bg-[#1A1A1A] rounded-xl border border-gray-800 max-h-48 shadow-lg shadow-black/50"
                style={{ zIndex: 9999, elevation: 9999 }}
              >
                <FlatList
                  data={statusFilters}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="px-4 py-3 border-b border-gray-800 active:bg-gray-800/50"
                      onPress={() => {
                        setSelectedStatus(item);
                        setShowStatusDropdown(false);
                        Keyboard.dismiss();
                      }}
                    >
                      <Text
                        className={`font-[KumbhSans] ${
                          selectedStatus === item
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
        </View>

        {/* Search Bar */}
        <View className="relative mb-2">
          <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
            <Ionicons name="search-outline" size={20} color="#94a3b8" />
          </View>
          <TextInput
            className="h-12 pl-12 pr-4 rounded-xl w-full text-white bg-[#18181b] font-[KumbhSans] text-base"
            placeholder="Search by title, trainer, or description..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Training Session List */}
      <FlatList
        data={filteredSessions}
        renderItem={({ item, index }) => (
          <TrainingCard item={item} index={index} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: (showProjectDropdown || showStatusDropdown) ? 200 : 0,
        }}
        ListEmptyComponent={() => (
          <Text
            className="text-gray-400 text-center mt-10"
            fontFamily="KumbhSans"
          >
            No training sessions found.
          </Text>
        )}
      />
    </View>
  );
};

export default Training;