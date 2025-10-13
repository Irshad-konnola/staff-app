import { View,  Pressable, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Text } from "@/components/Text";
const Support = () => {
  const contactMethods = [
    {
      icon: "mail-outline"as const,
      title: "Email Support",
      value: "support@company.com",
      action: () => Linking.openURL("mailto:support@company.com"),
      color: "#B4925E",
    },
    {
      icon: "call-outline"as const,
      title: "Phone Support",
      value: "+1 (555) 123-4567",
      action: () => Linking.openURL("tel:+15551234567"),
      color: "#10b981",
    },
   
  ];

  const socialLinks = [
    {
      icon: "logo-whatsapp" as const,
      name: "WhatsApp",
      url: "https://wa.me/15551234567",
      color: "#25D366",
    },
    {
      icon: "logo-instagram" as const,
      name: "Instagram",
      url: "https://instagram.com/company",
      color: "#E4405F",
    },
    {
      icon: "logo-youtube"as const,
      name: "YouTube",
      url: "https://youtube.com/company",
      color: "#FF0000",
    },
   
  ];

 

  return (
    <View className="flex-1 bg-black">
      {/* Background gradient */}
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "transparent"]}
        className="absolute w-full h-full"
      />

      {/* Header */}
      <View className="px-4 pt-4 pb-6">
        <Text className="text-2xl text-white mb-1" fontFamily="KumbhSans-Bold">
          Customer Support
        </Text>
        <Text className="text-gray-400 text-[15px]" fontFamily="KumbhSans">
          We're here to help you 24/7
        </Text>
      </View>

      {/* Contact Methods */}
      <View className="px-4 mb-6">
        <Text className="text-white text-lg mb-4 ml-1" fontFamily="KumbhSans-Medium">
          Contact Options
        </Text>
        
        {contactMethods.map((method, index) => (
          <Pressable
            key={method.title}
            onPress={method.action}
            className="bg-[#18181b] rounded-xl p-4 mb-3 border border-gray-800 active:bg-gray-800/50"
          >
            <View className="flex-row items-center">
              <View 
                className="w-10 h-10 rounded-lg justify-center items-center mr-3"
                style={{ backgroundColor: `${method.color}20` }}
              >
                <Ionicons name={method.icon} size={20} color={method.color} />
              </View>
              <View className="flex-1">
                <Text className="text-white text-[16px] font-[KumbhSans-Medium]">
                  {method.title}
                </Text>
                <Text className="text-gray-400 text-[14px] font-[KumbhSans]">
                  {method.value}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#6b7280" />
            </View>
          </Pressable>
        ))}
      </View>

      {/* Social Media Links */}
      <View className="px-4 mb-6">
        <Text className="text-white text-lg mb-4 ml-1" fontFamily="KumbhSans-Medium">
          Follow Us
        </Text>
        
        <View className="flex-row justify-between px-4">
          {socialLinks.map((social) => (
            <Pressable
              key={social.name}
              onPress={() => Linking.openURL(social.url)}
              className="items-center"
            >
              <View 
                className="w-14 h-14 rounded-2xl justify-center items-center mb-2"
                style={{ backgroundColor: `${social.color}20` }}
              >
                <Ionicons name={social.icon} size={24} color={social.color} />
              </View>
              <Text className="text-gray-400 text-[12px] font-[KumbhSans]">
                {social.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

    
    </View>
  );
};

export default Support;