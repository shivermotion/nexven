import React, { useState } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import { useColorScheme } from 'react-native';
import { MSTContext } from '../schema/mobx/MobxContext';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainAppNavigator from './MainAppNavigator';
// import MainTabs from './MainTabs'; // You can now use the context to access teamStore

const Stack = createNativeStackNavigator();

const AppStack = observer(() => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const rootStore = MSTContext();
  const teamStore = rootStore.TeamStore;

  if (!isAuthenticated) {
    if (showSignUp) {
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignUp">
            {() => (
              <SignUpScreen
                onSignUp={() => {
                  setIsAuthenticated(true);
                  setShowSignUp(false);
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Login">
            {() => <LoginScreen onLogin={() => setIsAuthenticated(true)} />}
          </Stack.Screen>
        </Stack.Navigator>
      );
    }
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login">
          {() => <LoginScreen onLogin={() => setIsAuthenticated(true)} />}
        </Stack.Screen>
        <Stack.Screen name="SignUp">
          {() => (
            <SignUpScreen
              onSignUp={() => {
                setIsAuthenticated(true);
                setShowSignUp(false);
              }}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  // Main app flow (tabs, conditionally rendered based on teamStore.userRole)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainApp" component={MainAppNavigator} />
    </Stack.Navigator>
  );
});

const AppNavigator = observer(() => {
  const colorScheme = useColorScheme();
  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppStack />
    </NavigationContainer>
  );
});

export default AppNavigator;
