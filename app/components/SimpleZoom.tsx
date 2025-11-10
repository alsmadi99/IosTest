import React, {useRef} from 'react';
import {View, TouchableOpacity, Animated} from 'react-native';

interface SimpleZoomProps {
  children: React.ReactNode;
  style?: any;
  minZoomScale?: number;
  maxZoomScale?: number;
  defaultScale?: number;
  doubleTapConfig?: {
    defaultScale?: number;
    minZoomScale?: number;
    maxZoomScale?: number;
  };
}

const SimpleZoom: React.FC<SimpleZoomProps> = ({
  children,
  style,
  minZoomScale = 1,
  maxZoomScale = 4,
  defaultScale = 1,
  doubleTapConfig,
}) => {
  // Use doubleTapConfig values if provided, otherwise fall back to individual props
  const finalMinZoomScale = doubleTapConfig?.minZoomScale ?? minZoomScale;
  const finalMaxZoomScale = doubleTapConfig?.maxZoomScale ?? maxZoomScale;
  const finalDefaultScale = doubleTapConfig?.defaultScale ?? defaultScale;

  const scale = useRef(new Animated.Value(finalDefaultScale)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScale = useRef(finalDefaultScale);

  const onDoubleTap = () => {
    if (lastScale.current > 1) {
      // Reset to normal scale
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: false,
        }),
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: false,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: false,
        }),
      ]).start();
      lastScale.current = 1;
    } else {
      // Zoom to default scale
      Animated.spring(scale, {
        toValue: finalDefaultScale,
        useNativeDriver: false,
      }).start();
      lastScale.current = finalDefaultScale;
    }
  };

  const animatedStyle = {
    transform: [{scale}, {translateX}, {translateY}],
  };

  return (
    <View style={[{flex: 1}, style]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onDoubleTap}
        style={{flex: 1}}>
        <Animated.View style={[{flex: 1}, animatedStyle]}>
          {children}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default SimpleZoom;
