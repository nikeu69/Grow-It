import {SoundEffect, SoundCategory} from '../types/GameTypes';

interface SoundPlayer {
  play(): void;
  stop(): void;
  setVolume(volume: number): void;
  setLoop(loop: boolean): void;
}

// Mock sound player for development - would be replaced with react-native-sound
class MockSoundPlayer implements SoundPlayer {
  private _volume: number = 1.0;
  private _loop: boolean = false;
  
  play(): void {
    console.log('🎵 Playing sound');
  }
  
  stop(): void {
    console.log('🔇 Stopping sound');
  }
  
  setVolume(volume: number): void {
    this._volume = volume;
  }
  
  setLoop(loop: boolean): void {
    this._loop = loop;
  }
}

export class SoundManager {
  private static sounds: Map<string, SoundPlayer> = new Map();
  private static masterVolume: number = 1.0;
  private static musicVolume: number = 0.7;
  private static sfxVolume: number = 0.8;
  private static muted: boolean = false;

  static async initialize(): Promise<void> {
    try {
      // Initialize sound effects
      await this.loadSounds();
      console.log('SoundManager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize SoundManager:', error);
      throw error;
    }
  }

  private static async loadSounds(): Promise<void> {
    const soundEffects: SoundEffect[] = [
      // Tap sounds
      {
        id: 'tap_1',
        file: 'sounds/sfx/tap_boing_1.wav',
        volume: 0.6,
        loop: false,
        category: SoundCategory.SFX,
      },
      {
        id: 'tap_2',
        file: 'sounds/sfx/tap_squish_1.wav',
        volume: 0.6,
        loop: false,
        category: SoundCategory.SFX,
      },
      {
        id: 'tap_3',
        file: 'sounds/sfx/tap_sproing_1.wav',
        volume: 0.6,
        loop: false,
        category: SoundCategory.SFX,
      },
      
      // Critical tap sounds
      {
        id: 'crit_tap',
        file: 'sounds/sfx/crit_whoosh.wav',
        volume: 0.8,
        loop: false,
        category: SoundCategory.SFX,
      },
      
      // Growth sounds
      {
        id: 'growth_stretch',
        file: 'sounds/sfx/growth_stretch.wav',
        volume: 0.5,
        loop: false,
        category: SoundCategory.SFX,
      },
      
      // Grow-Goo collection
      {
        id: 'goo_collect',
        file: 'sounds/sfx/goo_slurp.wav',
        volume: 0.4,
        loop: false,
        category: SoundCategory.SFX,
      },
      
      // UI sounds
      {
        id: 'ui_click',
        file: 'sounds/sfx/ui_click.wav',
        volume: 0.5,
        loop: false,
        category: SoundCategory.SFX,
      },
      {
        id: 'ui_whoosh',
        file: 'sounds/sfx/ui_whoosh.wav',
        volume: 0.4,
        loop: false,
        category: SoundCategory.SFX,
      },
      
      // Upgrade/Purchase sounds
      {
        id: 'upgrade_purchase',
        file: 'sounds/sfx/upgrade_kerching.wav',
        volume: 0.7,
        loop: false,
        category: SoundCategory.SFX,
      },
      
      // Ability sounds
      {
        id: 'ability_mega_stretch',
        file: 'sounds/sfx/ability_mega_stretch.wav',
        volume: 0.8,
        loop: false,
        category: SoundCategory.SFX,
      },
      {
        id: 'ability_goo_nado',
        file: 'sounds/sfx/ability_goo_nado.wav',
        volume: 0.7,
        loop: false,
        category: SoundCategory.SFX,
      },
      
      // Prestige sounds
      {
        id: 'prestige_cosmic',
        file: 'sounds/sfx/prestige_cosmic.wav',
        volume: 0.9,
        loop: false,
        category: SoundCategory.SFX,
      },
      
      // Pipsqueak vocals
      {
        id: 'pipsqueak_happy',
        file: 'sounds/voice/pipsqueak_happy.wav',
        volume: 0.6,
        loop: false,
        category: SoundCategory.VOICE,
      },
      {
        id: 'pipsqueak_excited',
        file: 'sounds/voice/pipsqueak_excited.wav',
        volume: 0.6,
        loop: false,
        category: SoundCategory.VOICE,
      },
      
      // Background music
      {
        id: 'music_main_theme',
        file: 'sounds/music/main_theme.mp3',
        volume: 0.7,
        loop: true,
        category: SoundCategory.MUSIC,
      },
      {
        id: 'music_cosmic_theme',
        file: 'sounds/music/cosmic_theme.mp3',
        volume: 0.7,
        loop: true,
        category: SoundCategory.MUSIC,
      },
      
      // Ambient sounds
      {
        id: 'ambient_idle_hum',
        file: 'sounds/ambient/idle_hum.wav',
        volume: 0.3,
        loop: true,
        category: SoundCategory.AMBIENT,
      },
    ];

    // For development, create mock sound players
    soundEffects.forEach(sound => {
      const player = new MockSoundPlayer();
      player.setVolume(sound.volume);
      player.setLoop(sound.loop);
      this.sounds.set(sound.id, player);
    });
  }

  static playSound(soundId: string): void {
    if (this.muted) return;
    
    const sound = this.sounds.get(soundId);
    if (sound) {
      sound.play();
    } else {
      console.warn(`Sound not found: ${soundId}`);
    }
  }

  static playRandomTapSound(): void {
    const tapSounds = ['tap_1', 'tap_2', 'tap_3'];
    const randomTap = tapSounds[Math.floor(Math.random() * tapSounds.length)];
    this.playSound(randomTap);
  }

  static stopSound(soundId: string): void {
    const sound = this.sounds.get(soundId);
    if (sound) {
      sound.stop();
    }
  }

  static stopAllSounds(): void {
    this.sounds.forEach(sound => sound.stop());
  }

  static setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  static setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  static setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  private static updateAllVolumes(): void {
    // Update volumes for all loaded sounds
    // This would be implemented with the actual sound library
  }

  static setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) {
      this.stopAllSounds();
    }
  }

  static getMasterVolume(): number {
    return this.masterVolume;
  }

  static getMusicVolume(): number {
    return this.musicVolume;
  }

  static getSfxVolume(): number {
    return this.sfxVolume;
  }

  static isMuted(): boolean {
    return this.muted;
  }

  // Convenience methods for common game sounds
  static playTapSound(): void {
    this.playRandomTapSound();
  }

  static playCriticalTapSound(): void {
    this.playSound('crit_tap');
    this.playSound('pipsqueak_excited');
  }

  static playGrowthSound(): void {
    this.playSound('growth_stretch');
  }

  static playGooCollectSound(): void {
    this.playSound('goo_collect');
  }

  static playUpgradePurchaseSound(): void {
    this.playSound('upgrade_purchase');
    this.playSound('pipsqueak_happy');
  }

  static playAbilitySound(abilityId: string): void {
    const abilitySound = `ability_${abilityId}`;
    this.playSound(abilitySound);
  }

  static playPrestigeSound(): void {
    this.playSound('prestige_cosmic');
  }

  static playUIClickSound(): void {
    this.playSound('ui_click');
  }

  static playUITransitionSound(): void {
    this.playSound('ui_whoosh');
  }

  static startBackgroundMusic(): void {
    this.playSound('music_main_theme');
    this.playSound('ambient_idle_hum');
  }

  static stopBackgroundMusic(): void {
    this.stopSound('music_main_theme');
    this.stopSound('ambient_idle_hum');
  }
}