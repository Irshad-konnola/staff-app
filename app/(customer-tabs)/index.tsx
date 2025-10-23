import { Image, TouchableOpacity, View, Dimensions, ScrollView } from "react-native";
import Animated, { FadeInLeft, FadeInRight, FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Href, router } from "expo-router";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  NasscriptLogo,
  ClientRelationShip,
  BugReport,
  ClientRequirements,
  Maintenance,
  ClientTicketing,
} from "@/constants/images";
import { MenuCardProp } from "@/types/type";
import FloatingAppsButton from "@/components/customer/FloatingAppsButton";

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

    { title: "Ticketing", icon: ClientTicketing, color: "#f97316", route: "/(customer-tabs)/customerTicketing", animation: FadeInRight.duration(700).delay(400) },
        { title: "Support", icon: ClientRelationShip, color: "#f97316", route: "/(customer-tabs)/support", animation: FadeInRight.duration(700).delay(400) },
    { title: "Bug Report", icon: BugReport, color: "#f97316", route: "/(customer-tabs)/bugReport", animation: FadeInRight.duration(700).delay(400) },
    { title: "Training", icon: ClientRequirements, color: "#f97316", route: "/(customer-tabs)/training", animation: FadeInRight.duration(700).delay(400) },
        { title: "Maintenance", icon: Maintenance, color: "#f97316", route: "/(customer-tabs)/maintenance", animation: FadeInRight.duration(700).delay(400) },


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
      <FloatingAppsButton/>
    </View>
  );
}
