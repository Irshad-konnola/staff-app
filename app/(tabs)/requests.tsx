import {
  FlatList,
  Pressable,
  TextInput,
  View,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Linking } from "react-native";
import { api } from "@/services/api";
// API calls
const fetchClientRequests = async () => {
  try {
    const response = await api.get("/client-requests/");
    return response.data;
  } catch (error) {
    console.error("Error fetching client requests:", error);
    throw error;
  }
};

const fetchStaff = async () => {
  try {
    const response = await api.get("/staff/");
    return response.data;
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
};

const updateClientRequest = async (requestId, data) => {
  try {
    const response = await api.post(
      `/client-requests/${requestId}/assign_staff/`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating client request:", error);
    throw error;
  }
};

// Detail Modal Component
const DetailModal = ({ visible, onClose, request, staffList, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(
    request?.assigned_staff?.toString() || ""
  );
  const [selectedStatus, setSelectedStatus] = useState(request?.status || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!selectedStaff || !selectedStatus) {
      Alert.alert("Error", "Please select both staff and status");
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdate(request.id, {
        staff_id: parseInt(selectedStaff),
        status: selectedStatus,
      });
      setIsEditing(false);
      Alert.alert("Success", "Request updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update request");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCall = () => {
    if (request?.client_number) {
      Linking.openURL(`tel:${request.client_number}`);
    }
  };

  const handleWhatsApp = () => {
    if (request?.client_number) {
      const message = `Hello ${request.client_name}, regarding your request - ${request.service_requested}`;
      Linking.openURL(
        `whatsapp://send?phone=${
          request.client_number
        }&text=${encodeURIComponent(message)}`
      );
    }
  };

  if (!request) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center p-4">
        <LinearGradient
          colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
          className="rounded-2xl p-0.5"
        >
          <View className="bg-[#18181b] rounded-2xl max-h-[90%]">
            {/* Header */}
            <View className="p-4 border-b border-white/10">
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-white text-xl"
                  fontFamily="KumbhSans-Bold"
                >
                  Request Details
                </Text>
                <Pressable onPress={onClose} className="p-2">
                  <Ionicons name="close" size={24} color="white" />
                </Pressable>
              </View>
            </View>

            {/* Content */}
            <FlatList
              data={[1]} // Dummy data for single item scroll
              renderItem={() => (
                <View className="p-4">
                  {/* Basic Info */}
                  <View className="mb-6">
                    <Text
                      className="text-white text-lg mb-3"
                      fontFamily="KumbhSans-Bold"
                    >
                      Client Information
                    </Text>
                    <DetailRow
                      icon="person"
                      label="Client Name"
                      value={request.client_name}
                    />
                    <DetailRow
                      icon="email"
                      label="Email"
                      value={request.client_email}
                    />
                    <DetailRow
                      icon="phone"
                      label="Phone"
                      value={request.client_number}
                    />
                    <DetailRow
                      icon="business"
                      label="Company"
                      value={request.company_name}
                    />
                    <DetailRow
                      icon="people"
                      label="Company Size"
                      value={request.company_size}
                    />
                  </View>

                  {/* Request Details */}
                  <View className="mb-6">
                    <Text
                      className="text-white text-lg mb-3"
                      fontFamily="KumbhSans-Bold"
                    >
                      Request Details
                    </Text>
                    <DetailRow
                      icon="description"
                      label="Service"
                      value={request.service_requested}
                    />
                    <DetailRow
                      icon="calendar-today"
                      label="Scheduled Date"
                      value={new Date(
                        request.scheduled_date
                      ).toLocaleDateString()}
                    />
                    <DetailRow
                      icon="schedule"
                      label="Duration"
                      value={`${request.duration} hour(s)`}
                    />
                    <DetailRow
                      icon="public"
                      label="Time Zone"
                      value={request.time_zone}
                    />
                    <DetailRow
                      icon="video-call"
                      label="Platform"
                      value={request.platform}
                    />
                  </View>

                  {/* Project Details */}
                  <View className="mb-6">
                    <Text
                      className="text-white text-lg mb-3"
                      fontFamily="KumbhSans-Bold"
                    >
                      Project Details
                    </Text>
                    <View className="bg-white/5 rounded-xl p-3">
                      <Text className="text-gray-300" fontFamily="KumbhSans">
                        {request.project_details}
                      </Text>
                    </View>
                  </View>

                  {/* Editable Fields */}
                  <View className="mb-6">
                    <Text
                      className="text-white text-lg mb-3"
                      fontFamily="KumbhSans-Bold"
                    >
                      Assignment
                    </Text>

                    {/* Status */}
                    <View className="mb-4">
                      <Text
                        className="text-gray-400 mb-2"
                        fontFamily="KumbhSans-Medium"
                      >
                        Status
                      </Text>
                      {isEditing ? (
                        <View className="bg-white/5 rounded-xl border border-white/10">
                          <Picker
                            selectedValue={selectedStatus}
                            onValueChange={setSelectedStatus}
                            style={{ color: "white" }}
                            dropdownIconColor="white"
                          >
                            <Picker.Item label="Scheduled" value="scheduled" />
                            <Picker.Item
                              label="In Progress"
                              value="in_progress"
                            />
                            <Picker.Item label="Completed" value="completed" />
                            <Picker.Item label="Cancelled" value="cancelled" />
                          </Picker>
                        </View>
                      ) : (
                        <View
                          className={`px-3 py-2 rounded-xl ${
                            request.status === "scheduled"
                              ? "bg-blue-500/20"
                              : request.status === "in_progress"
                              ? "bg-amber-500/20"
                              : request.status === "completed"
                              ? "bg-green-500/20"
                              : "bg-red-500/20"
                          }`}
                        >
                          <Text
                            className={
                              request.status === "scheduled"
                                ? "text-blue-400"
                                : request.status === "in_progress"
                                ? "text-amber-400"
                                : request.status === "completed"
                                ? "text-green-400"
                                : "text-red-400"
                            }
                            fontFamily="KumbhSans-Medium"
                          >
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Staff Assignment */}
                    <View className="mb-4">
                      <Text
                        className="text-gray-400 mb-2"
                        fontFamily="KumbhSans-Medium"
                      >
                        Assigned Staff
                      </Text>
                      {isEditing ? (
                        <View className="bg-white/5 rounded-xl border border-white/10">
                          <Picker
                            selectedValue={selectedStaff}
                            onValueChange={setSelectedStaff}
                            style={{ color: "white" }}
                            dropdownIconColor="white"
                          >
                            <Picker.Item label="Select Staff" value="" />
                            {staffList.map((staff) => (
                              <Picker.Item
                                key={staff.id}
                                label={staff.name || staff.username}
                                value={staff.id.toString()}
                              />
                            ))}
                          </Picker>
                        </View>
                      ) : (
                        <Text className="text-white" fontFamily="KumbhSans">
                          {request.assigned_staff_name || "Not assigned"}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Contact Actions */}
                  <View className="mb-6">
                    <Text
                      className="text-white text-lg mb-3"
                      fontFamily="KumbhSans-Bold"
                    >
                      Contact Client
                    </Text>
                    <View className="flex-row space-x-3">
                      <Pressable
                        onPress={handleCall}
                        className="flex-1 bg-green-500/20 p-3 rounded-xl flex-row items-center justify-center space-x-2"
                      >
                        <Ionicons name="call" size={20} color="#22c55e" />
                        <Text
                          className="text-green-400"
                          fontFamily="KumbhSans-Medium"
                        >
                          Call
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={handleWhatsApp}
                        className="flex-1 bg-green-500/20 p-3 rounded-xl flex-row items-center justify-center space-x-2"
                      >
                        <FontAwesome5
                          name="whatsapp"
                          size={20}
                          color="#22c55e"
                        />
                        <Text
                          className="text-green-400"
                          fontFamily="KumbhSans-Medium"
                        >
                          WhatsApp
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              )}
            />

            {/* Footer Actions */}
            <View className="p-4 border-t border-white/10">
              <View className="flex-row space-x-3">
                {!isEditing ? (
                  <>
                    <Pressable
                      onPress={() => setIsEditing(true)}
                      className="flex-1 bg-blue-500/20 p-3 rounded-xl flex-row items-center justify-center space-x-2"
                    >
                      <Feather name="edit-2" size={18} color="#60a5fa" />
                      <Text
                        className="text-blue-400"
                        fontFamily="KumbhSans-Medium"
                      >
                        Edit
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={onClose}
                      className="flex-1 bg-gray-500/20 p-3 rounded-xl flex-row items-center justify-center space-x-2"
                    >
                      <Text
                        className="text-gray-400"
                        fontFamily="KumbhSans-Medium"
                      >
                        Close
                      </Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable
                      onPress={handleUpdate}
                      disabled={isUpdating}
                      className="flex-1 bg-green-500/20 p-3 rounded-xl flex-row items-center justify-center space-x-2"
                    >
                      {isUpdating ? (
                        <ActivityIndicator color="#22c55e" size="small" />
                      ) : (
                        <Feather name="check" size={18} color="#22c55e" />
                      )}
                      <Text
                        className="text-green-400"
                        fontFamily="KumbhSans-Medium"
                      >
                        {isUpdating ? "Updating..." : "Update"}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setIsEditing(false)}
                      disabled={isUpdating}
                      className="flex-1 bg-red-500/20 p-3 rounded-xl flex-row items-center justify-center space-x-2"
                    >
                      <Feather name="x" size={18} color="#f87171" />
                      <Text
                        className="text-red-400"
                        fontFamily="KumbhSans-Medium"
                      >
                        Cancel
                      </Text>
                    </Pressable>
                  </>
                )}
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

// Helper component for detail rows
const DetailRow = ({ icon, label, value }) => (
  <View className="flex-row items-center mb-3">
    <MaterialIcons name={icon} size={20} color="#9ca3af" className="mr-3" />
    <View className="flex-1">
      <Text className="text-gray-400 text-sm" fontFamily="KumbhSans-Medium">
        {label}
      </Text>
      <Text className="text-white mt-1" fontFamily="KumbhSans">
        {value || "Not provided"}
      </Text>
    </View>
  </View>
);

const RelationshipCard = ({
  item,
  index,
  onPress,
}: {
  item: any;
  index: number;
  onPress: () => void;
}) => {
  const handleCall = () => {
    if (item?.client_number) {
      Linking.openURL(`tel:${item.client_number}`);
    }
  };

  const handleWhatsApp = () => {
    if (item?.client_number) {
      const message = `Hello ${item.client_name}, regarding your request - ${item.service_requested}`;
      Linking.openURL(
        `whatsapp://send?phone=${item.client_number}&text=${encodeURIComponent(
          message
        )}`
      );
    }
  };

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
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center space-x-2">
                <Text className="text-gray-400" fontFamily="KumbhSans">
                  ID: {item.id}
                </Text>
                <View className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <Text className="text-gray-400" fontFamily="KumbhSans">
                  {item.company_name}
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${
                  item.status === "scheduled"
                    ? "bg-blue-500/20"
                    : item.status === "in_progress"
                    ? "bg-amber-500/20"
                    : item.status === "completed"
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}
              >
                <Text
                  className={`${
                    item.status === "scheduled"
                      ? "text-blue-400"
                      : item.status === "in_progress"
                      ? "text-amber-400"
                      : item.status === "completed"
                      ? "text-green-400"
                      : "text-red-400"
                  } text-sm`}
                  fontFamily="KumbhSans-Medium"
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            </View>

            <View className="mb-4">
              <Text
                className="text-white text-xl mb-1"
                fontFamily="KumbhSans-Bold"
              >
                {item.client_name}
              </Text>
              <View className="flex flex-row space-x-2 my-2 items-center">
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color="white"
                />
                <Text className="text-gray-400  text-sm" fontFamily="KumbhSans">
                  {item?.client_email}
                </Text>
              </View>
              <View className="flex flex-row space-x-2 my-2 items-center">
                <FontAwesome name="building-o" size={20} color="white" />
                <Text className="text-gray-400  text-sm" fontFamily="KumbhSans">
                  {item?.company_name}
                </Text>
              </View>
              <View className="flex flex-row space-x-2 my-2 items-center">
                <Ionicons name="calendar-outline" size={20} color="white" />
                <Text className="text-gray-400  text-sm" fontFamily="KumbhSans">
                  {new Date(item.scheduled_date).toLocaleDateString()}
                </Text>
              </View>
              <View className="flex flex-row space-x-2 my-2 items-center">
                <MaterialIcons name="work-outline" size={20} color="white" />
                <Text className="text-gray-400  text-sm" fontFamily="KumbhSans">
                  {item.service_requested}
                </Text>
              </View>
            </View>

            <View className="flex-row space-x-2">
              <Pressable
                onPress={onPress}
                className="flex-1 bg-blue-500/10 p-3 rounded-xl flex-row items-center justify-center space-x-2"
              >
                <Feather name="eye" size={18} color="#60a5fa" />
                <Text className="text-blue-400" fontFamily="KumbhSans-Medium">
                  View Details
                </Text>
              </Pressable>
              <Pressable
                onPress={handleCall}
                className="w-12 bg-green-500/10 rounded-xl items-center justify-center"
              >
                <Ionicons name="call" size={18} color="#22c55e" />
              </Pressable>
              <Pressable
                onPress={handleWhatsApp}
                className="w-12 bg-green-500/10 rounded-xl items-center justify-center"
              >
                <FontAwesome5 name="whatsapp" size={18} color="#22c55e" />
              </Pressable>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const Request = () => {
  const insets = useSafeAreaInsets();
  const [clientRequests, setClientRequests] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    try {
      const [requestsData, staffData] = await Promise.all([
        fetchClientRequests(),
        fetchStaff(),
      ]);

      setClientRequests(requestsData.results || []);
      setStaffList(staffData || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load data");
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleUpdateRequest = async (requestId, data) => {
    await updateClientRequest(requestId, data);
    // Refresh data after update
    loadData();
    // Update the selected request in modal
    setSelectedRequest((prev) => (prev ? { ...prev, ...data } : null));
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const filteredRequests = clientRequests.filter(
    (request) =>
      request.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.client_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text className="text-white mt-4" fontFamily="KumbhSans">
          Loading client requests...
        </Text>
      </View>
    );
  }

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
              Client Leads
            </Text>
            <Text className="text-gray-400" fontFamily="KumbhSans">
              {clientRequests.length} total lead
              {clientRequests.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="relative">
          <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
            <Ionicons name="search-outline" size={20} color="#94a3b8" />
          </View>
          <TextInput
            className="h-12 pl-12 pr-4 rounded-xl w-full text-white bg-[#18181b] font-[KumbhSans] text-base"
            placeholder="Search client names..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Animated.View>

      <FlatList
        data={filteredRequests}
        renderItem={({ item, index }) => (
          <RelationshipCard
            item={item}
            index={index}
            onPress={() => handleViewDetails(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-400 text-lg" fontFamily="KumbhSans">
              No client requests found
            </Text>
          </View>
        }
      />

      <DetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        request={selectedRequest}
        staffList={staffList}
        onUpdate={handleUpdateRequest}
      />
    </View>
  );
};

export default Request;
