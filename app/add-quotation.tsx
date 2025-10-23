// import {
//   FlatList,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Modal,
//   Alert,
//   ActivityIndicator,
//   Image,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import { Text } from "@/components/Text";
// import { SafeAreaView } from "react-native-safe-area-context";
// import * as Haptics from "expo-haptics";
// import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { api } from "@/services/api";
// import DateTimePicker from '@react-native-community/datetimepicker';

// // API calls
// const fetchClients = async () => {
//   try {
//     const response = await api.get("/clients/");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching clients:", error);
//     throw error;
//   }
// };

// const fetchStaff = async () => {
//   try {
//     const response = await api.get("/staff/");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching staff:", error);
//     throw error;
//   }
// };

// const fetchProducts = async () => {
//   try {
//     const response = await api.get("/products/");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     throw error;
//   }
// };

// const createQuotation = async (quotationData) => {
//   try {
//     const response = await api.post("/quotations/", quotationData);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating quotation:", error);
//     throw error;
//   }
// };

// // Generate quotation number (simple UUID-like for demo)
// const generateQuotationNumber = () => {
//   return `QT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
// };

// // Product Item Component
// const ProductItem = ({ product, index, onUpdate, onRemove }) => {
//   const [quantity, setQuantity] = useState(product.quantity || 1);
//   const [unitPrice, setUnitPrice] = useState(product.unit_price || 0);

//   const calculateSubtotal = () => {
//     return quantity * unitPrice;
//   };

//   const handleQuantityChange = (value) => {
//     const newQuantity = parseInt(value) || 0;
//     setQuantity(newQuantity);
//     onUpdate(index, { ...product, quantity: newQuantity, unit_price: unitPrice });
//   };

//   const handlePriceChange = (value) => {
//     const newPrice = parseFloat(value) || 0;
//     setUnitPrice(newPrice);
//     onUpdate(index, { ...product, quantity: quantity, unit_price: newPrice });
//   };

//   return (
//     <View className="bg-white/5 rounded-xl p-4 mb-3 border border-white/10">
//       <View className="flex-row justify-between items-start mb-3">
//         <Text className="text-white text-lg font-medium flex-1">
//           {product.name}
//         </Text>
//         <TouchableOpacity onPress={() => onRemove(index)} className="p-1">
//           <Ionicons name="close-circle" size={20} color="#f87171" />
//         </TouchableOpacity>
//       </View>

//       <View className="flex-row space-x-3">
//         <View className="flex-1">
//           <Text className="text-gray-400 text-sm mb-1">Quantity</Text>
//           <TextInput
//             className="bg-white/10 rounded-lg p-2 text-white"
//             value={quantity.toString()}
//             onChangeText={handleQuantityChange}
//             keyboardType="numeric"
//           />
//         </View>
//         <View className="flex-1">
//           <Text className="text-gray-400 text-sm mb-1">Unit Price</Text>
//           <TextInput
//             className="bg-white/10 rounded-lg p-2 text-white"
//             value={unitPrice.toString()}
//             onChangeText={handlePriceChange}
//             keyboardType="numeric"
//           />
//         </View>
//         <View className="flex-1">
//           <Text className="text-gray-400 text-sm mb-1">Subtotal</Text>
//           <Text className="text-white text-lg font-bold p-2">
//             ${calculateSubtotal().toFixed(2)}
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// // Terms and Conditions Modal
// const TermsModal = ({ visible, onClose, onSelect }) => {
//   const [customTerms, setCustomTerms] = useState("");
//   const [selectedOption, setSelectedOption] = useState("");

//   const termsOptions = [
//     {
//       value: "custom",
//       label: "Custom Terms",
//       content: ""
//     },
//     {
//       value: "standard",
//       label: "Standard Terms",
//       content: `- 50% of the total amount must be paid in advance
// - Balance must be paid before final product delivery
// - 10% of the total amount will be added in AMC yearly, including security and server charges
// - Any changes to the quotation must be confirmed in writing`
//     },
//     {
//       value: "strict",
//       label: "Strict Terms",
//       content: `- Full payment required upfront
// - No refunds after work begins
// - Changes subject to additional charges
// - 30 days validity period`
//     },
//     {
//       value: "flexible",
//       label: "Flexible Terms",
//       content: `- 30% advance payment
// - Monthly installments available
// - Free support for 3 months
// - Flexible payment terms available`
//     }
//   ];

//   const handleSelect = (option) => {
//     setSelectedOption(option.value);
//     if (option.value !== "custom") {
//       setCustomTerms(option.content);
//     }
//   };

//   const handleApply = () => {
//     onSelect(customTerms);
//     onClose();
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent={true}>
//       <View className="flex-1 bg-black/50 justify-center p-4">
//         <View className="bg-[#1A1A1A] rounded-2xl p-6 max-h-[90%]">
//           <View className="flex-row justify-between items-center mb-6">
//             <Text className="text-white text-xl" fontFamily="KumbhSans-Bold">
//               Terms and Conditions
//             </Text>
//             <TouchableOpacity onPress={onClose}>
//               <Ionicons name="close" size={24} color="white" />
//             </TouchableOpacity>
//           </View>

//           <ScrollView>
//             <View className="space-y-4">
//               {termsOptions.map((option) => (
//                 <TouchableOpacity
//                   key={option.value}
//                   onPress={() => handleSelect(option)}
//                   className={`p-4 rounded-xl border ${
//                     selectedOption === option.value
//                       ? "border-amber-500 bg-amber-500/10"
//                       : "border-gray-700 bg-white/5"
//                   }`}
//                 >
//                   <Text className="text-white font-medium">{option.label}</Text>
//                   {option.value !== "custom" && selectedOption === option.value && (
//                     <Text className="text-gray-400 text-sm mt-2">
//                       {option.content}
//                     </Text>
//                   )}
//                 </TouchableOpacity>
//               ))}

//               {selectedOption === "custom" && (
//                 <View>
//                   <Text className="text-gray-300 mb-2">Custom Terms</Text>
//                   <TextInput
//                     className="bg-white/10 rounded-xl p-3 text-white border border-gray-700 min-h-[120px]"
//                     placeholder="Enter your custom terms and conditions..."
//                     placeholderTextColor="#666"
//                     multiline
//                     textAlignVertical="top"
//                     value={customTerms}
//                     onChangeText={setCustomTerms}
//                   />
//                 </View>
//               )}
//             </View>

//             <View className="flex-row space-x-3 mt-6">
//               <TouchableOpacity
//                 onPress={onClose}
//                 className="flex-1 bg-gray-700 p-3 rounded-xl"
//               >
//                 <Text className="text-white text-center">Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={handleApply}
//                 className="flex-1 bg-amber-500 p-3 rounded-xl"
//               >
//                 <Text className="text-black text-center">Apply Terms</Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const AddQuotation = () => {
//   const [focusedInput, setFocusedInput] = useState<string | null>(null);
//   const [clients, setClients] = useState([]);
//   const [staff, setStaff] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showClientModal, setShowClientModal] = useState(false);
//   const [showClientDropdown, setShowClientDropdown] = useState(false);
//   const [showStaffDropdown, setShowStaffDropdown] = useState(false);
//   const [showProductsDropdown, setShowProductsDropdown] = useState(false);
//   const [showTermsModal, setShowTermsModal] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   const [formData, setFormData] = useState({
//     quotation_number: generateQuotationNumber(),
//     version: "1",
//     status: "DRAFT",
//     valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
//     client: "",
//     client_name: "",
//     client_reference: "",
//     assigned_to: "",
//     assigned_to_name: "",
//     subtotal: 0,
//     discount_amount: 0,
//     total_amount: 0,
//     notes: "",
//     terms_and_conditions: "",
//     items: []
//   });

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const [clientsData, staffData, productsData] = await Promise.all([
//         fetchClients(),
//         fetchStaff(),
//         fetchProducts()
//       ]);
//       setClients(clientsData.results || []);
//       setStaff(staffData || []);
//       setProducts(productsData || []);
//     } catch (error) {
//       Alert.alert("Error", "Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   useEffect(() => {
//     // Calculate totals whenever items change
//     const subtotal = formData.items.reduce((sum, item) => {
//       return sum + (item.quantity * item.unit_price);
//     }, 0);
    
//     const total = subtotal - formData.discount_amount;
    
//     setFormData(prev => ({
//       ...prev,
//       subtotal: subtotal,
//       total_amount: total
//     }));
//   }, [formData.items, formData.discount_amount]);

//   const handleClientSelect = (client) => {
//     setFormData((prev) => ({
//       ...prev,
//       client: client.id,
//       client_name: client.name || client.company_name,
//     }));
//     setShowClientDropdown(false);
//   };

//   const handleStaffSelect = (staffMember) => {
//     setFormData((prev) => ({
//       ...prev,
//       assigned_to: staffMember.id,
//       assigned_to_name: staffMember.name || staffMember.username,
//     }));
//     setShowStaffDropdown(false);
//   };

//   const handleProductSelect = (product) => {
//     const newItem = {
//       product: product.id,
//       name: product.name,
//       description: "",
//       quantity: 1,
//       unit_price: product.selling_price || 0,
//       discount_percentage: 0,
//       subtotal: product.selling_price || 0
//     };
    
//     setFormData(prev => ({
//       ...prev,
//       items: [...prev.items, newItem]
//     }));
//     setShowProductsDropdown(false);
//   };

//   const updateProductItem = (index, updatedItem) => {
//     const newItems = [...formData.items];
//     newItems[index] = {
//       ...updatedItem,
//       subtotal: updatedItem.quantity * updatedItem.unit_price
//     };
//     setFormData(prev => ({ ...prev, items: newItems }));
//   };

//   const removeProductItem = (index) => {
//     const newItems = formData.items.filter((_, i) => i !== index);
//     setFormData(prev => ({ ...prev, items: newItems }));
//   };

//   const handleDateChange = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       setFormData(prev => ({ ...prev, valid_until: selectedDate }));
//     }
//   };

//   const handleSubmit = async () => {
//     if (!formData.client || !formData.assigned_to || formData.items.length === 0) {
//       Alert.alert("Error", "Please fill all required fields and add at least one product");
//       return;
//     }

//     const payload = {
//       ...formData,
//       valid_until: formData.valid_until.toISOString().split('T')[0],
//       items: formData.items.map(item => ({
//         product: item.product,
//         description: item.description,
//         quantity: item.quantity,
//         unit_price: item.unit_price,
//         discount_percentage: item.discount_percentage,
//         subtotal: item.subtotal
//       }))
//     };

//     setLoading(true);
//     try {
//       await createQuotation(payload);
//       Alert.alert("Success", "Quotation created successfully");
//       router.back();
//     } catch (error) {
//       Alert.alert("Error", "Failed to create quotation");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderInputContainer = (label, placeholder, extraProps = {}) => (
//     <View className="space-y-2 mb-4">
//       <Text className="text-gray-300 text-[15px] font-medium ml-1">
//         {label}
//       </Text>
//       <View className={`
//         bg-[#1A1A1A] rounded-xl overflow-hidden border 
//         ${focusedInput === label ? "border-amber-500" : "border-gray-800"}
//       `}>
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

//   const renderDropdownInput = (label, value, placeholder, onFocus) => (
//     <View className="space-y-2 mb-4">
//       <Text className="text-gray-300 text-[15px] font-medium ml-1">
//         {label}
//       </Text>
//       <TouchableOpacity
//         onPress={onFocus}
//         className={`
//           bg-[#1A1A1A] rounded-xl border p-4
//           ${focusedInput === label ? "border-amber-500" : "border-gray-800"}
//         `}
//       >
//         <Text className={`text-[15px] font-medium font-[KumbhSans] ${value ? "text-white" : "text-gray-500"}`}>
//           {value || placeholder}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const statusOptions = [
//     { value: "DRAFT", label: "Draft" },
//     { value: "SENT", label: "Sent to client" },
//     { value: "APPROVED", label: "Approved" },
//     { value: "ACCEPTED", label: "Accepted" },
//     { value: "REJECTED", label: "Rejected" },
//     { value: "EXPIRED", label: "Expired" }
//   ];

//   return (
//     <SafeAreaView className="flex-1 bg-[#121212]">
//       <View className="px-4 py-3 border-b border-gray-800 flex-row justify-start items-center space-x-3">
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back-sharp" size={24} color="white" />
//         </TouchableOpacity>
//         <Text className="text-2xl text-white " fontFamily="KumbhSans-Bold">
//           New Quotation
//         </Text>
//       </View>

//       <ScrollView className="flex-1 px-4 pt-3">
//         {/* Quotation Number & Version */}
//         <View className="flex-row space-x-3">
//           <View className="flex-1">
//             {renderInputContainer("Quotation Number", "Quotation number", {
//               value: formData.quotation_number,
//               editable: false
//             })}
//           </View>
//           <View className="flex-1">
//             {renderInputContainer("Version", "Version", {
//               value: formData.version,
//               onChangeText: (text) => setFormData(prev => ({ ...prev, version: text }))
//             })}
//           </View>
//         </View>

//         {/* Status */}
//         <View className="space-y-2 mb-4">
//           <Text className="text-gray-300 text-[15px] font-medium ml-1">Status</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             <View className="flex-row space-x-2">
//               {statusOptions.map((status) => (
//                 <TouchableOpacity
//                   key={status.value}
//                   onPress={() => setFormData(prev => ({ ...prev, status: status.value }))}
//                   className={`px-4 py-2 rounded-full ${
//                     formData.status === status.value
//                       ? "bg-amber-500"
//                       : "bg-white/5 border border-white/10"
//                   }`}
//                 >
//                   <Text className={formData.status === status.value ? "text-black font-medium" : "text-gray-400"}>
//                     {status.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </ScrollView>
//         </View>

//         {/* Client Selection */}
//         {renderDropdownInput(
//           "Client *",
//           formData.client_name,
//           "Select client",
//           () => setShowClientDropdown(true)
//         )}

//         {/* Assigned To */}
//         {renderDropdownInput(
//           "Assigned To *",
//           formData.assigned_to_name,
//           "Select staff member",
//           () => setShowStaffDropdown(true)
//         )}

//         {/* Valid Until */}
//         <View className="space-y-2 mb-4">
//           <Text className="text-gray-300 text-[15px] font-medium ml-1">
//             Valid Until
//           </Text>
//           <TouchableOpacity
//             onPress={() => setShowDatePicker(true)}
//             className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-4"
//           >
//             <Text className="text-white text-[15px]">
//               {formData.valid_until.toLocaleDateString()}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Client Reference */}
//         {renderInputContainer("Client Reference", "Enter client reference", {
//           value: formData.client_reference,
//           onChangeText: (text) => setFormData(prev => ({ ...prev, client_reference: text }))
//         })}

//         {/* Products Section */}
//         <View className="mb-6">
//           <View className="flex-row justify-between items-center mb-3">
//             <Text className="text-gray-300 text-[15px] font-medium">
//               Products ({formData.items.length})
//             </Text>
//             <TouchableOpacity
//               onPress={() => setShowProductsDropdown(true)}
//               className="bg-amber-500 px-4 py-2 rounded-xl flex-row items-center space-x-2"
//             >
//               <Ionicons name="add" size={18} color="black" />
//               <Text className="text-black font-medium">Add Product</Text>
//             </TouchableOpacity>
//           </View>

//           {formData.items.map((item, index) => (
//             <ProductItem
//               key={index}
//               product={item}
//               index={index}
//               onUpdate={updateProductItem}
//               onRemove={removeProductItem}
//             />
//           ))}

//           {formData.items.length === 0 && (
//             <View className="bg-white/5 rounded-xl p-8 items-center justify-center border border-dashed border-white/10">
//               <Feather name="package" size={32} color="#666" />
//               <Text className="text-gray-400 mt-2 text-center">
//                 No products added yet
//               </Text>
//               <Text className="text-gray-500 text-sm text-center mt-1">
//                 Click "Add Product" to start adding items
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* Totals Section */}
//         {formData.items.length > 0 && (
//           <View className="bg-white/5 rounded-xl p-4 mb-6">
//             <View className="flex-row justify-between mb-2">
//               <Text className="text-gray-400">Subtotal</Text>
//               <Text className="text-white font-bold">${formData.subtotal.toFixed(2)}</Text>
//             </View>
//             <View className="flex-row justify-between mb-2">
//               <Text className="text-gray-400">Discount</Text>
//               <TextInput
//                 className="text-white font-bold bg-transparent text-right"
//                 value={formData.discount_amount.toString()}
//                 onChangeText={(text) => setFormData(prev => ({ 
//                   ...prev, 
//                   discount_amount: parseFloat(text) || 0 
//                 }))}
//                 keyboardType="numeric"
//                 placeholder="0"
//               />
//             </View>
//             <View className="flex-row justify-between border-t border-white/10 pt-2">
//               <Text className="text-white text-lg font-bold">Total</Text>
//               <Text className="text-white text-lg font-bold">
//                 ${formData.total_amount.toFixed(2)}
//               </Text>
//             </View>
//           </View>
//         )}

//         {/* Notes */}
//         {renderInputContainer("Notes", "Enter any notes", {
//           multiline: true,
//           numberOfLines: 3,
//           textAlignVertical: "top",
//           value: formData.notes,
//           onChangeText: (text) => setFormData(prev => ({ ...prev, notes: text }))
//         })}

//         {/* Terms and Conditions */}
//         <View className="mb-6">
//           <View className="flex-row justify-between items-center mb-2">
//             <Text className="text-gray-300 text-[15px] font-medium">
//               Terms and Conditions
//             </Text>
//             <TouchableOpacity
//               onPress={() => setShowTermsModal(true)}
//               className="bg-blue-500/20 px-3 py-1 rounded-lg"
//             >
//               <Text className="text-blue-400 text-sm">Select Terms</Text>
//             </TouchableOpacity>
//           </View>
//           <TextInput
//             className="bg-[#1A1A1A] rounded-xl p-4 text-white border border-gray-800 min-h-[100px]"
//             placeholder="Select or enter terms and conditions..."
//             placeholderTextColor="#666"
//             multiline
//             textAlignVertical="top"
//             value={formData.terms_and_conditions}
//             onChangeText={(text) => setFormData(prev => ({ ...prev, terms_and_conditions: text }))}
//           />
//         </View>

//         {/* Action Buttons */}
//         <View className="flex-row justify-end space-x-3 py-6 mb-5">
//           <TouchableOpacity
//             className="px-6 py-3 rounded-lg bg-gray-800"
//             onPress={() => router.back()}
//             disabled={loading}
//           >
//             <Text className="text-white font-medium">Cancel</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             className="px-6 py-3 rounded-lg bg-amber-500 flex-row items-center"
//             onPress={handleSubmit}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="black" size="small" />
//             ) : (
//               <Text className="text-black font-medium">Create Quotation</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Client Dropdown Modal */}
//       <Modal visible={showClientDropdown} transparent animationType="slide">
//         <View className="flex-1 bg-black/50 justify-center p-4">
//           <View className="bg-[#1A1A1A] rounded-2xl max-h-[70%]">
//             <View className="p-4 border-b border-gray-800">
//               <View className="flex-row justify-between items-center">
//                 <Text className="text-white text-lg" fontFamily="KumbhSans-Bold">
//                   Select Client
//                 </Text>
//                 <TouchableOpacity onPress={() => setShowClientDropdown(false)}>
//                   <Ionicons name="close" size={24} color="white" />
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <FlatList
//               data={clients}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   onPress={() => handleClientSelect(item)}
//                   className="p-4 border-b border-gray-800"
//                 >
//                   <Text className="text-white text-lg" fontFamily="KumbhSans-Medium">
//                     {item.name || item.company_name}
//                   </Text>
//                   <Text className="text-gray-400 text-sm">
//                     {item.mobile_number}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       </Modal>

//       {/* Staff Dropdown Modal */}
//       <Modal visible={showStaffDropdown} transparent animationType="slide">
//         <View className="flex-1 bg-black/50 justify-center p-4">
//           <View className="bg-[#1A1A1A] rounded-2xl max-h-[70%]">
//             <View className="p-4 border-b border-gray-800">
//               <View className="flex-row justify-between items-center">
//                 <Text className="text-white text-lg" fontFamily="KumbhSans-Bold">
//                   Select Staff
//                 </Text>
//                 <TouchableOpacity onPress={() => setShowStaffDropdown(false)}>
//                   <Ionicons name="close" size={24} color="white" />
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <FlatList
//               data={staff}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   onPress={() => handleStaffSelect(item)}
//                   className="p-4 border-b border-gray-800"
//                 >
//                   <Text className="text-white text-lg" fontFamily="KumbhSans-Medium">
//                     {item.name || item.username}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       </Modal>

//       {/* Products Dropdown Modal */}
//       <Modal visible={showProductsDropdown} transparent animationType="slide">
//         <View className="flex-1 bg-black/50 justify-center p-4">
//           <View className="bg-[#1A1A1A] rounded-2xl max-h-[70%]">
//             <View className="p-4 border-b border-gray-800">
//               <View className="flex-row justify-between items-center">
//                 <Text className="text-white text-lg" fontFamily="KumbhSans-Bold">
//                   Select Product
//                 </Text>
//                 <TouchableOpacity onPress={() => setShowProductsDropdown(false)}>
//                   <Ionicons name="close" size={24} color="white" />
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <FlatList
//               data={products}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   onPress={() => handleProductSelect(item)}
//                   className="p-4 border-b border-gray-800"
//                 >
//                   <Text className="text-white text-lg" fontFamily="KumbhSans-Medium">
//                     {item.name}
//                   </Text>
//                   <Text className="text-gray-400 text-sm">
//                     ${item.selling_price || 0}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       </Modal>

//       {/* Terms Modal */}
//       <TermsModal
//         visible={showTermsModal}
//         onClose={() => setShowTermsModal(false)}
//         onSelect={(terms) => setFormData(prev => ({ ...prev, terms_and_conditions: terms }))}
//       />

//       {/* Date Picker */}
//       {showDatePicker && (
//         <DateTimePicker
//           value={formData.valid_until}
//           mode="date"
//           display="default"
//           onChange={handleDateChange}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// export default AddQuotation;

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
import { api } from "@/services/api";
import DateTimePicker from '@react-native-community/datetimepicker';

// API calls
const fetchClients = async () => {
  try {
    const response = await api.get("/clients/");
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

const fetchStaff = async () => {
  try {
    const response = await api.get("/staff/");
    return response.data;
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
};

const fetchProducts = async () => {
  try {
    const response = await api.get("/products/");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
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

const createQuotation = async (quotationData) => {
  try {
    const response = await api.post("/quotations/", quotationData);
    return response.data;
  } catch (error) {
    console.error("Error creating quotation:", error);
    throw error;
  }
};

// Generate quotation number (simple UUID-like for demo)
const generateQuotationNumber = () => {
  return `QT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Create Client Modal
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

// Product Item Component
const ProductItem = ({ product, index, onUpdate, onRemove }) => {
  const [quantity, setQuantity] = useState(product.quantity || 1);
  const [unitPrice, setUnitPrice] = useState(product.unit_price || 0);

  const calculateSubtotal = () => {
    return quantity * unitPrice;
  };

  const handleQuantityChange = (value) => {
    const newQuantity = parseInt(value) || 0;
    setQuantity(newQuantity);
    onUpdate(index, { ...product, quantity: newQuantity, unit_price: unitPrice });
  };

  const handlePriceChange = (value) => {
    const newPrice = parseFloat(value) || 0;
    setUnitPrice(newPrice);
    onUpdate(index, { ...product, quantity: quantity, unit_price: newPrice });
  };

  return (
    <View className="bg-white/5 rounded-xl p-4 mb-3 border border-white/10">
      <View className="flex-row justify-between items-start mb-3">
        <Text className="text-white text-lg font-medium flex-1">
          {product.name}
        </Text>
        <TouchableOpacity onPress={() => onRemove(index)} className="p-1">
          <Ionicons name="close-circle" size={20} color="#f87171" />
        </TouchableOpacity>
      </View>

      <View className="flex-row space-x-3">
        <View className="flex-1">
          <Text className="text-gray-400 text-sm mb-1">Quantity</Text>
          <TextInput
            className="bg-white/10 rounded-lg p-2 text-white"
            value={quantity.toString()}
            onChangeText={handleQuantityChange}
            keyboardType="numeric"
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-400 text-sm mb-1">Unit Price</Text>
          <TextInput
            className="bg-white/10 rounded-lg p-2 text-white"
            value={unitPrice.toString()}
            onChangeText={handlePriceChange}
            keyboardType="numeric"
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-400 text-sm mb-1">Subtotal</Text>
          <Text className="text-white text-lg font-bold p-2">
            ${calculateSubtotal().toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Terms and Conditions Modal
const TermsModal = ({ visible, onClose, onSelect }) => {
  const [customTerms, setCustomTerms] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const termsOptions = [
    {
      value: "custom",
      label: "Custom Terms",
      content: ""
    },
    {
      value: "standard",
      label: "Standard Terms",
      content: `- 50% of the total amount must be paid in advance
- Balance must be paid before final product delivery
- 10% of the total amount will be added in AMC yearly, including security and server charges
- Any changes to the quotation must be confirmed in writing`
    },
    {
      value: "strict",
      label: "Strict Terms",
      content: `- Full payment required upfront
- No refunds after work begins
- Changes subject to additional charges
- 30 days validity period`
    },
    {
      value: "flexible",
      label: "Flexible Terms",
      content: `- 30% advance payment
- Monthly installments available
- Free support for 3 months
- Flexible payment terms available`
    }
  ];

  const handleSelect = (option) => {
    setSelectedOption(option.value);
    if (option.value !== "custom") {
      setCustomTerms(option.content);
    }
  };

  const handleApply = () => {
    onSelect(customTerms);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 bg-black/50 justify-center p-4">
        <View className="bg-[#1A1A1A] rounded-2xl p-6 max-h-[90%]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white text-xl" fontFamily="KumbhSans-Bold">
              Terms and Conditions
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View className="space-y-4">
              {termsOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelect(option)}
                  className={`p-4 rounded-xl border ${
                    selectedOption === option.value
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-gray-700 bg-white/5"
                  }`}
                >
                  <Text className="text-white font-medium">{option.label}</Text>
                  {option.value !== "custom" && selectedOption === option.value && (
                    <Text className="text-gray-400 text-sm mt-2">
                      {option.content}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}

              {selectedOption === "custom" && (
                <View>
                  <Text className="text-gray-300 mb-2">Custom Terms</Text>
                  <TextInput
                    className="bg-white/10 rounded-xl p-3 text-white border border-gray-700 min-h-[120px]"
                    placeholder="Enter your custom terms and conditions..."
                    placeholderTextColor="#666"
                    multiline
                    textAlignVertical="top"
                    value={customTerms}
                    onChangeText={setCustomTerms}
                  />
                </View>
              )}
            </View>

            <View className="flex-row space-x-3 mt-6">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-gray-700 p-3 rounded-xl"
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApply}
                className="flex-1 bg-amber-500 p-3 rounded-xl"
              >
                <Text className="text-black text-center">Apply Terms</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const AddQuotation = () => {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [clients, setClients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formData, setFormData] = useState({
    quotation_number: generateQuotationNumber(),
    version: "1",
    status: "DRAFT",
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    client: "",
    client_name: "",
    client_reference: "",
    assigned_to: "",
    assigned_to_name: "",
    subtotal: 0,
    discount_amount: 0,
    total_amount: 0,
    notes: "",
    terms_and_conditions: "",
    items: []
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [clientsData, staffData, productsData] = await Promise.all([
        fetchClients(),
        fetchStaff(),
        fetchProducts()
      ]);
      setClients(clientsData.results || []);
      setStaff(staffData || []);
      setProducts(productsData || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Calculate totals whenever items change
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unit_price);
    }, 0);
    
    const total = subtotal - formData.discount_amount;
    
    setFormData(prev => ({
      ...prev,
      subtotal: subtotal,
      total_amount: total
    }));
  }, [formData.items, formData.discount_amount]);

  const handleClientSelect = (client) => {
    setFormData((prev) => ({
      ...prev,
      client: client.id,
      client_name: client.name || client.company_name,
    }));
    setShowClientDropdown(false);
  };

  const handleStaffSelect = (staffMember) => {
    setFormData((prev) => ({
      ...prev,
      assigned_to: staffMember.id,
      assigned_to_name: staffMember.name || staffMember.username,
    }));
    setShowStaffDropdown(false);
  };

  const handleProductSelect = (product) => {
    const newItem = {
      product: product.id,
      name: product.name,
      description: "",
      quantity: 1,
      unit_price: product.selling_price || 0,
      discount_percentage: 0,
      subtotal: product.selling_price || 0
    };
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    setShowProductsDropdown(false);
  };

  const updateProductItem = (index, updatedItem) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...updatedItem,
      subtotal: updatedItem.quantity * updatedItem.unit_price
    };
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const removeProductItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, valid_until: selectedDate }));
    }
  };

  const handleClientCreated = (newClient) => {
    setClients((prev) => [newClient, ...prev]);
    handleClientSelect(newClient);
  };

  const handleSubmit = async () => {
    if (!formData.client || !formData.assigned_to || formData.items.length === 0) {
      Alert.alert("Error", "Please fill all required fields and add at least one product");
      return;
    }

    const payload = {
      ...formData,
      valid_until: formData.valid_until.toISOString().split('T')[0],
      items: formData.items.map(item => ({
        product: item.product,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_percentage: item.discount_percentage,
        subtotal: item.subtotal
      }))
    };

    setLoading(true);
    try {
      await createQuotation(payload);
      Alert.alert("Success", "Quotation created successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to create quotation");
    } finally {
      setLoading(false);
    }
  };

  const renderInputContainer = (label, placeholder, extraProps = {}) => (
    <View className="space-y-2 mb-4">
      <Text className="text-gray-300 text-[15px] font-medium ml-1">
        {label}
      </Text>
      <View className={`
        bg-[#1A1A1A] rounded-xl overflow-hidden border 
        ${focusedInput === label ? "border-amber-500" : "border-gray-800"}
      `}>
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

  const renderDropdownInput = (label, value, placeholder, onFocus, showPlusButton = false, onPlusPress = () => {}) => (
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
          bg-[#1A1A1A] rounded-xl border p-4
          ${focusedInput === label ? "border-amber-500" : "border-gray-800"}
        `}
      >
        <Text className={`text-[15px] font-medium font-[KumbhSans] ${value ? "text-white" : "text-gray-500"}`}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const statusOptions = [
    { value: "DRAFT", label: "Draft" },
    { value: "SENT", label: "Sent to client" },
    { value: "APPROVED", label: "Approved" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "REJECTED", label: "Rejected" },
    { value: "EXPIRED", label: "Expired" }
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <View className="px-4 py-3 border-b border-gray-800 flex-row justify-start items-center space-x-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-sharp" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl text-white " fontFamily="KumbhSans-Bold">
          New Quotation
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-3">
        {/* Quotation Number & Version */}
        <View className="flex-row space-x-3">
          <View className="flex-1">
            {renderInputContainer("Quotation Number", "Quotation number", {
              value: formData.quotation_number,
              editable: false
            })}
          </View>
          <View className="flex-1">
            {renderInputContainer("Version", "Version", {
              value: formData.version,
              onChangeText: (text) => setFormData(prev => ({ ...prev, version: text }))
            })}
          </View>
        </View>

        {/* Status */}
        <View className="space-y-2 mb-4">
          <Text className="text-gray-300 text-[15px] font-medium ml-1">Status</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-2">
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status.value}
                  onPress={() => setFormData(prev => ({ ...prev, status: status.value }))}
                  className={`px-4 py-2 rounded-full ${
                    formData.status === status.value
                      ? "bg-amber-500"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  <Text className={formData.status === status.value ? "text-black font-medium" : "text-gray-400"}>
                    {status.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Client Selection */}
        {renderDropdownInput(
          "Client *",
          formData.client_name,
          "Select client",
          () => setShowClientDropdown(true),
          true,
          () => setShowClientModal(true)
        )}

        {/* Assigned To */}
        {renderDropdownInput(
          "Assigned To *",
          formData.assigned_to_name,
          "Select staff member",
          () => setShowStaffDropdown(true)
        )}

        {/* Valid Until */}
        <View className="space-y-2 mb-4">
          <Text className="text-gray-300 text-[15px] font-medium ml-1">
            Valid Until
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-4"
          >
            <Text className="text-white text-[15px]">
              {formData.valid_until.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Client Reference */}
        {renderInputContainer("Client Reference", "Enter client reference", {
          value: formData.client_reference,
          onChangeText: (text) => setFormData(prev => ({ ...prev, client_reference: text }))
        })}

        {/* Products Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-300 text-[15px] font-medium">
              Products ({formData.items.length})
            </Text>
            <TouchableOpacity
              onPress={() => setShowProductsDropdown(true)}
              className="bg-amber-500 px-4 py-2 rounded-xl flex-row items-center space-x-2"
            >
              <Ionicons name="add" size={18} color="black" />
              <Text className="text-black font-medium">Add Product</Text>
            </TouchableOpacity>
          </View>

          {formData.items.map((item, index) => (
            <ProductItem
              key={index}
              product={item}
              index={index}
              onUpdate={updateProductItem}
              onRemove={removeProductItem}
            />
          ))}

          {formData.items.length === 0 && (
            <View className="bg-white/5 rounded-xl p-8 items-center justify-center border border-dashed border-white/10">
              <Feather name="package" size={32} color="#666" />
              <Text className="text-gray-400 mt-2 text-center">
                No products added yet
              </Text>
              <Text className="text-gray-500 text-sm text-center mt-1">
                Click "Add Product" to start adding items
              </Text>
            </View>
          )}
        </View>

        {/* Totals Section */}
        {formData.items.length > 0 && (
          <View className="bg-white/5 rounded-xl p-4 mb-6">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">Subtotal</Text>
              <Text className="text-white font-bold">${formData.subtotal.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">Discount</Text>
              <TextInput
                className="text-white font-bold bg-transparent text-right"
                value={formData.discount_amount.toString()}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  discount_amount: parseFloat(text) || 0 
                }))}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
            <View className="flex-row justify-between border-t border-white/10 pt-2">
              <Text className="text-white text-lg font-bold">Total</Text>
              <Text className="text-white text-lg font-bold">
                ${formData.total_amount.toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Notes */}
        {renderInputContainer("Notes", "Enter any notes", {
          multiline: true,
          numberOfLines: 3,
          textAlignVertical: "top",
          value: formData.notes,
          onChangeText: (text) => setFormData(prev => ({ ...prev, notes: text }))
        })}

        {/* Terms and Conditions */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-300 text-[15px] font-medium">
              Terms and Conditions
            </Text>
            <TouchableOpacity
              onPress={() => setShowTermsModal(true)}
              className="bg-blue-500/20 px-3 py-1 rounded-lg"
            >
              <Text className="text-blue-400 text-sm">Select Terms</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            className="bg-[#1A1A1A] rounded-xl p-4 text-white border border-gray-800 min-h-[100px]"
            placeholder="Select or enter terms and conditions..."
            placeholderTextColor="#666"
            multiline
            textAlignVertical="top"
            value={formData.terms_and_conditions}
            onChangeText={(text) => setFormData(prev => ({ ...prev, terms_and_conditions: text }))}
          />
        </View>

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
              <Text className="text-black font-medium">Create Quotation</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Client Dropdown Modal */}
      <Modal visible={showClientDropdown} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center p-4">
          <View className="bg-[#1A1A1A] rounded-2xl max-h-[70%]">
            <View className="p-4 border-b border-gray-800">
              <View className="flex-row justify-between items-center">
                <Text className="text-white text-lg" fontFamily="KumbhSans-Bold">
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
                  <Text className="text-white text-lg" fontFamily="KumbhSans-Medium">
                    {item.name || item.company_name}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    {item.mobile_number}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Staff Dropdown Modal */}
      <Modal visible={showStaffDropdown} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center p-4">
          <View className="bg-[#1A1A1A] rounded-2xl max-h-[70%]">
            <View className="p-4 border-b border-gray-800">
              <View className="flex-row justify-between items-center">
                <Text className="text-white text-lg" fontFamily="KumbhSans-Bold">
                  Select Staff
                </Text>
                <TouchableOpacity onPress={() => setShowStaffDropdown(false)}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <FlatList
              data={staff}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleStaffSelect(item)}
                  className="p-4 border-b border-gray-800"
                >
                  <Text className="text-white text-lg" fontFamily="KumbhSans-Medium">
                    {item.name || item.username}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Products Dropdown Modal */}
      <Modal visible={showProductsDropdown} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center p-4">
          <View className="bg-[#1A1A1A] rounded-2xl max-h-[70%]">
            <View className="p-4 border-b border-gray-800">
              <View className="flex-row justify-between items-center">
                <Text className="text-white text-lg" fontFamily="KumbhSans-Bold">
                  Select Product
                </Text>
                <TouchableOpacity onPress={() => setShowProductsDropdown(false)}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <FlatList
              data={products}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleProductSelect(item)}
                  className="p-4 border-b border-gray-800"
                >
                  <Text className="text-white text-lg" fontFamily="KumbhSans-Medium">
                    {item.name}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    ${item.selling_price || 0}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Terms Modal */}
      <TermsModal
        visible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onSelect={(terms) => setFormData(prev => ({ ...prev, terms_and_conditions: terms }))}
      />

      {/* Create Client Modal */}
      <CreateClientModal
        visible={showClientModal}
        onClose={() => setShowClientModal(false)}
        onClientCreated={handleClientCreated}
      />

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.valid_until}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </SafeAreaView>
  );
};

export default AddQuotation;