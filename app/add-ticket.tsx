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

  const [priority, setPriority] = useState<string | null>(null);
  const [priorityVisible, setPriorityVisible] = useState(false);

  const [status, setStatus] = useState<string | null>(null);
  const [statusVisible, setStatusVisible] = useState(false);

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

  const priorities = ["Low", "Medium", "High"];
  const statuses = ["Open", "In-progress", "Closed"];

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
              focusedInput === "Customer"
                ? "border-amber-500"
                : "border-gray-800"
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

          {dropdownVisible && filteredCustomers.length > 0 && (
            <View className="absolute top-14 w-full bg-[#1E1E1E] border border-gray-700 rounded-xl max-h-60 z-50">
              <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
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

        {/* Priority Selector */}
        <View className="space-y-2 mb-4">
          <Text className="text-gray-300 text-[15px] font-medium ml-1">
            Priority
          </Text>
          <View className="relative">
            <TouchableOpacity
              className="bg-[#1A1A1A] rounded-xl border border-gray-800 px-4 py-3.5 flex-row justify-between items-center"
              onPress={() => {
                setPriorityVisible(!priorityVisible);
                Haptics.selectionAsync();
              }}
            >
              <Text className="text-white text-[15px] font-medium">
                {priority || "Select priority"}
              </Text>
              <Ionicons
                name={priorityVisible ? "chevron-up" : "chevron-down"}
                size={18}
                color="#999"
              />
            </TouchableOpacity>

            {priorityVisible && (
              <View className="absolute top-14 w-full bg-[#1E1E1E] border border-gray-700 rounded-xl z-50">
                {priorities.map((item) => (
                  <TouchableOpacity
                    key={item}
                    className="px-4 py-3 border-b border-gray-800"
                    onPress={() => {
                      setPriority(item);
                      setPriorityVisible(false);
                      Haptics.selectionAsync();
                    }}
                  >
                    <Text className="text-white text-[15px]">{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Status Selector */}
        <View className="space-y-2 mb-4">
          <Text className="text-gray-300 text-[15px] font-medium ml-1">
            Status
          </Text>
          <View className="relative">
            <TouchableOpacity
              className="bg-[#1A1A1A] rounded-xl border border-gray-800 px-4 py-3.5 flex-row justify-between items-center"
              onPress={() => {
                setStatusVisible(!statusVisible);
                Haptics.selectionAsync();
              }}
            >
              <Text className="text-white text-[15px] font-medium">
                {status || "Select status"}
              </Text>
              <Ionicons
                name={statusVisible ? "chevron-up" : "chevron-down"}
                size={18}
                color="#999"
              />
            </TouchableOpacity>

            {statusVisible && (
              <View className="absolute top-14 w-full bg-[#1E1E1E] border border-gray-700 rounded-xl z-50">
                {statuses.map((item) => (
                  <TouchableOpacity
                    key={item}
                    className="px-4 py-3 border-b border-gray-800"
                    onPress={() => {
                      setStatus(item);
                      setStatusVisible(false);
                      Haptics.selectionAsync();
                    }}
                  >
                    <Text className="text-white text-[15px]">{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

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
                priority,
                status,
              });
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
