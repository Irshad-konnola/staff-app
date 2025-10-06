import React from "react";
import { View, Animated, Dimensions, Pressable } from "react-native";
import { Image } from "native-base";
import { Text } from "@/components/Text";
import { cn } from "@/lib/utils";
import {
  ClientRelationShip,
  ClientRequirements,
  ClientRequirequests,
  NasscriptLogo,
  Quotation,
  ClientTicketing
} from "@/constants/images";
import { DrawerNavigationHelpers } from "@react-navigation/drawer/lib/typescript/commonjs/src/types";
import { DrawerNavigationState, ParamListBase } from "@react-navigation/native";

const CustomDrawerContent = ({
  navigation,
  state,
}: {
  navigation: DrawerNavigationHelpers;
  state: DrawerNavigationState<ParamListBase>;
}) => {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const menuItems = [
    { name: "requirements", title: "Requirements", icon: ClientRequirements },
    { name: "requests", title: "Requests", icon: ClientRequirequests },
    { name: "relationship", title: "Relationship", icon: ClientRelationShip },
    { name: "quotation", title: "Quotation", icon: Quotation },
        { name: "ticketing", title: "Ticketing", icon: ClientTicketing },

  ];
  const currentRouteName = state.routeNames[state.index];
  return (
    <View className="flex-1 bg-black/95 p-4">
      {/* Logo Section */}
      <View className="mb-8 mt-4">
        <View className="bg-primary/10 p-4 rounded-xl">
          <Image
            source={NasscriptLogo}
            className="w-32 h-8 self-center"
            alt="NasScript"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Menu Items */}
      <View className="space-y-3">
        {menuItems.map((item, index) => {
          const isActive = currentRouteName === item.name;

          return (
            <Animated.View
              key={item.name}
              className={cn(
                "overflow-hidden",
                isActive && "shadow-lg shadow-primary/20"
              )}
            >
              <AnimatedPressable
                onPress={() => navigation.navigate(item.name)}
                className={cn(
                  "flex-row items-center p-3 rounded-xl space-x-4",
                  isActive ? "bg-primary" : "bg-white/5 border border-white/10"
                )}
              >
                <View
                  className={cn(
                    "w-10 h-10 rounded-lg items-center justify-center",
                    isActive ? "bg-white/20" : "bg-white/5"
                  )}
                >
                  <Image
                    source={item.icon}
                    className="w-5 h-5"
                    tintColor={isActive ? "white" : "#9ca3af"}
                  />
                </View>

                <View className="flex-1">
                  <Text
                    className={cn(
                      "text-[15px] font-medium",
                      isActive ? "text-white" : "text-gray-400"
                    )}
                  >
                    {item.title}
                  </Text>

                  {isActive && (
                    <Text className="text-xs text-white/60 mt-0.5">
                      Manage {item.title.toLowerCase()}
                    </Text>
                  )}
                </View>

                {isActive && (
                  <View className="w-2 h-2 rounded-full bg-white mr-2" />
                )}
              </AnimatedPressable>
            </Animated.View>
          );
        })}
      </View>

      {/* Bottom Section */}
      {/* <View className="mt-auto mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
        <Text className="text-gray-400 text-sm">
          Need help with the dashboard?
        </Text>
        <AnimatedPressable className="mt-2 bg-primary/20 p-2 rounded-lg">
          <Text className="text-primary text-center font-medium">
            Contact Support
          </Text>
        </AnimatedPressable>
      </View> */}
       <View className="mt-auto mb-4 p-4">
              <AnimatedPressable
                onPress={() => navigation.navigate("login")}
                className="bg-red-600/20 border border-red-600/30 p-3 rounded-xl"
              >
                <Text className="text-red-400 text-center font-semibold">
                  Logout
                </Text>
              </AnimatedPressable>
            </View>
    </View>
  );
};

export default CustomDrawerContent;
