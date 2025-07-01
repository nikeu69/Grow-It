import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

export const UpgradesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Upgrades</Text>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Enhance Pipsqueak's Growing Power!</Text>
        <Text style={styles.description}>
          Upgrade system coming soon...
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4E1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});