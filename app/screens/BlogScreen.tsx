import { Constants, fonts, Languages } from '../common';
import {
  Blog,
  BlogScreenProps,
  BlogScreenState,
  QudsPaintsStore,
} from '../common/Types';
import {
  AppButton,
  AppHeader,
  AppTabBar,
  AppTouchableOpacity,
  ImageHeader,
  LoadingSpinner,
} from '../components';
import moment from 'moment';
import { navigate } from '../navigation';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { AppColors } from '../theme';
import { configureNextScaleAnimation, dimensionsCalculation, isIOS } from '../utils';
import { blogsGetCall } from '../services/api/calls';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  imageHeaderContent: {
    height: '100%',
    paddingLeft: dimensionsCalculation(20),
    justifyContent: 'center',
  },
  title: {
    color: AppColors.white,
    fontFamily: fonts.primaryBold,
    fontSize: dimensionsCalculation(30),
  },
  subtitle: {
    color: AppColors.white,
    fontSize: dimensionsCalculation(14),
    fontFamily: fonts.primaryBold,
  },
  listStyle: {
    flexGrow: 1,
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
    paddingTop: Constants.headerHeight,
  },
  blogContainer: {
    height: Dimensions.get('screen').width * 0.33 * 1.2,
    borderRadius: 0,
    marginBottom: dimensionsCalculation(30),
    marginHorizontal: dimensionsCalculation(20),
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    backgroundColor: AppColors.white,
    borderTopRightRadius: dimensionsCalculation(50),
    borderBottomRightRadius: dimensionsCalculation(50),
    paddingRight: dimensionsCalculation(30),
  },
  blogImage: {
    width: Dimensions.get('screen').width * 0.33,
    height: Dimensions.get('screen').width * 0.33 * 1.2,
    // flex: 0.4,
    marginRight: dimensionsCalculation(10),
  },
  blogRightSide: {
    flex: 1,
    paddingVertical: dimensionsCalculation(10),
    justifyContent: 'space-between',
  },
  blogTitle: {
    fontSize: dimensionsCalculation(14),
    fontFamily: fonts.primaryBold,
    textAlign: 'left',
    color: '#424242',
  },
  blogDate: {
    marginTop: -2,
    fontSize: dimensionsCalculation(12),
    textAlign: 'left',
    color: '#424242',
  },
  blogDescription: {
    color: '#424242',
    fontSize: dimensionsCalculation(10),
    textAlign: 'left',
    fontFamily: fonts.primaryLight,
    flex: 1,
  },
  learnMoreBtn: {
    backgroundColor: AppColors.secondary,
    borderRadius: dimensionsCalculation(15),
    paddingHorizontal: dimensionsCalculation(15),
    height: dimensionsCalculation(30),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: dimensionsCalculation(10),
  },
  learnMoreTxt: {
    fontSize: dimensionsCalculation(12),
    color: AppColors.mainText,
    textAlign: 'center',
    fontFamily: fonts.primaryLight,
  },
});

class BlogScreen extends Component<BlogScreenProps, BlogScreenState> {
  pagenumber = 1;
  constructor(props: BlogScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      isRefreshing: false,
      isFetchingMore: false,
      blogs: [],
      pages: 0,
    };
  }

  componentDidMount = () => {
    this.blogsGet();
  };

  blogsGet = (
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
        const result = await blogsGetCall({
          p: this.pagenumber++,
        });
        if (result?.data?.articles) {
          configureNextScaleAnimation();
          const newBlogs = result?.data?.articles;
          this.setState(
            {
              blogs: isRefreshing
                ? newBlogs
                : [...this.state.blogs, ...newBlogs],
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

  renderBlog = ({ item, index }: { item: Blog; index: number }) => {
    return (
      <View style={styles.blogContainer} key={`blog${index.toString()}`}>
        <FastImage
          source={{ uri: item?.article?.image ?? '' }}
          style={styles.blogImage}
          resizeMode="cover"
          fallback
          defaultSource={require('../../assets/images/qudsLogo.png')}
        />
        <View style={styles.blogRightSide}>
          <View style={{}}>
            <Text
              style={styles.blogTitle}
              // numberOfLines={1}
              adjustsFontSizeToFit>
              {item?.article?.name}
            </Text>
            <Text style={styles.blogDate}>
              {moment().format('MMM DD, yyyy')}
            </Text>
          </View>
          <Text
            style={styles.blogDescription}
          // numberOfLines={4}
          // adjustsFontSizeToFit
          >
            {item?.article?.shortdescription}
          </Text>
          <AppButton
            onPress={() => {
              navigate('BlogDetailsScreen', {
                blog: item,
              });
            }}
            containerStyle={styles.learnMoreBtn}
            androidRippleColor={AppColors.androidRippleColor.white}
            text={Languages.LearnMore}
            textStyle={styles.learnMoreTxt}
          />
        </View>
      </View>
    );
  };

  render() {
    const { isLoading, isRefreshing, isFetchingMore, blogs, pages } = this.state;
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
                <View
                  style={{
                    marginBottom: dimensionsCalculation(20),
                  }}>
                  <ImageHeader
                    hideMenuButton
                    source={require('../../assets/images/blog.png')}>
                    <View style={styles.imageHeaderContent}>
                      <Text style={styles.title}>{Languages.Blog}</Text>
                      {false && (
                        <Text style={styles.subtitle}>
                          {Languages.LearnAboutPaint}
                        </Text>
                      )}
                    </View>
                  </ImageHeader>
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
                    this.blogsGet(false, true, false);
                  }}
                />
              }
              onEndReached={() => {
                if (this.pagenumber <= pages && !isFetchingMore)
                  this.blogsGet(false, false, true);
              }}
              contentContainerStyle={styles.listStyle}
              keyExtractor={(item, index) => index.toString()}
              data={blogs}
              renderItem={this.renderBlog}
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

export default connect(mapStateToProps, null)(BlogScreen);
