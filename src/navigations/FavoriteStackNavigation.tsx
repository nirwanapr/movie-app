import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Favorite from '../screens/Favorite';
import MovieDetail from '../screens/MovieDetail';
import { Movie } from '../types/app'; 


export type FavoriteStackParamList = {
  Favorite: undefined;
  MovieDetail: Movie; 
};

const Stack = createNativeStackNavigator<FavoriteStackParamList>();

const FavoriteStackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Favorite"
        component={Favorite}
        options={{ title: 'Favorite Movies' }}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetail}
        options={({ route }) => ({ title: route.params.title || 'Movie Detail' })}
      />
    </Stack.Navigator>
  );
};

export default FavoriteStackNavigation;
