import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_ACCESS_TOKEN } from '@env';
import { Movie } from '../types/app';
import { useNavigation, StackActions } from '@react-navigation/native';

const KeywordSearch = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const fetchMovies = async (url: string, params: object) => {
    setLoading(true);
    try {
      const response = await axios.get(url, {
        params,
        headers: {
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
        },
      });
      setMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchMoviesByKeyword = () => {
    if (query.trim() === '') {
      console.log('Empty query, skipping search.');
      return;
    }
    fetchMovies('https://api.themoviedb.org/3/search/movie', { query, page: 1 });
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
      <Text style={styles.header}>Search Movies by Keyword</Text>
      <View style={styles.searchSection}>
        <Text style={styles.label}>Keyword</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter keyword"
          value={query}
          onChangeText={setQuery}
        />
        <Button title="Search" onPress={searchMoviesByKeyword} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
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

export default KeywordSearch;
