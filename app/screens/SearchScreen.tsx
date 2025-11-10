import { AppIcon, Constants, fonts, Languages } from '../common';
import { Product, SearchScreenProps, SearchScreenState } from '../common/Types';
import { AppTouchableOpacity, LoadingSpinner, ProductCard } from '../components';
import { goBack } from '../navigation';
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { View, StyleSheet, Text, FlatList, TextInput } from 'react-native';
import { productsGetCall } from '../services/api/calls';
import { AppColors } from '../theme';
import { dimensionsCalculation, getStatusBarHeight, isRTL } from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    paddingTop: getStatusBarHeight() + dimensionsCalculation(10),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: dimensionsCalculation(20),
    paddingLeft: dimensionsCalculation(10),
    paddingBottom: dimensionsCalculation(5),
    // elevation: 1,
    // backgroundColor: AppColors.white,
    // borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9',
  },
  searchInput: {
    flex: 1,
    paddingVertical: dimensionsCalculation(5),
    fontSize: dimensionsCalculation(16),
    textAlign: isRTL ? 'right' : 'left',
    marginLeft: dimensionsCalculation(10),
    paddingLeft: dimensionsCalculation(20),
    borderRadius: dimensionsCalculation(15),
    borderWidth: 1,
    borderColor: '#d9d9d9',
  },
});

export default class SearchScreen extends Component<
  SearchScreenProps,
  SearchScreenState
> {
  pagenumber = 1;

  constructor(props: SearchScreenProps) {
    super(props);
    this.state = {
      isLoading: false,
      search: props?.route?.params?.search ?? '',
      results: [],
    };
    StatusBar.setBarStyle('dark-content', true);
  }

  componentDidMount = () => {
    this.props.route?.params?.search && this.doSearch();
  };

  componentWillUnmount = () => {
    StatusBar.setBarStyle('light-content', true);
  };

  doSearch = () => {
    const { search } = this.state;
    this.setState(
      {
        isLoading: true,
      },
      async () => {
        const result = await productsGetCall({
          p: this.pagenumber++,
          search,
        });
        this.setState(
          {
            results: result?.data?.products ?? [],
            isLoading: false,
          },
          () => { },
        );
      },
    );
  };

  renderSearchResultItem = ({ item, index }: { item: Product; index: number }) => {
    return <ProductCard product={item} index={index} />;
  };

  render() {
    const { search, results, isLoading } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <AppTouchableOpacity
            borderless
            style={{ overflow: 'visible', padding: 5 }}
            onPress={() => {
              goBack();
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
          <TextInput
            autoFocus={!this.props?.route?.params?.search}
            value={search}
            onChangeText={(search) => {
              this.pagenumber = 1;
              search != ''
                ? this.setState(
                  (prevState) => ({
                    search,
                    results: prevState?.search == '' ? [] : prevState.results,
                  }),
                  () => {
                    this.doSearch();
                  },
                )
                : this.setState({ results: [], search }, () => { });
            }}
            placeholder={Languages.SearchPlaceholder}
            style={styles.searchInput}
          />
        </View>
        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: dimensionsCalculation(20),
          }}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          data={search != '' ? results : []}
          renderItem={this.renderSearchResultItem}
          ListEmptyComponent={
            search != '' ? (
              isLoading ? (
                <LoadingSpinner />
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: dimensionsCalculation(30),
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: fonts.primaryBold,
                      fontSize: dimensionsCalculation(20),
                    }}>
                    {Languages.NoSearchResults}
                  </Text>
                </View>
              )
            ) : null
          }
        />
      </View>
    );
  }
}
