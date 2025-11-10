import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { Languages } from '../common';
import { AppHeader } from '../components';
import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import { View, Text } from 'react-native';
import { AppColors } from '../theme';
import { dimensionsCalculation } from '../utils';

export interface SomethingWentWrongProps {
  onReload: () => void;
  navigation: StackNavigationProp<{}> | BottomTabNavigationProp<{}>;
  headerText: string;
}

export default function SomethingWentWrong({
  navigation,
  onReload,
  headerText,
}: SomethingWentWrongProps) {
  return (
    <View style={styles.container}>
      <AppHeader navigation={navigation} text={headerText} />
      <View style={styles.subContainer}>
        <Image
          source={require('../../assets/images/smthWentWrong.png')}
          style={styles.iconStyle}
        />
        <TouchableOpacity
          style={{}}
          onPress={() => {
            try {
              onReload();
            } catch (error) {
              __DEV__ && console.error('erroe', error);
            }
          }}>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              paddingHorizontal: dimensionsCalculation(30),
              color: AppColors.primary,
            }}>
            {Languages.SomethingWentWrong}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    width: Dimensions.get('screen').width * 0.5,
    resizeMode: 'contain',
    height: Dimensions.get('screen').width * 0.5,
    marginBottom: dimensionsCalculation(20),
  },
});
