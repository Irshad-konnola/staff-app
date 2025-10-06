import { Image, TouchableOpacity, View, Dimensions, ScrollView } from "react-native";
import Animated, { FadeInLeft, FadeInRight, FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Href, router } from "expo-router";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  NasscriptLogo,
  QuotationFormHome,
  RelationShipForHome,
  RequestForHome,
  RequirementForHome,
  ClientTicketing,
} from "@/constants/images";
import { MenuCardProp } from "@/types/type";

const { width } = Dimensions.get("window");

const MenuCard = ({ title, icon, color, onPress, enterAnimation }: MenuCardProp) => {
  return (
    <Animated.View entering={enterAnimation} className="w-[48%] my-2 h-[180px] relative">
      <TouchableOpacity onPress={onPress} className="w-full h-full">
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)"]}
          className="w-full h-full rounded-3xl p-4 overflow-hidden"
          style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}
        >
          <View className="flex-1 justify-between">
            <View
              className="h-14 w-14 rounded-2xl justify-center items-center"
              style={{ backgroundColor: `${color}80` }}
            >
              <Image source={icon} className="w-8 h-8" tintColor="white" alt="icons" />
            </View>
            <Text className="text-[16px] text-white mb-2" fontFamily="KumbhSans-Bold" numberOfLines={2}>
              {title}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function Index() {
  const insets = useSafeAreaInsets();

  const menuItems = [
    { title: "Client Requests", icon: RequestForHome, color: "#22c55e", route: "/(tabs)/requests", animation: FadeInLeft.duration(700) },
    { title: "Client Requirements", icon: RequirementForHome, color: "#6366f1", route: "/(tabs)/requirements", animation: FadeInRight.duration(700) },
    { title: "Client Relationship", icon: RelationShipForHome, color: "#ec4899", route: "/(tabs)/relationship", animation: FadeInLeft.duration(700).delay(200) },
    { title: "Client Quotation", icon: QuotationFormHome, color: "#06b6d4", route: "/(tabs)/quotation", animation: FadeInRight.duration(700).delay(200) },
    { title: "Client Ticketing", icon: ClientTicketing, color: "#f97316", route: "/(tabs)/ticketing", animation: FadeInRight.duration(700).delay(400) },
  ];

  return (
    <View className="flex-1 bg-black " style={{ paddingTop: insets.top }}>
      <LinearGradient colors={["rgba(255,255,255,0.1)", "transparent"]} className="absolute w-full h-full" />

      {/* Wrap content in ScrollView */}
      <ScrollView className="flex-1 px-4 py-5">
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(700)} className="space-y-3">
          <View className="flex justify-center flex-row">
            <Image source={NasscriptLogo} className="w-40 h-12 mb-4" resizeMode="contain" />
          </View>
          <Text className="text-[34px] text-white" fontFamily="KumbhSans-Bold">ERP Management</Text>
          <Text className="text-[15px] leading-6 text-gray-300" fontFamily="KumbhSans-Medium">
            Welcome! Access powerful tools to manage inventory, finances, and employees—all in one place. Simplify operations and drive smarter decisions with ease.
          </Text>
        </Animated.View>

        {/* Menu Grid */}
        <View className="flex-row flex-wrap justify-between mt-10 mb-4">
          {menuItems.map((item, index) => (
            <MenuCard
              key={index}
              title={item.title}
              icon={item.icon}
              color={item.color}
              onPress={() => router.navigate(item.route as Href)}
              enterAnimation={item.animation}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
