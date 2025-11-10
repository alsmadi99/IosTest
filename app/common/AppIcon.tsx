import React from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import { IconType } from './Types';

interface Props {
  type?: IconType;
  name: string;
  color?: string;
  size?: number;
  style?: StyleProp<TextStyle | ViewStyle>;
  onPress?: (e?: GestureResponderEvent) => void;
  useDefaultColors?: boolean;
}

const iconMap: Record<string, any> = {
  SimpleLineIcons,
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
};

const AppIcon = ({
  type = 'MaterialIcons',
  name,
  color = '#000',
  size = 20,
  style,
  onPress,
  useDefaultColors = false,
}: Props) => {
  // Handle Image icons separately
  if (type === 'Image') {
    const content = (
      <Image
        source={name}
        style={[
          { width: size, height: size },
          !useDefaultColors && { tintColor: color },
          style,
        ]}
        resizeMode="contain"
      />
    );
    return onPress ? (
      <TouchableOpacity
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={onPress}
        style={style}
      >
        {content}
      </TouchableOpacity>
    ) : (
      <View style={style}>{content}</View>
    );
  }

  // For vector icons
  const IconComponent = iconMap[type] || FontAwesome;

  const content = (
    <IconComponent name={name} size={size} color={color} style={style} />
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={style}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default AppIcon;
