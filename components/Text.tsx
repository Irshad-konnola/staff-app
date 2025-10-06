import { useFonts } from "expo-font";
import { Text as DefaultText, TextProps } from "react-native";
import { styled } from "nativewind";
import React from "react";

// First, create a styled version of DefaultText
const StyledText = styled(DefaultText);

export function Text(
  props: TextProps & {
    className?: string;
    fontFamily?:
      | "KumbhSans"
      | "KumbhSans-Bold"
      | "KumbhSans-Medium"
      | "KumbhSans-SemiBold";
  }
) {
  const [loaded] = useFonts({
    KumbhSans: require("../assets/fonts/KumbhSans.ttf"),
    "KumbhSans-Bold": require("../assets/fonts/KumbhSans-Bold.ttf"),
    "KumbhSans-Medium": require("../assets/fonts/KumbhSans-Medium.ttf"),
    "KumbhSans-SemiBold": require("../assets/fonts/KumbhSans-SemiBold.ttf"),
  });

  if (!loaded) {
    return null; // Ensure font is loaded before rendering
  }

  return (
    <StyledText
      {...props}
      className={props.className}
      style={[
        props.style,
        {
          fontFamily: props.fontFamily || "KumbhSans",
        },
      ]}
    />
  );
}
