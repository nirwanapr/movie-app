import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Search from '../screens/Search';
import KeywordSearch from '../search/KeywordSearch';
import GenreSearch from '../search/GenreSearch';
import MovieDetail from '../screens/MovieDetail';

const Stack = createStackNavigator();

const SearchStackNavigation = (): JSX.Element => (
  <Stack.Navigator initialRouteName="Search">
    <Stack.Screen
      name="Search"
      component={Search}
      options={{ headerTitle: 'Search Movies' }}
    />
    <Stack.Screen
      name="KeywordSearch"
      component={KeywordSearch}
      options={{ headerTitle: 'Search Movies by Keyword' }}
    />
    <Stack.Screen
      name="GenreSearch"
      component={GenreSearch}
      options={{ headerTitle: 'Search Movies by Genre' }}
    />
    <Stack.Screen
      name="MovieDetail"
      component={MovieDetail}
      options={({ route }) => ({ headerTitle: route.params.title })}
    />
  </Stack.Navigator>
);

export default SearchStackNavigation;
