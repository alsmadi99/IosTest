import { StyleSheet, Dimensions } from 'react-native';
import { AppColors } from '../theme';
import { fonts } from '../common';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
  responsiveSize,
  responsiveBorderRadius,
  spacing,
  fontSizes,
  getStatusBarHeight,
} from '../utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const responsiveStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  backBtn: {
    position: 'absolute',
    top: getStatusBarHeight() + responsiveSize(5),
    left: responsiveSize(10),
    borderRadius: responsiveBorderRadius(40),
    zIndex: 1500,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: responsiveSize(50),
    height: responsiveSize(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    // paddingTop: Constants.headerHeight + responsiveSize(20),
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  ourProducts: {
    color: '#535353',
    fontSize: fontSizes.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    margin: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderRadius: responsiveBorderRadius(20),
    backgroundColor: AppColors.white,
    padding: spacing.sm,
    marginHorizontal: spacing.xs,
    marginVertical: spacing.xs,
  },
  productImage: {
    width: '100%',
    height: responsiveHeight(120),
    borderRadius: responsiveBorderRadius(10),
    resizeMode: 'contain',
  },
  productInfoContainer: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  productName: {
    fontFamily: fonts.primaryBold,
    fontSize: fontSizes.md,
    textAlign: 'left',
    marginBottom: spacing.xs,
  },
  infoBtn: {
    backgroundColor: AppColors.primary,
    borderRadius: responsiveBorderRadius(20),
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    height: responsiveHeight(20),
    paddingVertical: 0,
  },
  infoBtnTxt: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.primaryBold,
  },
  selectedColor: {
    textAlign: 'left',
    fontFamily: fonts.primaryBold,
    color: AppColors.black,
    fontSize: fontSizes.md,
    marginBottom: spacing.sm,
  },
  color: {
    width: responsiveSize(30),
    height: responsiveSize(30),
    borderRadius: responsiveBorderRadius(15),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  sizeContainer: {
    borderColor: AppColors.mainText,
    borderWidth: 0.3,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    height: responsiveHeight(40),
    borderRadius: responsiveBorderRadius(10),
    marginRight: spacing.xs,
  },
  sizeTxt: {
    color: AppColors.mainText,
    fontSize: fontSizes.sm,
  },
  priceContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    textAlign: 'left',
    fontSize: fontSizes.xxl,
    color: AppColors.mainText,
  },
  qtyBtn: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    borderRadius: responsiveBorderRadius(5),
    width: responsiveSize(30),
    height: responsiveSize(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyTxt: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  addToCartBtn: {
    backgroundColor: AppColors.primary,
    borderRadius: responsiveBorderRadius(10),
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  addToCartTxt: {
    color: AppColors.white,
    fontSize: fontSizes.md,
    fontFamily: fonts.primaryBold,
  },
  // Responsive modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContent: {
    backgroundColor: AppColors.white,
    borderRadius: responsiveBorderRadius(15),
    padding: spacing.lg,
    width: '100%',
    maxWidth: SCREEN_WIDTH * 0.9,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: fontSizes.xl,
    fontFamily: fonts.primaryBold,
    textAlign: 'center',
    marginBottom: spacing.md,
    color: AppColors.mainText,
  },
  modalText: {
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * 1.5,
    textAlign: 'left',
    color: AppColors.inputText,
  },
  // Responsive tab styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    borderRadius: responsiveBorderRadius(10),
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    padding: spacing.xs,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: responsiveBorderRadius(8),
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: AppColors.primary,
  },
  inactiveTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: fontSizes.sm,
    fontFamily: fonts.primaryBold,
  },
  activeTabText: {
    color: AppColors.white,
  },
  inactiveTabText: {
    color: AppColors.mainText,
  },
  // Responsive certificate image
  certificateImg: {
    width: '100%',
    height: responsiveHeight(200),
    borderRadius: responsiveBorderRadius(10),
    resizeMode: 'contain',
  },
  // Responsive loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.white,
  },
  loadingText: {
    fontSize: fontSizes.md,
    color: AppColors.mainText,
    marginTop: spacing.md,
  },
});

// Device-specific style adjustments
export const getDeviceSpecificStyles = () => {
  const { width: SCREEN_WIDTH } = Dimensions.get('window');

  if (SCREEN_WIDTH >= 768) {
    // Tablet styles
    return {
      containerPadding: spacing.xl,
      cardPadding: spacing.lg,
      fontSizeMultiplier: 1.2,
      imageHeight: responsiveHeight(150),
    };
  } else if (SCREEN_WIDTH >= 414) {
    // Large phone styles
    return {
      containerPadding: spacing.lg,
      cardPadding: spacing.md,
      fontSizeMultiplier: 1.1,
      imageHeight: responsiveHeight(130),
    };
  } else if (SCREEN_WIDTH >= 375) {
    // Medium phone styles
    return {
      containerPadding: spacing.md,
      cardPadding: spacing.sm,
      fontSizeMultiplier: 1.0,
      imageHeight: responsiveHeight(120),
    };
  } else {
    // Small phone styles
    return {
      containerPadding: spacing.sm,
      cardPadding: spacing.xs,
      fontSizeMultiplier: 0.9,
      imageHeight: responsiveHeight(100),
    };
  }
};
