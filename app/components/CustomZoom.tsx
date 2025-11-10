import React, { useRef } from 'react';
import {

  PanGestureHandler,
  PinchGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import { Animated, Dimensions } from 'react-native';
import { View } from 'react-native';
interface CustomZoomProps {
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

const CustomZoom: React.FC<CustomZoomProps> = ({
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
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);

  const onPinchGestureEvent = Animated.event([{ nativeEvent: { scale } }], {
    useNativeDriver: false,
  });

  const onPinchStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastScale.current *= event.nativeEvent.scale;
      lastScale.current = Math.max(
        finalMinZoomScale,
        Math.min(finalMaxZoomScale, lastScale.current),
      );
      scale.setValue(lastScale.current);
    }
  };

  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: false },
  );

  const onPanStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastTranslateX.current += event.nativeEvent.translationX;
      lastTranslateY.current += event.nativeEvent.translationY;
      translateX.setValue(lastTranslateX.current);
      translateY.setValue(lastTranslateY.current);
    }
  };

  const onDoubleTap = (event: any) => {
    if (event.nativeEvent.state === State.END) {
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
        lastTranslateX.current = 0;
        lastTranslateY.current = 0;
      } else {
        // Zoom to default scale
        Animated.spring(scale, {
          toValue: finalDefaultScale,
          useNativeDriver: false,
        }).start();
        lastScale.current = finalDefaultScale;
      }
    }
  };

  const animatedStyle = {
    transform: [{ scale }, { translateX }, { translateY }],
  };

  return (
    <View style={[{ flex: 1 }, style]}>
      <TapGestureHandler numberOfTaps={2} onHandlerStateChange={onDoubleTap}>
        <Animated.View style={{ flex: 1 }}>
          <PanGestureHandler
            onGestureEvent={onPanGestureEvent}
            onHandlerStateChange={onPanStateChange}>
            <Animated.View style={{ flex: 1 }}>
              <PinchGestureHandler
                onGestureEvent={onPinchGestureEvent}
                onHandlerStateChange={onPinchStateChange}>
                <Animated.View style={[{ flex: 1 }, animatedStyle]}>
                  {children}
                </Animated.View>
              </PinchGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

export default CustomZoom;
