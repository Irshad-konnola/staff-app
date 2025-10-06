import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  GestureResponderEvent,
} from "react-native";
import React, { useState } from "react";
import { Text } from "@/components/Text";
import { SafeAreaView } from "react-native-safe-area-context";

import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const AddRequirement = () => {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

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
        className={`
        bg-[#1A1A1A] 
        rounded-xl 
        overflow-hidden 
        border 
        ${focusedInput === label ? "border-amber-500" : "border-gray-800"}
        transition-colors
      `}
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

  const renderChip = (
    text: string,
    onPress?: ((event: GestureResponderEvent) => void) | undefined
  ) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-amber-500/20 px-4 py-2 rounded-full space-x-2"
    >
      <Text className="text-amber-500 text-[14px] font-medium">{text}</Text>
      {/* <X size={14} color="#F59E0B" /> */}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <View className="px-4 py-3 border-b border-gray-800 flex-row justify-start items-center space-x-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-sharp" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl text-white " fontFamily="KumbhSans-Bold">
          New Requirement
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-3">
        {/* Client Selection */}
        {renderInputContainer("Choose Client", "Search and select client")}
        <View className="flex-row flex-wrap gap-2 mb-6">
          {["Aflah", "John", "Sarah"].map((name) => renderChip(name, () => {}))}
        </View>

        {/* File Number */}
        {renderInputContainer("File Number", "Enter file number")}

        {/* Document Upload */}
        <TouchableOpacity
          className="
            bg-[#1A1A1A] 
            rounded-xl 
            p-8 
            mb-6 
            border-2 
            border-dashed 
            border-gray-800
            items-center
            space-y-3
          "
        >
          <View className="bg-amber-500/20 p-3 rounded-full">
            {/* <Upload size={24} color="#F59E0B" /> */}
          </View>
          <Text className="text-gray-400 text-center">
            Drop your files here or{" "}
            <Text className="text-amber-500">browse</Text>
          </Text>
          <Text className="text-gray-600 text-sm">Maximum file size: 50MB</Text>
        </TouchableOpacity>

        <View>
          <View className="space-y-2 mb-4">
            <Text className="text-gray-300 text-[15px] font-medium ml-1">
              {"Features"}
            </Text>
            <View
              className={`
          bg-[#1A1A1A] 
          rounded-xl 
          overflow-hidden 
          border 
          ${
            focusedInput === "Features" ? "border-amber-500" : "border-gray-800"
          }
          transition-colors
        `}
            >
              <TextInput
                className="px-4 py-3.5 text-[15px] text-white font-medium font-[KumbhSans]"
                placeholderTextColor="#666"
                placeholder={"Search or add features"}
                onFocus={() => {
                  setFocusedInput("Features");
                  Haptics.selectionAsync();
                }}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>
          <View className="mt-0  w-[90%] hidden   mx-auto px-2 py-4 bg-[#1A1A1A] border  border-gray-800 rounded-xl overflow-x-auto">
            <View className="flex flex-row space-x-2 items-center">
              <Text className="text-gray-300 text-[15px] font-medium ml-1">
                {"Add "}
              </Text>
              <TouchableOpacity className="px-2 h-10 border rounded-xl border-gray-800 bg-[#2d2d2d] flex items-center justify-center">
                <Text className="text-[13px] text-white">Test</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Layout Selection */}
        {renderInputContainer("Choose Layout", "Select layout template")}
        <View className="flex-row flex-wrap gap-2 mb-6">
          {["Sidebar left", "Sidebar right", "Top nav"].map((layout) =>
            renderChip(layout, () => {})
          )}
        </View>

        {/* Additional Requirements */}
        {renderInputContainer(
          "Additional Requirements",
          "Enter any additional requirements",
          { multiline: true, numberOfLines: 4, textAlignVertical: "top" }
        )}

        {/* Prepared By */}
        {renderInputContainer("Prepared By", "Search and select staff")}
        <View className="flex-row flex-wrap gap-2 mb-6">
          {["Aflah", "Mike", "Emma"].map((name) => renderChip(name, () => {}))}
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-end space-x-3 py-6 mb-5">
          <TouchableOpacity
            className="px-6 py-3 rounded-lg bg-gray-800"
            onPress={() => Haptics.selectionAsync()}
          >
            <Text className="text-white font-medium">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="px-6 py-3 rounded-lg bg-amber-500"
            onPress={() => Haptics.selectionAsync()}
          >
            <Text className="text-black font-medium">Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddRequirement;
