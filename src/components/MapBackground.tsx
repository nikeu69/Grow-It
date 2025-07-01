import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

interface MapBackgroundProps {
  currentHeight: number;
}

export const MapBackground: React.FC<MapBackgroundProps> = ({currentHeight}) => {
  const getBackgroundStyle = (height: number) => {
    if (height < 10) {
      // Pebble Patch Playground
      return {
        backgroundColor: '#90EE90', // Light green
        backgroundElements: ['🌱', '🪨', '🐛'],
      };
    } else if (height < 100) {
      // Worm's-Eye View Wonders
      return {
        backgroundColor: '#98FB98', // Pale green
        backgroundElements: ['🌿', '🍄', '🦗'],
      };
    } else if (height < 1000) {
      // Rooftop Romp
      return {
        backgroundColor: '#87CEEB', // Sky blue
        backgroundElements: ['🏠', '🚗', '🌳'],
      };
    } else if (height < 10000) {
      // Skyscraper Summit
      return {
        backgroundColor: '#87CEFA', // Light sky blue
        backgroundElements: ['🏢', '🚁', '🐦'],
      };
    } else if (height < 100000) {
      // Cloud Kingdom Capers
      return {
        backgroundColor: '#E0F6FF', // Very light blue
        backgroundElements: ['☁️', '✈️', '🌤️'],
      };
    } else if (height < 1000000) {
      // Stratospheric Shenanigans
      return {
        backgroundColor: '#4169E1', // Royal blue
        backgroundElements: ['🎈', '🛩️', '⭐'],
      };
    } else if (height < 10000000) {
      // Lunar Leap Land
      return {
        backgroundColor: '#000080', // Navy
        backgroundElements: ['🌙', '🚀', '🛸'],
      };
    } else if (height < 100000000) {
      // Galactic Gigantism
      return {
        backgroundColor: '#191970', // Midnight blue
        backgroundElements: ['🌟', '🪐', '☄️'],
      };
    } else {
      // Interdimensional Immensity
      return {
        backgroundColor: '#4B0082', // Indigo
        backgroundElements: ['🌌', '✨', '🔮'],
      };
    }
  };

  const backgroundStyle = getBackgroundStyle(currentHeight);

  return (
    <View style={[styles.container, {backgroundColor: backgroundStyle.backgroundColor}]}>
      {/* Background elements scattered around */}
      {backgroundStyle.backgroundElements.map((element, index) => (
        <View
          key={`${element}-${index}`}
          style={[
            styles.backgroundElement,
            {
              left: (index * 30 + 20) % (width - 40),
              top: (index * 50 + 30) % (height - 200),
              opacity: 0.3,
            },
          ]}
        >
          <View style={styles.elementText}>
            {/* Render emoji element */}
            <View style={styles.emojiContainer}>
              <View style={styles.emoji}>
                {/* Emoji would be rendered here */}
              </View>
            </View>
          </View>
        </View>
      ))}
      
      {/* Atmospheric effects */}
      <View style={styles.atmosphereOverlay} />
      
      {/* Height-based gradient overlay */}
      <View 
        style={[
          styles.gradientOverlay,
          {
            opacity: Math.min(currentHeight / 1000000, 0.4),
          },
        ]} 
      />
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
    zIndex: -1,
  },
  backgroundElement: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  elementText: {
    fontSize: 20,
  },
  emojiContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    width: 20,
    height: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    opacity: 0.8,
  },
  atmosphereOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(75, 0, 130, 0.3)', // Purple overlay for cosmic feel
  },
});