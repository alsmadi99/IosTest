import { AppIcon, Languages } from '../common';
import { ProductCardProps, QudsPaintsStore } from '../common/Types';
import { AppTouchableOpacity } from '../components';
import { navigate, push } from '../navigation';
import React, { useEffect, useState } from 'react';
import { ImageBackground } from 'react-native';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToWishlistCall,
  getProductDetailsCall,
  getProductPriceCall,
  removeFromWishlistCall,
} from '../services/api/calls';
import { getWishlistAction } from '../store/actions/AuthActions';
import { addToCartAction } from '../store/actions/CartActions';
import { AppColors } from '../theme';
import {
  configureNextAnimation,
  dimensionsCalculation,
  isRTL,
  ShowToast,
} from '../utils';

const styles = StyleSheet.create({
  gridContainer: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    backgroundColor: AppColors.white,
    borderRadius: dimensionsCalculation(10),
    borderWidth: 0,
    padding: dimensionsCalculation(10),
    paddingTop: dimensionsCalculation(20),
    width: Dimensions.get('screen').width * 0.43,
    minHeight: Dimensions.get('screen').width * 0.4,
    alignItems: 'center',
    marginBottom: dimensionsCalculation(20),
  },
  gridImage: {
    alignSelf: 'center',
    width: Dimensions.get('screen').width * 0.3,
    height: Dimensions.get('screen').width * 0.3,
  },
  gridName: {
    color: AppColors.mainText,
    fontSize: dimensionsCalculation(16),
    textAlign: 'center',
    marginTop: dimensionsCalculation(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  headerBtn: {
    padding: 5,
    overflow: 'visible',
    marginLeft: dimensionsCalculation(4),
  },
});

const ProductCard = ({
  product,
  index,
  displayMode = 'grid',
  hideButtons = false,
  horizontal = false,
  hideDescription = false,
  containerStyle = {},
}: ProductCardProps) => {
  const checkIsFavorite = (): boolean => {
    return (
      wishlist?.findIndex((x) => x?.product?.id == product?.product?.id) != -1
    );
  };

  const { wishlist, user } = useSelector(({ auth }: QudsPaintsStore) => ({
    wishlist: auth?.wishlist,
    user: auth?.user,
  }));
  const dispatch = useDispatch();
  const [isFavourite, setIsFavourite] = useState<boolean>(checkIsFavorite());
  const [temp, setTemp] = useState(false);

  useEffect(() => {
    setIsFavourite(checkIsFavorite());
  }, [wishlist]);

  const doAddToWishlist = async () => {
    const result = await getProductDetailsCall({
      id: product?.product?.id ?? product?.product?.productid ?? '',
    });
    if (result?.data) {
      const result2 = await getProductPriceCall({
        id: product?.product?.id ?? product?.product?.productid ?? '',
        colorid: result?.data?.product?.colors[0]?.id ?? null,
        sizeid: result?.data?.product?.sizes[0]?.id ?? null,
      });
      if (result2?.data) {
        const wishlistResult = await addToWishlistCall({
          id: product?.product?.id ?? product?.product?.productid ?? '',
          attrid: result2?.data?.attrid ?? null,
          quantity: 1,
          tinting: null,
        });
        if (wishlistResult?.data?.result == 1) {
          // configureNextAnimation();
          setIsFavourite((previousValue) => !previousValue);
          await dispatch(getWishlistAction());
          ShowToast(Languages.AddedSuccessfully, 'success');
        } else {
          ShowToast(Languages.Oops);
        }
      } else {
        ShowToast(Languages.Oops);
      }
    } else {
      ShowToast(Languages.Oops);
    }
  };

  const handleWishlist = async () => {
    if (!user)
      return navigate('LoginScreen', {
        extraAction: () => {
          doAddToWishlist();
        },
      });
    if (!user.otpactive)
      return navigate('VerifyOtpScreen', {
        extraAction: () => {
          doAddToWishlist();
        },
      });
    if (isFavourite) {
      const result = await removeFromWishlistCall({
        id: product?.product?.id ?? product?.product?.productid ?? '',
      });
      if (result?.data?.result == 1) {
        // configureNextAnimation();
        setIsFavourite((previousValue) => !previousValue);
        await dispatch(getWishlistAction());
        ShowToast(Languages.RemovedSuccessfully, 'warning');
      } else {
        ShowToast(Languages.Oops);
      }
    } else {
      doAddToWishlist();
    }
  };

  const doAddToCart = async () => {
    const result = await getProductDetailsCall({
      id: product?.product?.id ?? product?.product?.productid ?? '',
    });
    if (result?.data) {
      const result2 = await getProductPriceCall({
        id: product?.product?.id ?? product?.product?.productid ?? '',
        colorid: result?.data?.product?.colors[0]?.id ?? null,
        sizeid: result?.data?.product?.sizes[0]?.id ?? null,
      });
      if (result2?.data) {
        const success = await dispatch(
          addToCartAction(
            product?.product?.id ?? product?.product?.productid ?? '',
            null,
            null,
            1,
            null,
            result2?.data?.attrid ?? null,
          ),
        );
        if (!success) push('ProductDetailsScreen', { product });
      } else {
        push('ProductDetailsScreen', { product });
      }
    } else {
      push('ProductDetailsScreen', { product });
    }
  };

  const addToCart = async () => {
    if (!user)
      return navigate('LoginScreen', {
        extraAction: () => {
          doAddToCart();
        },
      });
    if (!user.otpactive)
      return navigate('VerifyOtpScreen', {
        extraAction: () => {
          doAddToCart();
        },
      });
    if (!product?.product?.can) {
      push('ProductDetailsScreen', { product });
    } else {
      doAddToCart();
    }
  };

  return (
    <AppTouchableOpacity
      androidRippleColor={AppColors.androidRippleColor.black15}
      style={[
        styles.gridContainer,
        !horizontal && index % 2 == 0
          ? { marginHorizontal: dimensionsCalculation(20) }
          : { marginRight: dimensionsCalculation(20) },
        hideButtons && {
          borderRadius: dimensionsCalculation(10),
          width: Dimensions.get('screen').width * 0.4,
        },
        containerStyle,
      ]}
      onPress={() => {
        setTemp(!temp);
        push('ProductDetailsScreen', { product });
      }}>
      {product?.product?.offer && (
        <FastImage
          source={require('../../assets/images/offer.png')}
          style={{
            position: 'absolute',
            top: dimensionsCalculation(hideButtons ? 10 : 5),
            right: isRTL ? null : dimensionsCalculation(hideButtons ? 10 : 5),
            left: !isRTL ? null : dimensionsCalculation(hideButtons ? 10 : 5),
            zIndex: 100,
            width: dimensionsCalculation(30),
            height: dimensionsCalculation(30),
          }}
          resizeMode="contain"
        />
      )}
      <ImageBackground
        source={require('../../assets/images/prodBack.png')}
        style={{
          width: Dimensions.get('screen').width * 0.35,
          height: Dimensions.get('screen').width * 0.3,
          transform: [
            {
              scale: hideDescription ? 0.9 : 1,
            },
          ],
        }}
        resizeMode="contain">
        <FastImage
          source={{
            uri:
              product?.product?.image ?? product?.product?.productimage ?? '',
          }}
          fallback
          defaultSource={require('../../assets/images/qudsLogo.png')}
          style={styles.gridImage}
        />
      </ImageBackground>
      <Text
        style={[
          styles.gridName,
          horizontal && { fontSize: dimensionsCalculation(13) },
        ]}
        numberOfLines={horizontal ? 2 : 2}>
        {product?.product?.name ?? product?.product?.productname ?? ''}
      </Text>
      {!hideDescription && product?.product?.description && (
        <Text
          style={[styles.gridName, { fontSize: dimensionsCalculation(13) }]}
          numberOfLines={2}
          adjustsFontSizeToFit>
          {product?.product?.description ?? ''}
        </Text>
      )}
      {!hideButtons && (
        <View
          style={[
            styles.row,
            {
              marginTop: dimensionsCalculation(0),
              flex: 1,
              alignItems: 'flex-end',
            },
          ]}>
          <AppTouchableOpacity
            // disabled
            androidRippleColor={AppColors.androidRippleColor.black15}
            onPress={handleWishlist}
            borderless
            style={styles.headerBtn}>
            <AppIcon
              style={{}}
              name={isFavourite ? 'heart' : 'hearto'}
              type="AntDesign"
              size={dimensionsCalculation(18)}
              color={isFavourite ? AppColors.secondary : AppColors.black}
            />
          </AppTouchableOpacity>
          <AppTouchableOpacity
            androidRippleColor={AppColors.androidRippleColor.black15}
            onPress={addToCart}
            borderless
            style={styles.headerBtn}>
            <AppIcon
              style={{}}
              name={'shoppingcart'}
              type="AntDesign"
              size={dimensionsCalculation(18)}
              color={AppColors.black}
            />
          </AppTouchableOpacity>
        </View>
      )}
    </AppTouchableOpacity>
  );
};

export default ProductCard;
