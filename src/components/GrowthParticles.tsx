import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

interface Particle {
  id: string;
  x: number;
  y: number;
  isCrit: boolean;
}

interface GrowthParticlesProps {
  particles: Particle[];
}

const ParticleComponent: React.FC<{particle: Particle}> = ({particle}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate particle movement and effects
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 1300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (Math.random() - 0.5) * 50],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: particle.x - 10,
          top: particle.y - 10,
          opacity: opacity,
          transform: [
            {translateY},
            {translateX},
            {scale},
          ],
        },
      ]}
    >
      <View style={[
        styles.particleInner,
        particle.isCrit ? styles.critParticle : styles.normalParticle,
      ]}>
        {particle.isCrit ? (
          <>
            <View style={[styles.sparkle, styles.sparkle1]} />
            <View style={[styles.sparkle, styles.sparkle2]} />
            <View style={styles.critCenter} />
          </>
        ) : (
          <View style={styles.normalCenter} />
        )}
      </View>
    </Animated.View>
  );
};

export const GrowthParticles: React.FC<GrowthParticlesProps> = ({particles}) => {
  return (
    <View style={styles.container}>
      {particles.map((particle) => (
        <ParticleComponent key={particle.id} particle={particle} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 20,
    height: 20,
  },
  particleInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  normalParticle: {
    backgroundColor: '#98FB98',
    borderWidth: 2,
    borderColor: '#32CD32',
  },
  critParticle: {
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  normalCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#32CD32',
  },
  critCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B6B',
  },
  sparkle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  sparkle1: {
    top: 2,
    right: 2,
  },
  sparkle2: {
    bottom: 2,
    left: 2,
  },
});