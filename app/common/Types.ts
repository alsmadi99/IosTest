import {
  DrawerContentComponentProps,
  DrawerContentOptions,
} from '@react-navigation/drawer';
import {StackNavigationProp} from '@react-navigation/stack';
import {RefObject} from 'react';
import {Animated, LayoutChangeEvent, StyleProp, ViewStyle} from 'react-native';
import {PeriodMarking} from 'react-native-calendars';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {LatLng} from 'react-native-maps';
import Modal from 'react-native-modalbox';

export interface QudsPaintsStore {
  auth: AuthStore;
  cart: CartStore;
}

export interface AuthStore {
  user: User;
  wishlist: Product[];
}

export interface CartStore {
  isAddingToCart: boolean;
  isCartFetching: boolean;
  isCartItemDeleting: boolean;
  cartid: string;
  items: CartItem[];
  count: number;
  total: number;
}

//Splash screen
export interface SplashScreenProps {
  navigation: StackNavigationProp<{}>;
}
export interface SplashScreenState {}

//Products screen
export interface ProductsScreenProps {
  navigation: StackNavigationProp<{}>;
  route: {
    params: {
      type: 'normal' | 'offers' | 'best';
    };
  };
  user: User;
}
export interface ProductsScreenState {
  isLoading: boolean;
  isRefreshing: boolean;
  isFetchingMore: boolean;
  products: Product[];
  pages: number;
  viewPosition: number;
  keyboardHeight: number;
  disableBackDrop: boolean;
  sortBy: SortByType;
  showAllColors: boolean;
  availableColors: Color[];
  selectedColors: string[];
  availableMinPrice: number;
  minPrice: number;
  availableMaxPrice: number;
  maxPrice: number;
  search: string;
}

//Product details screen
export interface ProductDetailsScreenProps {
  navigation: StackNavigationProp<{}>;
  route: {
    params: {
      product: Product;
    };
  };
  user: User;
  wishlist: Product[];
  getWishlist: () => Promise<void>;
  addToCart: (
    productid: string,
    colorid: string,
    sizeid: string,
    quantity: number,
    tinting: string,
    productAttribute: string,
  ) => Promise<void>;
}
export interface ProductDetailsScreenState {
  isLoading: boolean;
  isRefreshing: boolean;
  product: Product;
  surveyQuestions: Question[];
  currentQuestion: number;
  realtedProducts: Product[];
  isRelatedProductsFetching: boolean;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  productAttribute: string;
  isInfoModalOpen: boolean;
  infoModalContent: 'certificate' | 'tds' | 'msds' | 'description';
  isVideoModalOpen: boolean;
  isWebviewLoading: boolean;
  selectedTab: 'description' | 'certificate';
  scrollX: Animated.Value;
  selectedDay: {
    [date: string]: PeriodMarking;
  };
  currentDate: string;
  isTimePickerVisible: boolean;
  selectedTime: Date;
  isBookingCall: boolean;
  isKeyboardShown: boolean;
  price: string;
  oldprice: string;
  showSizes: boolean;
  viewHeight: number;
  productQuantity: number;
  isColorSizeChange: boolean;
  code: string;
  isCheckingCode: boolean;
  isAddToCartClicked: boolean;
  phone: string;
  isAddBtnClicked: boolean;
  isValidPhone: boolean;
  isAddingPhone: boolean;
}

//Login screen
export interface LoginScreenProps {
  route: {
    params: {
      extraAction: () => void;
    };
  };
  navigation: StackNavigationProp<{}>;
  login: ({
    username,
    password,
    extraAction,
  }: {
    username: string;
    password: string;
    extraAction: () => void;
  }) => Promise<void>;
  appleLogin: (extraAction: () => void) => Promise<void>;
  fbLogin: (extraAction: () => void) => Promise<void>;
  gooogleLogin: (extraAction: () => void) => Promise<void>;
}
export interface LoginScreenState {
  isLoading: boolean;
  isSocialLoginLoading: boolean;
  isSigninBtnClicked: boolean;
  email: string;
  password: string;
  forgotPassPhone: string;
  forgotPassEmail: string;
  forgotPassClicked: boolean;
  forgotType: 'email' | 'phone';
}

export interface VerifyOtpScreenProps {
  route: {
    params: {
      extraAction: () => void;
      type: VerifyCodeScreenNavigateType;
      phone: string;
      token: string;
    };
  };
}

export enum VerifyCodeScreenNavigateType {
  forgot_password = 1,
  verify_account = 2,
  checkout = 3,
}

export interface RegisterParams {
  email: string;
  password: string;
  name: string;
  lastname: string;
  country: string;
  city: string;
  phone: string;
  usertypenew: any;
  extraAction: () => void;
}

export interface UpdateProfileParams {
  firstname: string;
  lastname: string;
  phone: string;
  city: string;
  country: string;
  email?: string;
  photo?: string;
  usertypenew: any;
}

//signup screen
export interface RegisterScreenProps {
  route: {
    params: {
      extraAction: () => void;
    };
  };
  navigation: StackNavigationProp<{}>;
  register: (params: RegisterParams) => Promise<void>;
  appleLogin: (extraAction: () => void) => Promise<void>;
  fbLogin: (extraAction: () => void) => Promise<void>;
  gooogleLogin: (extraAction: () => void) => Promise<void>;
}
export interface RegisterScreenState {
  isLoading: boolean;
  isSocialLoginLoading: boolean;
  isSignupBtnClicked: boolean;
  isUserAgree: boolean;
  fullname: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  isValidPhone: boolean;
  userType: any;
}

//Home screen
export interface HomeScreenProps {
  navigation: StackNavigationProp<{}>;
  user: User;
  getCart: () => Promise<void>;
}
export interface HomeScreenState {
  search: string;
  isLoading: boolean;
  isRefreshing: boolean;
  products: Product[];
  canOpenWhatsapp: boolean;
}

//Blog screen
export interface BlogScreenProps {
  navigation: StackNavigationProp<{}>;
}
export interface BlogScreenState {
  isLoading: boolean;
  isRefreshing: boolean;
  isFetchingMore: boolean;
  blogs: Blog[];
  pages: number;
}

//Wishlist screen
export interface WishlistScreenProps {
  navigation: StackNavigationProp<{}>;
  user: User;
  getWishlist: () => Promise<void>;
  addToCart: (
    productid: string,
    colorid: string,
    sizeid: string,
    quantity: number,
    tinting: string,
    productAttribute: string,
  ) => Promise<boolean>;
  wishlist: Product[];
}
export interface WishlistScreenState {
  isLoading: boolean;
  isRefreshing: boolean;
  isFetchingMore: boolean;
  surveyQuestions: Question[];
  currentQuestion: number;
  selectedProduct: Product;
}

//Video gallery screen
export interface VideoGalleryScreenProps {
  navigation: StackNavigationProp<{}>;
  user: User;
}
export interface VideoGalleryScreenState {
  isLoading: boolean;
  isRefreshing: boolean;
  isFetchingMore: boolean;
  videos: Video[];
  pages: number;
  videoURL: string;
}

//Video gallery screen
export interface PhotoGalleryScreenProps {
  navigation: StackNavigationProp<{}>;
  user: User;
}
export interface PhotoGalleryScreenState {
  isLoading: boolean;
  isRefreshing: boolean;
  isFetchingMore: boolean;
  photos: Photo[];
  types: any[];
  selectedType: string;
  pages: number;
}

//Cart screen
export interface CartScreenProps {
  navigation: StackNavigationProp<{}>;
  user: User;
  cart: CartStore;
  getCart: () => Promise<void>;
  removeCartItem: (productid: string) => Promise<void>;
  isCartFetching: boolean;
}
export interface CartScreenState {
  isLoading: boolean;
  currentStep: number;
  paymentOption: number;
  isAddressesFetching: boolean;
  addresses: Address[];
  selectedAddressID: string;
  area: any;
  code: string;
  isKeyboardShown: boolean;
  isAddBtnClicked: boolean;
  isValidPhone: boolean;
  phone: string;
  isAddingPhone: boolean;
  isCheckingCode: boolean;
}

export interface ContactUsScreenProps {
  navigation: StackNavigationProp<{}>;
}
//DistributionPoints screen
export interface DistributionPointsScreenProps {
  navigation: StackNavigationProp<{}>;
  user: User;
}
export interface DistributionPointsScreenState {
  isLoading: boolean;
  points: Point[];
}

//Profile screen
export interface ProfileScreenProps {
  navigation: StackNavigationProp<{}>;
  user: User;
  getUserData: () => void;
}
export interface ProfileScreenState {
  showInfo: boolean;
}

//Select location screen
export interface SelectLocationScreenProps {
  navigation: StackNavigationProp<{}>;
  user: User;
  route: {
    params: {
      onSelect: (location: LatLng, description: string) => void;
      getAddresses: () => void;
      onAddressAdded?: () => void;
    };
  };
}
export interface SelectLocationScreenState {
  isKeyboardShown: boolean;
  currentLocation: LatLng;
  searchResults: any[];
  location: string;
  details: string;
  isLoading: boolean;
}

//Webview screen
export interface WebViewScreenProps {
  navigation: StackNavigationProp<{}>;
  route: {
    params: {
      url: string;
    };
  };
}
export interface WebViewScreenState {
  isLoading: boolean;
  canGoBack: boolean;
}

//Static page screen
export interface StaticPageScreenProps {
  navigation: StackNavigationProp<{}>;
  route: {
    params: {
      istabbar: boolean;
      type: '40199' | '40155' | '40153' | 'TermsNConditions' | 'PrivacyPolicy';
    };
  };
}
export interface StaticPageScreenState {
  isLoading: boolean;
  text: string;
  selectedTab: any;
  tabs: any[];
  title: string;
  image: string;
  headerHeight: number;
  headerShown: boolean;
}

//Profile screen
export interface EditProfileScreenProps {
  navigation: StackNavigationProp<{}>;
  user: User;
  route: {
    params: {
      viewMode: boolean;
    };
  };
  getUserData: () => Promise<void>;
  updateProfile: (params: UpdateProfileParams) => Promise<boolean>;
}
export interface EditProfileScreenState {
  isLoading: boolean;
  isEditingProfile: boolean;
  isEditBtnClicked: boolean;
  fullname: string;
  email: string;
  phone: string;
  isModalOpen: boolean;
  profilePic: any | string;
  userType: any;
}

//Edit password screen
export interface EditPasswordScreenProps {
  navigation: StackNavigationProp<{}>;
  user: User;
  route: {
    params: {
      token: string;
    };
  };
}
export interface EditPasswordScreenState {
  isEditingPassword: boolean;
  isEditBtnClicked: boolean;
  password: string;
  confirmPassword: string;
  forgotPassPhone: string;
  forgotPassEmail: string;
  forgotPassClicked: boolean;
  forgotType: 'email' | 'phone';
  isLoading: boolean;
  isModalOpen: boolean;
}

//Search screen
export interface SearchScreenProps {
  navigation: StackNavigationProp<{}>;
  user: User;
  route: {
    params: {
      search: string;
    };
  };
}
export interface SearchScreenState {
  search: string;
  isLoading: boolean;
  results: Product[];
}

//My addresses screen
export interface MyAddressesScreenProps {
  route: {
    params: {
      onAddressAdded: () => void;
    };
  };
  navigation: StackNavigationProp<{}>;
  user: User;
}
export interface MyAddressesScreenState {
  isLoading: boolean;
  isRefreshing: boolean;
  isDeleting: boolean;
  addresses: Address[];
  isAddingAddress: boolean;
  isAddBtnClicked: boolean;
  newaddressName: string;
  selectedCity: any;
  selectedArea: any;
  adderssName: string;
  details: string;
  keyboardheight: number;
  viewHeight: number;
  cities: any[];
  search: string;
  areas: any[];
  pin: any;
  isCitiesSearching: boolean;
  isAreasSearching: boolean;
}

//My orders screen
export interface MyOrdersScreenProps {
  navigation: StackNavigationProp<{}>;
  user: User;
}
export interface MyOrdersScreenState {
  isLoading: boolean;
  isRefreshing: boolean;
  isFetchingMore: boolean;
  orders: Order[];
  pages: number;
}

//Texhnical excellence screen
export interface TechnicalExcellenceScreenProps {
  navigation: StackNavigationProp<{}>;
}
export interface TechnicalExcellenceScreenState {
  isLoading: boolean;
  items: TechnicalExcellence[];
  currentIndex: number;
}

//Notifications screen
export interface NotificationsScreenProps {
  getUserData: () => void;
  navigation: StackNavigationProp<{}>;
  user: User;
}
export interface NotificationsScreenState {
  isLoading: boolean;
  isRefreshing: boolean;
  isFetchingMore: boolean;
  stopFetchingMore: boolean;
  notifications: Notification[];
}

//Blog details screen
export interface BlogDetailsScreenProps {
  navigation: StackNavigationProp<{}>;
  route: {
    params: {
      blog: Blog;
    };
  };
}
export interface BlogDetailsScreenState {
  isloading: boolean;
  height: number;
  headerHeight: number;
  headerShown: boolean;
  blog: Blog;
}

//Order details screen
export interface OrderDetailsScreenProps {
  navigation: StackNavigationProp<{}>;
  route: {
    params: {
      isCartCheckout: boolean;
      order: Order;
    };
  };
}
export interface OrderDetailsScreenState {
  isLoading: boolean;
  order: Order;
}

//Paint calculator screen
export interface PaintCalculatorScreenProps {
  navigation: StackNavigationProp<{}>;
  route: {
    params: {
      product: Product;
    };
  };
}
export interface PaintCalculatorScreenState {
  isLoading: boolean;
  walls: Wall[];
  windows: number;
  doors: number;
  coverage: string;
  sqm: string;
  neededArea: string;
  calculate: string;
  piece: string;
  thickness: string;
  name: string;
  tooltipType: ToolTipType;
  isTooltipVisible: boolean;
  scale: number;
  sizes: CalculaterSize[];
}

export interface CalculaterSize {
  id: string;
  count: number;
  name: string;
  result: string;
  sq: number;
  coverage: string;

  thickness: string;
  calculate: number;
  piece: number;
}

export type ToolTipType =
  | 'learnmore'
  | 'dimensions'
  | 'doorcalculation'
  | 'howmuchneed';
//Take a survey screen
export interface TakeSurveyScreenProps {
  navigation: StackNavigationProp<{}>;
  user: User;
}
export interface TakeSurveyScreenState {
  isLoading: boolean;
  questions: SurveyQuestion[];
  currentQuestion: number;
  options: SurveyOption[];
  isSubmitting: boolean;
  selectedOptions: string[];
  steps: Step[];
  suggestions: Product[];
  selectedColor: Color;
  colors: Color[];
  scrollY: number;
}

export interface Step {
  id: string;
  question: string;
  isend: boolean;
  hasanswers: boolean;
  isbegin: boolean;
  anses: SurveyOption[];
  user?: boolean;
}

export interface SurveyOption {
  id: string;
  answer: string;
  image: string;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  isend: boolean;
  hasanswers: boolean;
  isbegin: boolean;
  anses: SurveyOption[];
  user?: boolean;
  option?: SurveyOption;
}

export interface Wall {
  id: number;
  title?: string;
  width: number;
  height: number;
}

export interface Notification {
  id: string;
  orderid: string;
  title: string;
  description: string;
  date: string;
}

export interface TechnicalExcellence {
  id: string;
  name: string;
  image: string;
  article: {
    id: string;
    name: string;
    description: string;
    shortdescription: string;
    image: string;
    image1: string;
    youtubecode: string;
    images: ProductImage[];
    fullimages: ProductImage[];
  };
  attachments: {name: string; url: string}[];
  description?: string;
}

export interface Order {
  order: {
    id: string;
    total: string;
    shipping: string;
    date: string;
    items: OrderItem[];
  };
}

export interface OrderItem {
  item: {
    image: string;
    productid: string;
    productname: string;
    sizeid: string;
    sizename: string;
    colorid: string;
    colorname: string;
    quantity: string;
    price: string;
    total: string;
  };
}

export interface Address {
  address: {
    id: string;
    location: string;
    lat: string;
    lng: string;
    details: string;
    areaid: any;
  };
}

export interface Question {
  id: string;
  name: string;
  productid: string;
  productname: string;
  productimage: string;
  can: boolean;
  selectedOption: number;
}

export interface Point {
  article: {
    id: string;
    name: string;
    lat: string;
    lng: string;
    location: string;
  };
}

export interface PlusMinusButtonsProps {
  item: CartItem;
  value: number;
  onPlus: (newValue: number) => void;
  onMinus: (newValue: number) => void;
  onLoading: (isLoading: boolean) => void;
}

export interface CartItem {
  item: {
    id: string;
    cartid: string;
    productid: string;
    productname: string;
    price: string;
    image: string;
    quantity: string;
    tinting: boolean;
    sizeid: string;
    sizename: string;
    colorid: string;
    colorname: string;
    prevent: boolean;
    checker: boolean;
    attrid: string;
  };
}

export interface Photo {
  article: {
    id: string;
    name: string;
    views: number;
    description: string;
    shortdescription: string;
    image: string;
    image1: string;
    youtubecode: string;
    images: ProductImage[];
    fullimages: ProductImage[];
  };
}

export interface Video {
  article: {
    id: string;
    name: string;
    views: number;
    description: string;
    shortdescription: string;
    image: string;
    image1: string;
    youtubecode: string;
    images: ProductImage[];
    fullimages: ProductImage[];
  };
}

export interface Blog {
  article: {
    id: string;
    name: string;
    description: string;
    shortdescription: string;
    image: string;
    image1: string;
    youtubecode: string;
    images: ProductImage[];
    fullimages: ProductImage[];
  };
}

export interface AppHeaderProps {
  showMenu?: boolean;
  onBackPress?: () => void;
  forwardedRef?: any;
  onLayout?: (e: LayoutChangeEvent) => void;
  headerStyle?: StyleProp<ViewStyle>;
  activeScreen?: 'cart' | 'wishlist' | 'profile' | 'notifications';
}

export interface Size {
  id: string;
  name: string;
}

export interface Color {
  id?: 'tinting' | string;
  name?: string;
  code?: string;
  image?: string;
  image2?: string;
  isTinting?: boolean;
  whitec?: boolean;
}

export interface ProductImage {}

export interface Product {
  product: {
    offer: boolean;
    attrid: string;
    colorid: string;
    sizeid: string;
    sizename: string;
    colorname: string;
    id: string;
    type: number;
    quantity: number;
    name: string;
    description: string;
    tds: string;
    msds: string;
    certificate: string;
    youtubecode: string;
    shortdescription: string;
    image: string;
    tdsattache: string;
    msdsattach: string;
    certificateattach: string;
    fullimage: string;
    sizes: Size[];
    colors: Color[];
    images: ProductImage[];
    fullimages: ProductImage[];
    price: number;
    oldprice: number;
    catid: string;
    catname: string;
    eco: '0' | '1';
    shield: '0' | '1';
    clean: '0' | '1';
    hassize: '0' | '1';
    hascolor: '0' | '1';
    hassizecolor: '0' | '1';
    productid: string;
    productname: string;
    productimage: string;
    can: boolean;
    tinting: boolean;
  };
}

export interface ProductCardProps {
  product: Product;
  displayMode?: 'grid' | 'card' | 'list';
  index: number;
  horizontal?: boolean;
  hideButtons?: boolean;
  hideDescription?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export interface User {
  id: string;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  photo: string;
  country: string;
  city: string;
  gender: string;
  token: string;
  otp: string;
  otpactive: boolean;
  newnotifications: number;
  usertypenew: number;
}

export type IconType =
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'FontAwesome'
  | 'Fontisto'
  | 'Foundation'
  | 'Ionicons'
  | 'MaterialIcons'
  | 'MaterialCommunityIcons'
  | 'Octicons'
  | 'Zocial'
  | 'SimpleLineIcons'
  | 'Image';

export type SortByType = 'lowtohigh' | 'hightolow' | 'atoz' | 'ztoa';

export interface SelectImageModalProps {
  forwardedRef: RefObject<Modal>;
  onImageSelected: (image: any) => void;
  open?: () => void;
  close?: () => void;
}

export interface DrawerContentItemProps {
  label: string;
  navigate?: string;
  onPress?: () => void;
  needAuth?: boolean;
}

export interface DrawerContentProps
  extends DrawerContentComponentProps<DrawerContentOptions> {}
