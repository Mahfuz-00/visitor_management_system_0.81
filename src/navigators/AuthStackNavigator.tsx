import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../screens/LoginScreen';
import { RegistrationScreen } from '../screens/RegistrationScreen';
import { DataContext } from './../store/GlobalState';
import { VerifyRegistrationScreen } from './../screens/VerifyRegistrationScreen';
import { MainStackNavigator } from './MainStackNavigator';
import OnboardingScreen from './../screens/OnboardingScreen';
import { EmployeeStackNavigator } from './EmployeeStackNavigator';
import { EmployeeLoginScreen } from './../screens/employee/EmployeeLoginScreen';
import { ForgetPassword } from './../screens/ForgetPassword';
import SelectUser from '../screens/SelectUser';

const AuthStack = createNativeStackNavigator();

export function AuthStackNavigator() {
  const { state } = useContext(DataContext)!;
  const { auth, loading } = state;

  if (loading && !auth.user) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1B5E20" />
      </View>
    );
  }

  return !auth.user ? (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {/* <AuthStack.Screen name={'SelectUser'} component={SelectUser} /> */}
      <AuthStack.Screen name={'Onboarding'} component={OnboardingScreen} />
      <AuthStack.Screen name={'Login'} component={LoginScreen} />
      <AuthStack.Screen name={'Registration'} component={RegistrationScreen} />
      <AuthStack.Screen name={'VerifyRegistration'} component={VerifyRegistrationScreen} />
      <AuthStack.Screen name={'EmployeeLogin'} component={EmployeeLoginScreen} />
      <AuthStack.Screen name={'ForgetPassword'} component={ForgetPassword} />
    </AuthStack.Navigator>
  ) : (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {auth.roles === "Visitor" ? (
        <AuthStack.Screen name={'MainStack'} component={MainStackNavigator} />
      ) : (
        <AuthStack.Screen name={'EmployeeStackNavigator'} component={EmployeeStackNavigator} />
      )}
    </AuthStack.Navigator>
  );
}