import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { API_ACCESS_TOKEN } from '@env';
import { Movie } from '../types/app';
import { useNavigation, StackActions } from '@react-navigation/native';

const Search = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const navigation = useNavigation();

  const searchMovies = async () => {
    if (query.trim() === '') {
      console.log('Empty query, skipping search.');
      return;
    }
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          query,
          page: 1,
        },
        headers: {
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
        },
      });
      setMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const navigateToDetail = (movie: Movie) => {
    navigation.dispatch(StackActions.push('MovieDetail', {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      original_language: movie.original_language,
      release_date: movie.release_date,
      popularity: movie.popularity,
      vote_count: movie.vote_count,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
    }));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for a movie..."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={searchMovies} />
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => navigateToDetail(item)}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
              style={styles.image}
            />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 150,
  },
  title: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Search;
