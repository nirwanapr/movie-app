import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Picker } from 'react-native';
import axios from 'axios';
import { API_ACCESS_TOKEN } from '@env';
import { Movie } from '../types/app';
import { useNavigation, StackActions } from '@react-navigation/native';

const Search = () => {
  const [activeTab, setActiveTab] = useState('Keyword');
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (activeTab === 'Category') {
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
    }
  }, [activeTab]);

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
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Keyword' && styles.activeTab]}
          onPress={() => setActiveTab('Keyword')}
        >
          <Text style={styles.tabText}>Keyword</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Category' && styles.activeTab]}
          onPress={() => setActiveTab('Category')}
        >
          <Text style={styles.tabText}>Category</Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'Keyword' ? (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter keyword"
            value={query}
            onChangeText={setQuery}
          />
          <Button color={'#B39CD0'} title="Search" onPress={searchMoviesByKeyword} />
        </View>
      ) : (
        <View>
          <Picker
            selectedValue={genre}
            style={styles.picker}
            onValueChange={(itemValue) => setGenre(itemValue)}
          >
            {genres.map((genre) => (
              <Picker.Item key={genre.id} label={genre.name} value={genre.id.toString()} />
            ))}
          </Picker>
          <Button color={'#B39CD0'} title="Search" onPress={searchMoviesByGenre} />
        </View>
      )}
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
  activeTab: {
    backgroundColor: '#B39CD0',
  },
  tabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
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

export default Search;
