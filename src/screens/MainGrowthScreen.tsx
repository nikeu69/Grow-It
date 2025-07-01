import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import {useGame} from '../contexts/GameContext';
import {GameEngine} from '../managers/GameEngine';
import {SoundManager} from '../managers/SoundManager';
import {BottomNavigationBar} from '../components/BottomNavigationBar';
import {TopStatusBar} from '../components/TopStatusBar';
import {PipsqueakCharacter} from '../components/PipsqueakCharacter';
import {GrowthParticles} from '../components/GrowthParticles';
import {MapBackground} from '../components/MapBackground';

const {width, height} = Dimensions.get('window');

export const MainGrowthScreen: React.FC = () => {
  const {gameState, tap, formatHeight, formatCurrency} = useGame();
  const [tapAnimation] = useState(new Animated.Value(1));
  const [growthAnimation] = useState(new Animated.Value(1));
  const [particles, setParticles] = useState<Array<{id: string, x: number, y: number, isCrit: boolean}>>([]);
  
  const tapAreaRef = useRef<TouchableOpacity>(null);
  const lastTapTime = useRef(0);

  // Handle tap with feedback
  const handleTap = (event: any) => {
    const now = Date.now();
    
    // Prevent spam tapping (max 10 taps per second)
    if (now - lastTapTime.current < 100) {
      return;
    }
    lastTapTime.current = now;

    // Get tap coordinates
    const {locationX, locationY} = event.nativeEvent;
    
    // Determine if critical
    const isCritical = Math.random() < GameEngine.getCriticalChance(gameState);
    
    // Play sound feedback
    GameEngine.playTapFeedback(isCritical);
    
    // Visual feedback
    animateTap();
    
    // Add particle effect
    addParticle(locationX, locationY, isCritical);
    
    // Execute tap
    tap();
  };

  const animateTap = () => {
    Animated.sequence([
      Animated.timing(tapAnimation, {
        toValue: 0.9,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(tapAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const addParticle = (x: number, y: number, isCrit: boolean) => {
    const particleId = `particle_${Date.now()}_${Math.random()}`;
    
    setParticles(prev => [...prev, {
      id: particleId,
      x,
      y,
      isCrit,
    }]);

    // Remove particle after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== particleId));
    }, 1500);
  };

  // Growth animation when height changes
  useEffect(() => {
    Animated.sequence([
      Animated.timing(growthAnimation, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(growthAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [gameState.player.height]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFE4E1" barStyle="dark-content" />
      
      {/* Top status bar with currency and height */}
      <TopStatusBar />
      
      {/* Main game area */}
      <ScrollView 
        contentContainerStyle={styles.gameArea}
        showsVerticalScrollIndicator={false}
      >
        {/* Map background */}
        <MapBackground currentHeight={gameState.player.height} />
        
        {/* Central tap area with Pipsqueak */}
        <TouchableOpacity
          ref={tapAreaRef}
          style={styles.tapArea}
          activeOpacity={0.8}
          onPress={handleTap}
        >
          <Animated.View 
            style={[
              styles.tapZone,
              {
                transform: [
                  { scale: tapAnimation },
                  { scale: growthAnimation }
                ]
              }
            ]}
          >
            <PipsqueakCharacter 
              height={gameState.player.height}
              currentSkin={gameState.player.currentSkin}
              accessories={gameState.player.accessories}
            />
            
            {/* Tap hint for new players */}
            {gameState.player.tapCount < 5 && (
              <View style={styles.tapHint}>
                <Text style={styles.tapHintText}>👆 Tap to grow!</Text>
                <Animated.View style={styles.tapIndicator} />
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
        
        {/* Growth particles */}
        <GrowthParticles particles={particles} />
        
        {/* Current height display */}
        <View style={styles.heightDisplay}>
          <Text style={styles.heightLabel}>Current Giggle-Height:</Text>
          <Text style={styles.heightValue}>
            {formatHeight(gameState.player.height)}
          </Text>
          <Text style={styles.mapTierName}>
            {GameEngine.getMapTierName(gameState.player.height)}
          </Text>
        </View>
        
        {/* Growth stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Tap Power</Text>
            <Text style={styles.statValue}>
              {formatHeight(GameEngine.getTapPower(gameState))}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Growth/sec</Text>
            <Text style={styles.statValue}>
              {formatHeight(GameEngine.getIdleGrowthRate(gameState))}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Crit Chance</Text>
            <Text style={styles.statValue}>
              {(GameEngine.getCriticalChance(gameState) * 100).toFixed(1)}%
            </Text>
          </View>
        </View>
        
        {/* Quick access upgrades */}
        <View style={styles.quickUpgrades}>
          <Text style={styles.quickUpgradesTitle}>Quick Boosts</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.quickUpgradeButton}>
              <Text style={styles.quickUpgradeText}>🚀 Tap+</Text>
              <Text style={styles.quickUpgradeCost}>10 Goo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickUpgradeButton}>
              <Text style={styles.quickUpgradeText}>⚡ Speed+</Text>
              <Text style={styles.quickUpgradeCost}>25 Goo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickUpgradeButton}>
              <Text style={styles.quickUpgradeText}>💥 Crit+</Text>
              <Text style={styles.quickUpgradeCost}>50 Goo</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
      
      {/* Bottom navigation */}
      <BottomNavigationBar />
      
      {/* Floating prestige button (when available) */}
      {gameState.prestige.available && (
        <TouchableOpacity style={styles.prestigeButton}>
          <Text style={styles.prestigeButtonText}>✨ PRESTIGE!</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4E1',
  },
  gameArea: {
    flexGrow: 1,
    paddingBottom: 80, // Space for bottom navigation
  },
  tapArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height * 0.5,
  },
  tapZone: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.8,
    height: width * 0.8,
  },
  tapHint: {
    position: 'absolute',
    top: -60,
    alignItems: 'center',
  },
  tapHintText: {
    fontSize: 18,
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tapIndicator: {
    width: 20,
    height: 20,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    opacity: 0.7,
  },
  heightDisplay: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  heightLabel: {
    fontSize: 16,
    color: '#8A4FFF',
    marginBottom: 5,
  },
  heightValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
  },
  mapTierName: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#8A4FFF',
    marginBottom: 3,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#32CD32',
  },
  quickUpgrades: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  quickUpgradesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  quickUpgradeButton: {
    backgroundColor: '#98FB98',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#32CD32',
  },
  quickUpgradeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 3,
  },
  quickUpgradeCost: {
    fontSize: 12,
    color: '#666',
  },
  prestigeButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: '#8A4FFF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  prestigeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});