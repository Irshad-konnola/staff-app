import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const GradientWithImage = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#000000", "#333333", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      />
      <Image
        source={require("../assets/images/rounded.png")}
        style={styles.logo}
        resizeMode="contain"
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
  logo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    width: "50%",
    height: "50%",
  },
});

export default GradientWithImage;
