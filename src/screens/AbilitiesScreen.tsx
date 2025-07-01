import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const AbilitiesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>✨ Abilities</Text>
      <Text style={styles.description}>Abilities coming soon...</Text>
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