import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, StackActions } from '@react-navigation/native';
import axios from 'axios';
import { API_URL, API_ACCESS_TOKEN } from '@env';

const MovieDetail = (): JSX.Element => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params as { id: string };

    const [movie, setMovie] = useState<any>(null);
    const [recommendations, setRecommendations] = useState<any[]>([]);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const movieResponse = await axios.get(`${API_URL}/movie/${id}`, {
                    headers: {
                        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
                    },
                });
                console.log('Movie data:', movieResponse.data); // Debugging line
                setMovie(movieResponse.data);

                const recommendationsResponse = await axios.get(`${API_URL}/movie/${id}/recommendations`, {
                    headers: {
                        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
                    },
                });
                console.log('Recommendations data:', recommendationsResponse.data.results); // Debugging line
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

    const navigateToDetail = (movieId: string) => {
        navigation.dispatch(StackActions.push('MovieDetail', { id: movieId }));
    };

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                style={styles.poster}
            />
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.overview}>{movie.overview}</Text>
            <View style={styles.detailsContainer}>
                <Text style={styles.detailsText}>Original Language: {movie.original_language}</Text>
                <Text style={styles.detailsText}>Release Date: {movie.release_date}</Text>
                <Text style={styles.detailsText}>Popularity: {movie.popularity}</Text>
                <Text style={styles.detailsText}>Vote Count: {movie.vote_count}</Text>
            </View>
            <Text style={styles.recommendationsTitle}>Recommendations</Text>
            <FlatList
                horizontal
                data={recommendations}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigateToDetail(item.id)} style={styles.recommendationItem}>
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
        height: 500,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 8,
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
        alignItems: 'center', // Center the items horizontally
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
