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
import { format, parseISO, isAfter, isBefore } from "date-fns";

const ContractCard = ({ item, index }: { item: any; index: number }) => {
  const getStatusInfo = (contract: any) => {
    const now = new Date();
    const endDate = parseISO(contract.endDate);
    
    if (contract.status === "active") {
      if (isBefore(now, endDate)) {
        const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry <= 30) {
          return { 
            status: "Expiring Soon", 
            color: "bg-amber-500/20", 
            textColor: "text-amber-400" 
          };
        }
        return { 
          status: "Active", 
          color: "bg-green-500/20", 
          textColor: "text-green-400" 
        };
      }
      return { 
        status: "Expired", 
        color: "bg-red-500/20", 
        textColor: "text-red-400" 
      };
    }
    
    if (contract.status === "pending") {
      return { 
        status: "Pending", 
        color: "bg-blue-500/20", 
        textColor: "text-blue-400" 
      };
    }
    
    return { 
      status: "Cancelled", 
      color: "bg-gray-500/20", 
      textColor: "text-gray-400" 
    };
  };

  const statusInfo = getStatusInfo(item);

  const calculateDaysRemaining = () => {
    const now = new Date();
    const endDate = parseISO(item.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = calculateDaysRemaining();

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
            {/* Header - Improved layout */}
            <View className="mb-4">
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text
                    className="text-white text-xl mb-1"
                    fontFamily="KumbhSans-Bold"
                    numberOfLines={1}
                  >
                    {item.project}
                  </Text>
                  <View className="flex-row items-center flex-wrap">
                    <Text className="text-gray-400 text-xs mr-2" fontFamily="KumbhSans">
                      ID: {item.id}
                    </Text>
                    <View className="w-1 h-1 rounded-full bg-gray-400 mr-2" />
                    <Text 
                      className="text-gray-400 text-xs flex-shrink" 
                      fontFamily="KumbhSans"
                      numberOfLines={1}
                    >
                      {item.type}
                    </Text>
                  </View>
                </View>
                <View className={`px-3 py-1 rounded-full ${statusInfo.color} ml-2 flex-shrink-0`}>
                  <Text className={`text-xs ${statusInfo.textColor}`} fontFamily="KumbhSans-Medium">
                    {statusInfo.status}
                  </Text>
                </View>
              </View>
            </View>

            {/* Plan and Contract Details */}
            <View className="mb-4">
              {/* Plan Type */}
              <View className="flex flex-row items-center mb-3">
                <MaterialIcons name="workspace-premium" size={18} color="white" />
                <Text className="text-gray-400 text-sm ml-2" fontFamily="KumbhSans">
                  {item.plan} Plan • {item.price} {item.billingCycle}
                </Text>
              </View>

              {/* Contract Period */}
              <View className="flex flex-row items-center mb-3">
                <Ionicons name="calendar-outline" size={18} color="white" />
                <Text className="text-gray-400 text-sm ml-2" fontFamily="KumbhSans">
                  {format(parseISO(item.startDate), "MMM dd, yyyy")} - {format(parseISO(item.endDate), "MMM dd, yyyy")}
                </Text>
              </View>

              {/* Support Hours */}
              <View className="flex flex-row items-center mb-3">
                <FontAwesome5 name="clock" size={14} color="white" />
                <Text className="text-gray-400 text-sm ml-2" fontFamily="KumbhSans">
                  {item.supportHours}
                </Text>
              </View>
            </View>

            {/* Progress Bar for Time Remaining */}
            {(statusInfo.status === "Active" || statusInfo.status === "Expiring Soon") && (
              <View className="mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-400 text-xs" fontFamily="KumbhSans">
                    Contract Progress
                  </Text>
                  <Text className="text-gray-400 text-xs" fontFamily="KumbhSans">
                    {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
                  </Text>
                </View>
                <View className="w-full bg-gray-700 rounded-full h-1.5">
                  <View 
                    className={`h-1.5 rounded-full ${
                      daysRemaining > 180 ? "bg-green-500" : 
                      daysRemaining > 30 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${Math.max(5, (daysRemaining / 365) * 100)}%` }}
                  />
                </View>
              </View>
            )}

            {/* Features - Improved layout */}
            <View className="mb-4">
              <Text className="text-gray-300 text-sm mb-2" fontFamily="KumbhSans-Medium">
                Included Features:
              </Text>
              <View className="flex-row flex-wrap">
                {item.features.slice(0, 4).map((feature: string, idx: number) => (
                  <View key={idx} className="flex-row items-center mr-3 mb-1 flex-shrink">
                    <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                    <Text 
                      className="text-gray-400 text-xs ml-1" 
                      fontFamily="KumbhSans"
                      numberOfLines={1}
                    >
                      {feature}
                    </Text>
                  </View>
                ))}
                {item.features.length > 4 && (
                  <Text className="text-gray-500 text-xs" fontFamily="KumbhSans">
                    +{item.features.length - 4} more
                  </Text>
                )}
              </View>
            </View>

            {/* Action Buttons - Improved responsive layout */}
            {/* <View className="flex-row space-x-2">
              {statusInfo.status === "Active" && daysRemaining <= 30 && (
                <TouchableOpacity className="flex-1 bg-[#B4925E] rounded-xl px-3 py-2 min-h-[40px] justify-center">
                  <Text className="text-white text-center text-xs font-[KumbhSans-Medium]">
                    Renew Now
                  </Text>
                </TouchableOpacity>
              )}
              
              {statusInfo.status === "Active" && daysRemaining > 30 && (
                <TouchableOpacity className="flex-1 bg-gray-600 rounded-xl px-3 py-2 min-h-[40px] justify-center">
                  <Text className="text-white text-center text-xs font-[KumbhSans-Medium]">
                    View Details
                  </Text>
                </TouchableOpacity>
              )}

              {statusInfo.status === "Expired" && (
                <TouchableOpacity className="flex-1 bg-[#B4925E] rounded-xl px-3 py-2 min-h-[40px] justify-center">
                  <Text className="text-white text-center text-xs font-[KumbhSans-Medium]">
                    Renew
                  </Text>
                </TouchableOpacity>
              )}

              {statusInfo.status === "Pending" && (
                <TouchableOpacity className="flex-1 bg-gray-600 rounded-xl px-3 py-2 min-h-[40px] justify-center">
                  <Text className="text-white text-center text-xs font-[KumbhSans-Medium]">
                    Proposal
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity className="flex-1 bg-gray-600 rounded-xl px-3 py-2 min-h-[40px] justify-center">
                <Text className="text-white text-center text-xs font-[KumbhSans-Medium]">
                  Support
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const Maintenance = () => {
  const insets = useSafeAreaInsets();

  // DUMMY DATA FOR MAINTENANCE CONTRACTS
  const dummyData = [
    {
      id: "AMC-2024-001",
      project: "E-commerce Platform",
      type: "Annual Maintenance Contract",
      plan: "Premium",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      supportHours: "24/7 Priority Support",
      price: "$2,499",
      billingCycle: "/year",
      status: "active",
      features: [
        "24/7 Priority Support",
        "Regular Security Updates",
        "Performance Optimization",
        "Bug Fixes & Patches",
        "Feature Enhancements",
        "Database Maintenance",
        "Backup Management",
        "SSL Certificate Renewal"
      ]
    },
    {
      id: "AMC-2024-002",
      project: "Analytics Dashboard",
      type: "Annual Maintenance",
      plan: "Standard",
      startDate: "2024-03-15",
      endDate: "2025-03-14",
      supportHours: "Business Hours Support",
      price: "$1,299",
      billingCycle: "/year",
      status: "active",
      features: [
        "Business Hours Support",
        "Security Updates",
        "Bug Fixes",
        "Performance Monitoring",
        "Data Backup",
        "Basic Enhancements"
      ]
    },
    {
      id: "AMC-2024-003",
      project: "CRM Integration System",
      type: "Semi-Annual Maintenance",
      plan: "Basic",
      startDate: "2023-07-01",
      endDate: "2024-01-01",
      supportHours: "Email Support",
      price: "$799",
      billingCycle: "/6 months",
      status: "expired",
      features: [
        "Email Support",
        "Critical Bug Fixes",
        "Security Patches",
        "System Updates"
      ]
    },
    {
      id: "AMC-2024-004",
      project: "Mobile Application",
      type: "Annual Enterprise Maintenance",
      plan: "Enterprise",
      startDate: "2024-06-01",
      endDate: "2025-05-31",
      supportHours: "24/7 Dedicated Support",
      price: "$4,999",
      billingCycle: "/year",
      status: "pending",
      features: [
        "24/7 Dedicated Support",
        "Custom Feature Development",
        "Advanced Security",
        "Performance Optimization",
        "App Store Management",
        "User Analytics",
        "Push Notification Service",
        "Multi-platform Support"
      ]
    },
    {
      id: "AMC-2024-005",
      project: "Website Redesign Project",
      type: "Quarterly Maintenance",
      plan: "Starter",
      startDate: "2024-09-01",
      endDate: "2024-12-01",
      supportHours: "Limited Email Support",
      price: "$399",
      billingCycle: "/quarter",
      status: "active",
      features: [
        "Limited Email Support",
        "Critical Security Updates",
        "Basic Maintenance"
      ]
    }
  ];

  const contractTypes = [
    "All Types",
    "Annual Maintenance",
    "Semi-Annual",
    "Quarterly"
  ];

  const statusFilters = [
    "All Status",
    "Active",
    "Expiring Soon",
    "Expired",
    "Pending"
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("All Types");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");

  const filteredContracts = dummyData.filter((contract) => {
    const matchesType = selectedType === "All Types" || contract.type.includes(selectedType);
    const matchesStatus = selectedStatus === "All Status" || 
      (selectedStatus === "Active" && contract.status === "active") ||
      (selectedStatus === "Expiring Soon" && contract.status === "active") ||
      (selectedStatus === "Expired" && contract.status === "expired") ||
      (selectedStatus === "Pending" && contract.status === "pending");
    const matchesSearch =
      !searchQuery ||
      contract.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.plan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const clearAllFilters = () => {
    setSelectedType("All Types");
    setSelectedStatus("All Status");
    setShowTypeDropdown(false);
    setShowStatusDropdown(false);
  };

  const hasActiveFilters = selectedType !== "All Types" || selectedStatus !== "All Status";

  // Calculate contract statistics
  const activeContracts = dummyData.filter(c => c.status === "active").length;
  const totalValue = dummyData.reduce((sum, contract) => {
    const price = parseInt(contract.price.replace('$', '').replace(',', ''));
    return sum + price;
  }, 0);

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
          <View className="flex-1">
            <Text
              className="text-2xl text-white mb-1"
              fontFamily="KumbhSans-Bold"
            >
              Maintenance Contracts
            </Text>
            <Text className="text-gray-400 text-sm" fontFamily="KumbhSans">
              {activeContracts} active contracts • ${totalValue.toLocaleString()} total value
            </Text>
          </View>
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

        {/* Type and Status Filters in Row */}
        <View className="flex-row space-x-3 mb-4">
          {/* Type Filter */}
          <View className="flex-1">
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setShowTypeDropdown(!showTypeDropdown);
                setShowStatusDropdown(false);
              }}
            >
              <View className="bg-[#18181b] rounded-xl border border-gray-800 flex-row justify-between items-center px-4 py-3.5">
                <Text
                  className={`text-[15px] font-[KumbhSans] ${
                    selectedType !== "All Types" ? "text-white" : "text-gray-500"
                  }`}
                  numberOfLines={1}
                >
                  {selectedType}
                </Text>
                <Ionicons
                  name={showTypeDropdown ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#aaa"
                />
              </View>
            </TouchableOpacity>

            {showTypeDropdown && (
              <View
                className="absolute top-[55px] left-0 right-0 bg-[#1A1A1A] rounded-xl border border-gray-800 max-h-48 shadow-lg shadow-black/50"
                style={{ zIndex: 9999, elevation: 9999 }}
              >
                <FlatList
                  data={contractTypes}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="px-4 py-3 border-b border-gray-800 active:bg-gray-800/50"
                      onPress={() => {
                        setSelectedType(item);
                        setShowTypeDropdown(false);
                        Keyboard.dismiss();
                      }}
                    >
                      <Text
                        className={`font-[KumbhSans] ${
                          selectedType === item
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
                setShowTypeDropdown(false);
              }}
            >
              <View className="bg-[#18181b] rounded-xl border border-gray-800 flex-row justify-between items-center px-4 py-3.5">
                <Text
                  className={`text-[15px] font-[KumbhSans] ${
                    selectedStatus !== "All Status" ? "text-white" : "text-gray-500"
                  }`}
                  numberOfLines={1}
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
            placeholder="Search by project, contract ID, or plan..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Contract List */}
      <FlatList
        data={filteredContracts}
        renderItem={({ item, index }) => (
          <ContractCard item={item} index={index} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: (showTypeDropdown || showStatusDropdown) ? 200 : 0,
        }}
        ListEmptyComponent={() => (
          <Text
            className="text-gray-400 text-center mt-10"
            fontFamily="KumbhSans"
          >
            No maintenance contracts found.
          </Text>
        )}
      />
    </View>
  );
};

export default Maintenance;