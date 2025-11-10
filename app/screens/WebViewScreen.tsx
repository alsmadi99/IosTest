import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { AppIcon, Constants, Languages } from '../common';
import { WebViewScreenProps, WebViewScreenState } from '../common/Types';
import { AppHeader, AppTouchableOpacity, LoadingSpinner } from '../components';
import { canGoBack, goBack } from '../navigation';
import React, { Component, createRef, RefObject } from 'react';
import { View, StyleSheet, I18nManager, BackHandler } from 'react-native';
import WebView from 'react-native-webview';
import RNFetchBlob from 'rn-fetch-blob';
import { AppColors } from '../theme';
import {
  dimensionsCalculation,
  getStatusBarHeight,
  isIOS,
  isRTL,
  requestExternalStoragePermission,
  ShowToast,
} from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  backBtn: {
    position: 'absolute',
    top: getStatusBarHeight() + dimensionsCalculation(5),
    left: dimensionsCalculation(10),
    borderRadius: dimensionsCalculation(40),
    zIndex: 1500,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: dimensionsCalculation(50),
    height: dimensionsCalculation(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class WebViewScreen extends Component<
  WebViewScreenProps,
  WebViewScreenState
> {
  webviewRef: RefObject<WebView>;
  constructor(props: WebViewScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      canGoBack: true,
    };
    this.webviewRef = createRef();
  }

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.backHandler);
  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
  };

  backHandler = () => {
    if (this.state.canGoBack) {
      this.webviewRef?.current?.goBack();
      return true;
    }
    return false;
  };

  render() {
    const url = this.props.route?.params?.url;
    const { isLoading } = this.state;
    return (
      <View
        style={[
          styles.container,
          !url.includes('virtualroom') && {
            paddingTop: Constants.headerHeight,
          },
        ]}>
        {isLoading && <LoadingSpinner overlay />}
        {url.includes('virtualroom') && (
          <AppTouchableOpacity
            androidRippleColor={AppColors.androidRippleColor.white}
            style={styles.backBtn}
            onPress={() => {
              if (this.state.canGoBack) {
                this.webviewRef?.current?.goBack();
                return;
              }
              goBack();
            }}>
            <AppIcon
              name={isRTL ? 'chevron-thin-right' : 'chevron-thin-left'}
              size={dimensionsCalculation(25)}
              color={AppColors.white}
              type="Entypo"
              style={{
                marginLeft: isRTL ? 0 : -5,
                marginRight: isRTL ? 0 : -5,
              }}
            />
          </AppTouchableOpacity>
        )}
        {!url.includes('virtualroom') && <AppHeader />}
        <WebView
          source={{
            uri: url,
          }}
          cacheEnabled
          cacheMode="LOAD_NO_CACHE"
          // cacheMode="LOAD_CACHE_ELSE_NETWORK"
          ref={this.webviewRef}
          onMessage={async (da) => {
            try {
              const data = JSON.parse(da.nativeEvent.data);
              if (data.type == '3') {
                setTimeout(() => {
                  this.setState(
                    {
                      isLoading: false,
                    },
                    () => { },
                  );
                }, 750);
              } else {
                const isGranted = await requestExternalStoragePermission();
                if (isGranted.granted) {
                  const base64Image = data.base64;
                  var Base64Code = base64Image.split(
                    data.type == '1'
                      ? 'data:image/png;base64,'
                      : 'data:application/pdf;base64,',
                  );

                  const { dirs } = RNFetchBlob.fs;

                  var path =
                    (data.type == '1'
                      ? isIOS
                        ? dirs.LibraryDir
                        : dirs.DCIMDir
                      : isIOS
                        ? dirs.DocumentDir
                        : dirs.DownloadDir) +
                    (data.type == '1' ? '/QudsPaints' : '') +
                    `/${new Date().getTime()}.${data.type == '1' ? 'png' : 'pdf'
                    }`;
                  RNFetchBlob.fs
                    .writeFile(path, Base64Code[1], 'base64')
                    .then((res) => {
                      if (!isIOS || data.type == '1') {
                        CameraRoll.save(path, {
                          type: 'photo',
                          album: 'QudsPaints',
                        })
                          .then(() => {
                            ShowToast(
                              Languages.DownloadedSuccesffully,
                              'success',
                            );
                          })
                          .catch((err) => console.error('ERRORRRR', err + ''));
                      } else {
                        ShowToast(Languages.DownloadedSuccesffully, 'success');
                      }
                    })
                    .catch((err) => {
                      console.error('ERROR FS', err + '');
                    });
                } else {
                  ShowToast(Languages.PermissionRequired);
                }
              }
            } catch (error) {
              // __DEV__ && console.log(error + '');
            }
          }}
          allowFileAccessFromFileURLs
          onNavigationStateChange={(e) => {
            this.setState(
              {
                canGoBack: e.canGoBack,
              },
              () => { },
            );
          }}
          injectedJavaScript={`
          const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
          document.getElementsByTagName("body")[0].style["user-select"] = "none";
          document.getElementsByTagName("body")[0].style["-webkit-touch-callout"] = "none";
          document.getElementsByTagName("body")[0].style["-webkit-user-select"] = "none";
          document.getElementsByTagName("body")[0].style["-khtml-user-select"] = "none";
          document.getElementsByTagName("body")[0].style["-moz-user-select"] = "none";
          document.getElementsByTagName("body")[0].style["-ms-user-select"] = "none";
          document.getElementsByClassName("header-area")[0].style.display = "none";
          document.getElementsByClassName("fixed-footer")[0].style.display = "none"`}
          allowFileAccess
          style={{
            paddingTop: Constants.headerHeight,
            paddingBottom: Constants.tabBarHeight,
            flex: 1,
          }}
        />
      </View>
    );
  }
}
