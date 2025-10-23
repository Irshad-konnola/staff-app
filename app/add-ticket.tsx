// import {
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Keyboard,
// } from "react-native";
// import React, { useState } from "react";
// import { Text } from "@/components/Text";
// import { SafeAreaView } from "react-native-safe-area-context";
// import * as Haptics from "expo-haptics";
// import { AntDesign, Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";

// const AddTicket = () => {
//   const [focusedInput, setFocusedInput] = useState<string | null>(null);
//   const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [dropdownVisible, setDropdownVisible] = useState(false);

//   const [priority, setPriority] = useState<string | null>(null);
//   const [priorityVisible, setPriorityVisible] = useState(false);

//   const [status, setStatus] = useState<string | null>(null);
//   const [statusVisible, setStatusVisible] = useState(false);

//   const dummyCustomers = [
//     "Acme Corp",
//     "John Doe",
//     "Sarah Ltd",
//     "Nasscript",
//     "TechWave",
//     "SoftGrow",
//     "GreenLeaf",
//     "NextGen Solutions",
//     "Zento Systems",
//     "Oceanic Ventures",
//   ];

//   const priorities = ["Low", "Medium", "High"];
//   const statuses = ["Open", "In-progress", "Closed"];

//   const filteredCustomers = dummyCustomers.filter((name) =>
//     name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const renderInputContainer = (
//     label: string,
//     placeholder: string,
//     extraProps = {}
//   ) => (
//     <View className="space-y-2 mb-4">
//       <Text className="text-gray-300 text-[15px] font-medium ml-1">
//         {label}
//       </Text>
//       <View
//         className={`bg-[#1A1A1A] rounded-xl overflow-hidden border ${
//           focusedInput === label ? "border-amber-500" : "border-gray-800"
//         }`}
//       >
//         <TextInput
//           className="px-4 py-3.5 text-[15px] text-white font-medium font-[KumbhSans]"
//           placeholderTextColor="#666"
//           placeholder={placeholder}
//           onFocus={() => {
//             setFocusedInput(label);
//             Haptics.selectionAsync();
//           }}
//           onBlur={() => setFocusedInput(null)}
//           {...extraProps}
//         />
//       </View>
//     </View>
//   );

//   const handleSelectCustomer = (name: string) => {
//     setSelectedCustomer(name);
//     setSearchQuery(name);
//     setDropdownVisible(false);
//     Keyboard.dismiss();
//     Haptics.selectionAsync();
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-[#121212]">
//       {/* Header */}
//       <View className="px-4 py-3 border-b border-gray-800 flex-row justify-start items-center space-x-3">
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back-sharp" size={24} color="white" />
//         </TouchableOpacity>
//         <Text className="text-2xl text-white" fontFamily="KumbhSans-Bold">
//           New Ticket
//         </Text>
//       </View>

//       {/* Form */}
//       <ScrollView
//         className="flex-1 px-4 pt-3"
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* Customer Selection */}
//         <Text className="text-gray-300 text-[15px] font-medium ml-1 mb-2">
//           Select Customer
//         </Text>

//         <View className="relative mb-6">
//           <View
//             className={`bg-[#1A1A1A] rounded-xl border ${
//               focusedInput === "Customer"
//                 ? "border-amber-500"
//                 : "border-gray-800"
//             } flex-row items-center px-3`}
//           >
//             <TextInput
//               className="flex-1 py-3.5 text-[15px] text-white font-medium font-[KumbhSans]"
//               placeholder="Search customer..."
//               placeholderTextColor="#666"
//               value={searchQuery}
//               onChangeText={(text) => {
//                 setSearchQuery(text);
//                 setDropdownVisible(true);
//               }}
//               onFocus={() => {
//                 setFocusedInput("Customer");
//                 setDropdownVisible(true);
//                 Haptics.selectionAsync();
//               }}
//               onBlur={() => setFocusedInput(null)}
//             />

//             {selectedCustomer ? (
//               <TouchableOpacity
//                 onPress={() => {
//                   setSelectedCustomer(null);
//                   setSearchQuery("");
//                   setDropdownVisible(false);
//                   Haptics.selectionAsync();
//                 }}
//               >
//                 <AntDesign name="closecircle" size={18} color="#999" />
//               </TouchableOpacity>
//             ) : (
//               <Ionicons name="search" size={20} color="#999" />
//             )}
//           </View>

//           {dropdownVisible && filteredCustomers.length > 0 && (
//             <View className="absolute top-14 w-full bg-[#1E1E1E] border border-gray-700 rounded-xl max-h-60 z-50">
//               <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
//                 {filteredCustomers.map((item) => (
//                   <TouchableOpacity
//                     key={item}
//                     className="px-4 py-3 border-b border-gray-800"
//                     onPress={() => handleSelectCustomer(item)}
//                   >
//                     <Text className="text-white text-[15px]">{item}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           )}
//         </View>

//         {renderInputContainer("Subject", "Enter ticket subject")}
//         {renderInputContainer("Description", "Enter issue description", {
//           multiline: true,
//           numberOfLines: 4,
//           textAlignVertical: "top",
//         })}

//         {/* Priority Selector */}
//         <View className="space-y-2 mb-4">
//           <Text className="text-gray-300 text-[15px] font-medium ml-1">
//             Priority
//           </Text>
//           <View className="relative">
//             <TouchableOpacity
//               className="bg-[#1A1A1A] rounded-xl border border-gray-800 px-4 py-3.5 flex-row justify-between items-center"
//               onPress={() => {
//                 setPriorityVisible(!priorityVisible);
//                 Haptics.selectionAsync();
//               }}
//             >
//               <Text className="text-white text-[15px] font-medium">
//                 {priority || "Select priority"}
//               </Text>
//               <Ionicons
//                 name={priorityVisible ? "chevron-up" : "chevron-down"}
//                 size={18}
//                 color="#999"
//               />
//             </TouchableOpacity>

//             {priorityVisible && (
//               <View className="absolute top-14 w-full bg-[#1E1E1E] border border-gray-700 rounded-xl z-50">
//                 {priorities.map((item) => (
//                   <TouchableOpacity
//                     key={item}
//                     className="px-4 py-3 border-b border-gray-800"
//                     onPress={() => {
//                       setPriority(item);
//                       setPriorityVisible(false);
//                       Haptics.selectionAsync();
//                     }}
//                   >
//                     <Text className="text-white text-[15px]">{item}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </View>
//         </View>

//         {/* Status Selector */}
//         <View className="space-y-2 mb-4">
//           <Text className="text-gray-300 text-[15px] font-medium ml-1">
//             Status
//           </Text>
//           <View className="relative">
//             <TouchableOpacity
//               className="bg-[#1A1A1A] rounded-xl border border-gray-800 px-4 py-3.5 flex-row justify-between items-center"
//               onPress={() => {
//                 setStatusVisible(!statusVisible);
//                 Haptics.selectionAsync();
//               }}
//             >
//               <Text className="text-white text-[15px] font-medium">
//                 {status || "Select status"}
//               </Text>
//               <Ionicons
//                 name={statusVisible ? "chevron-up" : "chevron-down"}
//                 size={18}
//                 color="#999"
//               />
//             </TouchableOpacity>

//             {statusVisible && (
//               <View className="absolute top-14 w-full bg-[#1E1E1E] border border-gray-700 rounded-xl z-50">
//                 {statuses.map((item) => (
//                   <TouchableOpacity
//                     key={item}
//                     className="px-4 py-3 border-b border-gray-800"
//                     onPress={() => {
//                       setStatus(item);
//                       setStatusVisible(false);
//                       Haptics.selectionAsync();
//                     }}
//                   >
//                     <Text className="text-white text-[15px]">{item}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </View>
//         </View>

//         {/* Action Buttons */}
//         <View className="flex-row justify-end space-x-3 py-6 mb-5">
//           <TouchableOpacity
//             className="px-6 py-3 rounded-lg bg-gray-800"
//             onPress={() => {
//               Haptics.selectionAsync();
//               router.back();
//             }}
//           >
//             <Text className="text-white font-medium">Cancel</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             className="px-6 py-3 rounded-lg bg-amber-500"
//             onPress={() => {
//               Haptics.selectionAsync();
//               console.log("Ticket saved with:", {
//                 customer: selectedCustomer,
//                 priority,
//                 status,
//               });
//             }}
//           >
//             <Text className="text-black font-medium">Save</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default AddTicket;
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  Modal,
  Alert,
  ActivityIndicator,
  Image,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Text } from "@/components/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import {
  AntDesign,
  Ionicons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { api } from "@/services/api";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

// API calls
const fetchProducts = async () => {
  try {
    const response = await api.get("/products/");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const fetchProjects = async (productId) => {
  try {
    const response = await api.get(`/projects/?product=${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

const fetchPriorities = async () => {
  try {
    const response = await api.get("/priorities/");
    return response.data;
  } catch (error) {
    console.error("Error fetching priorities:", error);
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

const createTicket = async (ticketData) => {
  try {
    console.log("Creating ticket with data:", {
      title: ticketData.title,
      priority: ticketData.priority,
      project_id: ticketData.project_id,
      status: ticketData.status,
      assigned_to: ticketData.assigned_to,
      files_count: ticketData.files?.length || 0
    });

    const formData = new FormData();
    
    // Append basic fields
    formData.append('title', ticketData.title);
    formData.append('description', ticketData.description || '');
    formData.append('priority', ticketData.priority);
    formData.append('project_id', ticketData.project_id);
    formData.append('status', ticketData.status);
    formData.append('assigned_to', ticketData.assigned_to);
    
    // Append due date if provided
    if (ticketData.due_date) {
      formData.append('due_date', ticketData.due_date.toISOString().split('T')[0]);
    }
    
    // Append files if any - SIMPLIFIED FORMAT
    if (ticketData.files && ticketData.files.length > 0) {
      ticketData.files.forEach((file) => {
        // Use the exact same format as web - just append the file object directly
        formData.append('files', {
          uri: file.uri,
          type: file.mimeType || 'image/jpeg',
          name: file.fileName || `image_${Date.now()}.jpg`
        });
      });
    }

    console.log("FormData prepared, making API call...");
    
    const response = await api.post("/tickets/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    
    console.log("Ticket created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Detailed error creating ticket:", {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

// File Upload Component
const FileUploadSection = ({ files, onFilesChange }) => {
  const pickFiles = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const newFiles = result.assets.map((asset) => ({
          uri: asset.uri,
          fileName: asset.fileName || `image_${Date.now()}.jpg`,
          mimeType: asset.type || "image/jpeg",
          fileSize: asset.fileSize,
        }));
        onFilesChange([...files, ...newFiles]);
      }
    } catch (error) {
      console.error("Error picking images:", error);
      Alert.alert("Error", "Failed to pick images");
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <View className="mb-6">
      <Text className="text-gray-300 text-[15px] font-medium ml-1 mb-3">
        Attachments (Images Only)
      </Text>

      {/* Upload Button */}
      <TouchableOpacity
        onPress={pickFiles}
        className="bg-amber-500/20 p-4 rounded-xl items-center justify-center border border-amber-500/30 mb-4"
      >
        <Feather name="image" size={24} color="#F59E0B" />
        <Text
          className="text-amber-500 mt-2 text-center"
          fontFamily="KumbhSans-Medium"
        >
          Upload Images
        </Text>
      </TouchableOpacity>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <View>
          <Text className="text-gray-400 text-sm mb-2">
            Images ({files.length})
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-2">
              {files.map((file, index) => (
                <View key={index} className="relative">
                  <Image
                    source={{ uri: file.uri }}
                    className="w-20 h-20 rounded-lg"
                  />
                  <TouchableOpacity
                    onPress={() => removeFile(index)}
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
    </View>
  );
};

const AddTicket = () => {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Data states
  const [products, setProducts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [users, setUsers] = useState([]);

  // Dropdown visibility states
  const [productsVisible, setProductsVisible] = useState(false);
  const [projectsVisible, setProjectsVisible] = useState(false);
  const [priorityVisible, setPriorityVisible] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const [usersVisible, setUsersVisible] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    product_id: "",
    product_name: "",
    project_id: "",
    project_name: "",
    priority: "",
    priority_name: "",
    status: "new",
    status_name: "New",
    assigned_to: "",
    assigned_to_name: "",
    due_date: null,
    files: [],
  });

  const statusOptions = [
    { value: "new", label: "New" },
    { value: "assigned", label: "Assigned" },
    { value: "in_progress", label: "In Progress" },
    { value: "on_hold", label: "On Hold" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
    { value: "reopened", label: "Reopened" },
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, prioritiesData, usersData] = await Promise.all([
        fetchProducts(),
        fetchPriorities(),
        fetchUsers(),
      ]);
      setProducts(productsData || []);
      setPriorities(prioritiesData.results || []);
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

  const handleProductSelect = async (product) => {
    setFormData((prev) => ({
      ...prev,
      product_id: product.id,
      product_name: product.name,
      project_id: "",
      project_name: "",
    }));
    setProductsVisible(false);

    // Load projects for selected product
    try {
      const projectsData = await fetchProjects(product.id);
      setProjects(projectsData.results || []);
    } catch (error) {
      console.error("Error loading projects:", error);
      Alert.alert("Error", "Failed to load projects");
    }
  };

  const handleProjectSelect = (project) => {
    setFormData((prev) => ({
      ...prev,
      project_id: project.id,
      project_name: project.name,
    }));
    setProjectsVisible(false);
  };

  const handlePrioritySelect = (priority) => {
    setFormData((prev) => ({
      ...prev,
      priority: priority.id,
      priority_name: priority.name,
    }));
    setPriorityVisible(false);
  };

  const handleStatusSelect = (status) => {
    setFormData((prev) => ({
      ...prev,
      status: status.value,
      status_name: status.label,
    }));
    setStatusVisible(false);
  };

  const handleUserSelect = (user) => {
    setFormData((prev) => ({
      ...prev,
      assigned_to: user.id,
      assigned_to_name: user.username,
    }));
    setUsersVisible(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, due_date: selectedDate }));
    }
  };

  const handleFilesChange = (newFiles) => {
    setFormData((prev) => ({ ...prev, files: newFiles }));
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.priority ||
      !formData.project_id ||
      !formData.assigned_to
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await createTicket(formData);
      Alert.alert("Success", "Ticket created successfully");
      router.back();
    } catch (error) {
      console.error("Error submitting ticket:", error);
      let errorMessage = "Failed to create ticket";
      
      if (error.message === "Network Error") {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.response?.data) {
        errorMessage = error.response.data.detail || JSON.stringify(error.response.data);
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderInputContainer = (label, placeholder, extraProps = {}) => (
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

  const renderDropdownInput = (
    label,
    value,
    placeholder,
    onFocus,
    isVisible,
    data,
    onSelect
  ) => (
    <View className="space-y-2 mb-4">
      <Text className="text-gray-300 text-[15px] font-medium ml-1">
        {label}
      </Text>
      <View className="relative">
        <TouchableOpacity
          className="bg-[#1A1A1A] rounded-xl border border-gray-800 px-4 py-3.5 flex-row justify-between items-center"
          onPress={onFocus}
        >
          <Text className="text-white text-[15px] font-medium">
            {value || placeholder}
          </Text>
          <Ionicons
            name={isVisible ? "chevron-up" : "chevron-down"}
            size={18}
            color="#999"
          />
        </TouchableOpacity>

        {isVisible && (
          <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onFocus}
          >
            <View className="flex-1 bg-black/50 justify-center p-4">
              <View className="bg-[#1A1A1A] rounded-2xl max-h-[70%]">
                <View className="p-4 border-b border-gray-800">
                  <View className="flex-row justify-between items-center">
                    <Text
                      className="text-white text-lg"
                      fontFamily="KumbhSans-Bold"
                    >
                      Select {label}
                    </Text>
                    <TouchableOpacity onPress={onFocus}>
                      <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
                <FlatList
                  data={data}
                  keyExtractor={(item) => item.id?.toString() || item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => onSelect(item)}
                      className="p-4 border-b border-gray-800"
                    >
                      <Text
                        className="text-white text-lg"
                        fontFamily="KumbhSans-Medium"
                      >
                        {item.name || item.label || item.username}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        )}
      </View>
    </View>
  );

  if (loading && !products.length) {
    return (
      <SafeAreaView className="flex-1 bg-[#121212] justify-center items-center">
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text className="text-white mt-4" fontFamily="KumbhSans">
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

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
        {/* Title */}
        {renderInputContainer("Title *", "Enter ticket title", {
          value: formData.title,
          onChangeText: (text) =>
            setFormData((prev) => ({ ...prev, title: text })),
        })}

        {/* Description */}
        {renderInputContainer("Description", "Enter issue description", {
          multiline: true,
          numberOfLines: 4,
          textAlignVertical: "top",
          value: formData.description,
          onChangeText: (text) =>
            setFormData((prev) => ({ ...prev, description: text })),
        })}

        {/* Product Selection */}
        {renderDropdownInput(
          "Product *",
          formData.product_name,
          "Select product",
          () => setProductsVisible(!productsVisible),
          productsVisible,
          products,
          handleProductSelect
        )}

        {/* Project Selection */}
        {renderDropdownInput(
          "Project *",
          formData.project_name,
          formData.product_id ? "Select project" : "Select product first",
          () => formData.product_id && setProjectsVisible(!projectsVisible),
          projectsVisible,
          projects,
          handleProjectSelect
        )}

        {/* Due Date */}
        <View className="space-y-2 mb-4">
          <Text className="text-gray-300 text-[15px] font-medium ml-1">
            Due Date (Optional)
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-4"
          >
            <Text className="text-white text-[15px]">
              {formData.due_date
                ? formData.due_date.toLocaleDateString()
                : "Select due date"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Priority Selection */}
        {renderDropdownInput(
          "Priority *",
          formData.priority_name,
          "Select priority",
          () => setPriorityVisible(!priorityVisible),
          priorityVisible,
          priorities,
          handlePrioritySelect
        )}

        {/* Status Selection */}
        {renderDropdownInput(
          "Status *",
          formData.status_name,
          "Select status",
          () => setStatusVisible(!statusVisible),
          statusVisible,
          statusOptions,
          handleStatusSelect
        )}

        {/* Assigned To Selection */}
        {renderDropdownInput(
          "Assigned To *",
          formData.assigned_to_name,
          "Select user",
          () => setUsersVisible(!usersVisible),
          usersVisible,
          users,
          handleUserSelect
        )}

        {/* Image Upload Section */}
        {/* <FileUploadSection
          files={formData.files}
          onFilesChange={handleFilesChange}
        /> */}

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
              <Text className="text-black font-medium">Save Ticket</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.due_date || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </SafeAreaView>
  );
};

export default AddTicket;