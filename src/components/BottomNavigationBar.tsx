import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useGame} from '../contexts/GameContext';
import {ScreenType} from '../types/GameTypes';

interface NavItem {
  id: ScreenType;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  {id: ScreenType.MAIN_GROWTH, label: 'Grow', icon: '🌱'},
  {id: ScreenType.UPGRADES, label: 'Upgrades', icon: '⬆️'},
  {id: ScreenType.ABILITIES, label: 'Abilities', icon: '✨'},
  {id: ScreenType.MISSIONS, label: 'Missions', icon: '🎯'},
  {id: ScreenType.SHOP, label: 'Shop', icon: '🛒'},
];

export const BottomNavigationBar: React.FC = () => {
  const {gameState, navigateToScreen} = useGame();
  const currentScreen = gameState.ui.currentScreen;

  const handleNavPress = (screenType: ScreenType) => {
    if (currentScreen !== screenType) {
      navigateToScreen(screenType);
    }
  };

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.navItem,
            currentScreen === item.id && styles.activeNavItem,
          ]}
          onPress={() => handleNavPress(item.id)}
        >
          <Text style={[
            styles.navIcon,
            currentScreen === item.id && styles.activeNavIcon,
          ]}>
            {item.icon}
          </Text>
          <Text style={[
            styles.navLabel,
            currentScreen === item.id && styles.activeNavLabel,
          ]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 20,
    paddingTop: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    backgroundColor: '#FFE4E1',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    opacity: 0.6,
  },
  activeNavIcon: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeNavLabel: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
});