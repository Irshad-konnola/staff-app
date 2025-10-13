// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { useEffect } from "react";

// import "react-native-reanimated";

// import { useColorScheme } from "@/components/useColorScheme";
// import { NativeBaseProvider } from "native-base";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Provider } from "react-redux";
// import { store } from "@/redux/store";

// export {
//   // Catch any errors thrown by the Layout component.
//   ErrorBoundary,
// } from "expo-router";

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: "(tabs)",
// };

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayoutPage() {
//   return <RootLayout />;
// }

// function RootLayout() {
//   const [loaded, error] = useFonts({
//     KumbhSans: require("../assets/fonts/KumbhSans.ttf"),
//     "KumbhSans-Bold": require("../assets/fonts/KumbhSans-Bold.ttf"),
//     "KumbhSans-Medium": require("../assets/fonts/KumbhSans-Medium.ttf"),
//   });

//   // Expo Router uses Error Boundaries to catch errors in the navigation tree.
//   useEffect(() => {
//     if (error) throw error;
//   }, [error]);

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <NativeBaseProvider>
//       <Provider store={store}>
//         <RootLayoutNav />
//       </Provider>
//     </NativeBaseProvider>
//   );
// }

// function RootLayoutNav() {
//   const colorScheme = useColorScheme();

//   const client = new QueryClient();
//   return (
//     // colorScheme === "dark" ? DarkTheme :
//     <QueryClientProvider client={client}>
//       <ThemeProvider value={DefaultTheme}>
//         <Stack>
//           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//           <Stack.Screen name="login" options={{ headerShown: false }} />
//           <Stack.Screen
//             name="add-requirement"
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="add-relationship"
//             options={{ headerShown: false }}
//           />
//            <Stack.Screen
//             name="add-ticket"
//             options={{ headerShown: false }}
//           />
//         </Stack>
//       </ThemeProvider>
//     </QueryClientProvider>
//   );
// }

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import "react-native-reanimated";
import { useColorScheme } from "@/components/useColorScheme";
import { NativeBaseProvider } from "native-base";

export { ErrorBoundary } from "expo-router";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayoutPage() {
  return <RootLayout />;
}

function RootLayout() {
  const [loaded, error] = useFonts({
    KumbhSans: require("../assets/fonts/KumbhSans.ttf"),
    "KumbhSans-Bold": require("../assets/fonts/KumbhSans-Bold.ttf"),
    "KumbhSans-Medium": require("../assets/fonts/KumbhSans-Medium.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <NativeBaseProvider>
      <RootLayoutNav />
    </NativeBaseProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        {/* Login is first screen */}
        <Stack.Screen name="login" options={{ headerShown: false }} />

        {/* Tabs and other screens */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(customer-tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="add-requirement"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="add-relationship"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="add-ticket"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="add-customer-ticket"
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="add-bug-report"
          options={{ headerShown: false }}
        />
           <Stack.Screen
          name="request-training"
          options={{ headerShown: false }}
        />
      </Stack>
      
      
    </ThemeProvider>
  );
}
