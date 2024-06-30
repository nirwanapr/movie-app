import React, { useState, useEffect } from 'react';
import { View, Button, FlatList, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Picker } from 'react-native';
import axios from 'axios';
import { API_ACCESS_TOKEN } from '@env';
import { Movie } from '../types/app';
import { useNavigation, StackActions } from '@react-navigation/native';

const GenreSearch = () => {
  const [genre, setGenre] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
          params: { language: 'en' },
          headers: {
            Authorization: `Bearer ${API_ACCESS_TOKEN}`,
          },
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

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

  const searchMoviesByGenre = () => {
    if (!genre) {
      console.log('No genre selected, skipping search.');
      return;
    }
    fetchMovies('https://api.themoviedb.org/3/discover/movie', { with_genres: genre, page: 1 });
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
      <Text style={styles.header}>Search Movies by Genre</Text>
      <View style={styles.searchSection}>
        <Text style={styles.label}>Genre</Text>
        <Picker
          selectedValue={genre}
          style={styles.picker}
          onValueChange={(itemValue) => setGenre(itemValue)}
        >
          {genres.map((genre) => (
            <Picker.Item key={genre.id} label={genre.name} value={genre.id.toString()} />
          ))}
        </Picker>
        <Button title="Search" onPress={searchMoviesByGenre} />
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
  picker: {
    height: 50,
    marginBottom: 8,
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

export default GenreSearch;
