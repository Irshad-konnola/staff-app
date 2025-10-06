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
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const AddRelationship = () => {
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
          New Relationship
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-3">
        {/* Client Selection */}
        <View className="flex flex-row justify-between items-center">
          <View className="w-[80%]">
            {renderInputContainer("Choose Client", "Search and select client")}
          </View>
          <TouchableOpacity className="py-3.5 h-12 mt-2 rounded-xl bg-green-500/20 flex justify-center items-center   w-[18%] transition-colors">
            <AntDesign name="plus" size={22} color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {["Aflah", "John", "Sarah"].map((name) => renderChip(name, () => {}))}
        </View>

        {/* File Number */}
        {renderInputContainer("Mobile Number", "Enter Mobile  number")}
        {renderInputContainer("WhatsApp Number", "Enter WhatsApp Number")}
        {renderInputContainer("Email", "Enter email address")}
        {renderInputContainer("Country", "Enter country")}
        {renderInputContainer("City", "Enter city")}

        {renderInputContainer("Products", "Search and select product")}
        <View className="flex-row flex-wrap gap-2 mb-6">
          {["Eyfel Air Freshner"].map((name) => renderChip(name, () => {}))}
        </View>
        {/* Document Upload */}

        {/* Features */}
        {renderInputContainer("Features", "Search or add features")}

        {/* Layout Selection */}
        {renderInputContainer("In Care of", "Select in care of")}
        <View className="flex-row flex-wrap gap-2 mb-6">
          {["Nasscript", "Hissan"].map((layout) =>
            renderChip(layout, () => {})
          )}
        </View>

        {renderInputContainer("Short note", "Enter short note")}
        {/* Additional Requirements */}
        {renderInputContainer("Remarks", "Enter remarks", {
          multiline: true,
          numberOfLines: 4,
          textAlignVertical: "top",
        })}

        {/* Prepared By */}
        {/* {renderInputContainer("Prepared By", "Search and select staff")}
        <View className="flex-row flex-wrap gap-2 mb-6">
          {["Aflah", "Mike", "Emma"].map((name) => renderChip(name, () => {}))}
        </View> */}

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

export default AddRelationship;
