import { AppIcon, Constants, fonts, Languages } from '../common';
import {
  QudsPaintsStore,
  Video,
  VideoGalleryScreenProps,
  VideoGalleryScreenState,
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
  Linking,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { AppColors } from '../theme';
import {
  configureNextScaleAnimation,
  currencyFormatter,
  dimensionsCalculation,
  getStatusBarHeight,
  isIOS,
  isRTL,
} from '../utils';
import { replace } from '../navigation';
import { videosGetCall } from '../services/api/calls';
import Modal from 'react-native-modalbox';
import WebView from 'react-native-webview';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  imageHeaderContent: {
    alignSelf: isRTL ? 'flex-start' : 'flex-end',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: getStatusBarHeight() + dimensionsCalculation(5),
    left: dimensionsCalculation(10),
    borderRadius: dimensionsCalculation(40),
    zIndex: 1500,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: dimensionsCalculation(50),
    height: dimensionsCalculation(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchTxt: {
    fontSize: dimensionsCalculation(25),
    color: AppColors.mainText,
    fontFamily: fonts.primaryBold,
    lineHeight: dimensionsCalculation(30),
    marginBottom: dimensionsCalculation(5),
  },
  switchBtn: {
    backgroundColor: AppColors.primary,
    borderRadius: dimensionsCalculation(20),
    paddingHorizontal: dimensionsCalculation(10),
  },
  listStyle: {
    flexGrow: 1,
    paddingTop: Constants.headerHeight,
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
  },
  videoCard: {
    flex: 1,
    alignItems: 'center',
    marginBottom: dimensionsCalculation(20),
    maxWidth: Dimensions.get('screen').width * 0.5,
  },
  videoThumbnail: {
    width: '95%',
    height: Dimensions.get('screen').width * 0.3,
  },
  videoTitle: {
    textAlign: 'left',
    alignSelf: 'stretch',
    paddingHorizontal: '2.5%',
    fontSize: dimensionsCalculation(12),
    marginVertical: dimensionsCalculation(5),
    color: '#66696B',
    fontFamily: fonts.primaryBold,
  },
  videoFooter: {
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

class VideoGalleryScreen extends Component<
  VideoGalleryScreenProps,
  VideoGalleryScreenState
> {
  pagenumber = 1;
  constructor(props: VideoGalleryScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      isRefreshing: false,
      isFetchingMore: false,
      videos: [],
      pages: 0,
      videoURL: null,
    };
  }

  componentDidMount = () => {
    this.videosGet();
  };

  videosGet = (
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
        const result = await videosGetCall({
          p: this.pagenumber++,
        });
        const newVideos = result?.data?.articles;
        configureNextScaleAnimation();
        if (result?.data?.articles) {
          this.setState(
            {
              videos: isRefreshing
                ? newVideos
                : [...this.state.videos, ...newVideos],
              pages: result?.data?.pages,
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

  renderVideo = ({ item, index }: { item: Video; index: number }) => {
    return (
      <AppTouchableOpacity
        style={styles.videoCard}
        onPress={async () => {
          try {
            this.setState(
              {
                videoURL: `https://www.youtube.com/embed/${item?.article?.youtubecode}?rel=0`,
              },
              () => { },
            );
          } catch (error) { }
        }}>
        <FastImage
          source={{
            uri: item?.article?.image ?? '',
          }}
          fallback
          defaultSource={require('../../assets/images/qudsLogo.png')}
          style={styles.videoThumbnail}
        />
        <Text style={styles.videoTitle}>{item?.article?.name}</Text>
        <View style={styles.videoFooter}>
          <FastImage
            source={require('../../assets/images/logo.png')}
            style={styles.logoStyle}
            resizeMode="contain"
          />
          <View style={styles.separator} />
          <Text style={styles.views}>
            {currencyFormatter(item?.article?.views ?? 0, {}) +
              ` ${Languages.Veiws.toLowerCase()}`}
          </Text>
        </View>
      </AppTouchableOpacity>
    );
  };

  renderModal = () => {
    const { videoURL } = this.state;
    return (
      <Modal
        isOpen={videoURL != null}
        coverScreen
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: AppColors.white,
        }}
        backdropPressToClose={false}
        backButtonClose
        swipeToClose={false}
        onOpened={() => {
        }}
        onClosed={() => {
          this.setState(
            {
              videoURL: null,
            },
            () => { },
          );
        }}>
        <AppTouchableOpacity
          androidRippleColor={AppColors.androidRippleColor.white}
          style={styles.backBtn}
          // borderless
          onPress={() => {
            this.setState(
              {
                videoURL: null,
              },
              () => { },
            );
          }}>
          <AppIcon
            name={isRTL ? 'chevron-thin-right' : 'chevron-thin-left'}
            size={dimensionsCalculation(25)}
            color={AppColors.black}
            type="Entypo"
            style={{
              marginLeft: isRTL ? 0 : -5,
              marginRight: isRTL ? 0 : -5,
            }}
          />
        </AppTouchableOpacity>
        <WebView
          style={{ flex: 1 }}
          containerStyle={{
            flexGrow: 1,
          }}
          source={{
            uri: videoURL,
          }}
          startInLoadingState
          renderLoading={() => <LoadingSpinner overlay />}
        />
      </Modal>
    );
  };

  render() {
    const {
      isLoading,
      isRefreshing,
      isFetchingMore,
      videos,
      pages,
      videoURL,
    } = this.state;
    return (
      <View style={styles.container}>
        <AppHeader />
        <AppTabBar />
        {videoURL != null && this.renderModal()}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {isIOS && isRefreshing && <LoadingSpinner overlay />}
            <FlatList
              ListHeaderComponent={
                <ImageHeader
                  style={{
                    marginBottom: dimensionsCalculation(20),
                  }}
                  source={require('../../assets/images/videoGallery.png')}
                  hideMenuButton>
                  <View style={styles.imageHeaderContent}>
                    <Text style={styles.switchTxt}>
                      {Languages.VideoGallery}
                    </Text>
                    <AppButton
                      onPress={() => {
                        replace('PhotoGalleryScreen');
                      }}
                      text={Languages.SwitchToPhoto}
                      textColor={AppColors.white}
                      containerStyle={styles.switchBtn}
                      androidRippleColor={AppColors.androidRippleColor.white}
                      textStyle={{
                        fontSize: dimensionsCalculation(10),
                      }}
                    />
                  </View>
                </ImageHeader>
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
                    this.videosGet(false, true, false);
                  }}
                />
              }
              onEndReached={() => {
                if (this.pagenumber <= pages && !isFetchingMore)
                  this.videosGet(false, false, true);
              }}
              contentContainerStyle={styles.listStyle}
              keyExtractor={(item, index) => index.toString()}
              data={videos}
              numColumns={2}
              renderItem={this.renderVideo}
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

export default connect(mapStateToProps, null)(VideoGalleryScreen);
