import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { Easing, useSharedValue, withRepeat, withTiming, useAnimatedProps } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ParticleBackground = () => {
  // Create separate shared values for each circle
  const translateX1 = useSharedValue(0);
  const translateY1 = useSharedValue(0);
  const translateX2 = useSharedValue(0);
  const translateY2 = useSharedValue(0);
  const translateX3 = useSharedValue(0);
  const translateY3 = useSharedValue(0);

  useEffect(() => {
    // Animate each circle independently
    translateX1.value = withRepeat(
      withTiming(Math.random() * width, { duration: 5000, easing: Easing.linear }),
      -1,
      true
    );
    translateY1.value = withRepeat(
      withTiming(Math.random() * height, { duration: 5000, easing: Easing.linear }),
      -1,
      true
    );

    translateX2.value = withRepeat(
      withTiming(Math.random() * width, { duration: 6000, easing: Easing.linear }),
      -1,
      true
    );
    translateY2.value = withRepeat(
      withTiming(Math.random() * height, { duration: 6000, easing: Easing.linear }),
      -1,
      true
    );

    translateX3.value = withRepeat(
      withTiming(Math.random() * width, { duration: 7000, easing: Easing.linear }),
      -1,
      true
    );
    translateY3.value = withRepeat(
      withTiming(Math.random() * height, { duration: 7000, easing: Easing.linear }),
      -1,
      true
    );
  }, []);

  // Define animated props for each circle
  const animatedProps1 = useAnimatedProps(() => ({
    cx: translateX1.value,
    cy: translateY1.value,
  }));

  const animatedProps2 = useAnimatedProps(() => ({
    cx: translateX2.value,
    cy: translateY2.value,
  }));

  const animatedProps3 = useAnimatedProps(() => ({
    cx: translateX3.value,
    cy: translateY3.value,
  }));

  return (
    <View style={{ position: 'absolute', width, height }}>
      <Svg width={width} height={height}>
        {/* Animated Circles */}
        <AnimatedCircle animatedProps={animatedProps1} r="20" fill="rgba(0, 128, 128, 0.5)" />
        <AnimatedCircle animatedProps={animatedProps2} r="15" fill="rgba(255, 0, 0, 0.5)" />
        <AnimatedCircle animatedProps={animatedProps3} r="10" fill="rgba(0, 0, 255, 0.5)" />
      </Svg>
    </View>
  );
};

export default ParticleBackground;
