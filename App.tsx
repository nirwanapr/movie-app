import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { FavoritesProvider } from './src/context/FavoriteContext'
import BottomTabNavigator from './src/navigations/BottomTabNavigation'


export default function App(): JSX.Element {
  return (
    <FavoritesProvider>
      <NavigationContainer>
          <BottomTabNavigator />
      </NavigationContainer>
    </FavoritesProvider>
    
  )
}