import { Constants, fonts, Languages } from '../common';
import {
  QudsPaintsStore,
  Photo,
  PhotoGalleryScreenProps,
  PhotoGalleryScreenState,
} from '../common/Types';
import {
  AppButton,
  AppHeader,
  AppTabBar,
  AppTouchableOpacity,
  ImageHeader,
  LoadingSpinner,
} from '../components';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { AppColors } from '../theme';
import {
  configureNextScaleAnimation,
  currencyFormatter,
  dimensionsCalculation,
  isIOS,
} from '../utils';
import { albumsGetCall, galleryGetCall } from '../services/api/calls';
import { navigate, replace } from '../navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  imageHeaderContent: {
    justifyContent: 'flex-end',
    paddingBottom: dimensionsCalculation(20),
    paddingLeft: dimensionsCalculation(20),
    height: '100%',
  },
  switchTxt: {
    textAlign: 'left',
    fontSize: dimensionsCalculation(25),
    color: AppColors.white,
    fontFamily: fonts.primaryBold,
    lineHeight: dimensionsCalculation(33.5),
    marginBottom: dimensionsCalculation(5),
  },
  switchBtn: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.secondary,
    borderRadius: dimensionsCalculation(20),
    paddingHorizontal: dimensionsCalculation(10),
    marginBottom: dimensionsCalculation(20),
  },
  listStyle: {
    flexGrow: 1,
    paddingTop: Constants.headerHeight,
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
  },
  photoThumbnail: {
    width: '95%',
    height: Dimensions.get('screen').width * 0.3,
  },
  photoTitle: {
    textAlign: 'left',
    alignSelf: 'stretch',
    paddingHorizontal: '2.5%',
    fontSize: dimensionsCalculation(12),
    marginVertical: dimensionsCalculation(5),
    color: '#66696B',
    fontFamily: fonts.primaryBold,
  },
  photoFooter: {
    alignSelf: 'stretch',
    paddingHorizontal: '2.5%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoStyle: {
    width: dimensionsCalculation(42),
    height: dimensionsCalculation(20),
  },
  separator: {
    height: dimensionsCalculation(15),
    marginHorizontal: dimensionsCalculation(15),
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  views: {
    color: '#919294',
    fontSize: dimensionsCalculation(14),
  },
});

class PhotoGalleryScreen extends Component<
  PhotoGalleryScreenProps,
  PhotoGalleryScreenState
> {
  pagenumber = 1;
  constructor(props: PhotoGalleryScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      isRefreshing: false,
      isFetchingMore: false,
      photos: [],
      types: [],
      selectedType: null,
      pages: 0,
    };
  }

  componentDidMount = () => {
    this.photosGet();
  };

  photosGet = (
    isLoading: boolean = true,
    isRefreshing: boolean = false,
    isFetchingMore: boolean = false,
  ) => {
    this.setState(
      {
        isLoading,
        isRefreshing,
        isFetchingMore,
      },
      async () => {
        const result = await galleryGetCall({
          p: 1,
        });
        if (result?.data?.types) {
          let newPhotos = [];
          const res = await albumsGetCall({
            id: this.state.selectedType,
            p: this.pagenumber++,
          });
          configureNextScaleAnimation();
          if (res.data) {
            newPhotos =
              isRefreshing || isLoading
                ? res?.data?.articles
                : [...this.state.photos, ...res?.data?.articles];
          }
          this.setState(
            {
              photos: newPhotos,
              types: result?.data?.types,
              pages: res?.data?.pages,
              isLoading: false,
              isRefreshing: false,
              isFetchingMore: false,
            },
            () => { },
          );
        } else {
          this.setState(
            {
              isLoading: false,
              isRefreshing: false,
              isFetchingMore: false,
            },
            () => { },
          );
        }
      },
    );
  };

  renderPhoto = ({ item, index }: { item: Photo; index: number }) => {
    return (
      <AppTouchableOpacity
        style={{
          flex: 1,
          alignItems: 'center',
          marginBottom: dimensionsCalculation(20),
          maxWidth: Dimensions.get('screen').width * 0.5,
        }}
        onPress={() => {
          navigate('AlbumScreen', {
            album: item,
          });
        }}>
        <FastImage
          source={{
            uri: item?.article?.image,
          }}
          style={styles.photoThumbnail}
          fallback
          defaultSource={require('../../assets/images/qudsLogo.png')}
        />
        <Text style={styles.photoTitle} numberOfLines={1}>
          {item?.article?.name}
        </Text>
        <View style={styles.photoFooter}>
          <FastImage
            source={require('../../assets/images/logo.png')}
            style={styles.logoStyle}
            resizeMode="contain"
          />
          {/* <View style={styles.separator} /> */}
          {false && (
            <Text style={styles.views}>
              {currencyFormatter(item?.article?.views ?? 0, {}) +
                ` ${Languages.Veiws.toLowerCase()}`}
            </Text>
          )}
        </View>
      </AppTouchableOpacity>
    );
  };

  render() {
    const {
      isLoading,
      isRefreshing,
      isFetchingMore,
      photos,
      pages,
      types,
      selectedType,
    } = this.state;
    return (
      <View style={styles.container}>
        <AppHeader />
        <AppTabBar />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {isIOS && isRefreshing && <LoadingSpinner overlay />}
            <FlatList
              ListHeaderComponent={
                <View style={{}}>
                  <ImageHeader
                    style={
                      {
                        // width: Dimensions.get('screen').width * 2,
                      }
                    }
                    source={require('../../assets/images/photoGallery.png')}
                    hideMenuButton>
                    <View style={styles.imageHeaderContent}>
                      <Text style={styles.switchTxt}>
                        {Languages.PhotoGallery}
                      </Text>
                      <AppButton
                        onPress={() => {
                          replace('VideoGalleryScreen');
                        }}
                        text={Languages.SwitchToVideo}
                        textColor={AppColors.mainText}
                        containerStyle={styles.switchBtn}
                        androidRippleColor={AppColors.androidRippleColor.white}
                        textStyle={{
                          fontSize: dimensionsCalculation(10),
                        }}
                      />
                    </View>
                  </ImageHeader>
                  <FlatList
                    contentContainerStyle={{
                      marginVertical: dimensionsCalculation(10),
                      paddingRight: dimensionsCalculation(10),
                    }}
                    data={[{ all: true, type: { name: Languages.All } }, ...types]}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                      <AppButton
                        onPress={() => {
                          this.setState(
                            {
                              selectedType:
                                selectedType == item?.type?.id || item?.all
                                  ? null
                                  : item?.type?.id,
                            },
                            () => {
                              this.pagenumber = 1;
                              this.photosGet(false, true);
                            },
                          );
                        }}
                        textColor={
                          item?.type?.id == selectedType ||
                            (!selectedType && item?.all)
                            ? AppColors.white
                            : AppColors.black
                        }
                        androidRippleColor={
                          item?.type?.id == selectedType ||
                            (!selectedType && item?.all)
                            ? AppColors.androidRippleColor.white
                            : AppColors.androidRippleColor.black15
                        }
                        text={item?.type?.name}
                        textStyle={{
                          fontFamily: fonts.primaryRegular,
                        }}
                        containerStyle={{
                          backgroundColor:
                            item?.type?.id == selectedType ||
                              (!selectedType && item?.all)
                              ? AppColors.primary
                              : AppColors.white,
                          borderRadius: dimensionsCalculation(10),
                          marginLeft: dimensionsCalculation(5),
                          borderWidth: 0.5,
                          borderColor: 'rgba(0,0,0,0.3)',
                          paddingHorizontal: dimensionsCalculation(10),
                        }}
                      />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              }
              ListFooterComponent={
                isFetchingMore ? (
                  <View
                    style={{
                      paddingVertical: dimensionsCalculation(10),
                      alignItems: 'center',
                    }}>
                    <ActivityIndicator color={AppColors.primary} size="small" />
                  </View>
                ) : null
              }
              refreshControl={
                <RefreshControl
                  progressViewOffset={dimensionsCalculation(80)}
                  refreshing={isRefreshing}
                  onRefresh={() => {
                    this.pagenumber = 1;
                    this.photosGet(false, true, false);
                  }}
                />
              }
              onEndReached={() => {
                if (this.pagenumber <= pages && !isFetchingMore)
                  this.photosGet(false, false, true);
              }}
              contentContainerStyle={styles.listStyle}
              keyExtractor={(item, index) => index.toString()}
              data={photos}
              numColumns={2}
              renderItem={this.renderPhoto}
            />
          </>
        )}
      </View>
    );
  }
}

const mapStateToProps = ({ auth }: QudsPaintsStore) => {
  return {
    user: auth?.user,
  };
};

export default connect(mapStateToProps, null)(PhotoGalleryScreen);
