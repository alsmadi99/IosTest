import React from 'react';
import { Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
    // name can be string (icon name) or number (require(...) for Image)
    name: any;
    type?: string;
    size?: number;
    color?: string;
    style?: any;
    [key: string]: any;
};

const AppIcon: React.FC<Props> = ({ name, type = 'MaterialIcons', size = 20, color, style, ...rest }) => {
    // If passed a local image (require(...)) or explicit Image type, render Image
    if (type === 'Image' || typeof name === 'number') {
        return <Image source={name} style={[{ width: size, height: size }, style]} resizeMode="contain" />;
    }

    let IconComp: any = MaterialIcons;
    switch ((type || '').toString()) {
        case 'AntDesign':
            IconComp = AntDesign;
            break;
        case 'FontAwesome':
            IconComp = FontAwesome;
            break;
        case 'Entypo':
            IconComp = Entypo;
            break;
        case 'Feather':
            IconComp = Feather;
            break;
        case 'Ionicons':
            IconComp = Ionicons;
            break;
        case 'MaterialCommunityIcons':
            IconComp = MaterialCommunityIcons;
            break;
        case 'MaterialIcons':
        default:
            IconComp = MaterialIcons;
    }

    // Ensure name is a string for vector icon components
    return <IconComp name={String(name)} size={size} color={color} style={style} {...rest} />;
};

export default AppIcon;
