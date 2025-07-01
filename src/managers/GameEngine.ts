import {GameState, GameEvent, GameEventType} from '../types/GameTypes';
import {SoundManager} from './SoundManager';

export class GameEngine {
  private static dispatch: React.Dispatch<GameEvent> | null = null;
  private static gameLoopInterval: number | null = null;
  private static gameIsRunning: boolean = false;
  private static lastUpdateTime: number = 0;
  
  // Game loop settings
  private static readonly GAME_LOOP_INTERVAL = 100; // 10 FPS for idle calculations
  private static readonly SAVE_INTERVAL = 30000; // Auto-save every 30 seconds
  
  static initialize(dispatchFunction: React.Dispatch<GameEvent>): void {
    this.dispatch = dispatchFunction;
    this.lastUpdateTime = Date.now();
    console.log('GameEngine initialized');
  }

  static startGameLoop(): void {
    if (this.gameIsRunning || !this.dispatch) {
      return;
    }

    this.gameIsRunning = true;
    this.lastUpdateTime = Date.now();
    
    this.gameLoopInterval = setInterval(() => {
      this.updateGameLoop();
    }, this.GAME_LOOP_INTERVAL) as any;
    
    console.log('Game loop started');
  }

  static stopGameLoop(): void {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }
    this.gameIsRunning = false;
    console.log('Game loop stopped');
  }

  static pauseGame(): void {
    this.gameIsRunning = false;
    if (this.dispatch) {
      this.dispatch({type: GameEventType.GAME_PAUSED});
    }
  }

  static resumeGame(): void {
    this.gameIsRunning = true;
    this.lastUpdateTime = Date.now();
    if (this.dispatch) {
      this.dispatch({type: GameEventType.GAME_RESUMED});
    }
  }

  private static updateGameLoop(): void {
    if (!this.gameIsRunning || !this.dispatch) {
      return;
    }

    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastUpdateTime;
    
    // Dispatch idle growth update
    this.dispatch({
      type: GameEventType.TAP, // Using as generic update for now
      payload: {
        type: 'idle_update',
        deltaTime: deltaTime,
      },
    });
    
    this.lastUpdateTime = currentTime;
  }

  // Game calculation helpers
  static getCriticalChance(gameState: GameState): number {
    let baseCritChance = 0.05; // 5% base critical chance
    
    // Apply upgrade multipliers
    baseCritChance *= gameState.prestige.permanentMultipliers.critChanceMultiplier;
    
    // Apply temporary boosts
    // Apply ability effects
    
    return Math.min(baseCritChance, 0.95); // Cap at 95%
  }

  static getTapPower(gameState: GameState): number {
    let basePower = 0.1; // Base tap power in cm
    
    // Apply upgrade multipliers from Grow-Force Enhancers
    Object.values(gameState.upgrades.growForceEnhancers).forEach(upgrade => {
      if (upgrade.unlocked) {
        basePower *= (1 + upgrade.currentEffect);
      }
    });
    
    // Apply prestige multipliers
    basePower *= gameState.prestige.permanentMultipliers.growthRateMultiplier;
    
    return basePower;
  }

  static getIdleGrowthRate(gameState: GameState): number {
    let baseRate = 0.01; // Base idle growth per second in cm
    
    // Apply upgrade multipliers from Sprout-Speed Accelerators
    Object.values(gameState.upgrades.sproutSpeedAccelerators).forEach(upgrade => {
      if (upgrade.unlocked) {
        baseRate *= (1 + upgrade.currentEffect);
      }
    });
    
    // Apply prestige multipliers
    baseRate *= gameState.prestige.permanentMultipliers.growthRateMultiplier;
    
    return baseRate;
  }

  static getGrowGooRate(gameState: GameState): number {
    // Grow-Goo generation is typically a percentage of growth
    const heightGrowthRate = this.getIdleGrowthRate(gameState);
    return heightGrowthRate * 0.1; // 10% of height growth as Grow-Goo
  }

  static calculateOfflineProgress(gameState: GameState, offlineTimeMs: number): {
    heightGained: number;
    growGooGained: number;
  } {
    const offlineHours = Math.min(offlineTimeMs / (1000 * 60 * 60), 24); // Cap at 24 hours
    const offlineMultiplier = gameState.prestige.permanentMultipliers.offlineProgressMultiplier;
    
    const hourlyGrowthRate = this.getIdleGrowthRate(gameState) * 3600; // Convert per second to per hour
    const hourlyGrowGooRate = this.getGrowGooRate(gameState) * 3600;
    
    const heightGained = hourlyGrowthRate * offlineHours * offlineMultiplier;
    const growGooGained = Math.floor(hourlyGrowGooRate * offlineHours * offlineMultiplier);
    
    return {
      heightGained,
      growGooGained,
    };
  }

  static checkMapTierUnlock(currentHeight: number): string | null {
    const mapTierRequirements = [
      {tier: 'worms_eye', requirement: 10},
      {tier: 'rooftop_romp', requirement: 100},
      {tier: 'skyscraper_summit', requirement: 1000},
      {tier: 'cloud_kingdom', requirement: 10000},
      {tier: 'stratospheric', requirement: 100000},
      {tier: 'lunar_leap', requirement: 1000000},
      {tier: 'galactic', requirement: 10000000},
      {tier: 'interdimensional', requirement: 100000000},
    ];
    
    for (const tier of mapTierRequirements) {
      if (currentHeight >= tier.requirement) {
        return tier.tier;
      }
    }
    
    return null;
  }

  static checkPrestigeAvailability(gameState: GameState): boolean {
    return gameState.player.height >= gameState.prestige.heightRequirement;
  }

  static calculatePrestigeReward(gameState: GameState): number {
    const heightFactor = Math.floor(gameState.player.height / gameState.prestige.heightRequirement);
    return Math.max(1, heightFactor);
  }

  // Ability system helpers
  static canUseAbility(gameState: GameState, abilityId: string): boolean {
    const ability = gameState.abilities[abilityId];
    return ability && ability.unlocked && ability.cooldownRemaining <= 0;
  }

  static getAbilityCooldown(gameState: GameState, abilityId: string): number {
    const ability = gameState.abilities[abilityId];
    if (!ability) return 0;
    
    let cooldown = ability.baseCooldown;
    
    // Apply upgrade effects from Stamina Elixirs
    Object.values(gameState.upgrades.staminaElixirs).forEach(upgrade => {
      if (upgrade.unlocked) {
        cooldown *= (1 - upgrade.currentEffect);
      }
    });
    
    return Math.max(cooldown * 0.1, cooldown); // Minimum 10% of base cooldown
  }

  // Upgrade system helpers
  static calculateUpgradeCost(baseCost: number, level: number, costMultiplier: number): number {
    return Math.floor(baseCost * Math.pow(costMultiplier, level));
  }

  static canAffordUpgrade(gameState: GameState, cost: number): boolean {
    return gameState.player.growGoo >= cost;
  }

  // Mission system helpers
  static updateMissionProgress(gameState: GameState, missionType: string, amount: number): void {
    // This would update mission progress based on player actions
    // Implementation would depend on specific mission requirements
  }

  // Sound integration
  static playGameSound(soundId: string): void {
    SoundManager.playSound(soundId);
  }

  static playTapFeedback(isCritical: boolean = false): void {
    if (isCritical) {
      SoundManager.playCriticalTapSound();
    } else {
      SoundManager.playTapSound();
    }
  }

  static playGrowthFeedback(): void {
    SoundManager.playGrowthSound();
  }

  static playGooCollectionFeedback(): void {
    SoundManager.playGooCollectSound();
  }

  // Utility functions
  static formatHeight(height: number): string {
    if (height < 100) {
      return `${height.toFixed(1)} cm`;
    } else if (height < 100000) {
      return `${(height / 100).toFixed(1)} m`;
    } else if (height < 100000000) {
      return `${(height / 100000).toFixed(1)} km`;
    } else {
      return `${(height / 100000000).toFixed(1)} Mm`;
    }
  }

  static formatCurrency(amount: number): string {
    if (amount < 1000) {
      return amount.toString();
    } else if (amount < 1000000) {
      return `${(amount / 1000).toFixed(1)}K`;
    } else if (amount < 1000000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount < 1000000000000) {
      return `${(amount / 1000000000).toFixed(1)}B`;
    } else {
      return `${(amount / 1000000000000).toFixed(1)}T`;
    }
  }

  static getMapTierName(height: number): string {
    if (height < 10) return "Pebble Patch Playground";
    if (height < 100) return "Worm's-Eye View Wonders";
    if (height < 1000) return "Rooftop Romp";
    if (height < 10000) return "Skyscraper Summit";
    if (height < 100000) return "Cloud Kingdom Capers";
    if (height < 1000000) return "Stratospheric Shenanigans";
    if (height < 10000000) return "Lunar Leap Land";
    if (height < 100000000) return "Galactic Gigantism";
    return "Interdimensional Immensity";
  }

  static isRunning(): boolean {
    return this.gameIsRunning;
  }
}