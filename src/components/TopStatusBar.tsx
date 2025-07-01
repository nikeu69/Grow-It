import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useGame} from '../contexts/GameContext';

export const TopStatusBar: React.FC = () => {
  const {gameState, formatCurrency, formatHeight} = useGame();

  return (
    <View style={styles.container}>
      {/* Height display */}
      <View style={styles.statContainer}>
        <Text style={styles.statIcon}>📏</Text>
        <View style={styles.statInfo}>
          <Text style={styles.statLabel}>Height</Text>
          <Text style={styles.statValue}>
            {formatHeight(gameState.player.height)}
          </Text>
        </View>
      </View>

      {/* Grow-Goo currency */}
      <TouchableOpacity style={styles.currencyContainer}>
        <Text style={styles.currencyIcon}>💧</Text>
        <View style={styles.currencyInfo}>
          <Text style={styles.currencyLabel}>Grow-Goo</Text>
          <Text style={styles.currencyValue}>
            {formatCurrency(gameState.player.growGoo)}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Stardust Shards */}
      <TouchableOpacity style={styles.currencyContainer}>
        <Text style={styles.currencyIcon}>✨</Text>
        <View style={styles.currencyInfo}>
          <Text style={styles.currencyLabel}>Shards</Text>
          <Text style={styles.currencyValue}>
            {formatCurrency(gameState.player.stardustShards)}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Settings button */}
      <TouchableOpacity style={styles.settingsButton}>
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  currencyIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  currencyInfo: {
    alignItems: 'flex-end',
  },
  currencyLabel: {
    fontSize: 9,
    color: '#666',
    marginBottom: 1,
  },
  currencyValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#32CD32',
  },
  settingsButton: {
    marginLeft: 8,
    padding: 8,
  },
  settingsIcon: {
    fontSize: 18,
  },
});