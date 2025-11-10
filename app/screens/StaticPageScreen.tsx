import { Constants, fonts, Languages } from '../common';
import { StaticPageScreenProps, StaticPageScreenState } from '../common/Types';
import {
  AppButton,
  AppHeader,
  AppTabBar,
  ImageHeader,
  LoadingSpinner,
} from '../components';
import React, { Component, createRef, RefObject } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import { AppColors } from '../theme';
import { configureNextAnimation, dimensionsCalculation, isRTL } from '../utils';
import { dynamicPageGetCall, staticPageGetCall } from '../services/api/calls';
import WebView from 'react-native-webview';
import { navigate } from '../navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  scrollview: {
    flexGrow: 1,
    paddingTop: Constants.headerHeight,
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(0),
  },
  header: {
    position: 'absolute',
    top: Constants.headerHeight,
    left: 0,
    right: 0,
    zIndex: 1500,
  },
  title: {
    fontFamily: fonts.primaryBold,
    fontSize: dimensionsCalculation(22),
    textAlign: 'center',
    color: AppColors.mainText,
    marginTop: dimensionsCalculation(20),
  },
  body: {
    paddingHorizontal: dimensionsCalculation(20),
    fontSize: dimensionsCalculation(16),
    textAlign: 'left',
  },
});

export default class StaticPageScreen extends Component<
  StaticPageScreenProps,
  StaticPageScreenState
> {
  listRef: RefObject<FlatList>;
  constructor(props: StaticPageScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      text: '',
      title: '',
      image: '',
      tabs: [],
      selectedTab: null,
      headerHeight: 0,
      headerShown: true,
    };
    this.listRef = createRef();
  }

  componentDidMount = () => {
    this.getData();
  };

  componentDidUpdate = (
    prevProps: StaticPageScreenProps,
    prevState: StaticPageScreenState,
  ) => {
    if (prevProps?.route?.params?.type != this.props?.route?.params?.type)
      this.getData();
  };

  getData = () => {
    this.setState(
      {
        isLoading: true,
      },
      async () => {
        if (
          this.props.route?.params?.istabbar ||
          this.props.route?.params?.type == '40199'
        ) {
          const result = await staticPageGetCall({
            id: this.props.route?.params?.type,
          });
          // configureNextAnimation();
          if (result?.data) {
            this.setState(
              {
                text: result?.data?.description,
                title: result?.data?.name,
                image: result?.data?.image,
                isLoading: false,
                headerShown: true,
              },
              () => { },
            );
          } else {
            this.setState(
              {
                isLoading: false,
                headerShown: true,
              },
              () => { },
            );
          }
        } else {
          const result = await dynamicPageGetCall({
            id: this.props.route?.params?.type,
          });
          configureNextAnimation();
          if (result?.data) {
            this.setState(
              {
                selectedTab: result?.data[0],
                tabs: result?.data,
                // text: result?.data[0]?.description,
                // title: result?.data[0]?.name,
                // image: result?.data[0]?.image,
                isLoading: false,
                headerShown: true,
              },
              () => {
                setTimeout(() => {
                  this.listRef?.current?.scrollToIndex({
                    index: 0,
                  });
                }, 150);
              },
            );
          } else {
            this.setState(
              {
                isLoading: false,
                headerShown: true,
              },
              () => { },
            );
          }
        }
      },
    );
  };

  render() {
    const {
      isLoading,
      text,
      title,
      headerShown,
      headerHeight,
      image,
      selectedTab,
      tabs,
    } = this.state;
    const { istabbar, type } = this.props.route.params;

    const injectedJS =
      "let iframes = document.getElementsByTagName('iframe');for (let i = 0; i < iframes.length; i++) {iframes[i].setAttribute('width',\"" +
      (Dimensions.get('screen').width - dimensionsCalculation(30)) +
      '"); iframes[i].style.marginTop = "20px";} document.getElementById("loading").style.display = "none"; ' +
      `
      (function () {
        window.onclick = function(e) {
          e.preventDefault();
          window.ReactNative.postMessage(e.target.href);
          e.stopPropagation()
        }
      }());`;
    return (
      <View style={styles.container}>
        <AppHeader />
        <AppTabBar />
        {false && isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {true && (
              <>
                {headerShown && (
                  <View
                    style={styles.header}
                    onLayout={(e) => {
                      this.setState(
                        {
                          headerHeight: e.nativeEvent.layout.height,
                        },
                        () => { },
                      );
                    }}>
                    {!istabbar && (
                      <FlatList
                        contentContainerStyle={{
                          paddingRight: dimensionsCalculation(10),
                        }}
                        horizontal
                        ref={this.listRef}
                        showsHorizontalScrollIndicator={false}
                        // style={{
                        //   flexDirection: 'row',
                        //   justifyContent: 'space-around',
                        //   alignItems: 'center',
                        //   flexWrap: 'wrap',
                        //   paddingRight: dimensionsCalculation(10),
                        // }}
                        data={tabs}
                        // initialScrollIndex={isRTL ? tabs?.length - 2 : 0}
                        initialNumToRender={tabs?.length}
                        renderItem={({ item: x, index }) => (
                          <AppButton
                            onPress={() => {
                              this.setState(
                                {
                                  selectedTab: x,
                                },
                                () => { },
                              );
                            }}
                            text={x?.name}
                            textStyle={{
                              fontSize: dimensionsCalculation(13),
                              fontFamily:
                                selectedTab?.id == x?.id
                                  ? fonts.primaryBold
                                  : fonts.primaryRegular,
                              textAlign: 'left',
                            }}
                            textColor={
                              selectedTab?.id == x?.id
                                ? AppColors.white
                                : AppColors.white
                            }
                            containerStyle={{
                              width: Dimensions.get('screen').width * 0.4,
                              backgroundColor:
                                selectedTab?.id == x?.id
                                  ? AppColors.secondary
                                  : AppColors.primary,
                              // elevation: 1,
                              // shadowColor: '#000',
                              // shadowOffset: {
                              //   width: 0,
                              //   height: 1,
                              // },
                              // shadowOpacity: 0.18,
                              // shadowRadius: 1.0,
                              overflow: 'visible',
                              borderWidth: 0,
                              marginBottom: dimensionsCalculation(10),
                              marginLeft: dimensionsCalculation(10),
                              marginTop: dimensionsCalculation(10),
                              // minHeight: dimensionsCalculation(60),
                            }}
                            numberOfLines={2}
                          />
                        )}
                      />
                    )}
                    {/* <ImageHeader
                      source={{
                        uri: istabbar ? image : selectedTab?.image,
                      }}
                      hideMenuButton
                      style={{
                        transform: [
                          {
                            rotateY: '180deg',
                          },
                        ],
                        height: Dimensions.get('screen').width / 3,
                      }}
                    />
                  */}
                    <Text style={styles.title}>
                      {istabbar ? title : selectedTab?.name}
                    </Text>
                  </View>
                )}
                <WebView
                  // startInLoadingState
                  source={{
                    html: `
                    <html dir="${Languages.langDirection}">
                    <head>
                    <style>
                    img {
                      display: block;
                      margin-left: auto;
                      margin-right: auto;
                      width: ${Dimensions.get('screen').width -
                      dimensionsCalculation(40)
                      }px !important;
                      max-height: ${Dimensions.get('screen').width -
                      dimensionsCalculation(40)
                      }px !important;
                      object-fit: contain !important
                    }
                    .loader {
                      border: 3px solid #f3f3f3; /* Light grey */
                      border-top: 3px solid ${AppColors.primary}; /* Blue */
                      border-radius: 50%;
                      width: 20px;
                      height: 20px;
                      animation: spin 1s linear infinite;
                    }
                    
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                    .loading {
                      position: fixed;
                      top: 0;
                      left: 0;
                      bottom: 0;
                      right: 0;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      z-index: 150000;
                      background: white !important
                    }
                    body {
                      -webkit-touch-callout: none;
                      -webkit-user-select: none;
                      -khtml-user-select: none;
                      -moz-user-select: none;
                      -ms-user-select: none;
                      user-select: none;
                    }
                    p {
                      margin-left: 0px !important;
                      margin-right: 0px !important;
                      text-align: ${isRTL ? 'right' : 'left'} !important;
                    }
                    </style>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
                    </head>
                    <body style="
                    padding-right: 10px !important
                    padding-left: 10px !important
                    width: 100% !important;
                    " >
                    <div class="loading" id="loading" >
                    <div class="loader"  >
                    </div>
                    </div>
                    <p
                    style="
                    padding-top: ${headerHeight};
                      padding-bottom: ${Constants.tabBarHeight + dimensionsCalculation(40)
                      };
                     
                    ">${istabbar ? text : selectedTab?.description || ''}</p>
                    </body>
                    </html>`,
                  }}
                  injectedJavaScript={injectedJS}
                  onShouldStartLoadWithRequest={(event) => {
                    return true;
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    fontSize: 16,
                    paddingTop: headerHeight + Constants.headerHeight,
                  }}
                  containerStyle={{
                    paddingHorizontal: dimensionsCalculation(10),
                    width: '100%',
                    paddingBottom:
                      Constants.tabBarHeight + dimensionsCalculation(0),
                    flexGrow: 1,
                  }}
                  onScroll={(e: any) => {
                    if (e.nativeEvent.contentOffset.y > 50 && !headerShown)
                      return;
                    if (e.nativeEvent.contentOffset.y > 50) {
                      configureNextAnimation();
                      this.setState(
                        {
                          headerShown: false,
                        },
                        () => { },
                      );
                    }
                    if (e.nativeEvent.contentOffset.y < 50 && !headerShown) {
                      this.setState(
                        {
                          headerShown: true,
                        },
                        () => { },
                      );
                    }
                  }}
                  renderLoading={() => <LoadingSpinner />}
                  originWhitelist={['*']}
                  onMessage={(e) => {
                    try {
                      const data = JSON.parse(e.nativeEvent.data);
                      if (data.type == '3') {
                        navigate('DistributionPointsScreen');
                      }
                    } catch (error) { }
                  }}
                  ref={() => { }}
                />
              </>
            )}
          </>
        )}
      </View>
    );
  }
}
