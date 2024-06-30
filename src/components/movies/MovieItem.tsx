import React from 'react';
import { ImageBackground, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { MovieItemProps } from '../../types/app';

const MovieItem = ({ movie, size, coverType }: MovieItemProps): JSX.Element => {
  const navigation = useNavigation();
  
  const pushAction = StackActions.push('MovieDetail', { 
    id: movie.id, 
    title: movie.title, 
    overview: movie.overview, 
    original_language: movie.original_language, 
    release_date: movie.release_date, 
    popularity: movie.popularity, 
    vote_count: movie.vote_count, 
    poster_path: movie.poster_path, 
    backdrop_path: movie.backdrop_path 
  });

  const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.dispatch(pushAction);
      }}
    >
      <ImageBackground
        resizeMode="cover"
        style={[size, styles.backgroundImage]}
        imageStyle={styles.backgroundImageStyle}
        source={{
          uri: `https://image.tmdb.org/t/p/w500${coverType === 'backdrop' ? movie.backdrop_path : movie.poster_path}`,
        }}
      >
        <LinearGradient
          colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
          locations={[0.6, 1.0]} // Adjusted gradient locations
          style={styles.gradientStyle}
        >
          <View style={styles.textContainer}>
            <Text style={styles.movieTitle}>{movie.title}</Text>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="yellow" />
              <Text style={styles.rating}>{voteAverage}</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    marginRight: 4,
  },
  backgroundImageStyle: {
    borderRadius: 8,
  },
  gradientStyle: {
    padding: 8,
    height: '100%',
    width: '100%',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingVertical: 13, 
  },
  movieTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    padding: 4,
    borderRadius: 4,
  },
  rating: {
    color: 'yellow',
    fontWeight: '700',
    marginLeft: 4,
  },
});

export default MovieItem;
