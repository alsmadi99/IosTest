import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { PlusMinusButtonsProps } from '../common/Types';
import { dimensionsCalculation } from '../utils';
import { AppColors } from '../theme';
import { AppTouchableOpacity } from '../components';
import { AppIcon } from '../common';
import { decreaseCartItemCall } from '../services/api/calls';
import { useDispatch } from 'react-redux';
import {
  addToCartAction,
  decreaseCartItemAction,
} from '../store/actions/CartActions';

const styles = StyleSheet.create({
  container: {
    marginTop: dimensionsCalculation(5),
    backgroundColor: AppColors.white,
    borderRadius: dimensionsCalculation(20),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
    minWidth: dimensionsCalculation(70),
  },
  btn: {
    overflow: 'visible',
    padding: dimensionsCalculation(5),
    paddingHorizontal: dimensionsCalculation(10),
    alignSelf: 'center',
  },
  currentValue: {
    textAlign: 'center',
    fontSize: dimensionsCalculation(11),
    color: AppColors.white,
  },
  currentValueContainer: {
    width: dimensionsCalculation(22),
    height: dimensionsCalculation(22),
    backgroundColor: AppColors.primary,
    borderRadius: dimensionsCalculation(15),
    margin: dimensionsCalculation(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const PlusMinusButtons = ({
  item,
  value,
  onPlus,
  onMinus,
  onLoading,
}: PlusMinusButtonsProps) => {
  const dispatch = useDispatch();
  const [currentValue, setCurrentValue] = useState<number>(value);
  const [isIncreasing, setIsIncreasing] = useState<boolean>(false);
  const [isDecreasing, setIsDecreasing] = useState<boolean>(false);

  useEffect(() => {
    setCurrentValue(value);
    return () => { };
  }, [value]);

  const handleChange = async (newValue) => {
    try {
      if (newValue > value) {
        const result = await dispatch(
          addToCartAction(
            item?.item?.productid,
            item?.item?.colorid,
            item?.item?.sizeid,
            1,
            item?.item?.tinting ? '1' : null,
            item?.item?.attrid,
          ),
        );
        return result;
      } else {
        const result = await dispatch(
          decreaseCartItemAction({
            productid: item?.item?.productid,
            // colorid: item?.item?.colorid ?? null,
            // sizeid: item?.item?.sizeid ?? null,
            quantity: parseFloat(item?.item?.quantity) - 1,
            attrid: item?.item?.attrid,
          }),
        );
        return result;
      }
    } catch (error) {
      __DEV__ && console.error(JSON.stringify(error));
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          flex: 1,
        }}>
        <AppTouchableOpacity
          androidRippleColor={AppColors.androidRippleColor.black15}
          style={styles.btn}
          borderless
          disabled={isIncreasing || isDecreasing || currentValue <= 1}
          onPress={async () => {
            // onLoading(true);
            setIsDecreasing(true);
            const result = await handleChange(currentValue - 1);
            if (result) {
              await setCurrentValue((prev) => prev - 1);
              onMinus(currentValue - 1);
            }
            setIsDecreasing(false);
            // onLoading(false);
          }}>
          {isDecreasing ? (
            <ActivityIndicator color={AppColors.primary} size="small" />
          ) : (
            <AppIcon
              name="minus"
              type="FontAwesome"
              color={AppColors.primary}
              size={dimensionsCalculation(14)}
            />
          )}
        </AppTouchableOpacity>
        <AppTouchableOpacity
          androidRippleColor={AppColors.androidRippleColor.black15}
          style={styles.btn}
          borderless
          disabled={isIncreasing || isDecreasing}
          onPress={async () => {
            // onLoading(true);
            setIsIncreasing(true);
            const result = await handleChange(currentValue + 1);
            if (result) {
              setCurrentValue((prev) => prev + 1);
              onMinus(currentValue + 1);
            }
            setIsIncreasing(false);
            // onLoading(false);
          }}>
          {isIncreasing ? (
            <ActivityIndicator color={AppColors.primary} size="small" />
          ) : (
            <AppIcon
              name="plus"
              type="FontAwesome"
              color={AppColors.primary}
              size={dimensionsCalculation(14)}
            />
          )}
        </AppTouchableOpacity>
      </View>
      <View style={styles.currentValueContainer}>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={styles.currentValue}>
          {currentValue}
        </Text>
      </View>
    </View>
  );
};

export default PlusMinusButtons;
