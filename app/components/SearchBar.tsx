import { AppIcon, Languages } from '../common';
import { AppTouchableOpacity } from '../components';
import { navigate } from '../navigation';
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { AppColors } from '../theme';
import { dimensionsCalculation, isRTL } from '../utils';

const styles = StyleSheet.create({
  searchContainer: {
    marginHorizontal: dimensionsCalculation(20),
    backgroundColor: '#FBFBFB',
    padding: dimensionsCalculation(4),
    borderRadius: dimensionsCalculation(20),
    marginBottom: dimensionsCalculation(20),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  searchInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: dimensionsCalculation(20),
    paddingLeft: dimensionsCalculation(10),
    borderWidth: 1,
    borderColor: '#B9BBBD',
  },
  findColor: {
    flex: 1,
    textAlign: isRTL ? 'right' : 'left',
    padding: 0,
    color: AppColors.mainText,
    fontSize: dimensionsCalculation(14),
  },
});

export interface SearchBarProps { }

const SearchBar = (props: SearchBarProps) => {
  const [search, setSearch] = useState<string>('');
  const ref = useRef<TextInput>();

  return (
    <AppTouchableOpacity
      androidRippleColor={AppColors.androidRippleColor.white}
      style={styles.searchContainer}
      disabled
      onPress={() => {
        navigate('SearchScreen');
      }}>
      <View style={styles.searchInnerContainer}>
        <TextInput
          ref={ref}
          defaultValue={search}
          placeholder={Languages.FindColor.toUpperCase()}
          style={styles.findColor}
          onChangeText={setSearch}
          onSubmitEditing={() => {
            navigate('SearchScreen', {
              search,
            });
            ref?.current?.clear();
            setSearch('');
          }}
        />
        {/* <Text style={styles.findColor}>
          {Languages.FindColor.toUpperCase()}
        </Text> */}
        <AppIcon
          name={require('../../assets/images/search.png')}
          size={dimensionsCalculation(30)}
          type="Image"
          useDefaultColors
          style={{
            right: -1,
          }}
          onPress={() => {
            navigate('SearchScreen', {
              search,
            });
            ref?.current?.clear();
            setSearch('');
          }}
        />
      </View>
    </AppTouchableOpacity>
  );
};

export default SearchBar;
