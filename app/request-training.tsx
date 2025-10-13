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
import { router,useLocalSearchParams } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';

const RequestTraining = () => {
  const insets = useSafeAreaInsets();
    const { sessionCount } = useLocalSearchParams (); // get ticket count from parent
  const sessionCountNumber = Number(sessionCount) || 0;

  const [formData, setFormData] = useState({
    title: "",
    project: "",
    preferredDate: "",
    preferredTime: "",
    duration: "",
    description: "",
    topics: "",
    attendees: "",
    joinMethod: "virtual",
  });

  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showJoinMethodDropdown, setShowJoinMethodDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const projects = [
    "Analytics Dashboard",
    "CRM Integration",
    "E-commerce Platform",
    "Mobile App",
    "Website Redesign",
    "Other"
  ];

  const durationOptions = [
    "30 minutes",
    "1 hour",
    "1.5 hours",
    "2 hours",
    "2.5 hours",
    "3 hours"
  ];

  const joinMethods = [
    { value: "virtual", label: "Virtual Meeting" },
    { value: "in-person", label: "In-Person" }
  ];

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.title || !formData.project || !formData.preferredDate || !formData.duration || !formData.description) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Training Request Submitted:", formData);
    
    Alert.alert(
      "Training Request Submitted",
      "Your training session request has been submitted. We'll contact you to confirm the schedule.",
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

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      updateFormData("preferredDate", formattedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const formattedTime = selectedTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      updateFormData("preferredTime", formattedTime);
    }
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
              Request Training
            </Text>
            <Text className="text-gray-400 text-sm" fontFamily="KumbhSans">
              Schedule a new training session
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
              Session Title *
            </Text>
            <TextInput
              className="bg-[#18181b] rounded-xl px-4 py-3 text-white font-[KumbhSans] text-base border border-gray-800"
              placeholder="e.g., Advanced Reporting Training"
              placeholderTextColor="#94a3b8"
              value={formData.title}
              onChangeText={(value) => updateFormData("title", value)}
            />
          </View>

          {/* Project Selection */}
          <View>
            <Text className="text-white text-lg mb-2 ml-1" fontFamily="KumbhSans-Medium">
              Project *
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowProjectDropdown(!showProjectDropdown);
                setShowDurationDropdown(false);
                setShowJoinMethodDropdown(false);
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

          {/* Preferred Date and Time */}
          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Text className="text-white text-lg mb-2 ml-1" fontFamily="KumbhSans-Medium">
                Preferred Date *
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="bg-[#18181b] rounded-xl px-4 py-3 border border-gray-800 flex-row justify-between items-center"
              >
                <Text
                  className={`font-[KumbhSans] text-base ${
                    formData.preferredDate ? "text-white" : "text-gray-500"
                  }`}
                >
                  {formData.preferredDate || "Select date"}
                </Text>
                <Ionicons name="calendar-outline" size={18} color="#aaa" />
              </TouchableOpacity>
            </View>

            <View className="flex-1">
              <Text className="text-white text-lg mb-2 ml-1" fontFamily="KumbhSans-Medium">
                Preferred Time
              </Text>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                className="bg-[#18181b] rounded-xl px-4 py-3 border border-gray-800 flex-row justify-between items-center"
              >
                <Text
                  className={`font-[KumbhSans] text-base ${
                    formData.preferredTime ? "text-white" : "text-gray-500"
                  }`}
                >
                  {formData.preferredTime || "Select time"}
                </Text>
                <Ionicons name="time-outline" size={18} color="#aaa" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Duration and Join Method */}
          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Text className="text-white text-lg mb-2 ml-1" fontFamily="KumbhSans-Medium">
                Duration *
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowDurationDropdown(!showDurationDropdown);
                  setShowProjectDropdown(false);
                  setShowJoinMethodDropdown(false);
                }}
                className="bg-[#18181b] rounded-xl px-4 py-3 border border-gray-800 flex-row justify-between items-center"
              >
                <Text
                  className={`font-[KumbhSans] text-base ${
                    formData.duration ? "text-white" : "text-gray-500"
                  }`}
                >
                  {formData.duration || "Select duration"}
                </Text>
                <Ionicons
                  name={showDurationDropdown ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#aaa"
                />
              </TouchableOpacity>

              {showDurationDropdown && (
                <View className="absolute top-20 left-0 right-0 bg-[#1A1A1A] rounded-xl border border-gray-800 max-h-48 z-50 shadow-lg shadow-black/50">
                  <ScrollView>
                    {durationOptions.map((duration) => (
                      <TouchableOpacity
                        key={duration}
                        className="px-4 py-3 border-b border-gray-800 active:bg-gray-800/50"
                        onPress={() => {
                          updateFormData("duration", duration);
                          setShowDurationDropdown(false);
                        }}
                      >
                        <Text className="text-white font-[KumbhSans]">
                          {duration}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-white text-lg mb-2 ml-1" fontFamily="KumbhSans-Medium">
                Join Method
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowJoinMethodDropdown(!showJoinMethodDropdown);
                  setShowProjectDropdown(false);
                  setShowDurationDropdown(false);
                }}
                className="bg-[#18181b] rounded-xl px-4 py-3 border border-gray-800 flex-row justify-between items-center"
              >
                <Text
                  className={`font-[KumbhSans] text-base ${
                    formData.joinMethod ? "text-white" : "text-gray-500"
                  }`}
                >
                  {joinMethods.find(method => method.value === formData.joinMethod)?.label || "Select method"}
                </Text>
                <Ionicons
                  name={showJoinMethodDropdown ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#aaa"
                />
              </TouchableOpacity>

              {showJoinMethodDropdown && (
                <View className="absolute top-20 left-0 right-0 bg-[#1A1A1A] rounded-xl border border-gray-800 max-h-48 z-50 shadow-lg shadow-black/50">
                  <ScrollView>
                    {joinMethods.map((method) => (
                      <TouchableOpacity
                        key={method.value}
                        className="px-4 py-3 border-b border-gray-800 active:bg-gray-800/50"
                        onPress={() => {
                          updateFormData("joinMethod", method.value);
                          setShowJoinMethodDropdown(false);
                        }}
                      >
                        <Text className="text-white font-[KumbhSans]">
                          {method.label}
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
              Training Description *
            </Text>
            <TextInput
              className="bg-[#18181b] rounded-xl px-4 py-3 text-white font-[KumbhSans] text-base border border-gray-800 min-h-[100px]"
              placeholder="Please describe what you'd like to learn or the specific topics you want covered..."
              placeholderTextColor="#94a3b8"
              value={formData.description}
              onChangeText={(value) => updateFormData("description", value)}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Specific Topics */}
          <View>
            <Text className="text-white text-lg mb-2 ml-1" fontFamily="KumbhSans-Medium">
              Specific Topics to Cover
            </Text>
            <TextInput
              className="bg-[#18181b] rounded-xl px-4 py-3 text-white font-[KumbhSans] text-base border border-gray-800 min-h-[80px]"
              placeholder="List specific features or topics you want to focus on..."
              placeholderTextColor="#94a3b8"
              value={formData.topics}
              onChangeText={(value) => updateFormData("topics", value)}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Number of Attendees */}
          <View>
            <Text className="text-white text-lg mb-2 ml-1" fontFamily="KumbhSans-Medium">
              Number of Attendees
            </Text>
            <TextInput
              className="bg-[#18181b] rounded-xl px-4 py-3 text-white font-[KumbhSans] text-base border border-gray-800"
              placeholder="e.g., 5"
              placeholderTextColor="#94a3b8"
              value={formData.attendees}
              onChangeText={(value) => updateFormData("attendees", value)}
              keyboardType="numeric"
            />
          </View>

          {/* Required Fields Note */}
          <View className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <Text className="text-amber-400 text-sm" fontFamily="KumbhSans">
              <Text className="font-bold">Note:</Text> You have {12 - sessionCountNumber} training sessions remaining for this year. Fields marked with * are required.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Date and Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default RequestTraining;