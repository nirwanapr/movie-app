import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useRoute, useNavigation, StackActions } from '@react-navigation/native';
import axios from 'axios';
import { API_URL, API_ACCESS_TOKEN } from '@env';
import { Movie } from '../types/app';
import { FavoriteStackParamList } from '../navigations/FavoriteStackNavigation';
import { useFavorites } from '../context/FavoriteContext'; 

type MovieDetailRouteProp = RouteProp<FavoriteStackParamList, 'MovieDetail'>;

const MovieDetail = (): JSX.Element => {
  const route = useRoute<MovieDetailRouteProp>();
  const navigation = useNavigation();
  const {
    id, original_language, release_date, popularity, vote_count, poster_path, backdrop_path, title, overview,
  } = route.params;

  const { addFavorite, removeFavorite, isFavorite } = useFavorites(); 

  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);

 
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movieResponse = await axios.get(`${API_URL}/movie/${id}`, {
          headers: {
            Authorization: `Bearer ${API_ACCESS_TOKEN}`,
          },
        });
        setMovie(movieResponse.data);

        const recommendationsResponse = await axios.get(`${API_URL}/movie/${id}/recommendations`, {
          headers: {
            Authorization: `Bearer ${API_ACCESS_TOKEN}`,
          },
        });
        setRecommendations(recommendationsResponse.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMovieData();
  }, [id]);


  if (!movie) {
    return <Text>Loading...</Text>;
  }


  const handleFavoriteToggle = () => {
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite({
        id, title, poster_path, backdrop_path, overview, original_language, release_date, popularity, vote_count,
      });
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
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${poster_path}` }}
        style={[styles.poster, { width: '100%', maxWidth: 300, height: 450 }]} 
      />
      <Text style={styles.title}>{title}</Text>

      {/* Favorite Button */}
      <TouchableOpacity onPress={handleFavoriteToggle} style={styles.favoriteButton}>
        <Text style={{ fontSize: 24 }}>
          {isFavorite(id) ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.overview}>{overview}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsText}>Original Language: {original_language}</Text>
        <Text style={styles.detailsText}>Release Date: {release_date}</Text>
        <Text style={styles.detailsText}>Popularity: {popularity}</Text>
        <Text style={styles.detailsText}>Vote Count: {vote_count}</Text>
      </View>

      
      <Text style={styles.recommendationsTitle}>Recommendations</Text>
      <FlatList
        horizontal
        data={recommendations}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToDetail(item)} style={styles.recommendationItem}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
              style={styles.recommendationPoster}
            />
            <Text style={styles.recommendationTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  poster: {
    width: '100%',
    maxWidth: 300, 
    height: 450, 
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  overview: {
    fontSize: 16,
    marginVertical: 8,
  },
  detailsContainer: {
    marginVertical: 8,
  },
  detailsText: {
    fontSize: 14,
    marginVertical: 2,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  recommendationItem: {
    width: 120,
    marginRight: 16,
    alignItems: 'center',
  },
  recommendationPoster: {
    width: 100,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  recommendationTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default MovieDetail;
