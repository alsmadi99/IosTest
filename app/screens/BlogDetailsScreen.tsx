import { Constants, fonts, Languages } from '../common';
import { BlogDetailsScreenProps, BlogDetailsScreenState } from '../common/Types';
import { AppHeader, AppTabBar } from '../components';
import moment from 'moment';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import WebView from 'react-native-webview';
import { AppColors } from '../theme';
import { configureNextAnimation, dimensionsCalculation, isRTL } from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    paddingTop: Constants.headerHeight + dimensionsCalculation(20),
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
    paddingHorizontal: dimensionsCalculation(20),
  },
  scrollview: {
    paddingTop: Constants.headerHeight + dimensionsCalculation(20),
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
    paddingHorizontal: dimensionsCalculation(20),
  },
  title: {
    fontSize: dimensionsCalculation(22),
    textAlign: 'center',
    color: AppColors.mainText,
    fontFamily: fonts.primaryBold,
    marginBottom: dimensionsCalculation(20),
  },
  blogImage: {
    borderRadius: dimensionsCalculation(20),
    width: Dimensions.get('screen').width * 0.5,
    height: Dimensions.get('screen').width * 0.5,
    // alignSelf: 'center',
    marginLeft: dimensionsCalculation(10),
  },
  blogDate: {
    marginVertical: dimensionsCalculation(10),
    marginLeft: dimensionsCalculation(10),
    fontSize: dimensionsCalculation(12),
    textAlign: 'left',
    color: '#424242',
  },
  blogDescription: {
    color: '#424242',
    fontSize: dimensionsCalculation(14),
    textAlign: 'left',
    fontFamily: fonts.primaryLight,
    flex: 1,
  },
});

export default class BlogDetailsScreen extends Component<
  BlogDetailsScreenProps,
  BlogDetailsScreenState
> {
  constructor(props: BlogDetailsScreenProps) {
    super(props);
    this.state = {
      isloading: true,
      blog: this.props.route?.params?.blog,
      height: 0,
      headerShown: true,
      headerHeight: 0,
    };
  }

  render() {
    const { headerShown, headerHeight, blog } = this.state;
    return (
      <>
        <AppHeader />
        <AppTabBar />
        {headerShown && (
          <View
            style={{
              position: 'absolute',
              top: Constants.headerHeight + dimensionsCalculation(20),
              left: 0,
              right: 0,
              // backgroundColor: AppColors.white,
              zIndex: 1500,
            }}
            onLayout={(e) => {
              this.setState(
                {
                  headerHeight: e.nativeEvent.layout.height,
                },
                () => { },
              );
            }}>
            <Text style={styles.title}>{blog?.article?.name}</Text>
            <FastImage
              source={{
                uri: blog?.article?.image,
              }}
              fallback
              defaultSource={require('../../assets/images/qudsLogo.png')}
              style={styles.blogImage}
              resizeMode="cover"
            />
            <Text style={styles.blogDate}>
              {moment().format('MMM DD, yyyy')}
            </Text>
          </View>
        )}
        <WebView
          source={{
            html: `
          <html dir="${Languages.langDirection}">
          <head>
          <style>
          img {
            display: block;
            margin-left: auto;
            margin-right: auto;
            // width: 50%;

          }
          body {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }</style>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
          </head>
          <body style="
          text-align: ${isRTL ? 'right' : 'left'} !important;
          " >
          <p
          style="
            padding-top: ${headerHeight + Constants.headerHeight + dimensionsCalculation(0)
              };
            padding-left: ${dimensionsCalculation(10)};
            padding-right: ${dimensionsCalculation(10)};
          ">${blog?.article?.description}</p>
          </body>
          </html>`,
          }}
          startInLoadingState
          renderLoading={() => {
            return <ActivityIndicator color={AppColors.primary} size="large" />;
          }}
          style={{
            width: '100%',
            height: '100%',
            fontSize: 16,
            paddingTop: headerHeight + Constants.headerHeight,
          }}
          containerStyle={{
            paddingBottom: Constants.tabBarHeight + dimensionsCalculation(0),
            flexGrow: 1,
          }}
          onMessage={() => { }}
          ref={() => { }}
          onScroll={(e: any) => {
            if (e.nativeEvent.contentOffset.y > 10 && !headerShown) return;
            if (e.nativeEvent.contentOffset.y > 10) {
              configureNextAnimation();
              this.setState(
                {
                  headerShown: false,
                },
                () => { },
              );
            }
            if (e.nativeEvent.contentOffset.y < 10 && !headerShown) {
              this.setState(
                {
                  headerShown: true,
                },
                () => { },
              );
            }
          }}
          originWhitelist={['*']}
        />
      </>
    );
  }
}
