

import React from "react";
import { Drawer } from "expo-router/drawer";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomeHeader from "@/components/CustomeHeader";
import { View } from "react-native";
import { cn } from "@/lib/utils";
import { Image } from "native-base";
import {
  Quotation,
  ClientTicketing,
  ClientRelationShip,
  BugReport,
  ClientRequirements,
  Maintenance
} from "@/constants/images";
import { Text } from "@/components/Text";
import CustomDrawerContentTwo from "@/components/CustomDrawerContentTwo";
import FloatingAppsButton from "@/components/customer/FloatingAppsButton";
const icons: {
  ticketing: any;
  support: any;
  bugReport: any;
  training: any;
  amc: any;
} = {
  ticketing: ClientTicketing,
  support: ClientRelationShip,
  bugReport: BugReport,
  training: ClientRequirements,
  amc: Maintenance,
};

export function DrawerIcon({
  name,
  title,
  isActive,
}: {
  name: "ticketing" | "support" | "bugReport" | "training" | "amc";
  title: string;
  isActive: boolean;
}) {
  return (
    <View
      className={cn(
        "w-full h-10 rounded-md px-4 flex flex-row space-x-2 items-center relative bg-slate-50",
        {
          "bg-primary": isActive,
        }
      )}
    >
      <Image
        className="w-6 h-6"
        source={icons[name]}
        tintColor={isActive ? "white" : "black"}
        alt={title}
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerStyle: {
            backgroundColor: "transparent",
            width: 250,
          },
          drawerType: "slide",
          overlayColor: "transparent",
        }}
        drawerContent={({ navigation, state }) => (
          <CustomDrawerContentTwo navigation={navigation} state={state} />
        )}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Dashboard",
            title: "Dashboard",
            header: ({ navigation }) => (
              <CustomeHeader navigation={navigation} title="" />
            ),
          }}
        />
       
        <Drawer.Screen
          name="customerTicketing"
          options={{
            drawerLabel: "Customer Ticketing",
            title: "Customer Ticketing",
            header: ({ navigation }) => (
              <CustomeHeader navigation={navigation} title="Customer Ticketing" />
            ),
          }}
        />

        <Drawer.Screen
          name="support"
          options={{
            drawerLabel: "Support",
            title: "Support",
            header: ({ navigation }) => (
              <CustomeHeader navigation={navigation} title="Support" />
            ),
          }}
        />

        <Drawer.Screen
          name="bugReport"
          options={{
            drawerLabel: "Bug Report",
            title: "Bug Report",
            header: ({ navigation }) => (
              <CustomeHeader navigation={navigation} title="Bug Report" />
            ),
          }}
        />

        <Drawer.Screen
          name="training"
          options={{
            drawerLabel: "Training",
            title: "Training",
            header: ({ navigation }) => (
              <CustomeHeader navigation={navigation} title="Training" />
            ),
          }}
        />

        <Drawer.Screen
          name="maintenance"
          options={{
            drawerLabel: "AMC",
            title: "AMC",
            header: ({ navigation }) => (
              <CustomeHeader navigation={navigation} title="AMC" />
            ),
          }}
        />
      </Drawer>
      {/* <FloatingAppsButton/> */}
    </GestureHandlerRootView>
  );
}