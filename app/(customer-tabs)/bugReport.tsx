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

const BugReportCard = ({ item, index }: { item: any; index: number }) => {
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
                  Report ID: {item.id}
                </Text>
                <View className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <Text className="text-gray-400" fontFamily="KumbhSans">
                  {item.severity}
                </Text>
              </View>

              <View
                className={`px-3 py-1 rounded-full ${
                  item.status === "open"
                    ? "bg-amber-500/20"
                    : item.status === "in-progress"
                    ? "bg-blue-500/20"
                    : item.status === "resolved"
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}
              >
                <Text
                  className={`text-sm ${
                    item.status === "open"
                      ? "text-amber-400"
                      : item.status === "in-progress"
                      ? "text-blue-400"
                      : item.status === "resolved"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                  fontFamily="KumbhSans-Medium"
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            </View>

            {/* Title / Project / Module / Date */}
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

              {/* Module */}
              <View className="flex flex-row space-x-2 my-2 items-center">
                <MaterialIcons name="bug-report" size={20} color="white" />
                <Text className="text-gray-400 text-sm" fontFamily="KumbhSans">
                  {item.module}
                </Text>
              </View>

              {/* Date */}
              <View className="flex flex-row space-x-2 my-2 items-center">
                <Ionicons name="calendar-outline" size={20} color="white" />
                <Text className="text-gray-400 text-sm" fontFamily="KumbhSans">
                  {item.createdDate}
                </Text>
              </View>
            </View>

            {/* Bug Description Preview */}
            <View className="mb-3">
              <Text className="text-gray-300 text-sm" fontFamily="KumbhSans">
                {item.description.length > 120
                  ? `${item.description.substring(0, 120)}...`
                  : item.description}
              </Text>
            </View>

            {/* Steps to Reproduce */}
            {item.stepsToReproduce && (
              <View className="mb-3">
                <Text
                  className="text-gray-400 text-sm mb-1"
                  fontFamily="KumbhSans-Medium"
                >
                  Steps to reproduce:
                </Text>
                <Text className="text-gray-300 text-sm" fontFamily="KumbhSans">
                  {item.stepsToReproduce.length > 100
                    ? `${item.stepsToReproduce.substring(0, 100)}...`
                    : item.stepsToReproduce}
                </Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const BugReport = () => {
  const insets = useSafeAreaInsets();

  // DUMMY DATA FOR BUG REPORTS
  const dummyData = [
    {
      id: "BR-101",
      title: "App crashes on login screen",
      project: "Website Redesign",
      module: "Authentication",
      createdDate: "2025-10-03",
      severity: "Critical",
      status: "open",
      description: "The application crashes immediately when tapping the login button on Android devices running OS version 14.",
      stepsToReproduce: "1. Open the app\n2. Enter any credentials\n3. Tap login button\n4. App crashes immediately",
      expectedBehavior: "User should be logged in and redirected to dashboard",
      actualBehavior: "App crashes to home screen",
      deviceInfo: "Android 14, Pixel 7",
      appVersion: "2.1.0"
    },
    {
      id: "BR-102",
      title: "Profile image not uploading",
      project: "CRM Integration",
      module: "User Profile",
      createdDate: "2025-10-02",
      severity: "High",
      status: "in-progress",
      description: "Profile image upload fails with network error even when internet connection is stable.",
      stepsToReproduce: "1. Go to profile settings\n2. Select upload photo\n3. Choose image from gallery\n4. Upload fails with network error",
      expectedBehavior: "Image should upload successfully",
      actualBehavior: "Upload fails with false network error",
      deviceInfo: "iOS 17, iPhone 15 Pro",
      appVersion: "2.1.0"
    },
    {
      id: "BR-103",
      title: "Typo in settings menu",
      project: "Analytics Dashboard",
      module: "UI/UX",
      createdDate: "2025-10-01",
      severity: "Low",
      status: "resolved",
      description: "Minor typo in the notification settings page.",
      stepsToReproduce: "1. Go to Settings\n2. Navigate to Notifications\n3. Observe typo in header",
      expectedBehavior: "Correct spelling should be displayed",
      actualBehavior: "Typo present in header text",
      deviceInfo: "All devices",
      appVersion: "2.1.0"
    },
    {
      id: "BR-104",
      title: "Data not syncing across devices",
      project: "Website Redesign",
      module: "Data Sync",
      createdDate: "2025-09-28",
      severity: "Medium",
      status: "closed",
      description: "User data changes made on web app are not reflecting on mobile app without manual refresh.",
      stepsToReproduce: "1. Make changes on web app\n2. Open mobile app\n3. Changes not visible until pull-to-refresh",
      expectedBehavior: "Automatic sync should occur",
      actualBehavior: "Manual refresh required",
      deviceInfo: "Cross-platform",
      appVersion: "2.0.5"
    }
  ];

  const dummyProjects = [
    "Website Redesign",
    "CRM Integration",
    "Analytics Dashboard",
    "Mobile App",
    "E-commerce Platform"
  ];

  const dummyModules = [
    "Authentication",
    "User Profile",
    "Data Sync",
    "UI/UX",
    "Payment",
    "Notifications",
    "Dashboard",
    "Settings",
    "Other"
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const filteredBugs = dummyData.filter((bug) => {
    const matchesProject = !selectedProject || bug.project === selectedProject;
    const matchesModule = !selectedModule || bug.module === selectedModule;
    const matchesSearch =
      !searchQuery ||
      bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesModule && matchesSearch;
  });

  const clearProjectFilter = () => {
    setSelectedProject(null);
    setShowProjectDropdown(false);
  };

  const clearModuleFilter = () => {
    setSelectedModule(null);
    setShowModuleDropdown(false);
  };

  const clearAllFilters = () => {
    setSelectedProject(null);
    setSelectedModule(null);
    setShowProjectDropdown(false);
    setShowModuleDropdown(false);
  };

  const hasActiveFilters = selectedProject || selectedModule;

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
              Bug Reports
            </Text>
            <Text className="text-gray-400" fontFamily="KumbhSans">
              {filteredBugs.length} total reports
            </Text>
          </View>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/add-bug-report",
                params: { reportCount: dummyData.length },
              })
            }
            className="h-10 px-4 rounded-xl flex-row items-center space-x-2 bg-[#B4925E]"
          >
            <AntDesign name="plus" size={20} color="white" />
            <Text className="text-white" fontFamily="KumbhSans-Medium">
              New Report
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

        {/* Project and Module Filters in Row */}
        <View className="flex-row space-x-3 mb-4">
          {/* Project Filter */}
          <View className="flex-1">
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setShowProjectDropdown(!showProjectDropdown);
                setShowModuleDropdown(false);
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

          {/* Module Filter */}
          <View className="flex-1">
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setShowModuleDropdown(!showModuleDropdown);
                setShowProjectDropdown(false);
              }}
            >
              <View className="bg-[#18181b] rounded-xl border border-gray-800 flex-row justify-between items-center px-4 py-3.5">
                <Text
                  className={`text-[15px] font-[KumbhSans] ${
                    selectedModule ? "text-white" : "text-gray-500"
                  }`}
                >
                  {selectedModule || "Module"}
                </Text>
                <Ionicons
                  name={showModuleDropdown ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#aaa"
                />
              </View>
            </TouchableOpacity>

            {showModuleDropdown && (
              <View
                className="absolute top-[55px] left-0 right-0 bg-[#1A1A1A] rounded-xl border border-gray-800 max-h-48 shadow-lg shadow-black/50"
                style={{ zIndex: 9999, elevation: 9999 }}
              >
                <FlatList
                  data={dummyModules}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="px-4 py-3 border-b border-gray-800 active:bg-gray-800/50"
                      onPress={() => {
                        setSelectedModule(item);
                        setShowModuleDropdown(false);
                        Keyboard.dismiss();
                      }}
                    >
                      <Text
                        className={`font-[KumbhSans] ${
                          selectedModule === item
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
            placeholder="Search by report ID, title, or description..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Bug Report List */}
      <FlatList
        data={filteredBugs}
        renderItem={({ item, index }) => (
          <BugReportCard item={item} index={index} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: (showProjectDropdown || showModuleDropdown) ? 200 : 0,
        }}
        ListEmptyComponent={() => (
          <Text
            className="text-gray-400 text-center mt-10"
            fontFamily="KumbhSans"
          >
            No bug reports found.
          </Text>
        )}
      />
    </View>
  );
};

export default BugReport;