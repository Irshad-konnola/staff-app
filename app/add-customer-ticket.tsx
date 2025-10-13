import {
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Keyboard,
  Pressable,
  Modal,
  Image,
  Alert,
} from "react-native";
import React, { useState, useRef } from "react";
import { Text } from "@/components/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams  } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const AddTicket = () => {
  const { ticketCount } = useLocalSearchParams (); // get ticket count from parent
  const maxTickets = 12;

  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [priority, setPriority] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const searchInputRef = useRef<TextInput>(null);

  // Dummy project data
  const dummyProjects = [
    "Website Redesign",
    "Mobile App Development",
    "CRM Integration",
    "Marketing Automation",
    "Analytics Dashboard",
    "E-commerce Platform",
    "Customer Portal",
    "Inventory System",
  ];

  const filteredProjects = dummyProjects.filter((p) =>
    p.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProjectSelect = (project: string) => {
    setSelectedProject(project);
    setSearchQuery("");
    setShowDropdown(false);
    Keyboard.dismiss();
    Haptics.selectionAsync();
  };

  const handleClearProject = () => {
    setSelectedProject(null);
    setSearchQuery("");
    Haptics.selectionAsync();
  };

  const handleOpenDropdown = () => {
    setShowDropdown(true);
    Haptics.selectionAsync();
  };

  /** Image Picker Methods **/
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
if (!result.canceled && result.assets && result.assets.length > 0) {
  setSelectedImage(result.assets[0].uri);
}
  };

  const takePhotoWithCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
if (!result.canceled && result.assets && result.assets.length > 0) {
  setSelectedImage(result.assets[0].uri);
}
  };

  const handleSaveTicket = () => {
    if (Number(ticketCount) >= maxTickets) {
      Alert.alert(
        "Ticket Limit Reached",
        `You can only create ${maxTickets} tickets per year.`
      );
      return;
    }

    if (!selectedProject || !subject || !description || !priority) {
      Alert.alert("Missing Fields", "Please fill all required fields.");
      return;
    }

    console.log("New Ticket Data:", {
      project: selectedProject,
      subject,
      description,
      priority,
      image: selectedImage,
    });

    // TODO: API integration for saving ticket
    router.back();
  };

  const renderInputContainer = (
    label: string,
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    extraProps = {}
  ) => (
    <View className="space-y-2 mb-4">
      <Text className="text-gray-300 text-[15px] font-medium ml-1">
        {label}
      </Text>
      <View
        className={`bg-[#1A1A1A] rounded-xl overflow-hidden border ${
          focusedInput === label ? "border-amber-500" : "border-gray-800"
        }`}
      >
        <TextInput
          className="px-4 py-3.5 text-[15px] text-white font-medium font-[KumbhSans]"
          placeholderTextColor="#666"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => {
            setFocusedInput(label);
            Haptics.selectionAsync();
          }}
          onBlur={() => setFocusedInput(null)}
          {...extraProps}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-800 flex-row justify-start items-center space-x-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-sharp" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl text-white" fontFamily="KumbhSans-Bold">
          New Ticket
        </Text>
      </View>

      {/* Form Container */}
      <ScrollView
        className="flex-1 px-4 pt-3"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Project Selection */}
        <View className="space-y-2 mb-6">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-300 text-[15px] font-medium ml-1">
              Select Project
            </Text>
            {selectedProject && (
              <TouchableOpacity onPress={handleClearProject}>
                <Text className="text-amber-400 text-sm font-[KumbhSans]">
                  Clear
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Pressable onPress={handleOpenDropdown}>
            <View
              className={`bg-[#1A1A1A] rounded-xl border ${
                showDropdown ? "border-amber-500" : "border-gray-800"
              } flex-row items-center px-4 py-3.5`}
            >
              <Text
                className={`flex-1 text-[15px] font-medium font-[KumbhSans] ${
                  selectedProject ? "text-white" : "text-gray-500"
                }`}
              >
                {selectedProject || "Select or search a project"}
              </Text>
              <Ionicons
                name={showDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color="#999"
              />
            </View>
          </Pressable>
        </View>

        {/* Subject & Description */}
        {renderInputContainer("Subject", "Enter ticket subject", subject, setSubject)}
        {renderInputContainer(
          "Description",
          "Enter issue description",
          description,
          setDescription,
          { multiline: true, numberOfLines: 6, textAlignVertical: "top" }
        )}

        {/* Priority Selection */}
        <View className="mb-6">
          <Text className="text-gray-300 text-[15px] font-medium ml-1 mb-2">
            Priority
          </Text>
          <View className="flex-row space-x-3">
            {["Low", "Medium", "High"].map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => setPriority(level)}
                className={`px-4 py-2 rounded-lg border ${
                  priority === level
                    ? "bg-amber-500 border-amber-500"
                    : "bg-[#1A1A1A] border-gray-800"
                }`}
              >
                <Text
                  className={`text-sm font-[KumbhSans] ${
                    priority === level ? "text-black" : "text-white"
                  }`}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Image Upload with Camera */}
        <View className="mb-6">
          <Text className="text-gray-300 text-[15px] font-medium ml-1 mb-2">
            Attach Image
          </Text>
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity
              onPress={pickFromGallery}
              className="px-4 py-3 rounded-lg bg-gray-800"
            >
              <Text className="text-white font-[KumbhSans]">Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={takePhotoWithCamera}
              className="px-4 py-3 rounded-lg bg-gray-800"
            >
              <Text className="text-white font-[KumbhSans]">Camera</Text>
            </TouchableOpacity>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                className="w-16 h-16 rounded-lg"
                resizeMode="cover"
              />
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-end space-x-3 py-6 mb-5">
          <TouchableOpacity
            className="px-6 py-3 rounded-lg bg-gray-800"
            onPress={() => router.back()}
          >
            <Text className="text-white font-medium">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="px-6 py-3 rounded-lg bg-amber-500"
            onPress={handleSaveTicket}
          >
            <Text className="text-black font-medium">Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Project Selection Modal */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <Pressable
          className="flex-1 bg-black/60"
          onPress={() => setShowDropdown(false)}
        >
          <View className="flex-1 justify-center items-center px-4">
            <Pressable
              className="w-full max-w-md bg-[#1A1A1A] rounded-2xl overflow-hidden"
              onPress={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <View className="px-4 py-4 border-b border-gray-800 flex-row items-center justify-between">
                <Text className="text-white text-lg font-[KumbhSans-Bold]">
                  Select Project
                </Text>
                <TouchableOpacity onPress={() => setShowDropdown(false)}>
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Search */}
              <View className="px-4 py-3 border-b border-gray-800">
                <View className="bg-[#121212] rounded-xl border border-gray-800 flex-row items-center px-3">
                  <Ionicons name="search" size={20} color="#999" />
                  <TextInput
                    ref={searchInputRef}
                    className="flex-1 px-3 py-2.5 text-[15px] text-white font-medium font-[KumbhSans]"
                    placeholderTextColor="#666"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus={true}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                      <Ionicons name="close-circle" size={18} color="#999" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Project List */}
              <ScrollView
                className="max-h-96"
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
              >
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((item) => (
                    <TouchableOpacity
                      key={item}
                      className={`px-4 py-4 border-b border-gray-800 active:bg-gray-800/50 ${
                        selectedProject === item ? "bg-amber-500/10" : ""
                      }`}
                      onPress={() => handleProjectSelect(item)}
                      activeOpacity={0.7}
                    >
                      <View className="flex-row items-center justify-between">
                        <Text
                          className={`text-[15px] font-[KumbhSans] ${
                            selectedProject === item
                              ? "text-amber-400"
                              : "text-white"
                          }`}
                        >
                          {item}
                        </Text>
                        {selectedProject === item && (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#f59e0b"
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View className="px-4 py-8">
                    <Text className="text-gray-400 text-center font-[KumbhSans]">
                      No projects found
                    </Text>
                  </View>
                )}
              </ScrollView>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default AddTicket;
