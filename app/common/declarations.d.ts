declare module 'react-native-modalbox' {
    import * as React from 'react';
    import { ViewStyle } from 'react-native';

    export interface ModalProps {
        isOpen?: boolean;
        style?: ViewStyle | ViewStyle[];
        backdrop?: boolean;
        backdropOpacity?: number;
        backdropColor?: string;
        backdropPressToClose?: boolean;
        swipeToClose?: boolean;
        backButtonClose?: boolean;
        coverScreen?: boolean;
        animationDuration?: number;
        onClosed?: () => void;
        onOpened?: () => void;
        position?: 'top' | 'center' | 'bottom';
        ref?: any;
    }

    export default class Modal extends React.Component<ModalProps> { }
}
