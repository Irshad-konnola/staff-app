import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { Text } from "@/components/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const AddTicket = () => {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Dummy customers
  const dummyCustomers = [
    "Acme Corp",
    "John Doe",
    "Sarah Ltd",
    "Nasscript",
    "TechWave",
    "SoftGrow",
    "GreenLeaf",
    "NextGen Solutions",
    "Zento Systems",
    "Oceanic Ventures",
  ];

  // Filter customers by search
  const filteredCustomers = dummyCustomers.filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleSelectCustomer = (name: string) => {
    setSelectedCustomer(name);
    setSearchQuery(name);
    setDropdownVisible(false);
    Keyboard.dismiss();
    Haptics.selectionAsync();
  };

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

      {/* Form */}
      <ScrollView
        className="flex-1 px-4 pt-3"
        keyboardShouldPersistTaps="handled"
      >
        {/* Customer Selection */}
        <Text className="text-gray-300 text-[15px] font-medium ml-1 mb-2">
          Select Customer
        </Text>

        <View className="relative mb-6">
          <View
            className={`bg-[#1A1A1A] rounded-xl border ${
              focusedInput === "Customer" ? "border-amber-500" : "border-gray-800"
            } flex-row items-center px-3`}
          >
            <TextInput
              className="flex-1 py-3.5 text-[15px] text-white font-medium font-[KumbhSans]"
              placeholder="Search customer..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setDropdownVisible(true);
              }}
              onFocus={() => {
                setFocusedInput("Customer");
                setDropdownVisible(true);
                Haptics.selectionAsync();
              }}
              onBlur={() => setFocusedInput(null)}
            />

            {selectedCustomer ? (
              <TouchableOpacity
                onPress={() => {
                  setSelectedCustomer(null);
                  setSearchQuery("");
                  setDropdownVisible(false);
                  Haptics.selectionAsync();
                }}
              >
                <AntDesign name="closecircle" size={18} color="#999" />
              </TouchableOpacity>
            ) : (
              <Ionicons name="search" size={20} color="#999" />
            )}
          </View>

          {/* Dropdown - Fixed with ScrollView instead of FlatList */}
          {dropdownVisible && filteredCustomers.length > 0 && (
            <View className="absolute top-14 w-full bg-[#1E1E1E] border border-gray-700 rounded-xl max-h-60 z-50">
              <ScrollView
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
              >
                {filteredCustomers.map((item) => (
                  <TouchableOpacity
                    key={item}
                    className="px-4 py-3 border-b border-gray-800"
                    onPress={() => handleSelectCustomer(item)}
                  >
                    <Text className="text-white text-[15px]">{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {renderInputContainer("Subject", "Enter ticket subject")}
        {renderInputContainer("Description", "Enter issue description", {
          multiline: true,
          numberOfLines: 4,
          textAlignVertical: "top",
        })}
        {renderInputContainer("Priority", "e.g. Low, Medium, High")}
        {renderInputContainer("Status", "e.g. Open, In-progress, Closed")}

        {/* Action Buttons */}
        <View className="flex-row justify-end space-x-3 py-6 mb-5">
          <TouchableOpacity
            className="px-6 py-3 rounded-lg bg-gray-800"
            onPress={() => {
              Haptics.selectionAsync();
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
                customer: selectedCustomer,
              });
              // TODO: integrate API later
            }}
          >
            <Text className="text-black font-medium">Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTicket;