import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GradientBackground = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#000000', '#333333', '#000000']}
        start={{ x: 3, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default GradientBackground;