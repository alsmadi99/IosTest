import {
  Color,
  Product,
  Step,
  SurveyOption,
  SurveyQuestion,
  TakeSurveyScreenProps,
  TakeSurveyScreenState,
} from '../common/Types';
import React, { Component, createRef, RefObject } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import {
  configureNextAnimation,
  configureNextScaleAnimation,
  dimensionsCalculation,
  isIOS,
  isRTL,
  ShowToast,
} from '../utils';
import { AppColors } from '../theme';
import {
  AppButton,
  AppHeader,
  AppTabBar,
  AppTouchableOpacity,
  LoadingSpinner,
  ProductCard,
} from '../components';
import { AppIcon, Constants, fonts, Languages } from '../common';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import { surveyQuestionsGetCall, surveyResultsGetCall } from '../services/api/calls';
import { goBack, navigate } from '../navigation';
import { View as AnimatedView } from 'react-native-animatable';
import Modal from 'react-native-modalbox';
import Zoom from 'react-native-zoom-reanimated';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrolllview: {
    paddingTop: Constants.headerHeight + dimensionsCalculation(20),
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
  },
  botBubbleContainer: {
    paddingLeft: dimensionsCalculation(10),
    flexDirection: 'row',
    maxWidth: Dimensions.get('screen').width * 0.9,
    marginBottom: dimensionsCalculation(20),
  },
  logo: {
    width: dimensionsCalculation(45),
    height: dimensionsCalculation(45),
  },
  botBubble: {
    maxWidth: '75%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderRadius: dimensionsCalculation(40),
    padding: dimensionsCalculation(20),
    backgroundColor: AppColors.white,
    marginLeft: dimensionsCalculation(5),
  },
  botBubbleText: {
    textAlign: 'left',
    color: AppColors.mainText,
    fontSize: dimensionsCalculation(16),
  },
  optionContainer: {
    marginHorizontal: dimensionsCalculation(5),
    width: '80%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    paddingHorizontal: dimensionsCalculation(5),
    backgroundColor: AppColors.white,
    marginBottom: dimensionsCalculation(10),
    paddingVertical: dimensionsCalculation(20),
  },
  optionIcon: {
    width: dimensionsCalculation(45),
    height: dimensionsCalculation(45),
    marginBottom: dimensionsCalculation(10),
    tintColor: AppColors.mainText,
  },
  optionText: {
    color: '#918E8E',
    fontSize: dimensionsCalculation(17),
    textAlign: 'center',
  },
  imTyping: {
    alignSelf: 'flex-start',
    marginLeft: dimensionsCalculation(5),
    width: dimensionsCalculation(70),
    height: dimensionsCalculation(70),
  },
});

export default class TakeSurveyScreen extends Component<
  TakeSurveyScreenProps,
  TakeSurveyScreenState
> {
  scrollviewRef = null as RefObject<ScrollView>;
  constructor(props: TakeSurveyScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      questions: [],
      currentQuestion: 0,
      options: [],
      steps: [],
      selectedOptions: [],
      isSubmitting: false,
      suggestions: [],
      colors: [],
      selectedColor: null,
      scrollY: 0,
    };
    this.scrollviewRef = createRef();
  }

  componentDidMount = () => {
    // this.stepsGet(null, true);
    this.questionsGet();
  };

  questionsGet = async () => {
    const result = await surveyQuestionsGetCall();
    if (Array.isArray(result?.data)) {
      this.setState(
        {
          questions: result?.data,
          currentQuestion: 0,
        },
        () => {
          this.stepsGet(result?.data[0], null, false);
          this.stepsGet(result?.data[1]);
        },
      );
    } else {
      goBack();
    }
  };

  stepsGet = (
    question: SurveyQuestion = null,
    optionID: string = null,
    isLoading: boolean = false,
    isSubmitting: boolean = false,
  ) => {
    this.setState(
      {
        isLoading,
        isSubmitting,
      },
      () => {
        setTimeout(() => {
          // configureNextScaleAnimation();
          this.setState(
            {
              isLoading: false,
            },
            async () => {
              setTimeout(() => {
                // configureNextScaleAnimation();
                this.setState(
                  {
                    steps: [...this.state.steps, question],
                    isSubmitting: false,
                    selectedOptions: optionID
                      ? [...this.state.selectedOptions, optionID]
                      : [...this.state.selectedOptions],
                    isLoading: false,
                  },
                  () => {
                    if (question.isend) {
                      this.setState(
                        {
                          isSubmitting: true,
                          options: [],
                        },
                        async () => {
                          let timeout = setTimeout(() => {
                            this.scrollviewRef?.current?.scrollToEnd({
                              animated: true,
                            });
                          }, 500);
                          const suggestionsResult = await surveyResultsGetCall({
                            answers: this.state.selectedOptions?.join(','),
                            // answers: '12,16,22,27,40,63,51,71',
                          });
                          timeout && clearTimeout(timeout);
                          if (suggestionsResult?.data?.Success) {
                            this.setState(
                              {
                                isSubmitting: false,
                                suggestions: suggestionsResult?.data?.products,
                                colors: suggestionsResult?.data?.colors ?? [],
                              },
                              () => {
                                setTimeout(() => {
                                  this.scrollviewRef?.current?.scrollTo({
                                    y:
                                      this.state.scrollY +
                                      Constants.tabBarHeight +
                                      Dimensions.get('screen').height * 0.5,
                                    animated: true,
                                  });
                                }, 500);
                              },
                            );
                          } else {
                            ShowToast(Languages.Oops);
                            this.setState(
                              {
                                isSubmitting: false,
                              },
                              () => { },
                            );
                          }
                        },
                      );
                    } else if (question?.isbegin) {
                      // setTimeout(() => {
                      //   this.scrollviewRef?.current?.scrollTo({
                      //     y: Dimensions.get('screen').height * 0.1,
                      //     animated: true,
                      //   });
                      // }, 1000);
                    } else {
                      // configureNextScaleAnimation();
                      setTimeout(() => {
                        let options: SurveyOption[] = question?.anses;
                        this.setState(
                          {
                            options,
                          },
                          () => {
                            setTimeout(() => {
                              this.scrollviewRef?.current?.scrollTo({
                                y:
                                  this.state.scrollY +
                                  Constants.tabBarHeight +
                                  Dimensions.get('screen').height *
                                  (this.state.steps?.length > 2 ? 0.5 : 0.2),
                                animated: true,
                              });
                            }, 500);
                          },
                        );
                      }, 500);
                    }
                  },
                );
              }, 500);
            },
          );
        }, 500);
      },
    );
  };

  renderStep = (step: SurveyQuestion) => {
    return (
      <View style={{}}>
        {step?.user && (
          <AnimatedView
            animation={
              isIOS || (!isIOS && isRTL) ? 'slideInLeft' : 'slideInRight'
            }
            duration={250}
            style={[
              styles.botBubble,
              {
                alignSelf: 'flex-end',
                marginRight: dimensionsCalculation(10),
                marginBottom: dimensionsCalculation(20),
              },
            ]}>
            <Text style={styles.botBubbleText}>{step.option?.answer}</Text>
          </AnimatedView>
        )}
        <AnimatedView
          animation={
            isIOS || (!isIOS && isRTL) ? 'slideInRight' : 'slideInLeft'
          }
          useNativeDriver
          duration={250}
          style={styles.botBubbleContainer}>
          <FastImage
            source={require('../../assets/images/qudsLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.botBubble}>
            <Text style={styles.botBubbleText}>{step.question}</Text>
          </View>
        </AnimatedView>
      </View>
    );
  };

  renderOption = (option: SurveyOption, index: number) => {
    const { steps, questions } = this.state;
    return (
      <View
        style={{
          width: Dimensions.get('screen').width * 0.5,
          justifyContent: 'center',
          alignItems: index % 2 == 0 ? 'flex-end' : 'flex-start',
          flexGrow: 1,
          maxWidth: Dimensions.get('screen').width * 0.5,
        }}>
        <AppTouchableOpacity
          style={styles.optionContainer}
          onPress={() => {
            configureNextScaleAnimation();
            this.stepsGet(
              {
                ...questions[steps?.length],
                user: true,
                option,
              },
              option.id,
              false,
              true,
            );
          }}>
          <FastImage
            source={{
              uri: option?.image ?? '',
            }}
            fallback
            defaultSource={require('../../assets/images/qudsLogo.png')}
            tintColor={AppColors.mainText}
            style={styles.optionIcon}
          />
          <Text
            style={styles.optionText}
          // numberOfLines={1}
          // adjustsFontSizeToFit
          >
            {option?.answer}
          </Text>
        </AppTouchableOpacity>
      </View>
    );
  };

  renderIsTyping = () => {
    return (
      <LottieView
        source={require('../../assets/animations/typing.json')}
        style={styles.imTyping}
        autoPlay
        loop
      />
    );
  };

  renderProduct = ({ item, index }: { item: any; index: number }) => {
    return (
      <ProductCard
        product={{ product: { ...item, id: item.productid } }}
        index={index}
      />
    );
  };

  renderColor = ({ item, index }: { item: Color; index: number }) => {
    return (
      <View
        style={{
          flex: 1,
          maxWidth: '50%',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: dimensionsCalculation(10),
          padding: dimensionsCalculation(10),
          paddingBottom: dimensionsCalculation(5),
          backgroundColor: AppColors.white,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.18,
          shadowRadius: 1.0,
          marginRight: index % 2 == 0 ? dimensionsCalculation(10) : 0,
          borderRadius: dimensionsCalculation(5),
        }}>
        <FastImage
          source={{
            uri: item?.image ?? '',
          }}
          style={{
            width: Dimensions.get('screen').width * 0.4,
            height: Dimensions.get('screen').width * 0.4,
          }}
          fallback
          defaultSource={require('../../assets/images/qudsLogo.png')}
          resizeMode="contain"
        />
        <Text
          style={{
            color: AppColors.mainText,
            fontSize: dimensionsCalculation(15),
            textAlign: 'center',
          }}
          numberOfLines={1}>
          {item?.name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: dimensionsCalculation(5),
          }}>
          <AppButton
            onPress={() => {
              navigate('WebViewScreen', {
                // url: `http://196.25.70.10/virtualroom?colorid=${item?.id}`,
                // url: `https://qudspaints.bloom-jo.com/virtualroom?colorid=${item?.id}`,
                url: `https://www.qudspaints.com/virtualroom?l=${Languages.getLanguage()}&colorid=${item?.id
                  }`,
              });
            }}
            text={Languages.TryIt}
            androidRippleColor={AppColors.androidRippleColor.white}
            containerStyle={{
              backgroundColor: AppColors.primary,
              height: dimensionsCalculation(30),
              borderRadius: dimensionsCalculation(22.5),
              flex: 1,
              // alignSelf: 'stretch',
              marginTop: dimensionsCalculation(10),
            }}
            textStyle={{
              fontFamily: fonts.primaryRegular,
            }}
          />
          <AppButton
            onPress={() => {
              this.setState(
                {
                  selectedColor: item,
                },
                () => { },
              );
            }}
            text={Languages.ViewIt}
            androidRippleColor={AppColors.androidRippleColor.white}
            containerStyle={{
              backgroundColor: AppColors.secondary,
              height: dimensionsCalculation(30),
              borderRadius: dimensionsCalculation(22.5),
              flex: 1,
              marginLeft: dimensionsCalculation(5),
              // alignSelf: 'stretch',
              marginTop: dimensionsCalculation(10),
            }}
            textStyle={{
              fontFamily: fonts.primaryRegular,
            }}
          />
        </View>
      </View>
    );
  };

  renderSuggestions = () => {
    const { suggestions, colors } = this.state;
    return (
      <>
        <FlatList
          contentContainerStyle={{
            paddingBottom:
              colors.length > 0
                ? 0
                : Constants.tabBarHeight + dimensionsCalculation(20),
          }}
          ListHeaderComponent={
            <Text
              style={{
                color: AppColors.mainText,
                fontSize: dimensionsCalculation(16),
                fontFamily: fonts.primaryBold,
                textAlign: 'left',
                marginLeft: dimensionsCalculation(20),
                marginBottom: dimensionsCalculation(20),
              }}>
              {Languages.SuggestedForYou}
            </Text>
          }
          ListEmptyComponent={
            <Text
              style={{
                color: AppColors.mainText,
                fontSize: dimensionsCalculation(16),
                fontFamily: fonts.primaryBold,
                textAlign: 'left',
                marginLeft: dimensionsCalculation(20),
                marginBottom: dimensionsCalculation(20),
              }}>
              {Languages.NoSuggestions}
            </Text>
          }
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          data={suggestions}
          renderItem={this.renderProduct}
        />
        {colors?.length > 0 && (
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: dimensionsCalculation(20),
              paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
            }}
            ListHeaderComponent={
              <Text
                style={{
                  color: AppColors.mainText,
                  fontSize: dimensionsCalculation(16),
                  fontFamily: fonts.primaryBold,
                  textAlign: 'left',
                  // marginLeft: dimensionsCalculation(20),
                  marginBottom: dimensionsCalculation(20),
                }}>
                {Languages.SuggestedColors}
              </Text>
            }
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            data={colors}
            renderItem={this.renderColor}
          />
        )}
      </>
    );
  };

  render() {
    const {
      isLoading,
      steps,
      options,
      suggestions,
      isSubmitting,
      selectedColor,
      colors,
    } = this.state;
    return (
      <View style={styles.container}>
        <AppHeader />
        <AppTabBar />
        {
          <Modal
            isOpen={selectedColor != null}
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
              this.setState(
                {
                  selectedColor: null,
                },
                () => { },
              );
            }}>
            {!!selectedColor ? (
              <>
                <Image
                  source={{
                    uri: selectedColor?.image2,
                  }}
                  onError={() => {
                    this.setState(
                      (prev) => ({
                        selectedColor: {
                          ...selectedColor,
                          image2: prev?.selectedColor?.image,
                        },
                      }),
                      () => { },
                    );
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
                    maxZoomScale: 4,
                  }}
                >
                  <Image
                    source={{ uri: selectedColor?.image2 ?? selectedColor?.image }}
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
                    this.setState(
                      {
                        selectedColor: null,
                      },
                      () => { },
                    );
                  }}>
                  <AppIcon
                    size={dimensionsCalculation(35)}
                    name="close"
                    color={AppColors.white}
                    type="SimpleLineIcons"
                  />
                </AppTouchableOpacity>
              </>
            ) : null}
          </Modal>
        }
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <ScrollView
              ref={this.scrollviewRef}
              onScroll={(e) => {
                this.setState({
                  scrollY: e.nativeEvent.contentOffset.y,
                });
              }}
              scrollEventThrottle={16}
              contentContainerStyle={styles.scrolllview}>
              {steps?.map((step, index) => this.renderStep(step))}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}>
                {!isSubmitting &&
                  options?.map((option, index) =>
                    this.renderOption(option, index),
                  )}
              </View>
              {isSubmitting && this.renderIsTyping()}
              {!isSubmitting &&
                (suggestions?.length > 0 || colors?.length > 0) &&
                this.renderSuggestions()}
            </ScrollView>
          </>
        )}
      </View>
    );
  }
}
