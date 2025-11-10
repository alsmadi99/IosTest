import { AppIcon, Constants, fonts, Languages } from '../common';
import {
  PaintCalculatorScreenProps,
  PaintCalculatorScreenState,
  Wall,
  ToolTipType,
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
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modalbox';
import { paintCalculatorCall } from '../services/api/calls';
import { AppColors } from '../theme';
import {
  configureNextAnimation,
  configureNextScaleAnimation,
  dimensionsCalculation,
  getStatusBarHeight,
  isRTL,
  ShowToast,
} from '../utils';
import { View as AnimatedView } from 'react-native-animatable';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  flatlist: {
    flexGrow: 1,
    paddingTop: Constants.headerHeight + dimensionsCalculation(20),
    paddingHorizontal: dimensionsCalculation(20),
    paddingBottom: Constants.tabBarHeight + dimensionsCalculation(20),
  },
  title: {
    fontFamily: fonts.primaryBold,
    // color: AppColors.inputText,
    fontSize: dimensionsCalculation(22),
    textAlign: 'left',
  },
  subtitle: {
    // color: '#676767',
    color: AppColors.black,
    fontSize: dimensionsCalculation(18),
    textAlign: 'left',
    marginVertical: dimensionsCalculation(10),
  },
  bodyTxt: {
    // color: '#575757',
    color: AppColors.black,
    fontFamily: fonts.primaryLight,
    fontSize: dimensionsCalculation(16),
    textAlign: 'left',
  },
  learnMore: {
    // color: '#575757',
    color: AppColors.black,
    textDecorationLine: 'underline',
    fontSize: dimensionsCalculation(16),
    fontFamily: fonts.primaryRegular,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginVertical: dimensionsCalculation(15),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wallContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wallBubble: {
    marginTop: dimensionsCalculation(10),
    height: dimensionsCalculation(40),
    width: dimensionsCalculation(80),
    borderRadius: dimensionsCalculation(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: dimensionsCalculation(10),
    backgroundColor: AppColors.mainText,
  },
  areaTxt: {
    color: AppColors.white,
    fontSize: dimensionsCalculation(14),
    fontFamily: fonts.primaryLight,
  },
  plusminus: {
    backgroundColor: AppColors.transparent,
    borderWidth: 1,
    borderColor: '#3B3A3A',
    borderRadius: dimensionsCalculation(15),
    width: dimensionsCalculation(30),
    height: dimensionsCalculation(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  howMuch: {
    marginTop: dimensionsCalculation(20),
    padding: dimensionsCalculation(30),
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: dimensionsCalculation(20),
    backgroundColor: '#F9F9F9',
    borderRadius: dimensionsCalculation(10),
  },
  howMuchTxt: {
    fontSize: dimensionsCalculation(16),
    // color: '#6B6363',
    color: AppColors.black,
    flex: 1,
    textAlign: 'left',
    textAlignVertical: 'top',
  },
  key: {
    // color: '#6B6363',
    color: AppColors.black,
    textAlign: 'left',
    marginLeft: dimensionsCalculation(20),
    fontSize: dimensionsCalculation(16),
  },
  value: {
    marginRight: dimensionsCalculation(20),
    textAlign: 'right',
    // color: '#6B6363',
    color: AppColors.black,
    fontSize: dimensionsCalculation(16),
  },
  modalStyle: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: AppColors.transparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: AppColors.transparent,
    zIndex: 0,
  },
  toolTip: {
    width: Dimensions.get('screen').width * 0.8,
    maxHeight: Dimensions.get('screen').width * 0.8,
    backgroundColor: AppColors.white,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: dimensionsCalculation(30),
    padding: dimensionsCalculation(30),
  },
  tipText: {
    textAlign: 'center',
    fontSize: dimensionsCalculation(13),
    color: AppColors.inputText,
  },
  learnMoreView: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  closeBtn: {
    marginLeft: dimensionsCalculation(20),
    overflow: 'visible',
    alignSelf: 'flex-start',
    padding: dimensionsCalculation(5),
    left: dimensionsCalculation(-5),
  },
  learnMoreTitle: {
    fontFamily: fonts.primaryBold,
    textAlign: 'left',
    fontSize: dimensionsCalculation(18),
    color: AppColors.black,
  },
  learnMoreText: {
    textAlign: 'left',
    fontSize: dimensionsCalculation(14),
    color: AppColors.inputText,
  },
  learnMoreSubtitle: {
    fontFamily: fonts.primaryBold,
    textAlign: 'left',
    fontSize: dimensionsCalculation(16),
    color: AppColors.black,
  },
});

export default class PaintCalculatorScreen extends Component<
  PaintCalculatorScreenProps,
  PaintCalculatorScreenState
> {
  tootipViewRef: RefObject<AnimatedView>;
  scrollviewRef: RefObject<FlatList>;
  constructor(props: PaintCalculatorScreenProps) {
    super(props);
    this.state = {
      isLoading: true,
      walls: [
        {
          id: 0,
          width: null,
          height: null,
        },
      ],
      windows: 0,
      doors: 0,
      coverage: '',
      sqm: '',
      tooltipType: null,
      isTooltipVisible: false,
      scale: 0,
      neededArea: '',
      calculate: '',
      piece: '',
      name: '',
      thickness: '',
      sizes: [],
    };
    this.tootipViewRef = createRef();
    this.scrollviewRef = createRef();
  }

  componentDidMount = () => {
    setTimeout(() => {
      configureNextAnimation();
      this.setState(
        {
          isLoading: false,
        },
        () => { },
      );
    }, 500);
  };

  componentDidUpdate = (
    prevProps: PaintCalculatorScreenProps,
    prevState: PaintCalculatorScreenState,
  ) => {
    if (prevState?.walls != this.state.walls) {
      return this.doCalculate();
    }
    if (prevState?.doors != this.state.doors) {
      return this.doCalculate();
    }
    if (prevState?.windows != this.state.windows) {
      return this.doCalculate();
    }
  };

  doCalculate = async () => {
    const { walls, doors, windows } = this.state;
    const filledWalls = walls?.filter(
      (x) => x?.height != null && x?.width != null,
    );
    if (filledWalls?.length > 0) {
      let values: string[] = [];
      filledWalls?.map((x) => values.push(`${x?.width},${x?.height}`));
      const result = await paintCalculatorCall({
        productid: this.props.route?.params?.product?.product?.id,
        values,
        door: doors,
        window: windows,
      });
      if (result?.data?.result == 1) {
        !this.state.coverage &&
          setTimeout(() => {
            this.scrollviewRef?.current.scrollToOffset({
              offset: 30000,
              animated: true,
            });
          }, 1000);
        this.setState(
          {
            coverage: result?.data['coverage']?.toString() ?? null,
            sqm: result?.data['sq']?.toString() ?? null,
            neededArea: result?.data['sq']?.toString() ?? '',
            calculate: result?.data?.calculate ?? '',
            thickness: result?.data?.thickness ?? '',
            name: result?.data?.name ?? '',
            piece: result?.data?.piece ?? '',
            sizes: result?.data?.sizes ?? [],
          },
          () => { },
        );
      } else {
        ShowToast(Languages.Oops);
      }
    } else {
      this.setState(
        {
          coverage: '',
          sqm: '',
          name: '',
          calculate: '',
          piece: '',
          neededArea: '',
        },
        () => { },
      );
    }
  };

  renderItem = ({ item, index }: { item: Wall; index: number }) => {
    const heightInputRef = createRef<TextInput>();
    return (
      <View key={`${index}wall`} style={styles.wallContainer}>
        <View style={styles.wallBubble}>
          <Text style={styles.areaTxt}>{`${Languages.Area} ${index + 1}`}</Text>
        </View>

        <View
          key={`width${index}`}
          style={[
            styles.wallBubble,
            {
              width: null,
              backgroundColor: AppColors.white,
              borderWidth: 1,
              borderColor: '#575757',
              flexDirection: 'row',
            },
          ]}>
          <AppTouchableOpacity
            androidRippleColor={AppColors.androidRippleColor.white}
            disabled={!item.width || item.width <= 1}
            style={{
              backgroundColor:
                !item.width || item.width <= 1 ? 'gray' : AppColors.primary,
              height: '100%',
              width: dimensionsCalculation(25),
              alignItems: 'center',
              justifyContent: 'center',
              borderTopLeftRadius: dimensionsCalculation(20),
              borderBottomLeftRadius: dimensionsCalculation(20),
            }}
            onPress={() => {
              item.width = item.width - 1;
              this.setState(
                {
                  walls: [...this.state.walls],
                },
                () => { },
              );
            }}>
            <AppIcon
              name="minus"
              size={dimensionsCalculation(15)}
              color={AppColors.white}
              type="AntDesign"
            />
          </AppTouchableOpacity>
          <TextInput
            value={item?.width?.toString() ?? ''}
            placeholder={Languages.Width}
            onChangeText={(width) => {
              item.width = width && width != '' ? parseFloat(width) : null;
              this.setState(
                {
                  walls: [...this.state.walls],
                },
                () => { },
              );
            }}
            keyboardType="number-pad"
            style={{
              padding: 0,
              paddingHorizontal: dimensionsCalculation(5),
              color: AppColors.secondary,
              fontSize: dimensionsCalculation(13),
              textAlign: 'center',
            }}
            onSubmitEditing={() => {
              heightInputRef?.current?.focus();
            }}
          />
          <AppTouchableOpacity
            androidRippleColor={AppColors.androidRippleColor.white}
            style={{
              backgroundColor: AppColors.primary,
              height: '100%',
              width: dimensionsCalculation(25),
              alignItems: 'center',
              justifyContent: 'center',
              borderTopRightRadius: dimensionsCalculation(20),
              borderBottomRightRadius: dimensionsCalculation(20),
            }}
            onPress={() => {
              item.width = item.width + 1;
              this.setState(
                {
                  walls: [...this.state.walls],
                },
                () => { },
              );
            }}>
            <AppIcon
              name="plus"
              size={dimensionsCalculation(15)}
              color={AppColors.white}
              type="AntDesign"
            />
          </AppTouchableOpacity>
        </View>
        <View
          key={`height${index}`}
          style={[
            styles.wallBubble,
            {
              width: null,
              backgroundColor: AppColors.white,
              borderWidth: 1,
              borderColor: '#575757',
              flexDirection: 'row',
            },
          ]}>
          <AppTouchableOpacity
            androidRippleColor={AppColors.androidRippleColor.white}
            disabled={!item.height || item.height <= 1}
            style={{
              backgroundColor:
                !item.height || item.height <= 1 ? 'gray' : AppColors.primary,
              height: '100%',
              width: dimensionsCalculation(25),
              alignItems: 'center',
              justifyContent: 'center',
              borderTopLeftRadius: dimensionsCalculation(20),
              borderBottomLeftRadius: dimensionsCalculation(20),
            }}
            onPress={() => {
              item.height = item.height - 1;
              this.setState(
                {
                  walls: [...this.state.walls],
                },
                () => { },
              );
            }}>
            <AppIcon
              name="minus"
              size={dimensionsCalculation(15)}
              color={AppColors.white}
              type="AntDesign"
            />
          </AppTouchableOpacity>
          <TextInput
            ref={heightInputRef}
            value={item?.height?.toString() ?? ''}
            placeholder={Languages.Height}
            onChangeText={(height) => {
              item.height = height && height != '' ? parseFloat(height) : null;
              this.setState(
                {
                  walls: [...this.state.walls],
                },
                () => { },
              );
            }}
            keyboardType="number-pad"
            style={{
              padding: 0,
              paddingHorizontal: dimensionsCalculation(5),
              color: AppColors.secondary,
              fontSize: dimensionsCalculation(13),
              textAlign: 'center',
            }}
          />
          <AppTouchableOpacity
            androidRippleColor={AppColors.androidRippleColor.white}
            style={{
              backgroundColor: AppColors.primary,
              height: '100%',
              width: dimensionsCalculation(25),
              alignItems: 'center',
              justifyContent: 'center',
              borderTopRightRadius: dimensionsCalculation(20),
              borderBottomRightRadius: dimensionsCalculation(20),
            }}
            onPress={() => {
              item.height = item.height + 1;
              this.setState(
                {
                  walls: [...this.state.walls],
                },
                () => { },
              );
            }}>
            <AppIcon
              name="plus"
              size={dimensionsCalculation(15)}
              color={AppColors.white}
              type="AntDesign"
            />
          </AppTouchableOpacity>
        </View>
        {index > 0 && (
          <AppTouchableOpacity
            borderless
            style={{
              overflow: 'visible',
              borderRadius: dimensionsCalculation(10),
            }}
            onPress={() => {
              configureNextAnimation();
              this.setState(
                {
                  walls: [
                    ...this.state.walls?.filter(
                      (_, current) => _.id != item.id,
                    ),
                  ],
                },
                () => { },
              );
            }}>
            <AppIcon
              type="FontAwesome"
              size={dimensionsCalculation(20)}
              color={AppColors.mainText}
              name="trash"
            />
          </AppTouchableOpacity>
        )}
      </View>
    );
  };

  getToolTipText = () => {
    const { tooltipType } = this.state;
    switch (tooltipType) {
      case 'dimensions':
        return Languages.DimensionsTip;
      case 'doorcalculation':
        return Languages.DoorsTip;
      case 'howmuchneed':
        return Languages.HowMuchNeedTip;
    }
  };

  renderToolTipModal = () => {
    const { tooltipType, isTooltipVisible } = this.state;
    return (
      <Modal
        isOpen={isTooltipVisible}
        statusBarTranslucent
        backdrop
        backdropPressToClose={false}
        backdropColor={AppColors.black}
        backdropOpacity={0.3}
        backButtonClose
        swipeToClose={false}
        coverScreen
        startOpen={tooltipType != 'learnmore'}
        animationDuration={tooltipType != 'learnmore' ? 0 : 400}
        style={styles.modalStyle}
        onClosed={() => {
          this.setState(
            {
              tooltipType: null,
              isTooltipVisible: false,
            },
            () => { },
          );
        }}>
        <AppTouchableOpacity
          androidRippleColor={AppColors.transparent}
          activeOpacity={1}
          style={styles.modalBackdrop}
          onPress={async () => {
            await this.tootipViewRef?.current?.zoomOut(300);
            this.setState(
              {
                isTooltipVisible: false,
              },
              () => { },
            );
          }}
        />
        {tooltipType != 'learnmore' ? (
          <AnimatedView
            ref={this.tootipViewRef as any}
            duration={300}
            delay={300}
            animation="zoomIn"
            style={styles.toolTip}>
            <Text style={styles.tipText}>{this.getToolTipText()}</Text>
          </AnimatedView>
        ) : (
          <View style={styles.learnMoreView}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                paddingTop: getStatusBarHeight() + dimensionsCalculation(20),
              }}>
              <AppTouchableOpacity
                androidRippleColor={AppColors.androidRippleColor.black15}
                borderless
                style={[styles.closeBtn]}
                onPress={() => {
                  this.setState(
                    {
                      isTooltipVisible: false,
                    },
                    () => { },
                  );
                }}>
                <AppIcon
                  name="closecircle"
                  type="AntDesign"
                  size={dimensionsCalculation(26)}
                  color={AppColors.inputText}
                />
              </AppTouchableOpacity>
              <Text
                style={[
                  styles.learnMoreTitle,
                  {
                    paddingHorizontal: dimensionsCalculation(20),
                    color: AppColors.mainText,
                  },
                ]}>
                {Languages.LearnMoreTitle}
              </Text>
              <View style={styles.separator} />
              <Text
                style={[
                  styles.learnMoreText,
                  {
                    paddingHorizontal: dimensionsCalculation(20),
                    color: AppColors.mainText,
                  },
                ]}>
                {Languages.LearnMoreP1}
              </Text>
            </ScrollView>
          </View>
        )}
      </Modal>
    );
  };

  render() {
    const {
      isLoading,
      walls,
      windows,
      doors,
      coverage,
      sqm,
      neededArea,
      calculate,
      thickness,
      sizes,
      piece,
      name,
    } = this.state;
    return (
      <View style={styles.container}>
        {this.renderToolTipModal()}
        <AppHeader />
        <AppTabBar />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <FlatList
            ref={this.scrollviewRef}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.flatlist}
            ListHeaderComponent={
              <View style={{}}>
                <Text style={styles.title}>
                  {Languages.PaintCalculatorTitle}
                </Text>
                <Text style={[styles.subtitle, { color: AppColors.mainText }]}>
                  ({this.props.route?.params?.product.product.name})
                </Text>
                <Text style={styles.subtitle}>{Languages.HowMuchPaint}</Text>
                <Text style={styles.bodyTxt}>{Languages.NoNeedCrunch}</Text>
                <AppTouchableOpacity
                  style={{
                    alignSelf: 'flex-start',
                    paddingHorizontal: dimensionsCalculation(10),
                    left: dimensionsCalculation(-10),
                    marginTop: dimensionsCalculation(15),
                  }}
                  onPress={() => {
                    this.setState(
                      {
                        tooltipType: 'learnmore',
                        isTooltipVisible: true,
                      },
                      () => { },
                    );
                  }}>
                  <Text style={styles.learnMore}>{Languages.LearnMore}</Text>
                </AppTouchableOpacity>
                <View style={styles.separator} />
                <View style={styles.row}>
                  <Text
                    style={styles.bodyTxt}
                    numberOfLines={1}
                    adjustsFontSizeToFit>
                    {Languages.EnterDimensions}
                  </Text>
                  <AppTouchableOpacity
                    style={{
                      overflow: 'visible',
                      borderRadius: dimensionsCalculation(10),
                    }}
                    borderless
                    onPress={() => {
                      this.setState(
                        {
                          tooltipType: 'dimensions',
                          isTooltipVisible: true,
                        },
                        () => { },
                      );
                    }}>
                    <AppIcon
                      name="info"
                      type="SimpleLineIcons"
                      size={dimensionsCalculation(20)}
                      // color="#707070"
                      color={AppColors.black}
                    />
                  </AppTouchableOpacity>
                </View>
                <Text
                  style={[
                    styles.bodyTxt,
                    {
                      color: AppColors.mainText,
                      marginTop: dimensionsCalculation(10),
                    },
                  ]}>
                  {Languages.CustomFeild}
                </Text>
              </View>
            }
            keyExtractor={(item, index) => index.toString()}
            data={walls}
            renderItem={this.renderItem}
            ListFooterComponent={
              <View style={{}}>
                <AppButton
                  onPress={() => {
                    configureNextAnimation();
                    this.setState(
                      {
                        walls: [
                          ...walls,
                          { id: walls.length, width: null, height: null },
                        ],
                      },
                      () => { },
                    );
                  }}
                  text={Languages.AddWall}
                  textColor={AppColors.black}
                  androidRippleColor={AppColors.androidRippleColor.black15}
                  icon="circle-with-plus"
                  iconType="Entypo"
                  iconSize={dimensionsCalculation(15)}
                  containerStyle={{
                    backgroundColor: AppColors.transparent,
                    alignSelf: 'flex-start',
                    marginTop: dimensionsCalculation(15),
                  }}
                />
                <View style={styles.separator} />
                <View style={styles.row}>
                  <Text
                    style={styles.bodyTxt}
                    numberOfLines={1}
                    adjustsFontSizeToFit>
                    {Languages.SubtractWindowsDoors}
                  </Text>
                  <AppTouchableOpacity
                    style={{
                      overflow: 'visible',
                      borderRadius: dimensionsCalculation(10),
                    }}
                    borderless
                    onPress={() => {
                      this.setState(
                        {
                          tooltipType: 'doorcalculation',
                          isTooltipVisible: true,
                        },
                        () => { },
                      );
                    }}>
                    <AppIcon
                      name="info"
                      type="SimpleLineIcons"
                      size={dimensionsCalculation(20)}
                      // color="#707070"
                      color={AppColors.black}
                    />
                  </AppTouchableOpacity>
                </View>
                <View
                  style={[
                    styles.row,
                    {
                      paddingHorizontal: dimensionsCalculation(20),
                      marginTop: dimensionsCalculation(10),
                    },
                  ]}>
                  <Text style={{ fontSize: dimensionsCalculation(16) }}>
                    {windows}
                  </Text>
                  <Text style={{ fontSize: dimensionsCalculation(16) }}>
                    {Languages.Window}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <AppButton
                      androidRippleColor={AppColors.androidRippleColor.black15}
                      containerStyle={styles.plusminus}
                      onPress={() => {
                        if (windows > 0)
                          this.setState(
                            {
                              windows: windows - 1,
                            },
                            () => { },
                          );
                      }}
                      disabled={windows == 0}
                      icon="minus"
                      iconType="Entypo"
                      iconSize={dimensionsCalculation(15)}
                      textColor="#3B3A3A"
                    />
                    <AppButton
                      androidRippleColor={AppColors.androidRippleColor.black15}
                      containerStyle={[
                        styles.plusminus,
                        { marginLeft: dimensionsCalculation(10) },
                      ]}
                      onPress={() => {
                        this.setState(
                          {
                            windows: windows + 1,
                          },
                          () => { },
                        );
                      }}
                      icon="plus"
                      iconType="Entypo"
                      iconSize={dimensionsCalculation(15)}
                      textColor="#3B3A3A"
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.row,
                    {
                      paddingHorizontal: dimensionsCalculation(20),
                      marginTop: dimensionsCalculation(10),
                    },
                  ]}>
                  <Text style={{ fontSize: dimensionsCalculation(16) }}>
                    {doors}
                  </Text>
                  <Text style={{ fontSize: dimensionsCalculation(16) }}>
                    {Languages.Door}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <AppButton
                      androidRippleColor={AppColors.androidRippleColor.black15}
                      containerStyle={styles.plusminus}
                      onPress={() => {
                        if (doors > 0)
                          this.setState({ doors: doors - 1 }, () => { });
                      }}
                      disabled={doors == 0}
                      icon="minus"
                      iconType="Entypo"
                      iconSize={dimensionsCalculation(15)}
                      textColor="#3B3A3A"
                    />
                    <AppButton
                      androidRippleColor={AppColors.androidRippleColor.black15}
                      containerStyle={[
                        styles.plusminus,
                        { marginLeft: dimensionsCalculation(10) },
                      ]}
                      onPress={() => {
                        this.setState(
                          {
                            doors: doors + 1,
                          },
                          () => { },
                        );
                      }}
                      icon="plus"
                      iconType="Entypo"
                      iconSize={dimensionsCalculation(15)}
                      textColor="#3B3A3A"
                    />
                  </View>
                </View>
                <View style={styles.howMuch}>
                  <Text style={styles.howMuchTxt}>
                    {Languages.HowMuchNeeded.replace('{0}', neededArea)}
                  </Text>
                  <AppTouchableOpacity
                    style={{
                      overflow: 'visible',
                      marginTop: dimensionsCalculation(3),
                      borderRadius: dimensionsCalculation(10),
                    }}
                    borderless
                    onPress={() => {
                      this.setState(
                        {
                          tooltipType: 'howmuchneed',
                          isTooltipVisible: true,
                        },
                        () => { },
                      );
                    }}>
                    <AppIcon
                      name="info"
                      type="SimpleLineIcons"
                      size={dimensionsCalculation(20)}
                      // color="#707070"
                      color={AppColors.black}
                    />
                  </AppTouchableOpacity>
                </View>
                {coverage != '' && sqm != '' && (
                  <View
                    style={{
                      marginHorizontal: dimensionsCalculation(20),
                      marginTop: dimensionsCalculation(20),
                    }}>
                    <View style={styles.row}>
                      <Text style={styles.key}>{Languages.Coverage}</Text>
                      <Text style={styles.value}>
                        {`${parseFloat(coverage)?.toFixed(2)} ${Languages.KG}`}
                      </Text>
                    </View>
                    <View style={styles.separator} />
                  </View>
                )}
                {calculate != '' && (
                  <View style={[styles.howMuch, { flexDirection: 'column' }]}>
                    <Text
                      style={[
                        styles.howMuchTxt,
                        {
                          // color: '#BCBCBC',
                          fontSize: dimensionsCalculation(16),
                        },
                      ]}>
                      {`${Languages.EstimatePerCoat}\n${Languages.Coverage}: ${calculate} ${Languages.M2}/${Languages.KG}`}
                    </Text>
                    <Text
                      style={[
                        styles.howMuchTxt,
                        {
                          // color: '#BCBCBC',
                          fontSize: dimensionsCalculation(16),
                        },
                      ]}>
                      {`${Languages.Thickness} ${thickness}`}
                    </Text>
                    {sizes?.length > 0 && (
                      <>
                        <Text
                          style={[
                            styles.howMuchTxt,
                            {
                              color: AppColors.secondary,
                              fontSize: dimensionsCalculation(16),
                            },
                          ]}>
                          {`${Languages.SuggestedSize}`}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            // alignItems: 'center',
                            flexWrap: 'wrap',
                          }}>
                          {sizes.map((x, i) => (
                            <Text
                              key={`count${i}`}
                              style={[
                                styles.howMuchTxt,
                                {
                                  flex: null,
                                  textAlign: 'left',
                                  color: AppColors.mainText,
                                  fontSize: dimensionsCalculation(16),
                                },
                              ]}>
                              {`${x?.name ?? ''} (${isRTL ? Languages.Count : ''
                                } ${x?.count ?? ''} ${!isRTL ? Languages.Count : ''
                                })`}
                            </Text>
                          ))}
                        </View>
                      </>
                    )}
                  </View>
                )}
              </View>
            }
          />
        )}
      </View>
    );
  }
}
