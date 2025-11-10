import { AppIcon, Constants, fonts, Languages } from '../common';
import {
  AppHeader,
  AppTabBar,
  AppTouchableOpacity,
  ImageHeader,
  LoadingSpinner,
} from '../components';
import React, { useEffect, useRef, useState } from 'react';
import { Image, RefreshControl } from 'react-native';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modalbox';
import Zoom from 'react-native-zoom-reanimated';

import { getPhotosCall } from '../services/api/calls';
import { AppColors } from '../theme';
import { currencyFormatter, dimensionsCalculation } from '../utils';

export interface AlbumScreenProps {
  route: {
    params: {
      album: any;
    };
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  flatlist: {
    flexGrow: 1,
    paddingTop: Constants.headerHeight,
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
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
  photoThumbnail: {
    width: '95%',
    height: Dimensions.get('screen').width * 0.5,
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

const AlbumScreen = ({ route }: AlbumScreenProps) => {
  const { album } = route?.params;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [photos, setPhotos] = useState<any[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const modalRef = useRef<Modal>();

  useEffect(() => {
    getPhotos();
  }, []);

  useEffect(() => {
    selectedPhoto && modalRef?.current?.open();
  }, [selectedPhoto]);

  const getPhotos = async (
    page = 1,
    isLoading = true,
    isRefreshing = false,
  ) => {
    setPage(page);
    setIsLoading(isLoading);
    setIsRefreshing(isRefreshing);
    const result = await getPhotosCall({
      id: album?.article?.id,
      p: page,
    });
    if (result?.data) {
      page == 1 &&
        result?.data?.imgs?.length == 1 &&
        setSelectedPhoto(result?.data?.imgs[0]);
      setPhotos(
        page == 1 ? [...result.data.imgs] : [...photos, ...result?.data?.imgs],
      );
    }
    setIsLoading(false);
    setIsRefreshing(false);
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <AppTouchableOpacity
      style={{
        flex: 1,
        alignItems: 'center',
        marginBottom: dimensionsCalculation(20),
        maxWidth: Dimensions.get('screen').width * 0.5,
      }}
      onPress={() => {
        setSelectedPhoto(item);
      }}>
      <FastImage
        source={{
          uri: item?.img,
        }}
        style={styles.photoThumbnail}
        fallback
        defaultSource={require('../../assets/images/qudsLogo.png')}
      />
    </AppTouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader />
      <AppTabBar />
      <Modal
        ref={modalRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: AppColors.white,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        coverScreen
        backButtonClose
        backdrop={false}
        swipeToClose={false}
        statusBarTranslucent
        onClosed={() => {
          setSelectedPhoto(null);
        }}>
        <Image
          source={{
            uri: selectedPhoto?.fullimg,
          }}
          onError={() => {
            setSelectedPhoto((prev) => ({
              ...prev,
              fullimg: prev?.img,
            }));
          }}
          style={{
            position: 'absolute',
            zIndex: -1,
            width: 1,
            height: 1,
          }}
        />
        <Zoom
          style={{ width: '100%', height: '100%' }}
          doubleTapConfig={{
            defaultScale: 2,
            minZoomScale: 1,
            maxZoomScale: 4
          }}
        >
          <Image
            source={{ uri: selectedPhoto?.fullimg ?? '' }}
            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          />
        </Zoom>
        <AppTouchableOpacity
          androidRippleColor={AppColors.androidRippleColor.white}
          style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            width: dimensionsCalculation(50),
            height: dimensionsCalculation(50),
            borderRadius: dimensionsCalculation(25),
            alignSelf: 'center',
            position: 'absolute',
            bottom: dimensionsCalculation(20),
            zIndex: 1111,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            modalRef?.current?.close();
          }}>
          <AppIcon
            size={dimensionsCalculation(35)}
            name="close"
            color={AppColors.white}
            type="SimpleLineIcons"
          />
        </AppTouchableOpacity>
      </Modal>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          ListHeaderComponent={
            <ImageHeader
              style={{
                marginBottom: dimensionsCalculation(20),
              }}
              source={require('../../assets/images/photoGallery.png')}
              hideMenuButton>
              <View style={styles.imageHeaderContent}>
                <Text style={styles.switchTxt}>{album.article.name}</Text>
              </View>
            </ImageHeader>
          }
          contentContainerStyle={styles.flatlist}
          keyExtractor={(item, index) => index.toString()}
          data={photos}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              progressViewOffset={dimensionsCalculation(80)}
              refreshing={isRefreshing}
              onRefresh={() => {
                getPhotos();
              }}
            />
          }
          numColumns={2}
        />
      )}
    </View>
  );
};

export default AlbumScreen;
