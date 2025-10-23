import { FlatList, Pressable, TextInput, View, Image, Alert, Modal, ActivityIndicator, Linking,ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { api } from "@/services/api";

// API call to fetch tickets
const fetchTickets = async () => {
  try {
    const response = await api.get("/tickets/");
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

// Detail Modal Component
const DetailModal = ({ visible, onClose, ticket }) => {
  const handleCall = () => {
    // You can add call functionality if client phone number is available
    Alert.alert("Info", "Call functionality would be implemented here");
  };

  const handleWhatsApp = () => {
    // You can add WhatsApp functionality if client phone number is available
    Alert.alert("Info", "WhatsApp functionality would be implemented here");
  };

  const handleImagePress = (imageUrl) => {
    if (imageUrl) {
      Linking.openURL(imageUrl);
    }
  };

  if (!ticket) return null;

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
                  Ticket Details
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
                  {/* Basic Info */}
                  <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-4">
                      <View>
                        <Text className="text-white text-lg mb-1" fontFamily="KumbhSans-Bold">
                          {ticket.title}
                        </Text>
                        <Text className="text-gray-400 text-sm" fontFamily="KumbhSans">
                          ID: {ticket.id}
                        </Text>
                      </View>
                      <View
                        className={`px-3 py-1 rounded-full ${
                          ticket.status === "new" ? "bg-blue-500/20" :
                          ticket.status === "in_progress" ? "bg-amber-500/20" :
                          ticket.status === "resolved" ? "bg-green-500/20" :
                          "bg-gray-500/20"
                        }`}
                      >
                        <Text
                          className={`${
                            ticket.status === "new" ? "text-blue-400" :
                            ticket.status === "in_progress" ? "text-amber-400" :
                            ticket.status === "resolved" ? "text-green-400" :
                            "text-gray-400"
                          } text-sm`}
                          fontFamily="KumbhSans-Medium"
                        >
                          {ticket.status?.charAt(0).toUpperCase() + ticket.status?.slice(1).replace('_', ' ')}
                        </Text>
                      </View>
                    </View>

                    {/* Ticket Information */}
                    <View className="space-y-3">
                      <DetailRow icon="description" label="Title" value={ticket.title} />
                      <DetailRow icon="person" label="Created By" value={ticket.created_by?.username} />
                      <DetailRow icon="business" label="Project" value={ticket.project_name} />
                      <DetailRow icon="assignment" label="Product" value={ticket.project?.product?.name} />
                      <DetailRow icon="priority" label="Priority" value={ticket.priority_name} />
                      <DetailRow icon="calendar-today" label="Created Date" value={new Date(ticket.created_at).toLocaleDateString()} />
                      <DetailRow icon="calendar-today" label="Due Date" value={ticket.due_date ? new Date(ticket.due_date).toLocaleDateString() : 'Not set'} />
                      <DetailRow icon="person" label="Assigned To" value={ticket.assigned_to_name || 'Not assigned'} />
                    </View>
                  </View>

                  {/* Description */}
                  {ticket.description && (
                    <View className="mb-6">
                      <Text className="text-white text-lg mb-3" fontFamily="KumbhSans-Bold">
                        Description
                      </Text>
                      <View className="bg-white/5 rounded-xl p-3">
                        <Text className="text-gray-300" fontFamily="KumbhSans">
                          {ticket.description}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Attachments */}
                  {ticket.attachments?.length > 0 && (
                    <View className="mb-6">
                      <Text className="text-white text-lg mb-3" fontFamily="KumbhSans-Bold">
                        Attachments ({ticket.attachments.length})
                      </Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row space-x-2">
                          {ticket.attachments.map((attachment, index) => (
                            <Pressable
                              key={attachment.id}
                              onPress={() => handleImagePress(attachment.file)}
                              className="relative"
                            >
                              <Image
                                source={{ uri: attachment.file }}
                                className="w-20 h-20 rounded-lg"
                              />
                              <View className="absolute bottom-1 left-1 right-1 bg-black/50 rounded px-1">
                                <Text className="text-white text-xs" numberOfLines={1}>
                                  {attachment.filename}
                                </Text>
                              </View>
                            </Pressable>
                          ))}
                        </View>
                      </ScrollView>
                    </View>
                  )}

                  {/* Tags */}
                  {ticket.tags?.length > 0 && (
                    <View className="mb-6">
                      <Text className="text-white text-lg mb-3" fontFamily="KumbhSans-Bold">
                        Tags
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {ticket.tags.map((tag, index) => (
                          <View key={index} className="bg-amber-500/20 px-3 py-1 rounded-full">
                            <Text className="text-amber-400 text-sm" fontFamily="KumbhSans">
                              {tag}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              )}
            />

            {/* Footer Actions */}
            {/* <View className="p-4 border-t border-white/10">
              <View className="flex-row space-x-3">
                <Pressable 
                  onPress={handleCall}
                  className="flex-1 bg-green-500/20 p-3 rounded-xl flex-row items-center justify-center space-x-2"
                >
                  <Ionicons name="call" size={20} color="#22c55e" />
                  <Text className="text-green-400" fontFamily="KumbhSans-Medium">
                    Call
                  </Text>
                </Pressable>
                <Pressable 
                  onPress={handleWhatsApp}
                  className="flex-1 bg-green-500/20 p-3 rounded-xl flex-row items-center justify-center space-x-2"
                >
                  <FontAwesome5 name="whatsapp" size={20} color="#22c55e" />
                  <Text className="text-green-400" fontFamily="KumbhSans-Medium">
                    WhatsApp
                  </Text>
                </Pressable>
                <Pressable 
                  onPress={onClose}
                  className="flex-1 bg-gray-500/20 p-3 rounded-xl flex-row items-center justify-center space-x-2"
                >
                  <Text className="text-gray-400" fontFamily="KumbhSans-Medium">
                    Close
                  </Text>
                </Pressable>
              </View>
            </View> */}
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

const TicketCard = ({ item, index, onViewDetails }: { item: any; index: number; onViewDetails: (ticket: any) => void }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "new": return { bg: "bg-blue-500/20", text: "text-blue-400" };
      case "in_progress": return { bg: "bg-amber-500/20", text: "text-amber-400" };
      case "resolved": return { bg: "bg-green-500/20", text: "text-green-400" };
      case "closed": return { bg: "bg-gray-500/20", text: "text-gray-400" };
      default: return { bg: "bg-gray-500/20", text: "text-gray-400" };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "text-red-400";
      case "Medium": return "text-amber-400";
      case "Low": return "text-green-400";
      default: return "text-gray-400";
    }
  };

  const statusColors = getStatusColor(item.status);

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
                  ID: {item.id}
                </Text>
                <View className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <Text className={`text-sm ${getPriorityColor(item.priority_name)}`} fontFamily="KumbhSans-Medium">
                  {item.priority_name} Priority
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${statusColors.bg}`}
              >
                <Text
                  className={`${statusColors.text} text-sm`}
                  fontFamily="KumbhSans-Medium"
                >
                  {item.status?.charAt(0).toUpperCase() + item.status?.slice(1).replace('_', ' ')}
                </Text>
              </View>
            </View>

            {/* Client / Subject */}
            <View className="mb-4">
              <Text
                className="text-white text-xl mb-1"
                fontFamily="KumbhSans-Bold"
              >
                {item.title}
              </Text>

              <View className="flex flex-row space-x-2 my-2 items-center">
                <MaterialIcons name="person-outline" size={20} color="white" />
                <Text className="text-gray-400 text-sm" fontFamily="KumbhSans">
                  Created by: {item.created_by?.username}
                </Text>
              </View>

              <View className="flex flex-row space-x-2 my-2 items-center">
                <Ionicons name="business-outline" size={20} color="white" />
                <Text className="text-gray-400 text-sm" fontFamily="KumbhSans">
                  Project: {item.project_name}
                </Text>
              </View>

              <View className="flex flex-row space-x-2 my-2 items-center">
                <Ionicons name="calendar-outline" size={20} color="white" />
                <Text className="text-gray-400 text-sm" fontFamily="KumbhSans">
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>

              {/* Attachments preview */}
              {item.attachments?.length > 0 && (
                <View className="flex flex-row space-x-2 my-2 items-center">
                  <Ionicons name="image-outline" size={20} color="white" />
                  <Text className="text-gray-400 text-sm" fontFamily="KumbhSans">
                    {item.attachments.length} attachment{item.attachments.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              )}
            </View>

            {/* View Details Button */}
            <Pressable 
              onPress={() => onViewDetails(item)}
              className="flex-row items-center justify-center space-x-2 bg-blue-500/20 p-3 rounded-xl mt-2 border border-blue-500/30"
            >
              <Feather name="eye" size={18} color="#60a5fa" />
              <Text className="text-blue-400" fontFamily="KumbhSans-Medium">
                View Details
              </Text>
            </Pressable>

            {/* Commented out Update Ticket section for future implementation */}
            {/* <Pressable 
              onPress={() => setShowModal(true)}
              className="flex-row items-center justify-center space-x-2 bg-[#B4925E] p-3 rounded-xl mt-2"
            >
              <Feather name="edit-2" size={18} color="white" />
              <Text className="text-white" fontFamily="KumbhSans-Medium">
                Update Ticket
              </Text>
            </Pressable> */}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const Ticketing = () => {
  const insets = useSafeAreaInsets();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadTickets = async () => {
    try {
      const data = await fetchTickets();
      setTickets(data.results || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load tickets');
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadTickets();
  };

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.id?.toString().includes(searchQuery) ||
    ticket.project_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.created_by?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text className="text-white mt-4" fontFamily="KumbhSans">
          Loading tickets...
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
              Support Tickets
            </Text>
            <Text className="text-gray-400" fontFamily="KumbhSans">
              {tickets.length} total tickets
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
            placeholder="Search by ticket ID, title, project..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Animated.View>

      <FlatList
        data={filteredTickets}
        renderItem={({ item, index }) => (
          <TicketCard 
            item={item} 
            index={index} 
            onViewDetails={handleViewDetails}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-400 text-lg" fontFamily="KumbhSans">
              No tickets found
            </Text>
          </View>
        }
      />

      <DetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        ticket={selectedTicket}
      />
    </View>
  );
};

export default Ticketing;