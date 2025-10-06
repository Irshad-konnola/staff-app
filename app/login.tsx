import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Image } from "native-base";
import { Text } from "@/components/Text";
import { Lock, NasscriptLogo, Person } from "@/constants/images";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/lib/schemas";
import { z } from "zod";
import { zodCustomResolver } from "@/lib/zodResolver";
import { cn } from "@/lib/utils";
import { router } from "expo-router";

const Login = () => {
  const [isFocused, setIsFocused] = useState({
    username: false,
    password: false,
  });
  type LoginSchema = z.infer<typeof loginSchema>;
  const { height } = Dimensions.get("window");

  const {
    register,
    handleSubmit,
    formState: { errors },
    ...rest
  } = useForm<LoginSchema>({
    resolver: zodCustomResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

const handleLoginSubmit = (values: LoginSchema) => {
  console.log("🚀 ~ handleLoginSubmit ~ values:", values);
  
  // Simple role check based on username
  if (values.username.toLowerCase().includes('staff')) {
    router.replace("/(tabs)"); 
  } else if (values.username.toLowerCase().includes('customer')) {
        // @ts-ignore - customer tabs route

    router.replace("/(customer-tabs)"); 
  } else {
    // Handle invalid user
    alert("Invalid credentials");
  }
};
  return (
    <View className="flex-1 bg-black">
      {/* Background Gradient Effect */}
      <Animated.View
        className="absolute w-full h-full"
        entering={FadeIn.duration(1000)}
      >
        <View className="absolute -top-32 -left-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
        <View className="absolute top-1/2 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, minHeight: height }}
        className="flex-1"
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          entering={FadeInDown.duration(1000).springify()}
          className="flex-1 justify-center px-8"
        >
          {/* Logo Section */}
          <View className="mb-12">
            <View className="bg-black/30 backdrop-blur-lg p-6 rounded-3xl">
              <Image
                source={NasscriptLogo}
                className="w-48 h-12 mx-auto"
                alt="NasScript Logo"
              />
              <Text
                fontFamily="KumbhSans-Medium"
                className="text-white/90 text-center mt-4 text-lg"
              >
                Welcome back! Please sign in to continue
              </Text>
            </View>
          </View>

          {/* Form Section */}
          <View className="space-y-6">
            {/* Username Input */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(1000).springify()}
              className="space-y-2"
            >
              <Text
                className="text-[16px] text-white/90 ml-1"
                fontFamily="KumbhSans-Medium"
              >
                Username
              </Text>
              <View
                className={cn(
                  "h-14 rounded-xl flex-row items-center space-x-3 px-4 bg-white/5 backdrop-blur-lg border",
                  isFocused.username ? "border-primary" : "border-white/10",
                  errors.username && "border-red-500"
                )}
              >
                <Image
                  source={Person}
                  tintColor={isFocused.username ? "#D4AF37" : "#9CA3AF"}
                  alt="person"
                  className="w-5 h-5"
                />
                <TextInput
                  className="flex-1 text-[17px] text-white font-[KumbhSans]"
                  placeholder="Enter your username"
                  placeholderTextColor="#6B7280"
                  {...register("username")}
                  onFocus={() =>
                    setIsFocused((prev) => ({ ...prev, username: true }))
                  }
                  onBlur={() =>
                    setIsFocused((prev) => ({ ...prev, username: false }))
                  }
                  onChangeText={(txt) => {
                    rest.setValue("username", txt);
                    rest.trigger("username");
                  }}
                />
              </View>
              {errors.username && (
                <Text
                  className="text-red-500 ml-1"
                  fontFamily="KumbhSans-Medium"
                >
                  {errors.username.message}
                </Text>
              )}
            </Animated.View>

            {/* Password Input */}
            <Animated.View
              entering={FadeInDown.delay(400).duration(1000).springify()}
              className="space-y-2"
            >
              <Text
                className="text-[16px] text-white/90 ml-1"
                fontFamily="KumbhSans-Medium"
              >
                Password
              </Text>
              <View
                className={cn(
                  "h-14 rounded-xl flex-row items-center space-x-3 px-4 bg-white/5 backdrop-blur-lg border",
                  isFocused.password ? "border-primary" : "border-white/10",
                  errors.password && "border-red-500"
                )}
              >
                <Image
                  source={Lock}
                  tintColor={isFocused.password ? "#D4AF37" : "#9CA3AF"}
                  className="w-5 h-5"
                  alt="lock"
                />
                <TextInput
                  className="flex-1 text-[17px] text-white font-[KumbhSans]"
                  placeholder="Enter your password"
                  placeholderTextColor="#6B7280"
                  secureTextEntry
                  {...register("password")}
                  onFocus={() =>
                    setIsFocused((prev) => ({ ...prev, password: true }))
                  }
                  onBlur={() =>
                    setIsFocused((prev) => ({ ...prev, password: false }))
                  }
                  onChangeText={(txt) => {
                    rest.setValue("password", txt);
                    rest.trigger("password");
                  }}
                />
              </View>
              {errors.password && (
                <Text
                  className="text-red-500 ml-1"
                  fontFamily="KumbhSans-Medium"
                >
                  {errors.password.message}
                </Text>
              )}
            </Animated.View>

            {/* Login Button */}
            <Animated.View
              entering={FadeInDown.delay(600).duration(1000).springify()}
            >
              <TouchableOpacity
                onPress={handleSubmit(handleLoginSubmit)}
                className={cn(
                  "h-14 rounded-xl bg-primary justify-center items-center mt-4",
                  {
                    "opacity-50": false,
                  }
                )}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center space-x-2">
                  <Text
                    className="text-white text-lg font-semibold"
                    fontFamily="KumbhSans-SemiBold"
                  >
                    Sign In
                  </Text>
                  {false && <ActivityIndicator color="white" />}
                </View>
              </TouchableOpacity>

              <TouchableOpacity className="mt-4 hidden">
                <Text
                  className="text-white/60 text-center"
                  fontFamily="KumbhSans-Medium"
                >
                  Forgot your password?
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default Login;
