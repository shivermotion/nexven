import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import VendorsStack from './VendorsStack';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import TeamScreen from '../screens/TeamScreen';
import LogsScreen from '../screens/LogsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

// Global menu button component
const GlobalMenuButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={{ marginRight: 16 }} onPress={onPress}>
    <Text style={{ fontSize: 22 }}>☰</Text>
  </TouchableOpacity>
);

// Modal for global menu
const GlobalMenuModal = ({ visible, onClose, onNavigate }: any) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onNavigate('Logs');
            onClose();
          }}
        >
          <Text style={styles.menuText}>Logs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            onNavigate('Settings');
            onClose();
          }}
        >
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={onClose}>
          <Text style={styles.menuText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const MainAppNavigator = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  // Helper to navigate to logs/settings as modals
  const handleNavigate = (screen: 'Logs' | 'Settings') => {
    navigation.navigate(screen as never);
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerRight: () => <GlobalMenuButton onPress={() => setMenuVisible(true)} />,
        }}
      >
        <Tab.Screen name="Vendors" component={VendorsStack} options={{ headerShown: false }} />
        <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
        <Tab.Screen name="Teams" component={TeamScreen} />
        {/* <Tab.Screen
          name="Logs"
          component={LogsScreen}
          options={{ tabBarButton: () => null, headerShown: false }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ tabBarButton: () => null, headerShown: false }}
        /> */}
      </Tab.Navigator>
      <GlobalMenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigate={handleNavigate}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    minWidth: 200,
    alignItems: 'center',
  },
  menuItem: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 18,
    color: '#007AFF',
  },
});

export default MainAppNavigator;
