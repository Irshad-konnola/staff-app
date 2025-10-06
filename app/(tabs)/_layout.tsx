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
  ClientRelationShip,
  ClientRequirements,
  ClientRequirequests,
  Quotation,
  ClientTicketing,
} from "@/constants/images";
import { Text } from "@/components/Text";
import CustomDrawerContent from "@/components/CustomDrawerContent";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

const icons: {
  requirements: any;
  relationship: any;
  requests: any;
  quotation: any;
  ticketing:any;
} = {
  requirements: ClientRequirements,
  relationship: ClientRelationShip,
  requests: ClientRequirequests,
  quotation: Quotation,
  ticketing:ClientTicketing,
};
export function DrawerIcon({
  name,
  title,
  isActive,
}: {
  name: "requirements" | "relationship" | "requests" | "quotation" | "ticketing";
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
          <CustomDrawerContent navigation={navigation} state={state} />
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
          name="requests"
          options={{
            drawerLabel: "requests",
            header: ({ navigation }) => (
              <CustomeHeader navigation={navigation} title="Client Requests" />
            ),
          }}
        />
        <Drawer.Screen
          name="requirements"
          options={{
            drawerLabel: "requirements",
            header: ({ navigation }) => (
              <CustomeHeader
                navigation={navigation}
                title="Client Requirements"
              />
            ),
          }}
        />
        <Drawer.Screen
          name="relationship"
          options={{
            drawerLabel: "relationship",
            header: ({ navigation }) => (
              <CustomeHeader
                navigation={navigation}
                title="Client Relationship"
              />
            ),
          }}
        />
        <Drawer.Screen
          name="quotation"
          options={{
            drawerLabel: "quotation",
            header: ({ navigation }) => (
              <CustomeHeader navigation={navigation} title="Client Quotation" />
            ),
          }}
        />
         <Drawer.Screen
          name="ticketing"
          options={{
            drawerLabel: "ticketing",
            header: ({ navigation }) => (
              <CustomeHeader navigation={navigation} title="Client Ticketing" />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
