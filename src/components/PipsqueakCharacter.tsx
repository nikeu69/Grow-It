import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';

interface PipsqueakCharacterProps {
  height: number;
  currentSkin: string;
  accessories: string[];
}

export const PipsqueakCharacter: React.FC<PipsqueakCharacterProps> = ({
  height,
  currentSkin,
  accessories,
}) => {
  const [idleAnimation] = useState(new Animated.Value(0));
  const [blinkAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    // Idle breathing animation
    const idleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(idleAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(idleAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    idleLoop.start();

    // Random blinking
    const blinkInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnimation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000 + Math.random() * 2000);

    return () => {
      idleLoop.stop();
      clearInterval(blinkInterval);
    };
  }, []);

  // Calculate character size based on height
  const getCharacterSize = (height: number) => {
    const baseSize = 80;
    const maxSize = 150;
    const scaleFactor = Math.log10(height + 1) * 20;
    return Math.min(baseSize + scaleFactor, maxSize);
  };

  const characterSize = getCharacterSize(height);
  
  const idleScale = idleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const getSkinStyle = (skinId: string) => {
    switch (skinId) {
      case 'tuxedo':
        return {backgroundColor: '#000', borderColor: '#FFF'};
      case 'robot':
        return {backgroundColor: '#C0C0C0', borderColor: '#808080'};
      case 'unicorn':
        return {backgroundColor: '#FFB6C1', borderColor: '#FF69B4'};
      case 'ninja':
        return {backgroundColor: '#2F4F4F', borderColor: '#000'};
      case 'astronaut':
        return {backgroundColor: '#FFF', borderColor: '#000'};
      default:
        return {backgroundColor: '#98FB98', borderColor: '#32CD32'};
    }
  };

  const skinStyle = getSkinStyle(currentSkin);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.character,
          {
            width: characterSize,
            height: characterSize,
            borderRadius: characterSize / 2,
            transform: [{scale: idleScale}],
            ...skinStyle,
          },
        ]}
      >
        {/* Main body */}
        <View style={[styles.body, skinStyle]} />

        {/* Eyes */}
        <Animated.View
          style={[
            styles.leftEye,
            {transform: [{scaleY: blinkAnimation}]},
          ]}
        />
        <Animated.View
          style={[
            styles.rightEye,
            {transform: [{scaleY: blinkAnimation}]},
          ]}
        />

        {/* Expression based on height milestones */}
        <View style={styles.expression}>
          {height < 10 && <Text style={styles.expressionText}>😊</Text>}
          {height >= 10 && height < 100 && <Text style={styles.expressionText}>😄</Text>}
          {height >= 100 && height < 1000 && <Text style={styles.expressionText}>🤩</Text>}
          {height >= 1000 && height < 10000 && <Text style={styles.expressionText}>🚀</Text>}
          {height >= 10000 && <Text style={styles.expressionText}>🌟</Text>}
        </View>

        {/* Accessories */}
        {accessories.includes('propeller_hat') && (
          <View style={styles.propellerHat}>
            <Text style={styles.accessoryIcon}>🚁</Text>
          </View>
        )}
        
        {accessories.includes('monocle') && (
          <View style={styles.monocle}>
            <Text style={styles.accessoryIcon}>🧐</Text>
          </View>
        )}
        
        {accessories.includes('jetpack') && (
          <View style={styles.jetpack}>
            <Text style={styles.accessoryIcon}>🎒</Text>
          </View>
        )}

        {/* Growth sparkles */}
        <View style={styles.sparkles}>
          <Text style={styles.sparkle}>✨</Text>
          <Text style={[styles.sparkle, styles.sparkle2]}>⭐</Text>
          <Text style={[styles.sparkle, styles.sparkle3]}>💫</Text>
        </View>
      </Animated.View>

      {/* Character name */}
      <Text style={styles.characterName}>Pipsqueak</Text>
      
      {/* Fun status text */}
      {height < 5 && (
        <Text style={styles.statusText}>Feeling tiny! 🐭</Text>
      )}
      {height >= 5 && height < 50 && (
        <Text style={styles.statusText}>Getting taller! 📏</Text>
      )}
      {height >= 50 && height < 500 && (
        <Text style={styles.statusText}>So much growth! 🌱</Text>
      )}
      {height >= 500 && (
        <Text style={styles.statusText}>GIGANTIC! 🏔️</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  character: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
  },
  body: {
    position: 'absolute',
    width: '90%',
    height: '90%',
    borderRadius: 1000,
  },
  leftEye: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#000',
    borderRadius: 4,
    top: '35%',
    left: '35%',
  },
  rightEye: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#000',
    borderRadius: 4,
    top: '35%',
    right: '35%',
  },
  expression: {
    position: 'absolute',
    bottom: '25%',
  },
  expressionText: {
    fontSize: 20,
  },
  propellerHat: {
    position: 'absolute',
    top: -15,
  },
  monocle: {
    position: 'absolute',
    top: '30%',
    right: '25%',
  },
  jetpack: {
    position: 'absolute',
    bottom: '10%',
    right: -20,
  },
  accessoryIcon: {
    fontSize: 16,
  },
  sparkles: {
    position: 'absolute',
    width: '120%',
    height: '120%',
  },
  sparkle: {
    position: 'absolute',
    fontSize: 12,
    opacity: 0.7,
  },
  sparkle2: {
    top: '10%',
    right: '10%',
  },
  sparkle3: {
    bottom: '10%',
    left: '10%',
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginTop: 10,
  },
  statusText: {
    fontSize: 12,
    color: '#8A4FFF',
    marginTop: 5,
    fontStyle: 'italic',
  },
});