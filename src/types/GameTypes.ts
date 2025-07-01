// Core Game Types for Growth It!

export interface GameState {
  player: PlayerState;
  upgrades: UpgradeState;
  abilities: AbilityState;
  missions: MissionState;
  prestige: PrestigeState;
  shop: ShopState;
  ui: UIState;
  settings: SettingsState;
  meta: MetaState;
}

export interface PlayerState {
  height: number; // Current height in centimeters
  totalHeight: number; // All-time height accumulated
  growGoo: number; // Primary currency
  stardustShards: number; // Premium currency
  cosmicDust: number; // Prestige currency
  currentSkin: string; // Current skin ID
  accessories: string[]; // Array of equipped accessory IDs
  currentMap: MapTier;
  tapCount: number; // Total taps made
  prestigeCount: number; // Number of times prestiged
  playTime: number; // Total play time in milliseconds
  lastSaveTime: number; // Timestamp of last save
  offlineTime: number; // Time away from game
}

export interface UpgradeState {
  growForceEnhancers: UpgradeCategory;
  sproutSpeedAccelerators: UpgradeCategory;
  critBurstCatalysts: UpgradeCategory;
  staminaElixirs: UpgradeCategory;
  environmentalBoosts: UpgradeCategory;
}

export interface UpgradeCategory {
  [upgradeId: string]: {
    level: number;
    cost: number;
    baseCost: number;
    costMultiplier: number;
    baseEffect: number;
    currentEffect: number;
    maxLevel?: number;
    unlocked: boolean;
  };
}

export interface AbilityState {
  [abilityId: string]: {
    level: number;
    cooldownRemaining: number;
    baseCooldown: number;
    currentCooldown: number;
    duration: number;
    power: number;
    unlocked: boolean;
    timesUsed: number;
  };
}

export interface MissionState {
  daily: Mission[];
  weekly: Mission[];
  dailyStreakCount: number;
  weeklyStreakCount: number;
  lastDailyReset: number;
  lastWeeklyReset: number;
}

export interface Mission {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
  reward: MissionReward;
  expiresAt?: number;
}

export enum MissionType {
  TAP_COUNT = 'tap_count',
  REACH_HEIGHT = 'reach_height',
  COLLECT_GOO = 'collect_goo',
  USE_ABILITY = 'use_ability',
  PURCHASE_UPGRADE = 'purchase_upgrade',
  PRESTIGE = 'prestige',
  UNLOCK_SKIN = 'unlock_skin',
  SPEND_CURRENCY = 'spend_currency',
}

export interface MissionReward {
  growGoo?: number;
  stardustShards?: number;
  cosmicDust?: number;
  cosmicCrates?: number;
  skins?: string[];
  accessories?: string[];
}

export interface PrestigeState {
  available: boolean;
  heightRequirement: number;
  cosmicDustGain: number;
  permanentMultipliers: {
    growGooMultiplier: number;
    growthRateMultiplier: number;
    critChanceMultiplier: number;
    critPowerMultiplier: number;
    offlineProgressMultiplier: number;
  };
  ascendedAbilities: string[];
}

export interface ShopState {
  dailyDeals: ShopItem[];
  lastDailyDealReset: number;
  purchaseHistory: string[];
  noAdsUnlocked: boolean;
}

export interface ShopItem {
  id: string;
  type: ShopItemType;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice?: number;
  currency: Currency;
  contents: ShopItemContents;
  limited: boolean;
  purchased: boolean;
  expiresAt?: number;
}

export enum ShopItemType {
  CURRENCY_BUNDLE = 'currency_bundle',
  SKIN = 'skin',
  ACCESSORY = 'accessory',
  BOOST = 'boost',
  SPECIAL_OFFER = 'special_offer',
  NO_ADS = 'no_ads',
  STARTER_PACK = 'starter_pack',
}

export interface ShopItemContents {
  growGoo?: number;
  stardustShards?: number;
  cosmicDust?: number;
  skins?: string[];
  accessories?: string[];
  boosts?: TemporaryBoost[];
}

export interface TemporaryBoost {
  type: BoostType;
  multiplier: number;
  duration: number; // in milliseconds
  remainingTime?: number;
}

export enum BoostType {
  GROWTH_MULTIPLIER = 'growth_multiplier',
  GOO_MULTIPLIER = 'goo_multiplier',
  CRIT_CHANCE = 'crit_chance',
  CRIT_POWER = 'crit_power',
  OFFLINE_PROGRESS = 'offline_progress',
}

export enum Currency {
  GROW_GOO = 'grow_goo',
  STARDUST_SHARDS = 'stardust_shards',
  COSMIC_DUST = 'cosmic_dust',
  REAL_MONEY = 'real_money',
}

export interface UIState {
  currentScreen: ScreenType;
  previousScreen: ScreenType;
  showOfflineProgress: boolean;
  showLevelUp: boolean;
  showNewUnlock: boolean;
  notifications: GameNotification[];
  tutorialStep: number;
  tutorialCompleted: boolean;
}

export enum ScreenType {
  MAIN_GROWTH = 'main_growth',
  UPGRADES = 'upgrades',
  ABILITIES = 'abilities',
  MISSIONS = 'missions',
  SHOP = 'shop',
  PRESTIGE = 'prestige',
  SETTINGS = 'settings',
  SKINS = 'skins',
}

export interface GameNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: number;
  read: boolean;
  action?: NotificationAction;
}

export enum NotificationType {
  ACHIEVEMENT = 'achievement',
  MISSION_COMPLETE = 'mission_complete',
  NEW_UNLOCK = 'new_unlock',
  OFFLINE_PROGRESS = 'offline_progress',
  EVENT = 'event',
  SHOP_OFFER = 'shop_offer',
}

export interface NotificationAction {
  label: string;
  action: () => void;
}

export interface SettingsState {
  musicVolume: number; // 0-1
  sfxVolume: number; // 0-1
  language: string;
  pushNotifications: {
    idleGrowthReady: boolean;
    eventStarting: boolean;
    dailyMissionReset: boolean;
    shopOffers: boolean;
  };
  hapticFeedback: boolean;
  showFPS: boolean;
  cloudSaveEnabled: boolean;
}

export interface MetaState {
  version: string;
  firstLaunch: boolean;
  installDate: number;
  lastPlayDate: number;
  totalSessions: number;
  averageSessionLength: number;
  analytics: {
    [event: string]: number;
  };
}

export enum MapTier {
  PEBBLE_PATCH = 'pebble_patch',
  WORMS_EYE = 'worms_eye',
  ROOFTOP_ROMP = 'rooftop_romp',
  SKYSCRAPER_SUMMIT = 'skyscraper_summit',
  CLOUD_KINGDOM = 'cloud_kingdom',
  STRATOSPHERIC = 'stratospheric',
  LUNAR_LEAP = 'lunar_leap',
  GALACTIC = 'galactic',
  INTERDIMENSIONAL = 'interdimensional',
}

export interface MapTierInfo {
  id: MapTier;
  name: string;
  description: string;
  heightRequirement: number;
  backgroundAsset: string;
  musicAsset: string;
  passiveBonus?: {
    type: string;
    multiplier: number;
  };
}

export interface SkinInfo {
  id: string;
  name: string;
  description: string;
  rarity: SkinRarity;
  cost: number;
  currency: Currency;
  assetPath: string;
  passiveBonus?: {
    type: string;
    multiplier: number;
  };
  unlocked: boolean;
  unlockCondition?: UnlockCondition;
}

export enum SkinRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  COSMIC = 'cosmic',
}

export interface UnlockCondition {
  type: UnlockType;
  requirement: number | string;
  description: string;
}

export enum UnlockType {
  HEIGHT_REACHED = 'height_reached',
  TOTAL_TAPS = 'total_taps',
  PRESTIGE_COUNT = 'prestige_count',
  MISSION_COMPLETE = 'mission_complete',
  PURCHASE = 'purchase',
  EVENT = 'event',
}

export interface AccessoryInfo {
  id: string;
  name: string;
  description: string;
  slot: AccessorySlot;
  rarity: SkinRarity;
  cost: number;
  currency: Currency;
  assetPath: string;
  unlocked: boolean;
}

export enum AccessorySlot {
  HAT = 'hat',
  EYEWEAR = 'eyewear',
  BACKPACK = 'backpack',
  AURA = 'aura',
}

// Game Event Types
export interface GameEvent {
  type: GameEventType;
  payload?: any;
  timestamp?: number;
}

export enum GameEventType {
  // Player Actions
  TAP = 'tap',
  CRITICAL_TAP = 'critical_tap',
  
  // Growth Events
  HEIGHT_MILESTONE = 'height_milestone',
  MAP_TIER_UNLOCK = 'map_tier_unlock',
  
  // Currency Events
  GOO_COLLECTED = 'goo_collected',
  CURRENCY_SPENT = 'currency_spent',
  
  // Upgrade Events
  UPGRADE_PURCHASED = 'upgrade_purchased',
  ABILITY_UNLOCKED = 'ability_unlocked',
  ABILITY_USED = 'ability_used',
  
  // Mission Events
  MISSION_PROGRESS = 'mission_progress',
  MISSION_COMPLETED = 'mission_completed',
  MISSION_CLAIMED = 'mission_claimed',
  
  // Prestige Events
  PRESTIGE_AVAILABLE = 'prestige_available',
  PRESTIGE_PERFORMED = 'prestige_performed',
  
  // Shop Events
  ITEM_PURCHASED = 'item_purchased',
  AD_WATCHED = 'ad_watched',
  
  // System Events
  GAME_PAUSED = 'game_paused',
  GAME_RESUMED = 'game_resumed',
  OFFLINE_PROGRESS = 'offline_progress',
  SAVE_GAME = 'save_game',
  LOAD_GAME = 'load_game',
}

// Animation and Visual Types
export interface AnimationConfig {
  duration: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce';
  loop?: boolean;
  autoReverse?: boolean;
}

export interface ParticleEffect {
  type: ParticleType;
  count: number;
  duration: number;
  position: {x: number; y: number};
  velocity: {x: number; y: number};
  color: string;
  size: number;
}

export enum ParticleType {
  GROWTH_SPARK = 'growth_spark',
  GOO_DROP = 'goo_drop',
  CRIT_BURST = 'crit_burst',
  STAR_TWINKLE = 'star_twinkle',
  PRESTIGE_COSMIC = 'prestige_cosmic',
}

// Audio Types
export interface SoundEffect {
  id: string;
  file: string;
  volume: number;
  loop: boolean;
  category: SoundCategory;
}

export enum SoundCategory {
  SFX = 'sfx',
  MUSIC = 'music',
  VOICE = 'voice',
  AMBIENT = 'ambient',
}

// Game Balance and Configuration
export interface GameConfig {
  version: string;
  balancing: {
    baseGrowthRate: number;
    baseTapPower: number;
    criticalChance: number;
    criticalMultiplier: number;
    offlineMultiplier: number;
    prestigeHeightRequirement: number;
    maxOfflineHours: number;
  };
  mapTiers: MapTierInfo[];
  upgrades: {[category: string]: any};
  abilities: {[abilityId: string]: any};
  skins: SkinInfo[];
  accessories: AccessoryInfo[];
}

export default GameState;