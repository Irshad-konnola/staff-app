import { View, TextInput, Pressable, FlatList, Modal, Alert, ActivityIndicator, Linking } from "react-native";
import { Text } from "@/components/Text";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { api } from "@/services/api"; // Import your API instance

// API call to fetch client requirements
const fetchClientRequirements = async () => {
  try {
    const response = await api.get('/client-requirements/');
    return response.data;
  } catch (error) {
    console.error('Error fetching client requirements:', error);
    throw error;
  }
};

// Detail Modal Component
const DetailModal = ({ visible, onClose, requirement }) => {
  const handleCall = () => {
    if (requirement?.client_number) {
      Linking.openURL(`tel:${requirement.client_number}`);
    }
  };

  const handleWhatsApp = () => {
    if (requirement?.client_number) {
      const message = `Hello ${requirement.client_name}, regarding your requirements`;
      Linking.openURL(`whatsapp://send?phone=${requirement.client_number}&text=${encodeURIComponent(message)}`);
    }
  };

  const handleFileDownload = (fileUrl) => {
    if (fileUrl) {
      Linking.openURL(fileUrl);
    }
  };

  if (!requirement) return null;

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
                <Text className="text-white text-xl" fontFamily="KumbhSans-Bold">
                  Requirement Details
                </Text>
                <Pressable onPress={onClose} className="p-2">
                  <Ionicons name="close" size={24} color="white" />
                </Pressable>
              </View>
            </View>

            {/* Content */}
            <FlatList
              data={[1]}
              renderItem={() => (
                <View className="p-4">
                  {/* Status & Basic Info */}
                  <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-4">
                      <View>
                        <Text className="text-white text-lg mb-1" fontFamily="KumbhSans-Bold">
                          {requirement.client_name}
                        </Text>
                        <Text className="text-gray-400 text-sm" fontFamily="KumbhSans">
                          File: {requirement.file_number}
                        </Text>
                      </View>
                      <View
                        className={`px-3 py-1 rounded-full ${
                          requirement.status === "pending" ? "bg-amber-500/20" :
                          requirement.status === "approved" ? "bg-green-500/20" :
                          "bg-blue-500/20"
                        }`}
                      >
                        <Text
                          className={`${
                            requirement.status === "pending" ? "text-amber-400" :
                            requirement.status === "approved" ? "text-green-400" :
                            "text-blue-400"
                          } text-sm`}
                          fontFamily="KumbhSans-Medium"
                        >
                          {requirement.status?.charAt(0).toUpperCase() + requirement.status?.slice(1)}
                        </Text>
                      </View>
                    </View>

                    {/* Client Information */}
                    <View className="space-y-3">
                      <DetailRow icon="person" label="Client Name" value={requirement.client_name} />
                      <DetailRow icon="phone" label="Phone" value={requirement.client_number} />
                      <DetailRow icon="description" label="File Number" value={requirement.file_number} />
                      <DetailRow icon="person" label="Prepared By" value={requirement.prepared_by_username} />
                    </View>
                  </View>

                  {/* Additional Requirements */}
                  {requirement.additional_requirements && (
                    <View className="mb-6">
                      <Text className="text-white text-lg mb-3" fontFamily="KumbhSans-Bold">
                        Additional Requirements
                      </Text>
                      <View className="bg-white/5 rounded-xl p-3">
                        <Text className="text-gray-300" fontFamily="KumbhSans">
                          {requirement.additional_requirements}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Features */}
                  {(requirement.predefined_features?.length > 0 || requirement.custom_features?.length > 0) && (
                    <View className="mb-6">
                      <Text className="text-white text-lg mb-3" fontFamily="KumbhSans-Bold">
                        Features
                      </Text>
                      <View className="space-y-2">
                        {requirement.predefined_features?.map((feature, index) => (
                          <View key={index} className="flex-row items-center space-x-2">
                            <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                            <Text className="text-gray-300" fontFamily="KumbhSans">
                              {feature}
                            </Text>
                          </View>
                        ))}
                        {requirement.custom_features?.map((feature, index) => (
                          <View key={index} className="flex-row items-center space-x-2">
                            <Ionicons name="add-circle" size={16} color="#60a5fa" />
                            <Text className="text-gray-300" fontFamily="KumbhSans">
                              {feature}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Files */}
                  {requirement.files?.length > 0 && (
                    <View className="mb-6">
                      <Text className="text-white text-lg mb-3" fontFamily="KumbhSans-Bold">
                        Attached Files
                      </Text>
                      <View className="space-y-2">
                        {requirement.files.map((file, index) => (
                          <Pressable
                            key={file.id}
                            onPress={() => handleFileDownload(file.file)}
                            className="flex-row items-center space-x-3 bg-white/5 p-3 rounded-xl"
                          >
                            <MaterialIcons name="attach-file" size={20} color="#60a5fa" />
                            <Text className="text-blue-400 flex-1" fontFamily="KumbhSans" numberOfLines={1}>
                              {file.file.split('/').pop()}
                            </Text>
                            <Feather name="download" size={18} color="#60a5fa" />
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Images */}
                  {requirement.images?.length > 0 && (
                    <View className="mb-6">
                      <Text className="text-white text-lg mb-3" fontFamily="KumbhSans-Bold">
                        Images
                      </Text>
                      <View className="flex-row flex-wrap -mx-1">
                        {requirement.images.map((image, index) => (
                          <Pressable
                            key={image.id}
                            onPress={() => Linking.openURL(image.file)}
                            className="w-1/3 p-1"
                          >
                            <View className="aspect-square bg-white/10 rounded-lg items-center justify-center">
                              <MaterialIcons name="image" size={24} color="#9ca3af" />
                            </View>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              )}
            />

            {/* Footer Actions */}
            <View className="p-4 border-t border-white/10">
              <View className="flex-row space-x-3">
                <Pressable 
                  onPress={handleCall}
                  className="flex-1 bg-green-500/20 p-3 rounded-xl flex-row items-center justify-center space-x-2"
                >
                  <Ionicons name="call" size={20} color="#22c55e" />
                  {/* <Text className="text-green-400" fontFamily="KumbhSans-Medium">
                    Call
                  </Text> */}
                </Pressable>
                <Pressable 
                  onPress={handleWhatsApp}
                  className="flex-1 bg-green-500/20 p-3 rounded-xl flex-row items-center justify-center space-x-2"
                >
                  <FontAwesome5 name="whatsapp" size={20} color="#22c55e" />
                  {/* <Text className="text-green-400" fontFamily="KumbhSans-Medium">
                    WhatsApp
                  </Text> */}
                </Pressable>
                {/* <Pressable 
                  onPress={onClose}
                  className="flex-1 bg-gray-500/20 p-3 rounded-xl flex-row items-center justify-center space-x-2"
                >
                  <Text className="text-gray-400" fontFamily="KumbhSans-Medium">
                    Close
                  </Text>
                </Pressable> */}
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
  <View className="flex-row items-center">
    <MaterialIcons name={icon} size={20} color="#9ca3af" className="mr-3" />
    <View className="flex-1">
      <Text className="text-gray-400 text-sm" fontFamily="KumbhSans-Medium">
        {label}
      </Text>
      <Text className="text-white mt-1" fontFamily="KumbhSans">
        {value || 'Not provided'}
      </Text>
    </View>
  </View>
);

const RequirementCard = ({ item, index, onPress }: { item: any; index: number; onPress: () => void }) => {
  const handleCall = () => {
    if (item?.client_number) {
      Linking.openURL(`tel:${item.client_number}`);
    }
  };

  const handleWhatsApp = () => {
    if (item?.client_number) {
      const message = `Hello ${item.client_name}, regarding your requirements`;
      Linking.openURL(`whatsapp://send?phone=${item.client_number}&text=${encodeURIComponent(message)}`);
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
                  File #{item.file_number}
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${
                  item.status === "pending"
                    ? "bg-amber-500/20"
                    : "bg-green-500/20"
                }`}
              >
                <Text
                  className={`${
                    item.status === "pending"
                      ? "text-amber-400"
                      : "text-green-400"
                  } text-sm`}
                  fontFamily="KumbhSans-Medium"
                >
                  {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
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
              <Text className="text-gray-400 text-sm mb-2" fontFamily="KumbhSans">
                Prepared by: {item.prepared_by_username}
              </Text>
              {item.additional_requirements && (
                <Text className="text-gray-400 text-sm" fontFamily="KumbhSans" numberOfLines={2}>
                  {item.additional_requirements}
                </Text>
              )}
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

export default function EnhancedRequirementsList() {
  const insets = useSafeAreaInsets();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadRequirements = async () => {
    try {
      const data = await fetchClientRequirements();
      setRequirements(data.results || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load requirements');
      console.error('Error loading requirements:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRequirements();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadRequirements();
  };

  const handleViewDetails = (requirement) => {
    setSelectedRequirement(requirement);
    setModalVisible(true);
  };

  const filteredRequirements = requirements.filter(req =>
    req.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.file_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.client_number?.includes(searchQuery)
  );

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text className="text-white mt-4" fontFamily="KumbhSans">
          Loading requirements...
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

      {/* Header */}
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
              Client Requirements
            </Text>
            <Text className="text-gray-400" fontFamily="KumbhSans">
              {requirements.length} total requirement{requirements.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <Pressable
            onPress={() => router.navigate("/add-requirement")}
            className="h-10 px-4 rounded-xl flex-row items-center space-x-2 bg-[#B4925E]"
          >
            <AntDesign name="plus" size={20} color="white" />
            <Text className="text-white" fontFamily="KumbhSans-Medium">
              Add new
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
            placeholder="Search requirements..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Animated.View>

      {/* List */}
      <FlatList
        data={filteredRequirements}
        renderItem={({ item, index }) => (
          <RequirementCard 
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
              No requirements found
            </Text>
          </View>
        }
      />

      <DetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        requirement={selectedRequirement}
      />
    </View>
  );
}