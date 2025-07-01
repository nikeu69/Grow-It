# 🛠️ Growth It! Development Guide

This guide will help you understand the codebase structure and continue development on **Growth It!**

## 🏗️ Architecture Overview

### State Management
The game uses React Context with useReducer for state management:

- **GameContext** (`src/contexts/GameContext.tsx`): Main game state provider
- **GameStateManager** (`src/managers/GameStateManager.ts`): Reducer and initial state
- **GameTypes** (`src/types/GameTypes.ts`): Comprehensive type definitions

### Core Systems

#### 1. Game Engine (`src/managers/GameEngine.ts`)
- **Game Loop**: Handles idle progression and real-time updates
- **Calculations**: All game math (tap power, growth rates, costs)
- **Utilities**: Formatting, map tier detection, prestige checks

#### 2. Storage Manager (`src/managers/StorageManager.ts`)
- **Persistence**: Save/load game state using AsyncStorage
- **Cloud Sync**: Hooks for cloud save integration
- **Import/Export**: Game data backup functionality

#### 3. Sound Manager (`src/managers/SoundManager.ts`)
- **Audio System**: Centralized sound effect management
- **Categories**: SFX, Music, Voice, Ambient
- **Volume Control**: Per-category volume management

## 📱 Screen Architecture

### Navigation Flow
```
LoadingScreen → MainGrowthScreen ↔ [Upgrades, Abilities, Missions, Shop, Prestige, Settings]
```

#### Main Growth Screen (`src/screens/MainGrowthScreen.tsx`)
- **Primary Interface**: Where players spend most time
- **Tap Mechanics**: Core interaction with visual feedback
- **Character Display**: Pipsqueak with animations and customization
- **Stats Display**: Real-time growth information

### Component Hierarchy
```
App
├── GameProvider (Context)
├── LoadingScreen
└── NavigationContainer
    ├── MainGrowthScreen
    │   ├── TopStatusBar
    │   ├── MapBackground
    │   ├── PipsqueakCharacter
    │   ├── GrowthParticles
    │   └── BottomNavigationBar
    ├── UpgradesScreen (placeholder)
    ├── AbilitiesScreen (placeholder)
    ├── MissionsScreen (placeholder)
    ├── ShopScreen (placeholder)
    ├── PrestigeScreen (placeholder)
    └── SettingsScreen (placeholder)
```

## 🎮 Core Game Mechanics

### 1. Growth System
```typescript
// Base calculations in GameEngine.ts
const tapPower = basePower * upgradeMultipliers * prestigeMultipliers;
const idleGrowth = baseRate * upgradeMultipliers * prestigeMultipliers * deltaTime;
```

### 2. Currency System
- **Grow-Goo**: Primary currency, earned through growth
- **Stardust Shards**: Premium currency (IAP)
- **Cosmic Dust**: Prestige currency

### 3. Progression Gates
- **Map Tiers**: Unlock at specific heights
- **Upgrades**: Cost scaling with exponential growth
- **Prestige**: Available at configurable height thresholds

## 🔧 Development Workflow

### 1. Adding New Features

#### Adding an Upgrade Category
1. Update `UpgradeState` interface in `GameTypes.ts`
2. Add category to `initialGameState` in `GameStateManager.ts`
3. Implement calculation logic in `GameEngine.ts`
4. Create UI components in upgrade screen

#### Adding New Abilities
1. Define ability interface in `GameTypes.ts`
2. Add to `initialGameState` abilities object
3. Implement cooldown and effect logic in `GameEngine.ts`
4. Create ability UI components

#### Adding New Map Tiers
1. Add tier to `MapTier` enum in `GameTypes.ts`
2. Update `checkMapTierUnlock()` in `GameEngine.ts`
3. Add background assets and styling
4. Update `MapBackground.tsx` component

### 2. Game Balance

#### Critical Values to Tune
```typescript
// In GameEngine.ts
const baseTapPower = 0.1; // cm per tap
const baseIdleRate = 0.01; // cm per second
const baseCritChance = 0.05; // 5% chance
const prestigeRequirement = 100000; // 1km for first prestige

// In GameStateManager.ts - Upgrade costs
const baseCost = 10; // Grow-Goo
const costMultiplier = 1.15; // 15% increase per level
```

### 3. Testing Strategy

#### Unit Tests
- Game calculations (GameEngine)
- State management (GameStateManager)
- Utility functions

#### Integration Tests
- Save/load functionality
- Offline progress calculation
- Prestige mechanics

#### Manual Testing
- Tap responsiveness on devices
- Battery usage during idle
- Memory usage over time

## 🎨 Asset Integration

### Expected Asset Structure
```
assets/
├── images/
│   ├── characters/     # Pipsqueak skins and accessories
│   ├── backgrounds/    # Map tier backgrounds
│   ├── ui/            # UI elements and icons
│   └── particles/     # Effect sprites
└── sounds/
    ├── sfx/           # Sound effects
    ├── music/         # Background music
    ├── voice/         # Pipsqueak vocals
    └── ambient/       # Environmental sounds
```

### Asset Loading
1. Update `SoundManager.loadSounds()` with real audio files
2. Replace placeholder visuals in components
3. Implement sprite-based character rendering
4. Add asset preloading in `LoadingScreen`

## 💰 Monetization Implementation

### In-App Purchases
1. Integrate `react-native-in-app-purchase`
2. Implement purchase validation
3. Update `ShopScreen` with real products
4. Add purchase restoration

### Ads Integration
1. Integrate ad SDK (AdMob, Unity Ads, etc.)
2. Implement rewarded video ads
3. Add ad loading and caching
4. Implement opt-in ad rewards

## 🚀 Performance Optimization

### Key Areas
1. **Animation Performance**: Use `useNativeDriver` where possible
2. **Memory Management**: Proper cleanup of intervals and listeners
3. **Bundle Size**: Code splitting and lazy loading
4. **Battery Usage**: Optimize game loop frequency

### Monitoring
- Add performance metrics tracking
- Monitor memory usage patterns
- Track battery drain during gameplay
- Measure app startup time

## 🐛 Debugging Tips

### Common Issues
1. **State Updates**: Use React DevTools to track state changes
2. **Performance**: Use Flipper for debugging animations
3. **Storage**: Clear AsyncStorage during development resets
4. **Sound**: Check audio file formats and loading

### Development Tools
```bash
# Debug tools
npm run start -- --reset-cache  # Clear Metro cache
npx react-native log-android     # View Android logs
npx react-native log-ios         # View iOS logs
```

## 📊 Analytics Implementation

### Events to Track
- Player actions (taps, upgrades, prestige)
- Session length and frequency
- Progression milestones
- Monetization events
- Error tracking

### Recommended Tools
- Firebase Analytics
- Mixpanel
- Custom event system

## 🔒 Security Considerations

### Client-Side Validation
- Validate all calculations on device
- Implement cheat detection
- Secure save file integrity

### Server Integration (Future)
- Leaderboards with server validation
- Cloud save encryption
- Purchase receipt validation

## 📈 Next Development Phases

### Phase 1: Core Completion
- [ ] Implement all upgrade categories
- [ ] Complete ability system
- [ ] Build mission system
- [ ] Create shop interface

### Phase 2: Content & Polish
- [ ] Asset integration
- [ ] Sound implementation
- [ ] Animation polish
- [ ] Game balance tuning

### Phase 3: Monetization
- [ ] IAP integration
- [ ] Ad system implementation
- [ ] Analytics tracking
- [ ] A/B testing setup

### Phase 4: Launch Preparation
- [ ] Platform-specific builds
- [ ] App store optimization
- [ ] Performance optimization
- [ ] Beta testing

---

## 💡 Pro Tips

1. **Start Small**: Implement one feature completely before moving to the next
2. **Test Early**: Use device testing from the beginning
3. **Balance Iteratively**: Adjust game economy based on play testing
4. **User Feedback**: Gather feedback early and often
5. **Performance First**: Always consider mobile performance constraints

Happy coding! Let's make Pipsqueak's growth dreams come true! 🌱✨