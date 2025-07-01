import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const ShopScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Shop</Text>
      <Text style={styles.description}>Shop coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
});