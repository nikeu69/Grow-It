import React, {createContext, useContext, useReducer, useEffect, ReactNode} from 'react';
import {GameState, GameEvent, GameEventType, MapTier, ScreenType} from '../types/GameTypes';
import {gameReducer, initialGameState} from '../managers/GameStateManager';
import {StorageManager} from '../managers/StorageManager';
import {GameEngine} from '../managers/GameEngine';

interface GameContextType {
  gameState: GameState;
  dispatch: React.Dispatch<GameEvent>;
  // Game Actions
  tap: () => void;
  performCriticalTap: () => void;
  purchaseUpgrade: (category: string, upgradeId: string) => void;
  useAbility: (abilityId: string) => void;
  prestige: () => void;
  purchaseShopItem: (itemId: string) => void;
  watchAd: (rewardType: string) => void;
  // Navigation
  navigateToScreen: (screen: ScreenType) => void;
  // Utility
  formatHeight: (height: number) => string;
  formatCurrency: (amount: number) => string;
  getOfflineProgress: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({children}) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  useEffect(() => {
    // Initialize game engine
    GameEngine.initialize(dispatch);
    
    // Load saved game data
    loadGameData();
    
    // Start game loop
    GameEngine.startGameLoop();
    
    // Handle app state changes
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background') {
        saveGameData();
        GameEngine.pauseGame();
      } else if (nextAppState === 'active') {
        loadGameData();
        GameEngine.resumeGame();
        getOfflineProgress();
      }
    };

    // Cleanup on unmount
    return () => {
      GameEngine.stopGameLoop();
      saveGameData();
    };
  }, []);

  const loadGameData = async () => {
    try {
      const savedData = await StorageManager.loadGameData();
      if (savedData) {
        dispatch({
          type: GameEventType.LOAD_GAME,
          payload: savedData,
        });
      }
    } catch (error) {
      console.error('Failed to load game data:', error);
    }
  };

  const saveGameData = async () => {
    try {
      await StorageManager.saveGameData(gameState);
      dispatch({type: GameEventType.SAVE_GAME});
    } catch (error) {
      console.error('Failed to save game data:', error);
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const saveInterval = setInterval(saveGameData, 30000);
    return () => clearInterval(saveInterval);
  }, [gameState]);

  const tap = () => {
    const isCritical = Math.random() < GameEngine.getCriticalChance(gameState);
    
    if (isCritical) {
      performCriticalTap();
    } else {
      dispatch({type: GameEventType.TAP});
    }
  };

  const performCriticalTap = () => {
    dispatch({type: GameEventType.CRITICAL_TAP});
  };

  const purchaseUpgrade = (category: string, upgradeId: string) => {
    dispatch({
      type: GameEventType.UPGRADE_PURCHASED,
      payload: {category, upgradeId},
    });
  };

  const useAbility = (abilityId: string) => {
    const ability = gameState.abilities[abilityId];
    if (ability && ability.cooldownRemaining <= 0) {
      dispatch({
        type: GameEventType.ABILITY_USED,
        payload: {abilityId},
      });
    }
  };

  const prestige = () => {
    if (gameState.prestige.available) {
      dispatch({type: GameEventType.PRESTIGE_PERFORMED});
    }
  };

  const purchaseShopItem = (itemId: string) => {
    dispatch({
      type: GameEventType.ITEM_PURCHASED,
      payload: {itemId},
    });
  };

  const watchAd = (rewardType: string) => {
    dispatch({
      type: GameEventType.AD_WATCHED,
      payload: {rewardType},
    });
  };

  const navigateToScreen = (screen: ScreenType) => {
    dispatch({
      type: GameEventType.TAP, // Using TAP as a generic action for now
      payload: {navigateTo: screen},
    });
  };

  const formatHeight = (height: number): string => {
    if (height < 100) {
      return `${height.toFixed(1)} cm`;
    } else if (height < 100000) {
      return `${(height / 100).toFixed(1)} m`;
    } else if (height < 100000000) {
      return `${(height / 100000).toFixed(1)} km`;
    } else {
      return `${(height / 100000000).toFixed(1)} Mm`;
    }
  };

  const formatCurrency = (amount: number): string => {
    if (amount < 1000) {
      return amount.toString();
    } else if (amount < 1000000) {
      return `${(amount / 1000).toFixed(1)}K`;
    } else if (amount < 1000000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else {
      return `${(amount / 1000000000).toFixed(1)}B`;
    }
  };

  const getOfflineProgress = () => {
    const currentTime = Date.now();
    const timeDiff = currentTime - gameState.player.lastSaveTime;
    
    if (timeDiff > 60000) { // More than 1 minute offline
      dispatch({
        type: GameEventType.OFFLINE_PROGRESS,
        payload: {offlineTime: timeDiff},
      });
    }
  };

  const contextValue: GameContextType = {
    gameState,
    dispatch,
    tap,
    performCriticalTap,
    purchaseUpgrade,
    useAbility,
    prestige,
    purchaseShopItem,
    watchAd,
    navigateToScreen,
    formatHeight,
    formatCurrency,
    getOfflineProgress,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};