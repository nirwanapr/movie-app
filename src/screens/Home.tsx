// screens/Home.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';

const Home = ({ navigation }: any) => {
  return (
    <View>
      <Text>Home</Text>
      <Button
        title="Go to Movie Detail"
        onPress={() => navigation.navigate('MovieDetail')}
      />
    </View>
  );
};

export default Home;
