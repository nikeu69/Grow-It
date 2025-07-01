import {GameState, GameEvent, GameEventType, MapTier, ScreenType} from '../types/GameTypes';

export const initialGameState: GameState = {
  player: {
    height: 1.0, // Starting at 1cm
    totalHeight: 1.0,
    growGoo: 0,
    stardustShards: 0,
    cosmicDust: 0,
    currentSkin: 'default',
    accessories: [],
    currentMap: MapTier.PEBBLE_PATCH,
    tapCount: 0,
    prestigeCount: 0,
    playTime: 0,
    lastSaveTime: Date.now(),
    offlineTime: 0,
  },
  upgrades: {
    growForceEnhancers: {},
    sproutSpeedAccelerators: {},
    critBurstCatalysts: {},
    staminaElixirs: {},
    environmentalBoosts: {},
  },
  abilities: {},
  missions: {
    daily: [],
    weekly: [],
    dailyStreakCount: 0,
    weeklyStreakCount: 0,
    lastDailyReset: Date.now(),
    lastWeeklyReset: Date.now(),
  },
  prestige: {
    available: false,
    heightRequirement: 100000, // 1 kilometer
    cosmicDustGain: 0,
    permanentMultipliers: {
      growGooMultiplier: 1.0,
      growthRateMultiplier: 1.0,
      critChanceMultiplier: 1.0,
      critPowerMultiplier: 1.0,
      offlineProgressMultiplier: 1.0,
    },
    ascendedAbilities: [],
  },
  shop: {
    dailyDeals: [],
    lastDailyDealReset: Date.now(),
    purchaseHistory: [],
    noAdsUnlocked: false,
  },
  ui: {
    currentScreen: ScreenType.MAIN_GROWTH,
    previousScreen: ScreenType.MAIN_GROWTH,
    showOfflineProgress: false,
    showLevelUp: false,
    showNewUnlock: false,
    notifications: [],
    tutorialStep: 0,
    tutorialCompleted: false,
  },
  settings: {
    musicVolume: 0.7,
    sfxVolume: 0.8,
    language: 'en',
    pushNotifications: {
      idleGrowthReady: true,
      eventStarting: true,
      dailyMissionReset: true,
      shopOffers: false,
    },
    hapticFeedback: true,
    showFPS: false,
    cloudSaveEnabled: true,
  },
  meta: {
    version: '1.0.0',
    firstLaunch: true,
    installDate: Date.now(),
    lastPlayDate: Date.now(),
    totalSessions: 1,
    averageSessionLength: 0,
    analytics: {},
  },
};

export const gameReducer = (state: GameState, action: GameEvent): GameState => {
  switch (action.type) {
    case GameEventType.TAP:
      return handleTap(state);
      
    case GameEventType.CRITICAL_TAP:
      return handleCriticalTap(state);
      
    case GameEventType.UPGRADE_PURCHASED:
      return handleUpgradePurchase(state, action.payload);
      
    case GameEventType.ABILITY_USED:
      return handleAbilityUse(state, action.payload);
      
    case GameEventType.PRESTIGE_PERFORMED:
      return handlePrestige(state);
      
    case GameEventType.OFFLINE_PROGRESS:
      return handleOfflineProgress(state, action.payload);
      
    case GameEventType.SAVE_GAME:
      return {
        ...state,
        player: {
          ...state.player,
          lastSaveTime: Date.now(),
        },
      };
      
    case GameEventType.LOAD_GAME:
      return {
        ...state,
        ...action.payload,
      };
      
    default:
      return state;
  }
};

const handleTap = (state: GameState): GameState => {
  const tapPower = calculateTapPower(state);
  const growGooGain = Math.floor(tapPower * 0.1);
  
  return {
    ...state,
    player: {
      ...state.player,
      height: state.player.height + tapPower,
      totalHeight: state.player.totalHeight + tapPower,
      growGoo: state.player.growGoo + growGooGain,
      tapCount: state.player.tapCount + 1,
    },
  };
};

const handleCriticalTap = (state: GameState): GameState => {
  const baseTapPower = calculateTapPower(state);
  const critMultiplier = 2.5; // Base critical multiplier
  const critPower = baseTapPower * critMultiplier;
  const growGooGain = Math.floor(critPower * 0.15); // More Grow-Goo from crits
  
  return {
    ...state,
    player: {
      ...state.player,
      height: state.player.height + critPower,
      totalHeight: state.player.totalHeight + critPower,
      growGoo: state.player.growGoo + growGooGain,
      tapCount: state.player.tapCount + 1,
    },
  };
};

const handleUpgradePurchase = (state: GameState, payload: any): GameState => {
  const {category, upgradeId} = payload;
  // Implementation for upgrade purchase logic
  return state; // Placeholder
};

const handleAbilityUse = (state: GameState, payload: any): GameState => {
  const {abilityId} = payload;
  // Implementation for ability use logic
  return state; // Placeholder
};

const handlePrestige = (state: GameState): GameState => {
  if (!state.prestige.available) {
    return state;
  }
  
  const cosmicDustGain = calculateCosmicDustGain(state);
  
  return {
    ...state,
    player: {
      ...state.player,
      height: 1.0, // Reset to starting height
      growGoo: 0, // Reset currency
      currentMap: MapTier.PEBBLE_PATCH, // Reset map
      prestigeCount: state.player.prestigeCount + 1,
      cosmicDust: state.player.cosmicDust + cosmicDustGain,
    },
    prestige: {
      ...state.prestige,
      available: false,
      heightRequirement: state.prestige.heightRequirement * 10, // Increase requirement
    },
    // Reset upgrades and abilities would go here
  };
};

const handleOfflineProgress = (state: GameState, payload: any): GameState => {
  const {offlineTime} = payload;
  const offlineHours = Math.min(offlineTime / (1000 * 60 * 60), 24); // Max 24 hours
  
  const idleGrowthRate = calculateIdleGrowthRate(state);
  const offlineHeight = idleGrowthRate * offlineHours;
  const offlineGrowGoo = Math.floor(offlineHeight * 0.05);
  
  return {
    ...state,
    player: {
      ...state.player,
      height: state.player.height + offlineHeight,
      totalHeight: state.player.totalHeight + offlineHeight,
      growGoo: state.player.growGoo + offlineGrowGoo,
      offlineTime: offlineTime,
    },
    ui: {
      ...state.ui,
      showOfflineProgress: true,
    },
  };
};

// Helper functions for calculations
const calculateTapPower = (state: GameState): number => {
  let basePower = 0.1; // Base tap power in cm
  
  // Apply upgrade multipliers
  // Apply prestige multipliers
  // Apply temporary boost multipliers
  
  return basePower;
};

const calculateIdleGrowthRate = (state: GameState): number => {
  let baseRate = 0.01; // Base idle growth per hour in cm
  
  // Apply upgrade multipliers
  // Apply prestige multipliers
  
  return baseRate;
};

const calculateCosmicDustGain = (state: GameState): number => {
  const heightFactor = Math.floor(state.player.height / 1000); // 1 dust per km
  return Math.max(1, heightFactor);
};

export default gameReducer;