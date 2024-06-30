import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useFavorites } from '../context/FavoriteContext';
import { useNavigation } from '@react-navigation/native';
import { Movie } from '../types/app'; 
import { FavoriteStackParamList } from '../navigations/FavoriteStackNavigation';

const Favorite = (): JSX.Element => {
  const { favorites } = useFavorites();
  const navigation = useNavigation<any>(); 

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No favorite movies yet.</Text>
      </View>
    );
  }

  const navigateToDetail = (movie: Movie) => { 
    navigation.navigate('MovieDetail', movie);
  };

  return (
    <FlatList
      data={favorites}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigateToDetail(item)} style={styles.movieItem}>
          <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }} style={styles.moviePoster} />
          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
  },
  movieItem: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  moviePoster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  movieInfo: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  movieOverview: {
    fontSize: 14,
    color: '#666',
  },
});

export default Favorite;
