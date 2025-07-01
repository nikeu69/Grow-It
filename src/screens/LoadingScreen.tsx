import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

export const LoadingScreen: React.FC = () => {
  const [loadingProgress] = useState(new Animated.Value(0));
  const [pipsqueakBounce] = useState(new Animated.Value(1));

  useEffect(() => {
    // Animate loading progress
    Animated.timing(loadingProgress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Animate Pipsqueak bouncing
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pipsqueakBounce, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pipsqueakBounce, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    bounceAnimation.start();

    return () => {
      bounceAnimation.stop();
    };
  }, []);

  const progressWidth = loadingProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.background} />
      
      {/* Main content */}
      <View style={styles.content}>
        {/* Game title */}
        <Text style={styles.title}>Growth It!</Text>
        <Text style={styles.subtitle}>The Quest for Ultimate Squish-Height!</Text>
        
        {/* Pipsqueak character placeholder */}
        <Animated.View 
          style={[
            styles.pipsqueakContainer,
            { transform: [{ scale: pipsqueakBounce }] }
          ]}
        >
          <View style={styles.pipsqueak}>
            <View style={styles.pipsqueakBody} />
            <View style={styles.pipsqueakEye} />
            <View style={styles.pipsqueakEye2} />
            <Text style={styles.pipsqueakFace}>😊</Text>
          </View>
        </Animated.View>
        
        {/* Loading text */}
        <Text style={styles.loadingText}>Preparing for epic growth...</Text>
        
        {/* Loading bar */}
        <View style={styles.loadingBarContainer}>
          <Animated.View 
            style={[
              styles.loadingBar,
              { width: progressWidth }
            ]} 
          />
        </View>
        
        {/* Fun loading messages */}
        <Text style={styles.tipText}>
          💡 Tip: Pipsqueak is very excited to meet you!
        </Text>
      </View>
      
      {/* Version info */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>v1.0.0 • Made with 💚 for growth!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4E1', // Light pink background
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFE4E1',
    opacity: 0.8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: '#FFB6C1',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#8A4FFF',
    textAlign: 'center',
    marginBottom: 60,
    fontStyle: 'italic',
  },
  pipsqueakContainer: {
    marginBottom: 40,
  },
  pipsqueak: {
    width: 120,
    height: 120,
    backgroundColor: '#98FB98',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#32CD32',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  pipsqueakBody: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: '#98FB98',
    borderRadius: 50,
  },
  pipsqueakEye: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 6,
    top: 35,
    left: 35,
  },
  pipsqueakEye2: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 6,
    top: 35,
    right: 35,
  },
  pipsqueakFace: {
    fontSize: 24,
    position: 'absolute',
    bottom: 25,
  },
  loadingText: {
    fontSize: 20,
    color: '#FF6B6B',
    marginBottom: 20,
    fontWeight: '600',
  },
  loadingBarContainer: {
    width: width * 0.7,
    height: 8,
    backgroundColor: '#FFB6C1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 30,
  },
  loadingBar: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
  },
  tipText: {
    fontSize: 16,
    color: '#8A4FFF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});