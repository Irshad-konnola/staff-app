import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Text } from "@/components/Text";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const TicketDetailsModal = ({ visible, onClose, ticket }) => {
  const [messages, setMessages] = useState(ticket.messages || []);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Pick image from gallery
  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Take photo with camera
  const takePhotoWithCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSend = () => {
    if (!newMessage.trim() && !selectedImage) return;

    const msg = {
      id: Date.now().toString(),
      text: newMessage,
      image: selectedImage || undefined,
      sender: "customer",
      time: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, msg]);
    setNewMessage("");
    setSelectedImage(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/70 justify-end">
        <View className="bg-[#1c1c1e] rounded-t-3xl p-4 max-h-[85%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-bold">
              {ticket.subject}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                className={`my-2 ${
                  item.sender === "customer" ? "items-end" : "items-start"
                }`}
              >
                <View
                  className={`p-3 rounded-xl max-w-[80%] ${
                    item.sender === "customer" ? "bg-[#B4925E]" : "bg-gray-700"
                  }`}
                >
                  {item.image && (
                    <Image
                      source={{ uri: item.image }}
                      className="w-40 h-32 rounded-lg mb-2"
                      resizeMode="cover"
                    />
                  )}
                  <Text className="text-white text-sm">{item.text}</Text>
                </View>
                <Text className="text-gray-400 text-[11px] mt-1">
                  {item.time}
                </Text>
              </View>
            )}
          />

          {/* Input Area */}
          <View className="flex-row items-center mt-4 bg-[#18181b] rounded-xl px-3 py-2">
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                className="w-12 h-12 rounded-lg mr-2"
                resizeMode="cover"
              />
            )}
            <TextInput
              className="flex-1 text-white px-2"
              placeholder="Type your reply..."
              placeholderTextColor="#aaa"
              value={newMessage}
              onChangeText={setNewMessage}
            />
            {/* Gallery Button */}
            <TouchableOpacity onPress={pickImageFromGallery} className="mr-2">
              <Ionicons name="image-outline" size={22} color="#B4925E" />
            </TouchableOpacity>
            {/* Camera Button */}
            <TouchableOpacity onPress={takePhotoWithCamera} className="mr-2">
              <Ionicons name="camera-outline" size={22} color="#B4925E" />
            </TouchableOpacity>
            {/* Send Button */}
            <TouchableOpacity onPress={handleSend}>
              <Ionicons name="send" size={22} color="#B4925E" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TicketDetailsModal;
