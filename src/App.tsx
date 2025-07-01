import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import {GameProvider} from './contexts/GameContext';
import {SoundManager} from './managers/SoundManager';
import {StorageManager} from './managers/StorageManager';
import {NavigationContainer} from './navigation/NavigationContainer';
import {LoadingScreen} from './screens/LoadingScreen';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gameInitialized, setGameInitialized] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    try {
      // Initialize storage and load saved game data
      await StorageManager.initialize();
      
      // Initialize sound system
      await SoundManager.initialize();
      
      // Simulate loading time for splash screen
      setTimeout(() => {
        setGameInitialized(true);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to initialize game:', error);
      Alert.alert(
        'Initialization Error',
        'Failed to start Growth It! Please restart the app.',
        [{text: 'OK', onPress: () => setIsLoading(false)}]
      );
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <GameProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFE4E1"
          hidden={false}
        />
        <View style={styles.gameContainer}>
          <NavigationContainer />
        </View>
      </SafeAreaView>
    </GameProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4E1', // Light pink background
  },
  gameContainer: {
    flex: 1,
  },
});

export default App;