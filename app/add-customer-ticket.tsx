import {
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Keyboard,
  Pressable,
  Modal,
} from "react-native";
import React, { useState, useRef } from "react";
import { Text } from "@/components/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const AddTicket = () => {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
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

  const renderInputContainer = (
    label: string,
    placeholder: string,
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

          {/* Input Field - Pressable to open modal */}
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

        {/* Other Fields */}
        {renderInputContainer("Subject", "Enter ticket subject")}
        {renderInputContainer("Description", "Enter issue description", {
          multiline: true,
          numberOfLines: 6,
          textAlignVertical: "top",
        })}
        {renderInputContainer("Priority", "e.g. Low, Medium, High")}
        {renderInputContainer("Status", "e.g. Open, In-progress, Closed")}

        {/* Action Buttons */}
        <View className="flex-row justify-end space-x-3 py-6 mb-5">
          <TouchableOpacity
            className="px-6 py-3 rounded-lg bg-gray-800"
            onPress={() => {
              Keyboard.dismiss();
              router.back();
            }}
          >
            <Text className="text-white font-medium">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="px-6 py-3 rounded-lg bg-amber-500"
            onPress={() => {
              Haptics.selectionAsync();
              console.log("Ticket saved with:", {
                project: selectedProject,
              });
              // TODO: integrate API later
            }}
          >
            <Text className="text-black font-medium">Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for Project Selection */}
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
              {/* Modal Header */}
              <View className="px-4 py-4 border-b border-gray-800 flex-row items-center justify-between">
                <Text className="text-white text-lg font-[KumbhSans-Bold]">
                  Select Project
                </Text>
                <TouchableOpacity onPress={() => setShowDropdown(false)}>
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Search Input */}
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
                            selectedProject === item ? "text-amber-400" : "text-white"
                          }`}
                        >
                          {item}
                        </Text>
                        {selectedProject === item && (
                          <Ionicons name="checkmark-circle" size={20} color="#f59e0b" />
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