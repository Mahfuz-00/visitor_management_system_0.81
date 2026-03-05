import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthStackNavigator } from './navigators/AuthStackNavigator';
import { DataProvider } from './store/GlobalState';
import { Loading } from './components/Loading';

const RootStack = createNativeStackNavigator();

export default function App() {
  return (
    <DataProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer>
            <RootStack.Navigator
              screenOptions={{
                headerShown: false,
                animation: 'none',
              }}
            >
              <RootStack.Screen
                name="AuthStack"
                component={AuthStackNavigator}
              />
            </RootStack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
        <Loading />
      </SafeAreaProvider>
    </DataProvider>
  );
}