import { AppIcon, Constants, fonts, Languages } from '../common';
import {
  TechnicalExcellence,
  TechnicalExcellenceScreenProps,
  TechnicalExcellenceScreenState,
} from '../common/Types';
import {
  AppButton,
  AppHeader,
  AppTabBar,
  AppTouchableOpacity,
  LoadingSpinner,
} from '../components';
import React, { Component, createRef, RefObject } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Image
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modalbox';
import Zoom from 'react-native-zoom-reanimated';
import { AppColors } from '../theme';
import {
  configureNextScaleAnimation,
  dimensionsCalculation,
  getStatusBarHeight,
  isRTL,
  ShowToast,
} from '../utils';
import { technicalGetCall } from '../services/api/calls';
import { goBack, navigate, navigationRef } from '../navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7E5E4',
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(10),
  },
  flatlist: {
    paddingTop: Constants.headerHeight,
  },
  dotsContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    paddingHorizontal: dimensionsCalculation(20),
    width: Dimensions.get('screen').width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    alignSelf: 'center',
    width: Dimensions.get('screen').width * 0.7,
    resizeMode: 'contain',
    height: Dimensions.get('screen').width * 0.7,
    marginBottom: dimensionsCalculation(30),
  },
  itemTitle: {
    fontSize: dimensionsCalculation(14),
    color: '#575757',
    textAlign: 'center',
    fontFamily: fonts.primaryBold,
    marginBottom: dimensionsCalculation(10),
  },
  itemCode: {
    fontSize: dimensionsCalculation(14),
    color: '#575757',
    textAlign: 'center',
  },
  modalStyle: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: AppColors.transparent,
    justifyContent: 'center',
  },
  closeBtn: {
    overflow: 'visible',
    alignSelf: 'flex-start',
    padding: dimensionsCalculation(5),
    marginTop: dimensionsCalculation(10),
  },
});

export default class TechnicalExcellenceScreen extends Component<
  TechnicalExcellenceScreenProps,
  TechnicalExcellenceScreenState
> {
  flatListRef = null as RefObject<FlatList>;
  photoModalRef = null as RefObject<Modal>;
  interval = null;
  pagenumber = 1;
  constructor(props: TechnicalExcellenceScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      items: [],
      currentIndex: 0,
    };
    this.flatListRef = createRef();
    this.photoModalRef = createRef();
  }

  componentDidMount = () => {
    this.getItems();
  };

  getItems = () => {
    this.setState(
      {
        isLoading: true,
      },
      async () => {
        const result = await technicalGetCall({
          p: this.pagenumber,
        });
        if (result?.data?.articles) {
          configureNextScaleAnimation();
          this.setState(
            {
              isLoading: false,
              items: result?.data?.articles,
            },
            () => {
              this.interval && clearInterval(this.interval);
              this.prepareInterval();
            },
          );
        } else {
          goBack();
          ShowToast(Languages.Oops);
        }
      },
    );
  };

  prepareInterval = () => {
    this.interval = setInterval(() => {
      configureNextScaleAnimation();
      setTimeout(() => {
        this.flatListRef.current.scrollToOffset({
          animated: true,
          offset:
            this.state.currentIndex == this.state.items?.length - 1
              ? 0
              : (this.state.currentIndex + 1) * Dimensions.get('screen').width,
        });
      }, 0);
    }, 3000);
  };

  componentWillUnmount = () => {
    this.interval && clearInterval(this.interval);
  };

  renderItem = ({ item, index }: { item: TechnicalExcellence; index: number }) => {
    return (
      <View style={styles.itemContainer}>
        <AppTouchableOpacity
          androidRippleColor={AppColors.transparent}
          style={{}}
          onPress={() => {
            // this.interval && clearInterval(this.interval);
            // this.photoModalRef?.current?.open();
            navigate('TechnicalDetailsScreen', {
              item,
            });
          }}>
          <FastImage
            source={{
              uri: item?.article?.image ?? '',
            }}
            fallback
            defaultSource={require('../../assets/images/qudsLogo.png')}
            style={styles.itemImage}
          />
          <View style={{}}>
            <Text style={styles.itemTitle}>{item?.article?.name}</Text>
            <Text style={styles.itemCode} numberOfLines={1}>
              {item?.article?.shortdescription}
            </Text>
            <AppButton
              onPress={() => {
                navigate('TechnicalDetailsScreen', {
                  item,
                });
              }}
              text={Languages.SeeMore}
              containerStyle={{
                marginTop: dimensionsCalculation(10),
                backgroundColor: AppColors.primary,
              }}
              textStyle={{
                fontFamily: fonts.primaryRegular,
                color: AppColors.white,
              }}
            />
          </View>
        </AppTouchableOpacity>
      </View>
    );
  };

  renderImageModal = () => {
    const { currentIndex, items } = this.state;
    return (
      <Modal
        ref={this.photoModalRef}
        coverScreen
        statusBarTranslucent
        style={[styles.modalStyle, { backgroundColor: AppColors.white }]}
        backButtonClose
        animationDuration={300}
        onClosed={() => {
          this.prepareInterval();
        }}
        onOpened={() => {
          this.interval && clearInterval(this.interval);
        }}
        backdrop={false}
        swipeToClose={false}>
        <AppTouchableOpacity
          androidRippleColor={AppColors.androidRippleColor.black15}
          borderless
          style={[
            styles.closeBtn,
            {
              position: 'absolute',
              top: getStatusBarHeight(),
              marginLeft: dimensionsCalculation(10),
              zIndex: 1500,
            },
          ]}
          onPress={() => {
            this.photoModalRef?.current?.close();
          }}>
          <AppIcon
            name="closecircle"
            type="AntDesign"
            size={dimensionsCalculation(26)}
            color={AppColors.primary}
          />
        </AppTouchableOpacity>
        <Zoom
          style={{ flex: 1, marginHorizontal: dimensionsCalculation(20) }}
          doubleTapConfig={{
            defaultScale: 2,
            minZoomScale: 1,
            maxZoomScale: 4,
          }}
        >
          <Image
            source={{ uri: items[currentIndex]?.article?.image ?? '' }}
            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          />
        </Zoom>
      </Modal>
    );
  };

  onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.setState(
      {
        currentIndex: Math.round(
          e.nativeEvent?.contentOffset?.x / Dimensions.get('screen').width,
        ),
      },
      () => { },
    );
  };

  render() {
    const { isLoading, items, currentIndex } = this.state;
    return (
      <View style={styles.container}>
        <AppHeader />
        <AppTabBar />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {this.renderImageModal()}
            <FlatList
              ref={this.flatListRef}
              contentContainerStyle={styles.flatlist}
              showsHorizontalScrollIndicator={false}
              onScroll={this.onScroll}
              onTouchStart={() => {
                this.interval && clearInterval(this.interval);
              }}
              onTouchCancel={() => {
                this.interval && clearInterval(this.interval);
                this.prepareInterval();
              }}
              horizontal
              pagingEnabled
              scrollEventThrottle={16}
              getItemLayout={(data, index) => {
                return {
                  index: index,
                  offset: Dimensions.get('screen').width,
                  length: index * Dimensions.get('screen').width,
                };
              }}
              decelerationRate="fast"
              keyExtractor={(item, index) => index.toString()}
              data={items}
              renderItem={this.renderItem}
            />
            <View style={styles.dotsContainer}>
              {items?.map((_, index) => (
                <AppIcon
                  name={index == currentIndex ? 'circle' : 'circle-thin'}
                  type="FontAwesome"
                  size={dimensionsCalculation(13)}
                  color={AppColors.mainText}
                  style={{ marginHorizontal: dimensionsCalculation(3) }}
                />
              ))}
            </View>
          </>
        )}
      </View>
    );
  }
}
