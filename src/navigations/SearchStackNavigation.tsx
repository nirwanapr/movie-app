import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Search from '../screens/Search';
import MovieDetail from '../screens/MovieDetail';

const Stack = createStackNavigator();

const SearchStackNavigation = (): JSX.Element => (
  <Stack.Navigator>
    <Stack.Screen
      name="Search"
      component={Search}
      options={{ headerTitle: 'Search Movies' }}
    />
    <Stack.Screen
      name="MovieDetail"
      component={MovieDetail}
      options={({ route }) => ({ headerTitle: route.params.title })}
    />
  </Stack.Navigator>
);

export default SearchStackNavigation;
