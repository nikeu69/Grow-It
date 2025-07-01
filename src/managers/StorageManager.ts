import AsyncStorage from '@react-native-async-storage/async-storage';
import {GameState} from '../types/GameTypes';

const STORAGE_KEYS = {
  GAME_DATA: '@growth_it_game_data',
  SETTINGS: '@growth_it_settings',
  ANALYTICS: '@growth_it_analytics',
  FIRST_LAUNCH: '@growth_it_first_launch',
};

export class StorageManager {
  static async initialize(): Promise<void> {
    try {
      // Check if this is the first launch
      const firstLaunch = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
      if (!firstLaunch) {
        await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
        console.log('First launch initialized');
      }
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw error;
    }
  }

  static async saveGameData(gameState: GameState): Promise<void> {
    try {
      const dataToSave = {
        ...gameState,
        player: {
          ...gameState.player,
          lastSaveTime: Date.now(),
        },
        meta: {
          ...gameState.meta,
          lastPlayDate: Date.now(),
        },
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.GAME_DATA,
        JSON.stringify(dataToSave)
      );
      console.log('Game data saved successfully');
    } catch (error) {
      console.error('Failed to save game data:', error);
      throw error;
    }
  }

  static async loadGameData(): Promise<GameState | null> {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEYS.GAME_DATA);
      
      if (savedData) {
        const gameState = JSON.parse(savedData) as GameState;
        console.log('Game data loaded successfully');
        return gameState;
      }
      
      console.log('No saved game data found');
      return null;
    } catch (error) {
      console.error('Failed to load game data:', error);
      return null;
    }
  }

  static async clearGameData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.GAME_DATA);
      console.log('Game data cleared');
    } catch (error) {
      console.error('Failed to clear game data:', error);
      throw error;
    }
  }

  static async saveSettings(settings: any): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(settings)
      );
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }

  static async loadSettings(): Promise<any> {
    try {
      const savedSettings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
      
      return null;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return null;
    }
  }

  static async saveAnalytics(analytics: any): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.ANALYTICS,
        JSON.stringify(analytics)
      );
    } catch (error) {
      console.error('Failed to save analytics:', error);
    }
  }

  static async loadAnalytics(): Promise<any> {
    try {
      const savedAnalytics = await AsyncStorage.getItem(STORAGE_KEYS.ANALYTICS);
      
      if (savedAnalytics) {
        return JSON.parse(savedAnalytics);
      }
      
      return {};
    } catch (error) {
      console.error('Failed to load analytics:', error);
      return {};
    }
  }

  static async getStorageSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const gameKeys = keys.filter(key => key.startsWith('@growth_it'));
      
      let totalSize = 0;
      for (const key of gameKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error('Failed to calculate storage size:', error);
      return 0;
    }
  }

  static async exportGameData(): Promise<string> {
    try {
      const gameData = await AsyncStorage.getItem(STORAGE_KEYS.GAME_DATA);
      return gameData || '';
    } catch (error) {
      console.error('Failed to export game data:', error);
      throw error;
    }
  }

  static async importGameData(gameDataString: string): Promise<void> {
    try {
      // Validate the data before importing
      const gameData = JSON.parse(gameDataString);
      
      // Basic validation - check if required properties exist
      if (!gameData.player || !gameData.upgrades) {
        throw new Error('Invalid game data format');
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.GAME_DATA, gameDataString);
      console.log('Game data imported successfully');
    } catch (error) {
      console.error('Failed to import game data:', error);
      throw error;
    }
  }
}