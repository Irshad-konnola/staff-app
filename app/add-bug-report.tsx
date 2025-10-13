import React, { useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const AddBugReport = () => {
  const insets = useSafeAreaInsets();
  
  const [formData, setFormData] = useState({
    title: "",
    project: "",
    module: "",
    severity: "",
    description: "",
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: "",
    deviceInfo: "",
    appVersion: "",
  });

  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false);

  const projects = [
    "Website Redesign",
    "CRM Integration",
    "Analytics Dashboard",
    "Mobile App",
    "E-commerce Platform",
    "Other"
  ];

  const modules = [
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

  const severityLevels = [
    "Critical",
    "High",
    "Medium",
    "Low"
  ];

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.title || !formData.project || !formData.module || !formData.severity || !formData.description) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Bug Report Submitted:", formData);
    
    Alert.alert(
      "Bug Report Submitted",
      "Thank you for reporting this issue. We'll investigate it promptly.",
      [
        {
          text: "OK",
          onPress: () => router.back()
        }
      ]
    );
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-black"
      style={{ paddingTop: insets.top }}
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "transparent"]}
        className="absolute w-full h-full"
      />

      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-800 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl text-white" fontFamily="KumbhSans-Bold">
              New Bug Report
            </Text>
            <Text className="text-gray-400 text-sm" fontFamily="KumbhSans">
              Report a new issue
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-[#B4925E] px-4 py-2 rounded-xl"
        >
          <Text className="text-white" fontFamily="KumbhSans-Medium">
            Submit
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 space-y-6 pb-8">
          {/* Title */}
          <View>
            <Text className="text-white text-lg mb-2 ml-1" fontFamily="KumbhSans-Medium">
              Title *
            </Text>
            <TextInput
              className="bg-[#18181b] rounded-xl px-4 py-3 text-white font-[KumbhSans] text-base border border-gray-800"
              placeholder="Brief description of the bug"
              placeholderTextColor="#94a3b8"
              value={formData.title}
              onChangeText={(value) => updateFormData("title", value)}
            />
          </View>

          {/* Project, Module and Severity in Row */}
          <View className="space-y-4">
            {/* Project and Module Row */}
            <View className="flex-row space-x-4">
              {/* Project Dropdown */}
              <View className="flex-1">
                <Text className="text-white text-lg mb-2 ml-1" fontFamily="KumbhSans-Medium">
                  Project *
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowProjectDropdown(!showProjectDropdown);
                    setShowModuleDropdown(false);
                    setShowSeverityDropdown(false);
                  }}
                  className="bg-[#18181b] rounded-xl px-4 py-3 border border-gray-800 flex-row justify-between items-center"
                >
                  <Text
                    className={`font-[KumbhSans] text-base ${
                      formData.project ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {formData.project || "Select project"}
                  </Text>
                  <Ionicons
                    name={showProjectDropdown ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#aaa"
                  />
                </TouchableOpacity>

                {showProjectDropdown && (
                  <View className="absolute top-20 left-0 right-0 bg-[#1A1A1A] rounded-xl border border-gray-800 max-h-48 z-50 shadow-lg shadow-black/50">
                    <ScrollView>
                      {projects.map((project) => (
                        <TouchableOpacity
                          key={project}
                          className="px-4 py-3 border-b border-gray-800 active:bg-gray-800/50"
                          onPress={() => {
                            updateFormData("project", project);
                            setShowProjectDropdown(false);
                          }}
                        >
                          <Text className="text-white font-[KumbhSans]">
                            {project}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Module Dropdown */}
              <View className="flex-1">
                <Text className="text-white text-lg mb-2 ml-1" fontFamily="KumbhSans-Medium">
                  Module *
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowModuleDropdown(!showModuleDropdown);
                    setShowProjectDropdown(false);
                    setShowSeverityDropdown(false);
                  }}
                  className="bg-[#18181b] rounded-xl px-4 py-3 border border-gray-800 flex-row justify-between items-center"
                >
                  <Text
                    className={`font-[KumbhSans] text-base ${
                      formData.module ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {formData.module || "Select module"}
                  </Text>
                  <Ionicons
                    name={showModuleDropdown ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#aaa"
                  />
                </TouchableOpacity>

                {showModuleDropdown && (
                  <View className="absolute top-20 left-0 right-0 bg-[#1A1A1A] rounded-xl border border-gray-800 max-h-48 z-50 shadow-lg shadow-black/50">
                    <ScrollView>
                      {modules.map((module) => (
                        <TouchableOpacity
                          key={module}
                          className="px-4 py-3 border-b border-gray-800 active:bg-gray-800/50"
                          onPress={() => {
                            updateFormData("module", module);
                            setShowModuleDropdown(false);
                          }}
                        >
                          <Text className="text-white font-[KumbhSans]">
                            {module}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Severity Dropdown */}
            <View className="flex-1">
              <Text className="text-white text-lg mb-2 ml-1" fontFamily="KumbhSans-Medium">
                Severity *
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowSeverityDropdown(!showSeverityDropdown);
                  setShowProjectDropdown(false);
                  setShowModuleDropdown(false);
                }}
                className="bg-[#18181b] rounded-xl px-4 py-3 border border-gray-800 flex-row justify-between items-center"
              >
                <Text
                  className={`font-[KumbhSans] text-base ${
                    formData.severity ? "text-white" : "text-gray-500"
                  }`}
                >
                  {formData.severity || "Select severity"}
                </Text>
                <Ionicons
                  name={showSeverityDropdown ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#aaa"
                />
              </TouchableOpacity>

              {showSeverityDropdown && (
                <View className="absolute top-20 left-0 right-0 bg-[#1A1A1A] rounded-xl border border-gray-800 max-h-48 z-50 shadow-lg shadow-black/50">
                  <ScrollView>
                    {severityLevels.map((severity) => (
                      <TouchableOpacity
                        key={severity}
                        className="px-4 py-3 border-b border-gray-800 active:bg-gray-800/50"
                        onPress={() => {
                          updateFormData("severity", severity);
                          setShowSeverityDropdown(false);
                        }}
                      >
                        <Text className="text-white font-[KumbhSans]">
                          {severity}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          {/* Description */}
          <View>
            <Text className="text-white text-lg mb-2 ml-1" fontFamily="KumbhSans-Medium">
              Description *
            </Text>
            <TextInput
              className="bg-[#18181b] rounded-xl px-4 py-3 text-white font-[KumbhSans] text-base border border-gray-800 min-h-[100px]"
              placeholder="Detailed description of the bug..."
              placeholderTextColor="#94a3b8"
              value={formData.description}
              onChangeText={(value) => updateFormData("description", value)}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Steps to Reproduce */}
          <View>
            <Text className="text-white text-lg mb-2 ml-1" fontFamily="KumbhSans-Medium">
              Steps to Reproduce
            </Text>
            <TextInput
              className="bg-[#18181b] rounded-xl px-4 py-3 text-white font-[KumbhSans] text-base border border-gray-800 min-h-[80px]"
              placeholder="Step-by-step instructions to reproduce the bug..."
              placeholderTextColor="#94a3b8"
              value={formData.stepsToReproduce}
              onChangeText={(value) => updateFormData("stepsToReproduce", value)}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Expected vs Actual Behavior */}
          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Text className="text-white text-lg mb-2 ml-1" fontFamily="KumbhSans-Medium">
                Expected Behavior
              </Text>
              <TextInput
                className="bg-[#18181b] rounded-xl px-4 py-3 text-white font-[KumbhSans] text-base border border-gray-800 min-h-[80px]"
                placeholder="What should happen..."
                placeholderTextColor="#94a3b8"
                value={formData.expectedBehavior}
                onChangeText={(value) => updateFormData("expectedBehavior", value)}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View className="flex-1">
              <Text className="text-white text-lg mb-2 ml-1" fontFamily="KumbhSans-Medium">
                Actual Behavior
              </Text>
              <TextInput
                className="bg-[#18181b] rounded-xl px-4 py-3 text-white font-[KumbhSans] text-base border border-gray-800 min-h-[80px]"
                placeholder="What actually happens..."
                placeholderTextColor="#94a3b8"
                value={formData.actualBehavior}
                onChangeText={(value) => updateFormData("actualBehavior", value)}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Device Info and App Version */}
          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Text className="text-white text-lg mb-2 ml-1" fontFamily="KumbhSans-Medium">
                Device Information
              </Text>
              <TextInput
                className="bg-[#18181b] rounded-xl px-4 py-3 text-white font-[KumbhSans] text-base border border-gray-800"
                placeholder="Device, OS version..."
                placeholderTextColor="#94a3b8"
                value={formData.deviceInfo}
                onChangeText={(value) => updateFormData("deviceInfo", value)}
              />
            </View>

            <View className="flex-1">
              <Text className="text-white text-lg mb-2 ml-1" fontFamily="KumbhSans-Medium">
                App Version
              </Text>
              <TextInput
                className="bg-[#18181b] rounded-xl px-4 py-3 text-white font-[KumbhSans] text-base border border-gray-800"
                placeholder="App version number"
                placeholderTextColor="#94a3b8"
                value={formData.appVersion}
                onChangeText={(value) => updateFormData("appVersion", value)}
              />
            </View>
          </View>

          {/* Required Fields Note */}
          <View className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <Text className="text-amber-400 text-sm" fontFamily="KumbhSans">
              <Text className="font-bold">Note:</Text> Fields marked with * are required.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddBugReport;