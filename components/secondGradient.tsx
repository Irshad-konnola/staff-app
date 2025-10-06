import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

// GridOverlay component to create vertical and horizontal grid lines
const GridOverlay = () => {
  return (
    <View style={styles.gridContainer}>
      {/* Vertical lines */}
      {Array.from({ length: 100 }).map((_, index) => (
        <View key={`v-${index}`} style={[styles.gridLine, { left: `${index * 10}%` }]} />
      ))}
      {/* Horizontal lines */}
      {Array.from({ length: 100 }).map((_, index) => (
        <View key={`h-${index}`} style={[styles.gridLine, { top: `${index * 10}%`, width: "100%", height: .4 }]} />
      ))}
    </View>
  );
};

const SecondGradient = () => {
  const bounceAnim = useSharedValue(0);

  bounceAnim.value = withRepeat(
    withSequence(
      withTiming(-10, { duration: 500 }), // Move up
      withTiming(0, { duration: 500 })    // Move down
    ),
    -1, // Repeat indefinitely
    true // Reverse the animation
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: bounceAnim.value }],
      opacity: 0.4, // Ensure opacity is included here for consistency
    };
  });

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={["#000000", "#a16207", "#333333", "#000000"]}
        start={{ x: 7, y: 22 }}
        end={{ x: 25, y: 1 }}
        style={styles.gradient}
      />
      
      {/* Grid Overlay */}
      <GridOverlay />

      {/* Animated Image */}
      <Animated.Image
        entering={FadeInDown.duration(700)}
        source={require("../assets/images/rounded.png")}
        style={[animatedStyle, styles.image]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  gradient: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  gridContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "#000",
    opacity: 0.5, // Adjust opacity for subtle grid effect
    height: "100%", // Full height for vertical lines, overridden for horizontal lines
    width: .5, // 1px wide for vertical lines, overridden for horizontal lines
  },
  image: {
    position: "absolute",
    top: 112, // equivalent to top-28 in Tailwind units
    left: 20, // equivalent to left-5 in Tailwind units
  },
});

export default SecondGradient;
