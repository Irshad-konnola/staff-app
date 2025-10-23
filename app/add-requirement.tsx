import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Text } from "@/components/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { api } from "@/services/api";

// API calls (same as before)
const fetchClients = async () => {
  try {
    const response = await api.get("/clients/");
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

const fetchUsers = async () => {
  try {
    const response = await api.get("/users/");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const createClient = async (clientData) => {
  try {
    const response = await api.post("/clients/", clientData);
    return response.data;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

// Helper function to create form data for file uploads
const createFormData = (requirementData) => {
  const formData = new FormData();

  // Append basic fields
  formData.append("client_id", requirementData.client_id);
  formData.append("status", requirementData.status || "pending");
  formData.append("file_number", requirementData.file_number);
  formData.append(
    "additional_requirements",
    requirementData.additional_requirements || ""
  );
  formData.append("prepared_by", requirementData.prepared_by);

  // Append images if any
  if (requirementData.images && requirementData.images.length > 0) {
    requirementData.images.forEach((image, index) => {
      formData.append(`uploaded_images[${index}]`, {
        uri: image.uri,
        type: image.mimeType || "image/jpeg",
        name: image.fileName || `image_${index}.jpg`,
      } as any);
    });
  }

  // Append files if any
  if (requirementData.files && requirementData.files.length > 0) {
    requirementData.files.forEach((file, index) => {
      formData.append(`uploaded_files[${index}]`, {
        uri: file.uri,
        type: file.mimeType || "application/octet-stream",
        name: file.name || `file_${index}`,
      } as any);
    });
  }

  return formData;
};

const createRequirement = async (requirementData) => {
  try {
    const formData = createFormData(requirementData);

    const response = await api.post("/client-requirements/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating requirement:", error);
    throw error;
  }
};

// Create Client Modal with Country and City fields
const CreateClientModal = ({ visible, onClose, onClientCreated }) => {
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState({
    name: "",
    company_name: "",
    mobile_number: "",
    email: "",
    address: "",
    file_number: "",
    country: "",
    city: "",
  });

  const handleCreateClient = async () => {
    if (!clientData.name || !clientData.mobile_number) {
      Alert.alert("Error", "Name and mobile number are required");
      return;
    }

    setLoading(true);
    try {
      const newClient = await createClient(clientData);
      Alert.alert("Success", "Client created successfully");
      onClientCreated(newClient);
      setClientData({
        name: "",
        company_name: "",
        mobile_number: "",
        email: "",
        address: "",
        file_number: "",
        country: "",
        city: "",
      });
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to create client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center p-4">
        <View className="bg-[#1A1A1A] rounded-2xl p-6 max-h-[90%]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white text-xl" fontFamily="KumbhSans-Bold">
              Create New Client
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View className="space-y-4">
              <View>
                <Text className="text-gray-300 mb-2">Client Name *</Text>
                <TextInput
                  className="bg-[#2d2d2d] rounded-xl p-3 text-white border border-gray-700"
                  placeholder="Enter client name"
                  placeholderTextColor="#666"
                  value={clientData.name}
                  onChangeText={(text) =>
                    setClientData((prev) => ({ ...prev, name: text }))
                  }
                />
              </View>

              <View>
                <Text className="text-gray-300 mb-2">Company Name</Text>
                <TextInput
                  className="bg-[#2d2d2d] rounded-xl p-3 text-white border border-gray-700"
                  placeholder="Enter company name"
                  placeholderTextColor="#666"
                  value={clientData.company_name}
                  onChangeText={(text) =>
                    setClientData((prev) => ({ ...prev, company_name: text }))
                  }
                />
              </View>

              <View>
                <Text className="text-gray-300 mb-2">Mobile Number *</Text>
                <TextInput
                  className="bg-[#2d2d2d] rounded-xl p-3 text-white border border-gray-700"
                  placeholder="Enter mobile number"
                  placeholderTextColor="#666"
                  value={clientData.mobile_number}
                  onChangeText={(text) =>
                    setClientData((prev) => ({ ...prev, mobile_number: text }))
                  }
                  keyboardType="phone-pad"
                />
              </View>

              <View>
                <Text className="text-gray-300 mb-2">Email</Text>
                <TextInput
                  className="bg-[#2d2d2d] rounded-xl p-3 text-white border border-gray-700"
                  placeholder="Enter email"
                  placeholderTextColor="#666"
                  value={clientData.email}
                  onChangeText={(text) =>
                    setClientData((prev) => ({ ...prev, email: text }))
                  }
                  keyboardType="email-address"
                />
              </View>

              <View>
                <Text className="text-gray-300 mb-2">File Number</Text>
                <TextInput
                  className="bg-[#2d2d2d] rounded-xl p-3 text-white border border-gray-700"
                  placeholder="Enter file number"
                  placeholderTextColor="#666"
                  value={clientData.file_number}
                  onChangeText={(text) =>
                    setClientData((prev) => ({ ...prev, file_number: text }))
                  }
                />
              </View>

              <View>
                <Text className="text-gray-300 mb-2">Country</Text>
                <TextInput
                  className="bg-[#2d2d2d] rounded-xl p-3 text-white border border-gray-700"
                  placeholder="Enter country"
                  placeholderTextColor="#666"
                  value={clientData.country}
                  onChangeText={(text) =>
                    setClientData((prev) => ({ ...prev, country: text }))
                  }
                />
              </View>

              <View>
                <Text className="text-gray-300 mb-2">City</Text>
                <TextInput
                  className="bg-[#2d2d2d] rounded-xl p-3 text-white border border-gray-700"
                  placeholder="Enter city"
                  placeholderTextColor="#666"
                  value={clientData.city}
                  onChangeText={(text) =>
                    setClientData((prev) => ({ ...prev, city: text }))
                  }
                />
              </View>

              <View>
                <Text className="text-gray-300 mb-2">Address</Text>
                <TextInput
                  className="bg-[#2d2d2d] rounded-xl p-3 text-white border border-gray-700"
                  placeholder="Enter address"
                  placeholderTextColor="#666"
                  value={clientData.address}
                  onChangeText={(text) =>
                    setClientData((prev) => ({ ...prev, address: text }))
                  }
                  multiline
                />
              </View>
            </View>

            <View className="flex-row space-x-3 mt-6">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-gray-700 p-3 rounded-xl"
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateClient}
                disabled={loading}
                className="flex-1 bg-amber-500 p-3 rounded-xl flex-row justify-center items-center"
              >
                {loading ? (
                  <ActivityIndicator color="black" size="small" />
                ) : (
                  <Text className="text-black text-center">Create Client</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// File Upload Component
const FileUploadSection = ({
  images,
  files,
  onImagesChange,
  onFilesChange,
}) => {
  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          mimeType: asset.type || "image/jpeg",
          fileName: asset.fileName || `image_${Date.now()}.jpg`,
          fileSize: asset.fileSize,
        }));
        onImagesChange([...images, ...newImages]);
      }
    } catch (error) {
      console.error("Error picking images:", error);
      Alert.alert("Error", "Failed to pick images");
    }
  };

  const pickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: true,
      });

      if (!result.canceled) {
        const newFiles = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType,
          size: asset.size,
        }));
        onFilesChange([...files, ...newFiles]);
      }
    } catch (error) {
      console.error("Error picking documents:", error);
      Alert.alert("Error", "Failed to pick documents");
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <View className="mb-6">
      <Text className="text-gray-300 text-[15px] font-medium ml-1 mb-3">
        Upload Requirements
      </Text>

      {/* Upload Buttons */}
      <View className="flex-row space-x-3 mb-4">
        <TouchableOpacity
          onPress={pickImages}
          className="flex-1 bg-amber-500/20 p-4 rounded-xl items-center justify-center border border-amber-500/30"
        >
          <Feather name="image" size={24} color="#F59E0B" />
          <Text
            className="text-amber-500 mt-2 text-center"
            fontFamily="KumbhSans-Medium"
          >
            Upload Images
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={pickDocuments}
          className="flex-1 bg-blue-500/20 p-4 rounded-xl items-center justify-center border border-blue-500/30"
        >
          <Feather name="file" size={24} color="#60a5fa" />
          <Text
            className="text-blue-400 mt-2 text-center"
            fontFamily="KumbhSans-Medium"
          >
            Upload Documents
          </Text>
        </TouchableOpacity>
      </View>

      {/* Uploaded Images */}
      {images.length > 0 && (
        <View className="mb-4">
          <Text className="text-gray-400 text-sm mb-2">
            Images ({images.length})
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-2">
              {images.map((image, index) => (
                <View key={index} className="relative">
                  <Image
                    source={{ uri: image.uri }}
                    className="w-20 h-20 rounded-lg"
                  />
                  <TouchableOpacity
                    onPress={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                  >
                    <Ionicons name="close" size={14} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Uploaded Files */}
      {files.length > 0 && (
        <View>
          <Text className="text-gray-400 text-sm mb-2">
            Documents ({files.length})
          </Text>
          <View className="space-y-2">
            {files.map((file, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between bg-white/5 p-3 rounded-xl"
              >
                <View className="flex-row items-center space-x-3 flex-1">
                  <Feather name="file" size={20} color="#60a5fa" />
                  <View className="flex-1">
                    <Text className="text-white text-sm" numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text className="text-gray-400 text-xs">
                      {Math.round(file.size / 1024)} KB
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => removeFile(index)}
                  className="p-1"
                >
                  <Ionicons name="close" size={18} color="#f87171" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const AddRequirement = () => {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [formData, setFormData] = useState({
    client_id: "",
    client_name: "",
    file_number: "",
    additional_requirements: "",
    prepared_by: "",
    prepared_by_name: "",
    status: "pending",
    images: [],
    files: [],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [clientsData, usersData] = await Promise.all([
        fetchClients(),
        fetchUsers(),
      ]);
      setClients(clientsData.results || []);
      setUsers(usersData.results || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClientSelect = (client) => {
    setFormData((prev) => ({
      ...prev,
      client_id: client.id,
      client_name: client.name || client.company_name,
      file_number: client.file_number || "",
    }));
    setShowClientDropdown(false);
  };

  const handleUserSelect = (user) => {
    setFormData((prev) => ({
      ...prev,
      prepared_by: user.id,
      prepared_by_name: user.username,
    }));
    setShowUserDropdown(false);
  };

  const handleClientCreated = (newClient) => {
    setClients((prev) => [newClient, ...prev]);
    handleClientSelect(newClient);
  };

  const handleImagesChange = (newImages) => {
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleFilesChange = (newFiles) => {
    setFormData((prev) => ({ ...prev, files: newFiles }));
  };

  const handleSubmit = async () => {
    if (!formData.client_id || !formData.file_number || !formData.prepared_by) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await createRequirement(formData);
      Alert.alert("Success", "Requirement created successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to create requirement");
    } finally {
      setLoading(false);
    }
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

  const renderDropdownInput = (
    label: string,
    value: string,
    placeholder: string,
    onFocus: () => void,
    showPlusButton = false,
    onPlusPress = () => {}
  ) => (
    <View className="space-y-2 mb-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-300 text-[15px] font-medium ml-1">
          {label}
        </Text>
        {showPlusButton && (
          <TouchableOpacity onPress={onPlusPress} className="p-1">
            <Ionicons name="add-circle" size={20} color="#F59E0B" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        onPress={onFocus}
        className={`
          bg-[#1A1A1A] 
          rounded-xl 
          border 
          ${focusedInput === label ? "border-amber-500" : "border-gray-800"}
          p-4
        `}
      >
        <Text
          className={`text-[15px] font-medium font-[KumbhSans] ${
            value ? "text-white" : "text-gray-500"
          }`}
        >
          {value || placeholder}
        </Text>
      </TouchableOpacity>
    </View>
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
        {renderDropdownInput(
          "Choose Client *",
          formData.client_name,
          "Search and select client",
          () => setShowClientDropdown(true),
          true,
          () => setShowClientModal(true)
        )}

        {/* File Number */}
        {renderInputContainer("File Number *", "Enter file number", {
          value: formData.file_number,
          onChangeText: (text) =>
            setFormData((prev) => ({ ...prev, file_number: text })),
        })}

        {/* File Upload Section */}
        <FileUploadSection
          images={formData.images}
          files={formData.files}
          onImagesChange={handleImagesChange}
          onFilesChange={handleFilesChange}
        />

        {/* Additional Requirements */}
        {renderInputContainer(
          "Additional Requirements",
          "Enter any additional requirements",
          {
            multiline: true,
            numberOfLines: 4,
            textAlignVertical: "top",
            value: formData.additional_requirements,
            onChangeText: (text) =>
              setFormData((prev) => ({
                ...prev,
                additional_requirements: text,
              })),
          }
        )}

        {/* Prepared By */}
        {renderDropdownInput(
          "Prepared By *",
          formData.prepared_by_name,
          "Select staff member",
          () => setShowUserDropdown(true)
        )}

        {/* Action Buttons */}
        <View className="flex-row justify-end space-x-3 py-6 mb-5">
          <TouchableOpacity
            className="px-6 py-3 rounded-lg bg-gray-800"
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text className="text-white font-medium">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="px-6 py-3 rounded-lg bg-amber-500 flex-row items-center"
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="black" size="small" />
            ) : (
              <Text className="text-black font-medium">Save Requirement</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Client Dropdown Modal */}
      <Modal
        visible={showClientDropdown}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 bg-black/50 justify-center p-4">
          <View className="bg-[#1A1A1A] rounded-2xl max-h-[70%]">
            <View className="p-4 border-b border-gray-800">
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-white text-lg"
                  fontFamily="KumbhSans-Bold"
                >
                  Select Client
                </Text>
                <TouchableOpacity onPress={() => setShowClientDropdown(false)}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <FlatList
              data={clients}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleClientSelect(item)}
                  className="p-4 border-b border-gray-800"
                >
                  <Text
                    className="text-white text-lg"
                    fontFamily="KumbhSans-Medium"
                  >
                    {item.name || item.company_name}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    {item.mobile_number} • File: {item.file_number}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* User Dropdown Modal */}
      <Modal
        visible={showUserDropdown}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 bg-black/50 justify-center p-4">
          <View className="bg-[#1A1A1A] rounded-2xl max-h-[70%]">
            <View className="p-4 border-b border-gray-800">
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-white text-lg"
                  fontFamily="KumbhSans-Bold"
                >
                  Select Staff
                </Text>
                <TouchableOpacity onPress={() => setShowUserDropdown(false)}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <FlatList
              data={users}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleUserSelect(item)}
                  className="p-4 border-b border-gray-800"
                >
                  <Text
                    className="text-white text-lg"
                    fontFamily="KumbhSans-Medium"
                  >
                    {item.username}
                  </Text>
                  {item.email && (
                    <Text className="text-gray-400 text-sm">{item.email}</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Create Client Modal */}
      <CreateClientModal
        visible={showClientModal}
        onClose={() => setShowClientModal(false)}
        onClientCreated={handleClientCreated}
      />
    </SafeAreaView>
  );
};

export default AddRequirement;
