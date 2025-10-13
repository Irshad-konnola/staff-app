import { FlatList, Pressable, TextInput, View, Image, Alert,Modal  } from "react-native";
import React, { useState } from "react";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

// Types
interface Ticket {
  id: string;
  subject: string;
  raisedBy: string;
  createdDate: string;
  priority: string;
  status: 'open' | 'in-progress' | 'closed';
  staffNotes?: string[];
  staffImages?: string[];
}

interface StatusUpdateModalProps {
  ticket: Ticket;
  visible: boolean;
  onClose: () => void;
  onUpdate: (ticketId: string, status: Ticket['status'], note: string, image: string | null) => void;
}

const StatusUpdateModal = ({ ticket, visible, onClose, onUpdate }: StatusUpdateModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<Ticket["status"]>(ticket.status);
  const [note, setNote] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdate = () => {
    if (selectedStatus !== ticket.status || note.trim() || image) {
      onUpdate(ticket.id, selectedStatus, note.trim(), image);
    }
    setNote("");
    setImage(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/70 justify-center items-center px-4">
        <View className="bg-[#18181b] rounded-2xl p-6 w-full max-w-sm">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-xl" fontFamily="KumbhSans-Bold">
              Update Ticket
            </Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#94a3b8" />
            </Pressable>
          </View>

          {/* Status */}
          <Text className="text-gray-400 mb-2" fontFamily="KumbhSans-Medium">
            Status
          </Text>
          <View className="flex-row space-x-2 mb-4">
            {(["open", "in-progress", "closed"] as const).map((status) => (
              <Pressable
                key={status}
                onPress={() => setSelectedStatus(status)}
                className={`flex-1 px-3 py-2 rounded-xl border ${
                  selectedStatus === status
                    ? status === "open"
                      ? "border-amber-500 bg-amber-500/20"
                      : status === "in-progress"
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-green-500 bg-green-500/20"
                    : "border-gray-600 bg-transparent"
                }`}
              >
                <Text
                  className={`text-center text-xs ${
                    selectedStatus === status
                      ? status === "open"
                        ? "text-amber-400"
                        : status === "in-progress"
                        ? "text-blue-400"
                        : "text-green-400"
                      : "text-gray-400"
                  }`}
                  fontFamily="KumbhSans-Medium"
                >
                  {status === "in-progress" ? "In-progress" : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Note Input */}
          <Text className="text-gray-400 mb-2" fontFamily="KumbhSans-Medium">
            Add Note
          </Text>
          <TextInput
            className="h-20 px-4 py-3 rounded-xl bg-[#27272a] text-white font-[KumbhSans] text-base mb-4"
            placeholder="Add a note for the customer..."
            placeholderTextColor="#94a3b8"
            multiline
            textAlignVertical="top"
            value={note}
            onChangeText={setNote}
          />

          {/* Image Picker */}
          <Pressable
            onPress={pickImage}
            className="flex-row items-center space-x-2 mb-4 p-3 bg-[#27272a] rounded-xl"
          >
            <Ionicons name="image-outline" size={20} color="#94a3b8" />
            <Text className="text-gray-400" fontFamily="KumbhSans">
              {image ? "Change Image" : "Attach Image"}
            </Text>
          </Pressable>

          {image && (
            <View className="mb-4 relative">
              <Image source={{ uri: image }} className="w-full h-32 rounded-xl" />
              <Pressable
                onPress={() => setImage(null)}
                className="absolute top-2 right-2 bg-red-500/80 w-6 h-6 rounded-full items-center justify-center"
              >
                <Ionicons name="close" size={16} color="white" />
              </Pressable>
            </View>
          )}

          {/* Buttons */}
          <View className="flex-row space-x-3">
            <Pressable
              onPress={onClose}
              className="flex-1 px-4 py-3 bg-gray-600 rounded-xl"
            >
              <Text className="text-white text-center" fontFamily="KumbhSans-Medium">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleUpdate}
              className="flex-1 px-4 py-3 bg-[#B4925E] rounded-xl"
            >
              <Text className="text-white text-center" fontFamily="KumbhSans-Medium">
                Update
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const TicketCard = ({ item, index, onUpdateTicket }: { item: Ticket; index: number; onUpdateTicket: (ticket: Ticket) => void }) => {
  const [showModal, setShowModal] = useState(false);

  const handleUpdate = (ticketId: string, status: Ticket['status'], note: string, image: string | null) => {
    const updatedTicket: Ticket = {
      ...item,
      status,
      staffNotes: note ? [...(item.staffNotes || []), note] : item.staffNotes,
      staffImages: image ? [...(item.staffImages || []), image] : item.staffImages,
    };
    onUpdateTicket(updatedTicket);
  };

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

              {/* Staff Notes Preview */}
              {item.staffNotes && item.staffNotes.length > 0 && (
                <View className="mb-3 p-3 bg-[#27272a] rounded-xl">
                  <Text className="text-gray-400 text-sm mb-1" fontFamily="KumbhSans-Medium">
                    Latest Note:
                  </Text>
                  <Text className="text-white text-sm" fontFamily="KumbhSans">
                    {item.staffNotes[item.staffNotes.length - 1]}
                  </Text>
                </View>
              )}

              {/* Staff Images Preview */}
              {item.staffImages && item.staffImages.length > 0 && (
                <View className="mb-3">
                  <Text className="text-gray-400 text-sm mb-2" fontFamily="KumbhSans-Medium">
                    Attached Images: {item.staffImages.length}
                  </Text>
                  <View className="flex-row space-x-2">
                    {item.staffImages.slice(0, 3).map((img, idx) => (
                      <Image
                        key={idx}
                        source={{ uri: img }}
                        className="w-12 h-12 rounded-lg"
                      />
                    ))}
                  </View>
                </View>
              )}

              {/* Update Ticket Button */}
              <Pressable 
                onPress={() => setShowModal(true)}
                className="flex-row items-center justify-center space-x-2 bg-[#B4925E] p-3 rounded-xl mt-2"
              >
                <Feather name="edit-2" size={18} color="white" />
                <Text className="text-white" fontFamily="KumbhSans-Medium">
                  Update Ticket
                </Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <StatusUpdateModal
        ticket={item}
        visible={showModal}
        onClose={() => setShowModal(false)}
        onUpdate={handleUpdate}
      />
    </>
  );
};

const Ticketing = () => {
  const insets = useSafeAreaInsets();
  const [tickets, setTickets] = useState<Ticket[]>([
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
  ]);

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === updatedTicket.id ? updatedTicket : ticket
    ));
  };

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
            placeholder="Search by ticket ID, subject, client..."
            placeholderTextColor="#94a3b8"
          />
        </View>
      </Animated.View>

      <FlatList
        data={tickets}
        renderItem={({ item, index }) => (
          <TicketCard 
            item={item} 
            index={index} 
            onUpdateTicket={handleUpdateTicket}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Ticketing;