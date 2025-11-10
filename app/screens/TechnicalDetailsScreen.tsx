import { AppIcon, Constants, fonts, Languages } from '../common';
import { TechnicalExcellence } from '../common/Types';
import {
  AppHeader,
  AppTabBar,
  AppTouchableOpacity,
  LoadingSpinner,
} from '../components';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getTechnicalExcelence } from '../services/api/calls';
import { AppColors } from '../theme';
import {
  dimensionsCalculation,
  isIOS,
  isRTL,
  requestExternalStoragePermission,
  ShowToast,
} from '../utils';
import RNFetchBlob from 'rn-fetch-blob';
import AutoHeightWebView from 'react-native-autoheight-webview';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  scrollview: {
    paddingTop: Constants.headerHeight,
    paddingBottom: dimensionsCalculation(20) + Constants.tabBarHeight,
  },
  toggleAttachmentsBtn: {
    flexDirection: 'row',
    marginHorizontal: dimensionsCalculation(10),
    paddingHorizontal: dimensionsCalculation(10),
    marginBottom: dimensionsCalculation(20),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showAttachments: {
    marginLeft: dimensionsCalculation(10),
    color: AppColors.mainText,
    fontSize: dimensionsCalculation(20),
  },
  itemImage: {
    marginTop: dimensionsCalculation(10),
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
});

export interface TechnicalDetailsScreenProps {
  route: {
    params: {
      item: TechnicalExcellence;
    };
  };
}

const TechnicalDetailsScreen = ({ route }: TechnicalDetailsScreenProps) => {
  const [item, setItem] = useState<TechnicalExcellence>(route?.params?.item);
  const [textHeight, setTextHeight] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isWebLoading, setIsWebLoading] = useState<boolean>(true);
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [isAttachmentsVisible, setIsAttachmentsVisible] =
    useState<boolean>(false);

  useEffect(() => {
    getItem();
  }, []);

  const getItem = async () => {
    const result = await getTechnicalExcelence({
      id: item?.article?.id ?? item?.id,
    });
    try {
      if (result?.data) {
        setItem(result?.data);
      }
    } catch (error) {
      __DEV__ && console.error('err', error + '');
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      <AppTabBar />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollview}>
          <View
            onLayout={() => {
              setTimeout(() => {
                setShowWebView(true);
              }, 50);
            }}
            style={{}}>
            <View style={{ paddingHorizontal: dimensionsCalculation(20) }}>
              <Text style={styles.itemTitle}>{item?.name}</Text>
            </View>
            <AppTouchableOpacity
              androidRippleColor={AppColors.androidRippleColor.black15}
              style={[
                styles.toggleAttachmentsBtn,
                isAttachmentsVisible && {
                  marginBottom: dimensionsCalculation(0),
                },
              ]}
              onPress={() => {
                setIsAttachmentsVisible((prev) => !prev);
              }}>
              <View style={styles.row}>
                <AppIcon
                  name="file"
                  type="FontAwesome"
                  size={dimensionsCalculation(25)}
                  color={AppColors.mainText}
                />
                <Text style={styles.showAttachments}>
                  {Languages.Attachments}
                </Text>
              </View>
              <AppIcon
                name={
                  isAttachmentsVisible ? 'chevron-thin-up' : 'chevron-thin-down'
                }
                size={dimensionsCalculation(25)}
                color={AppColors.mainText}
                type="Entypo"
              />
            </AppTouchableOpacity>
            {isAttachmentsVisible &&
              item?.attachments?.map((x, index) => (
                <View
                  key={`attachment${index}`}
                  style={{
                    paddingHorizontal: dimensionsCalculation(10),
                    marginHorizontal: dimensionsCalculation(10),
                    alignSelf: 'stretch',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: dimensionsCalculation(5),
                    borderBottomWidth:
                      index == item.attachments.length - 1 ? 0 : 0.5,
                    borderBottomColor: 'rgba(0,0,0,0.3)',
                  }}>
                  <Text
                    style={{
                      color: AppColors.black,
                      fontSize: dimensionsCalculation(16),
                      textAlign: 'left',
                      flex: 1,
                    }}>
                    {`${x.name}`}
                  </Text>
                  <AppTouchableOpacity
                    style={{
                      overflow: 'visible',
                    }}
                    androidRippleColor={AppColors.androidRippleColor.black15}
                    onPress={async () => {
                      const { config, fs } = RNFetchBlob;
                      const result = await requestExternalStoragePermission();
                      if (result?.granted) {
                        let direction = fs.dirs.DownloadDir;
                        let options = {
                          fileCache: true,

                          addAndroidDownloads: {
                            useDownloadManager: true,
                            notification: true,
                            path:
                              direction +
                              '/QudsPaints' +
                              '/quds_' +
                              Math.floor(
                                new Date().getTime() +
                                new Date().getSeconds() / 2,
                              ) +
                              '.pdf',

                            description: 'Downloading ...',
                          },
                        };
                        config({
                          ...options,
                          path: isIOS
                            ? direction +
                            '/' +
                            Math.floor(
                              new Date().getTime() +
                              new Date().getSeconds() / 2,
                            ) +
                            '.pdf'
                            : direction +
                            '/QudsPaints' +
                            '/quds_' +
                            Math.floor(
                              new Date().getTime() +
                              new Date().getSeconds() / 2,
                            ) +
                            '.pdf',
                        })
                          .fetch('GET', x.url)
                          .then(async (res) => {
                            if (isIOS) {
                              RNFetchBlob.ios.previewDocument(res.path());
                            }
                            ShowToast(
                              Languages.DownloadedSuccesffully,
                              'success',
                            );
                            // __DEV__ && console.log('res', JSON.stringify(res));
                          })
                          .catch(
                            (err) =>
                              __DEV__ && console.error('error', err + ''),
                          );
                      } else {
                        Alert.alert('', Languages.PermissionRequired);
                      }
                    }}
                    borderless>
                    <AppIcon
                      name="download"
                      type="Feather"
                      style={{
                        marginRight: dimensionsCalculation(1),
                      }}
                      size={dimensionsCalculation(25)}
                      color={AppColors.primary}
                    />
                  </AppTouchableOpacity>
                </View>
              ))}
            {isAttachmentsVisible && (
              <View
                style={{
                  borderBottomColor: 'rgba(0,0,0,0.3)',
                  marginBottom: dimensionsCalculation(20),
                  borderBottomWidth: 0.5,
                  width: '100%',
                }}
              />
            )}
          </View>
          {showWebView ? (
            <AutoHeightWebView
              source={{
                html: `<html dir="${Languages.langDirection}"><head>
                <style>
                body {
                  -webkit-touch-callout: none;
                  -webkit-user-select: none;
                  -khtml-user-select: none;
                  -moz-user-select: none;
                  -ms-user-select: none;
                  user-select: none;
                }</style>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="text-align: ${isRTL ? 'right' : 'left'
                  };
              padding-left: ${dimensionsCalculation(20)}px;
              padding-right: ${dimensionsCalculation(20)}px;
              "><p style="text-align: ${isRTL ? 'right' : 'left'} !important">${item?.description ?? ''
                  }</p></body></html>`,
              }}
              style={{
                width: Dimensions.get('screen').width,
              }}
              containerStyle={{
                // minHeight: textHeight,
                paddingBottom: 0,
              }}
              startInLoadingState
              onLoad={() => {
                setIsWebLoading(false);
              }}
              renderLoading={() => {
                return (
                  <ActivityIndicator size="large" color={AppColors.primary} />
                );
              }}
            // style={{
            //   minHeight: textHeight,
            // }}
            />
          ) : (
            <ActivityIndicator size="large" color={AppColors.primary} />
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default TechnicalDetailsScreen;
