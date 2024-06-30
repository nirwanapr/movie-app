import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FavoritesContextProps {
  favorites: any[];
  addFavorite: (movie: any) => void;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextProps>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<any[]>([]);

  const addFavorite = (movie: any) => {
    setFavorites((prevFavorites) => [...prevFavorites, movie]);
  };

  const removeFavorite = (movieId: number) => {
    setFavorites((prevFavorites) => prevFavorites.filter(movie => movie.id !== movieId));
  };

  const isFavorite = (movieId: number) => {
    return favorites.some(movie => movie.id === movieId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
