import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthStackNavigator } from './navigators/AuthStackNavigator';
import { DataProvider } from './store/GlobalState'; 
import { Loading } from './components/Loading';

const RootStack = createNativeStackNavigator();

export default function App() {
  return (
    <DataProvider>
      <Loading />
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
    </DataProvider>
  );
}