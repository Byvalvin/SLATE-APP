import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps, // <-- Import useAnimatedProps
  withRepeat,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import Svg, { Circle, Path, ClipPath, Defs } from 'react-native-svg'; // Rect is not used, can remove

interface LiquidWaveLoaderProps {
  size?: number; // Diameter of the circle
  color?: string; // Color of the liquid
  backgroundColor?: string; // Background color of the circle
}

const LiquidWaveLoader: React.FC<LiquidWaveLoaderProps> = ({
  size = 100,
  color = '#58F157', // Green color
  backgroundColor = '#E0E0E0', // Light grey for the empty part of the bowl
}) => {
  const progress = useSharedValue(0); // For filling the circle
  const waveOffset = useSharedValue(0); // For animating the wave horizontally

  const radius = size / 2;
  const strokeWidth = 5; // Border thickness for the bowl
  const innerRadius = radius - strokeWidth / 2;

  // Wave parameters
  const waveHeight = radius * 0.1; // Amplitude of the wave
  const waveLength = radius * 0.5; // Controls the frequency of the wave

  useEffect(() => {
    // Animate the filling of the circle (e.g., from empty to full over 2 seconds, then reset/loop)
    progress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1, // -1 means infinite repeat
      false // don't reverse the animation
    );

    // Animate the wave movement horizontally
    waveOffset.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.linear }), // Change duration for wave speed
      -1, // Infinite repeat
      false // don't reverse
    );
  }, []);

  // Use useAnimatedProps for animating SVG attributes
  const animatedProps = useAnimatedProps(() => {
    // The fill level based on progress (0 = bottom, 1 = top)
    const fillLevelY = interpolate(progress.value, [0, 1], [size, 0], Extrapolate.CLAMP);

    // Calculate wave points
    let pathData = `M 0 ${fillLevelY}`; // Start at bottom left of the SVG view (or top of the liquid)
    for (let i = 0; i <= size; i += 1) {
      const x = i;
      // Add a small sine wave to the Y coordinate
      // The waveOffset animates the phase of the sine wave
      const y = fillLevelY + waveHeight * Math.sin((x / waveLength) * Math.PI + waveOffset.value * Math.PI * 2);
      pathData += ` L ${x} ${y}`;
    }
    pathData += ` L ${size} ${size} L 0 ${size} Z`; // Close the path to form a filled shape

    return {
      d: pathData, // Return the 'd' attribute directly
    };
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        
        <Circle
          cx={radius}
          cy={radius}
          r={innerRadius}
          fill={backgroundColor}
          stroke={color}
          strokeWidth={strokeWidth}
        />

        
        <Defs>
          <ClipPath id="circleClip">
            <Circle cx={radius} cy={radius} r={innerRadius} />
          </ClipPath>
        </Defs>

       
        <AnimatedPath
          animatedProps={animatedProps} // <-- Use animatedProps here
          fill={color}
          clipPath="url(#circleClip)" // Apply the clip path
        />
      </Svg>
    </View>
  );
};

// Create an Animated version of Path component from react-native-svg
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default LiquidWaveLoader;