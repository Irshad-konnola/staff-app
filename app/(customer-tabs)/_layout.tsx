import React from "react";

// import { Link, Tabs } from "expo-router";
// import { Pressable } from "react-native";
import { Drawer } from "expo-router/drawer";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
// import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomeHeader from "@/components/CustomeHeader";
import { View } from "react-native";
import { cn } from "@/lib/utils";
import { Image } from "native-base";
import {
 
  Quotation,
  ClientTicketing,
} from "@/constants/images";
import { Text } from "@/components/Text";
import CustomDrawerContentTwo from "@/components/CustomDrawerContentTwo";
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

const icons: {
  
  ticketing:any;
} = {
 
  ticketing:ClientTicketing,
};
export function DrawerIcon({
  name,
  title,
  isActive,
}: {
  name: "customerTicketing";
  title: string;
  isActive: boolean;
}) {
  return (
    <View
      className={cn(
        "w-full h-10 rounded-md px-4 flex flex-row space-x-2 items-center relative bg-slate-50",
        {
          "bg-primary ": isActive,
        }
      )}
    >
      <Image
        className="w-6 h-6"
        source={icons[name]}
        tintColor={isActive ? "white" : "black"}
      />
      <Text
        className={cn("text-[16px] text-black", {
          "text-white": isActive,
        })}
      >
        {title}
      </Text>
    </View>
  );
}
export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView>
      <Drawer
        screenOptions={{
          drawerStyle: {
            backgroundColor: "transparent",
            width: 250,
          },
        }}
        drawerContent={({ navigation, state }) => (
          <CustomDrawerContentTwo navigation={navigation} state={state} />
        )}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "index",
            header: ({ navigation }) => (
              <CustomeHeader navigation={navigation} title="" />
            ),
          }}
        />
       
         <Drawer.Screen
          name="customerTicketing"
          options={{
            drawerLabel: "ticketing",
            header: ({ navigation }) => (
              <CustomeHeader navigation={navigation} title="Customer Ticketing" />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
