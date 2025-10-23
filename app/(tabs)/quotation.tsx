import {
  FlatList,
  Pressable,
  TextInput,
  View,
  Modal,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { api } from "@/services/api";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

// API call to fetch quotations
const fetchQuotations = async () => {
  try {
    const response = await api.get("/quotations/");
    return response.data;
  } catch (error) {
    console.error("Error fetching quotations:", error);
    throw error;
  }
};

// Detail Modal Component
const DetailModal = ({ visible, onClose, quotation }) => {
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const handleCall = () => {
    if (quotation?.client_number) {
      Linking.openURL(`tel:${quotation.client_number}`);
    }
  };

  const handleWhatsApp = () => {
    if (quotation?.client_number) {
      const message = `Hello ${quotation.client_name}, regarding your quotation ${quotation.quotation_number}`;
      Linking.openURL(
        `whatsapp://send?phone=${
          quotation.client_number
        }&text=${encodeURIComponent(message)}`
      );
    }
  };

  const generatePDF = async () => {
    if (!quotation) return;

    setGeneratingPDF(true);
    try {
      const htmlContent = generateHTMLContent(quotation);

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: `Quotation_${quotation.quotation_number}`,
        });
      } else {
        Alert.alert("Success", `PDF saved to: ${uri}`);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Failed to generate PDF");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const generateHTMLContent = (quotation) => {
    const formatCurrency = (value) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "QAR",
      }).format(value || 0);
    };

    const formatDate = (dateString) => {
      if (!dateString) return "-";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch {
        return dateString;
      }
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quotation ${quotation.quotation_number}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.3;
            margin: 0;
            padding: 10mm;
            color: #333;
          }
          .print-header {
            text-align: center;
            border-bottom: 0.5pt solid #ddd;
            padding-bottom: 3px;
            margin-bottom: 10px;
          }
          .print-section {
            margin-bottom: 6px;
          }
          .print-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin: 5px 0;
            font-size: 9pt;
          }
          .print-table th,
          .print-table td {
            border: 0.5pt solid #ddd;
            padding: 4px;
            text-align: left;
            font-size: 9pt;
          }
          .print-table th {
            background-color: #f3f4f6;
          }
          .print-footer {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 0.5pt solid #ddd;
          }
          .status-badge {
            display: inline-block;
            padding: 1px 6px;
            border-radius: 3px;
            font-size: 9pt;
            background-color: #f3f4f6;
          }
          .bank-details {
            margin-top: 10px;
            padding: 8px;
            background-color: #f8f9fa;
            border: 0.5pt solid #ddd;
            border-radius: 3px;
            font-size: 9pt;
          }
          .signature-section {
            margin-top: 15px;
            margin-bottom: 15px;
            text-align: right;
          }
          .signature-line {
            width: 180px;
            border-top: 0.5pt solid #000;
            margin-top: 8px;
            text-align: center;
            display: inline-block;
          }
          .footer-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 10px;
            align-items: start;
          }
          .qr-code {
            text-align: right;
          }
          .qr-code img {
            max-width: 80px;
            height: auto;
          }
          .seal-sign-section {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 0.5pt solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .text-center {
            text-align: center;
          }
          .flex {
            display: flex;
          }
          .justify-between {
            justify-content: space-between;
          }
          .items-center {
            align-items: center;
          }
          .mt-10 {
            margin-top: 40px;
          }
          .pt-6 {
            padding-top: 24px;
          }
          .border-t {
            border-top: 0.5pt solid #ddd;
          }
          .h-16 {
            height: 64px;
          }
          .w-auto {
            width: auto;
          }
          .text-sm {
            font-size: 9pt;
          }
          .font-semibold {
            font-weight: 600;
          }
          .text-xs {
            font-size: 8pt;
          }
          .border-b {
            border-bottom: 0.5pt solid #666;
          }
          .border-gray-400 {
            border-color: #666;
          }
          .mb-2 {
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="print-content">
          <div class="print-header">
            <h1 style="font-size: 16pt; font-weight: bold; margin: 0;">
              Quotation #${quotation.quotation_number || "N/A"}
            </h1>
            <div style="display: flex; gap: 4px; align-items: center; justify-content: center; margin-top: 4px;">
              <p style="margin: 0;">Version ${quotation.version || "1"}</p> | 
              <div class="status-badge">${
                quotation.status_display || quotation.status || "DRAFT"
              }</div>
            </div>
          </div>

          <div class="print-section">
            <h2 style="font-size: 13pt; font-weight: bold; margin-bottom: 10px;">
              Client Information
            </h2>
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <div>
                <p style="margin: 2px 0;"><strong>Name:</strong> ${
                  quotation.client_name || "N/A"
                }</p>
                ${
                  quotation.client_number
                    ? `<p style="margin: 2px 0;"><strong>Mob. No:</strong> ${quotation.client_number}</p>`
                    : ""
                }
                ${
                  quotation.client?.address
                    ? `<p style="margin: 2px 0;"><strong>Address:</strong> ${quotation.client.address}</p>`
                    : ""
                }
                ${
                  quotation.client?.email
                    ? `<p style="margin: 2px 0;"><strong>Email:</strong> ${quotation.client.email}</p>`
                    : ""
                }
              </div>
              <div>
                <p style="margin: 2px 0;"><strong>Created:</strong> ${formatDate(
                  quotation.created_at
                )}</p>
                <p style="margin: 2px 0;"><strong>Valid Until:</strong> ${formatDate(
                  quotation.valid_until
                )}</p>
              </div>
            </div>
          </div>

          ${
            quotation.items && quotation.items.length > 0
              ? `
            <div class="print-section">
              <h2 style="font-size: 13pt; font-weight: bold; margin-bottom: 10px;">
                Items
              </h2>
              <table class="print-table">
                <thead>
                  <tr>
                    <th>Product SKU</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    ${
                      quotation.items.some(
                        (item) => item.discount_percentage > 0
                      )
                        ? `
                      <th>Discount %</th>
                      <th>Discount Amount</th>
                    `
                        : ""
                    }
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${quotation.items
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.product_sku || "N/A"}</td>
                      <td>${item.product_name || "N/A"}</td>
                      <td>${item.quantity || 0}</td>
                      <td>${formatCurrency(item.unit_price)}</td>
                      ${
                        quotation.items.some(
                          (item) => item.discount_percentage > 0
                        )
                          ? `
                        <td>${item.discount_percentage || 0}%</td>
<td>
  {( ((item.unit_price * item.quantity) * (item.discount_percentage || 0)) / 100 ).toFixed(2)}
</td>
                      `
                          : ""
                      }
                      <td>${formatCurrency(item.subtotal)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="${
                      quotation.items.some(
                        (item) => item.discount_percentage > 0
                      )
                        ? 6
                        : 4
                    }" style="text-align: right;">
                      <strong>Subtotal:</strong>
                    </td>
                    <td>${formatCurrency(quotation.subtotal)}</td>
                  </tr>
                  ${
                    quotation.discount_amount > 0
                      ? `
                    <tr>
                      <td colspan="${
                        quotation.items.some(
                          (item) => item.discount_percentage > 0
                        )
                          ? 6
                          : 4
                      }" style="text-align: right;">
                        <strong>Discount Amount:</strong>
                      </td>
                      <td>${formatCurrency(quotation.discount_amount)}</td>
                    </tr>
                  `
                      : ""
                  }
                  <tr>
                    <td colspan="${
                      quotation.items.some(
                        (item) => item.discount_percentage > 0
                      )
                        ? 6
                        : 4
                    }" style="text-align: right;">
                      <strong>Total Amount:</strong>
                    </td>
                    <td>
                      <strong>${formatCurrency(quotation.total_amount)}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          `
              : ""
          }

          ${
            quotation.terms_and_conditions
              ? `
            <div class="print-section">
              <h2 style="font-size: ${
                quotation.items && quotation.items.length <= 1 ? "11pt" : "13pt"
              }; font-weight: bold; margin-bottom: ${
                  quotation.items && quotation.items.length <= 1
                    ? "5px"
                    : "10px"
                };">
                Terms and Conditions
              </h2>
              <p style="margin-bottom: ${
                quotation.items && quotation.items.length <= 1 ? "8px" : "15px"
              }; white-space: pre-wrap; font-size: ${
                  quotation.items && quotation.items.length <= 1
                    ? "9pt"
                    : "11pt"
                }; line-height: ${
                  quotation.items && quotation.items.length <= 1 ? "1.2" : "1.3"
                }">
                ${quotation.terms_and_conditions}
              </p>
            </div>
          `
              : ""
          }

          <div class="footer-content">
            <div>
              <div class="bank-details" style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h3 style="font-size: 12pt; font-weight: bold; margin-bottom: 10px;">
                    Bank Details
                  </h3>
                  <p style="margin: 2px 0;"><strong>Nasscript Software Innovations</strong></p>
                  <p style="margin: 2px 0;"><strong>Account No:</strong> 0259052441001</p>
                  <p style="margin: 2px 0;"><strong>IBAN:</strong> QA97QNBA000000000259052441001</p>
                  <p style="margin: 2px 0;"><strong>Branch:</strong> AL KHOR CORPORATE BR</p>
                </div>
                <div class="qr-code">
                  <!-- QR Code can be added here if available -->
                </div>
              </div>
            </div>
          </div>

          <div class="seal-sign-section">
            <div class="text-center">
              <div class="flex items-center justify-center" style="gap: 4px;">
                <!-- Sign and Seal images would be added here -->
                <div style="height: 64px; width: auto; border: 0.5pt dashed #999; display: inline-block; line-height: 64px; color: #666;">
                  [Authorized Signature]
                </div>
                <div style="height: 64px; width: auto; border: 0.5pt dashed #999; display: inline-block; line-height: 64px; color: #666;">
                  [Company Seal]
                </div>
              </div>
              <p class="text-sm font-semibold" style="margin: 4px 0;">ANAS ATHANIKKAL</p>
              <p class="text-xs" style="margin: 0;">CEO - NASSCRIPT SOFTWARE INNOVATIONS</p>
            </div>

            <div class="text-center">
              <div class="border-b border-gray-400 mb-2" style="width: 200px; height: 24px;"></div>
              <p class="text-sm font-semibold" style="margin: 0;">Client Signature</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  if (!quotation) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center p-4">
        <LinearGradient
          colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
          className="rounded-2xl p-0.5"
        >
          <View className="bg-[#18181b] rounded-2xl max-h-[90%]">
            {/* Header */}
            <View className="p-4 border-b border-white/10">
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-white text-xl"
                  fontFamily="KumbhSans-Bold"
                >
                  Quotation Details
                </Text>
                <Pressable onPress={onClose} className="p-2">
                  <Ionicons name="close" size={24} color="white" />
                </Pressable>
              </View>
            </View>

            {/* Content */}
            <FlatList
              data={[1]}
              renderItem={() => (
                <View className="p-4">
                  {/* Basic Info */}
                  <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-4">
                      <View>
                        <Text
                          className="text-white text-lg mb-1"
                          fontFamily="KumbhSans-Bold"
                        >
                          {quotation.client_name}
                        </Text>
                        <Text
                          className="text-gray-400 text-sm"
                          fontFamily="KumbhSans"
                        >
                          Quotation: {quotation.quotation_number}
                        </Text>
                      </View>
                      <View
                        className={`px-3 py-1 rounded-full ${
                          quotation.status === "DRAFT"
                            ? "bg-gray-500/20"
                            : quotation.status === "SENT"
                            ? "bg-blue-500/20"
                            : quotation.status === "APPROVED"
                            ? "bg-green-500/20"
                            : quotation.status === "ACCEPTED"
                            ? "bg-green-500/20"
                            : quotation.status === "REJECTED"
                            ? "bg-red-500/20"
                            : "bg-amber-500/20"
                        }`}
                      >
                        <Text
                          className={`${
                            quotation.status === "DRAFT"
                              ? "text-gray-400"
                              : quotation.status === "SENT"
                              ? "text-blue-400"
                              : quotation.status === "APPROVED"
                              ? "text-green-400"
                              : quotation.status === "ACCEPTED"
                              ? "text-green-400"
                              : quotation.status === "REJECTED"
                              ? "text-red-400"
                              : "text-amber-400"
                          } text-sm`}
                          fontFamily="KumbhSans-Medium"
                        >
                          {quotation.status_display || quotation.status}
                        </Text>
                      </View>
                    </View>

                    {/* Client Information */}
                    <View className="space-y-3">
                      <DetailRow
                        icon="person"
                        label="Client Name"
                        value={quotation.client_name}
                      />
                      <DetailRow
                        icon="phone"
                        label="Phone"
                        value={quotation.client_number}
                      />
                      <DetailRow
                        icon="description"
                        label="Quotation Number"
                        value={quotation.quotation_number}
                      />
                      <DetailRow
                        icon="person"
                        label="Created By"
                        value={quotation.created_by_username}
                      />
                      <DetailRow
                        icon="assignment"
                        label="Assigned To"
                        value={quotation.assigned_to_user}
                      />
                      <DetailRow
                        icon="calendar-today"
                        label="Valid Until"
                        value={quotation.valid_until}
                      />
                      <DetailRow
                        icon="description"
                        label="Client Reference"
                        value={quotation.client_reference}
                      />
                      <DetailRow
                        icon="attach-money"
                        label="Total Amount"
                        value={`$${quotation.total_amount}`}
                      />
                    </View>
                  </View>

                  {/* Items */}
                  {quotation.items?.length > 0 && (
                    <View className="mb-6">
                      <Text
                        className="text-white text-lg mb-3"
                        fontFamily="KumbhSans-Bold"
                      >
                        Products ({quotation.items.length})
                      </Text>
                      <View className="space-y-2">
                        {quotation.items.map((item, index) => (
                          <View
                            key={item.id}
                            className="bg-white/5 rounded-xl p-3"
                          >
                            <Text
                              className="text-white font-medium"
                              fontFamily="KumbhSans-Medium"
                            >
                              {item.product_name}
                            </Text>
                            <View className="flex-row justify-between mt-2">
                              <Text className="text-gray-400 text-sm">
                                Qty: {item.quantity}
                              </Text>
                              <Text className="text-gray-400 text-sm">
                                Price: ${item.unit_price}
                              </Text>
                              <Text className="text-white text-sm font-bold">
                                Subtotal: ${item.subtotal}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Financial Summary */}
                  <View className="mb-6">
                    <Text
                      className="text-white text-lg mb-3"
                      fontFamily="KumbhSans-Bold"
                    >
                      Financial Summary
                    </Text>
                    <View className="bg-white/5 rounded-xl p-4">
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-400">Subtotal</Text>
                        <Text className="text-white">
                          ${quotation.subtotal}
                        </Text>
                      </View>
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-400">Discount</Text>
                        <Text className="text-white">
                          ${quotation.discount_amount}
                        </Text>
                      </View>
                      <View className="flex-row justify-between border-t border-white/10 pt-2">
                        <Text className="text-white font-bold">
                          Total Amount
                        </Text>
                        <Text className="text-white font-bold">
                          ${quotation.total_amount}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Notes */}
                  {quotation.notes && (
                    <View className="mb-6">
                      <Text
                        className="text-white text-lg mb-3"
                        fontFamily="KumbhSans-Bold"
                      >
                        Notes
                      </Text>
                      <View className="bg-white/5 rounded-xl p-3">
                        <Text className="text-gray-300" fontFamily="KumbhSans">
                          {quotation.notes}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Terms and Conditions */}
                  {quotation.terms_and_conditions && (
                    <View className="mb-6">
                      <Text
                        className="text-white text-lg mb-3"
                        fontFamily="KumbhSans-Bold"
                      >
                        Terms and Conditions
                      </Text>
                      <View className="bg-white/5 rounded-xl p-3">
                        <Text className="text-gray-300" fontFamily="KumbhSans">
                          {quotation.terms_and_conditions}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            />

            {/* Footer Actions */}
            <View className="p-4 border-t border-white/10">
              <View className="flex-row space-x-3">
                <Pressable
                  onPress={handleCall}
                  className="flex-1 bg-green-500/20 p-3 rounded-xl flex-row items-center justify-center space-x-2"
                >
                  <Ionicons name="call" size={20} color="#22c55e" />
                </Pressable>
                <Pressable
                  onPress={handleWhatsApp}
                  className="flex-1 bg-green-500/20 p-3 rounded-xl flex-row items-center justify-center space-x-2"
                >
                  <FontAwesome5 name="whatsapp" size={20} color="#22c55e" />
                </Pressable>
                <Pressable
                  onPress={generatePDF}
                  disabled={generatingPDF}
                  className="flex-1 bg-blue-500/20 p-3 rounded-xl flex-row items-center justify-center space-x-2"
                >
                  {generatingPDF ? (
                    <ActivityIndicator size="small" color="#60a5fa" />
                  ) : (
                    <MaterialIcons
                      name="picture-as-pdf"
                      size={20}
                      color="#60a5fa"
                    />
                  )}
                  <Text className="text-blue-400" fontFamily="KumbhSans-Medium">
                    {generatingPDF ? "Generating..." : "PDF"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

// Helper component for detail rows
const DetailRow = ({ icon, label, value }) => (
  <View className="flex-row items-center">
    <MaterialIcons name={icon} size={20} color="#9ca3af" className="mr-3" />
    <View className="flex-1">
      <Text className="text-gray-400 text-sm" fontFamily="KumbhSans-Medium">
        {label}
      </Text>
      <Text className="text-white mt-1" fontFamily="KumbhSans">
        {value || "Not provided"}
      </Text>
    </View>
  </View>
);
const RelationshipCard = ({
  item,
  index,
  onPress,
}: {
  item: any;
  index: number;
  onPress: () => void;
}) => {
  const handleCall = () => {
    if (item?.client_number) {
      Linking.openURL(`tel:${item.client_number}`);
    }
  };

  const handleWhatsApp = () => {
    if (item?.client_number) {
      const message = `Hello ${item.client_name}, regarding your quotation ${item.quotation_number}`;
      Linking.openURL(
        `whatsapp://send?phone=${item.client_number}&text=${encodeURIComponent(
          message
        )}`
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DRAFT":
        return { bg: "bg-gray-500/20", text: "text-gray-400" };
      case "SENT":
        return { bg: "bg-blue-500/20", text: "text-blue-400" };
      case "APPROVED":
        return { bg: "bg-green-500/20", text: "text-green-400" };
      case "ACCEPTED":
        return { bg: "bg-green-500/20", text: "text-green-400" };
      case "REJECTED":
        return { bg: "bg-red-500/20", text: "text-red-400" };
      case "EXPIRED":
        return { bg: "bg-amber-500/20", text: "text-amber-400" };
      default:
        return { bg: "bg-gray-500/20", text: "text-gray-400" };
    }
  };

  const statusColors = getStatusColor(item.status);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(600)}
      className="mb-4 px-4"
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
        className="rounded-2xl p-0.5"
      >
        <View className="bg-[#18181b] rounded-2xl overflow-hidden">
          <View className="p-4">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center space-x-2">
                <Text className="text-gray-400" fontFamily="KumbhSans">
                  ID: {item.id}
                </Text>
                <View className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <Text className="text-gray-400" fontFamily="KumbhSans">
                  #{item.quotation_number}
                </Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${statusColors.bg}`}>
                <Text
                  className={`${statusColors.text} text-sm`}
                  fontFamily="KumbhSans-Medium"
                >
                  {item.status_display || item.status}
                </Text>
              </View>
            </View>

            <View className="mb-4">
              <Text
                className="text-white text-xl mb-1"
                fontFamily="KumbhSans-Bold"
              >
                {item.client_name}
              </Text>
              <View className="flex flex-row space-x-2 my-2 items-center">
                <FontAwesome name="building-o" size={20} color="white" />
                <Text className="text-gray-400  text-sm" fontFamily="KumbhSans">
                  Reference:{" "}
                  <Text fontFamily="KumbhSans-Bold">
                    {item.client_reference || "N/A"}
                  </Text>
                </Text>
              </View>
              <View className="flex flex-row space-x-2 my-2 items-center">
                <Ionicons name="calendar-outline" size={20} color="white" />
                <Text className="text-gray-400  text-sm" fontFamily="KumbhSans">
                  Valid until: {item.valid_until}
                </Text>
              </View>
              <View className="flex flex-row space-x-2 my-2 items-center">
                <MaterialIcons name="attach-money" size={20} color="white" />
                <Text className="text-gray-400  text-sm" fontFamily="KumbhSans">
                  Total: ${item.total_amount}
                </Text>
              </View>
            </View>

            <View className="flex-row space-x-2">
              <Pressable
                onPress={onPress}
                className="flex-1 bg-blue-500/10 p-3 rounded-xl flex-row items-center justify-center space-x-2"
              >
                <Feather name="eye" size={18} color="#60a5fa" />
                <Text className="text-blue-400" fontFamily="KumbhSans-Medium">
                  View Details
                </Text>
              </Pressable>
              <Pressable
                onPress={handleCall}
                className="w-12 bg-green-500/10 rounded-xl items-center justify-center"
              >
                <Ionicons name="call" size={18} color="#22c55e" />
              </Pressable>
              <Pressable
                onPress={handleWhatsApp}
                className="w-12 bg-green-500/10 rounded-xl items-center justify-center"
              >
                <FontAwesome5 name="whatsapp" size={18} color="#22c55e" />
              </Pressable>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const Quotation = () => {
  const insets = useSafeAreaInsets();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadQuotations = async () => {
    try {
      const data = await fetchQuotations();
      setQuotations(data.results || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load quotations");
      console.error("Error loading quotations:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadQuotations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadQuotations();
  };

  const handleViewDetails = (quotation) => {
    setSelectedQuotation(quotation);
    setModalVisible(true);
  };

  const filteredQuotations = quotations.filter(
    (quote) =>
      quote.quotation_number
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      quote.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.client_reference
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      quote.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.id?.toString().includes(searchQuery)
  );

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text className="text-white mt-4" fontFamily="KumbhSans">
          Loading quotations...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "transparent"]}
        className="absolute w-full h-full"
      />
      <Animated.View
        entering={FadeInDown.duration(600)}
        className="px-4 py-3 mb-2"
      >
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text
              className="text-2xl text-white mb-1"
              fontFamily="KumbhSans-Bold"
            >
              Client Quotations
            </Text>
            <Text className="text-gray-400" fontFamily="KumbhSans">
              {quotations.length} total quotation
              {quotations.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <Pressable
            onPress={() => router.navigate("/add-quotation")}
            className="h-10 px-4 rounded-xl flex-row items-center space-x-2 bg-[#B4925E]"
          >
            <AntDesign name="plus" size={20} color="white" />
            <Text className="text-white" fontFamily="KumbhSans-Medium">
              Add new
            </Text>
          </Pressable>
        </View>

        {/* Search Bar */}
        <View className="relative">
          <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
            <Ionicons name="search-outline" size={20} color="#94a3b8" />
          </View>
          <TextInput
            className="h-12 pl-12 pr-4 rounded-xl w-full text-white bg-[#18181b] font-[KumbhSans] text-base"
            placeholder="Search by ID, quotation number, client or status.."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Animated.View>
      <FlatList
        data={filteredQuotations}
        renderItem={({ item, index }) => (
          <RelationshipCard
            item={item}
            index={index}
            onPress={() => handleViewDetails(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-400 text-lg" fontFamily="KumbhSans">
              No quotations found
            </Text>
          </View>
        }
      />

      <DetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        quotation={selectedQuotation}
      />
    </View>
  );
};

export default Quotation;
