import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useGame} from '../contexts/GameContext';
import {ScreenType} from '../types/GameTypes';

// Import screens
import {MainGrowthScreen} from '../screens/MainGrowthScreen';
import {UpgradesScreen} from '../screens/UpgradesScreen';
import {AbilitiesScreen} from '../screens/AbilitiesScreen';
import {MissionsScreen} from '../screens/MissionsScreen';
import {ShopScreen} from '../screens/ShopScreen';
import {PrestigeScreen} from '../screens/PrestigeScreen';
import {SettingsScreen} from '../screens/SettingsScreen';

export const NavigationContainer: React.FC = () => {
  const {gameState} = useGame();
  const currentScreen = gameState.ui.currentScreen;

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case ScreenType.MAIN_GROWTH:
        return <MainGrowthScreen />;
      case ScreenType.UPGRADES:
        return <UpgradesScreen />;
      case ScreenType.ABILITIES:
        return <AbilitiesScreen />;
      case ScreenType.MISSIONS:
        return <MissionsScreen />;
      case ScreenType.SHOP:
        return <ShopScreen />;
      case ScreenType.PRESTIGE:
        return <PrestigeScreen />;
      case ScreenType.SETTINGS:
        return <SettingsScreen />;
      default:
        return <MainGrowthScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4E1',
  },
});