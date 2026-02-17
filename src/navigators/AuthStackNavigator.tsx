import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../screens/LoginScreen';
import { RegistrationScreen } from '../screens/RegistrationScreen';
import { VerifyRegistrationScreen } from '../screens/VerifyRegistrationScreen';
import { MainStackNavigator } from './MainStackNavigator';
import OnboardingScreen from '../screens/OnboardingScreen';
import { EmployeeStackNavigator } from './EmployeeStackNavigator';
import { EmployeeLoginScreen } from '../screens/employee/EmployeeLoginScreen';
import { ForgetPassword } from '../screens/ForgetPassword';
import { DataContext } from '../store/GlobalState';

const AuthStack = createNativeStackNavigator();

export function AuthStackNavigator() {
  const { state } = useContext(DataContext)!;
  const { auth } = state;

  if (!auth.user) {
    return (
      <AuthStack.Navigator
        screenOptions={{ headerShown: false }}
      >
        <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Registration" component={RegistrationScreen} />
        <AuthStack.Screen name="VerifyRegistration" component={VerifyRegistrationScreen} />
        <AuthStack.Screen name="EmployeeLogin" component={EmployeeLoginScreen} />
        <AuthStack.Screen name="ForgetPassword" component={ForgetPassword} />
      </AuthStack.Navigator>
    );
  }

  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false }}
    >
      {auth.roles === 'Visitor' ? (
        <AuthStack.Screen name="MainStack" component={MainStackNavigator} />
      ) : (
        <AuthStack.Screen name="EmployeeStack" component={EmployeeStackNavigator} />
      )}
    </AuthStack.Navigator>
  );
}