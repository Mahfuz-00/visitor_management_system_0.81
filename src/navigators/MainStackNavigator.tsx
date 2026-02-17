import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import { DataContext } from '../store/GlobalState';
import style from '../styles/style';

import AppointmentList from '../screens/main/AppointmentList';
import More from '../screens/main/More';
import EmployeeList from '../screens/main/EmployeeList';
import AppointmentDetails from '../screens/main/AppointmentDetails';
import EditProfile from '../screens/main/EditProfile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export function MainStackNavigator() {
  const { state, dispatch, logout } = useContext(DataContext)!;
  const { language } = state;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerRight: () => (
          <View style={style.headerRightText}>
            <TouchableOpacity
              style={{ marginRight: 20 }}
              onPress={() =>
                dispatch({ type: 'LANGUAGE', payload: language === 'en' ? 'bn' : 'en' })
              }
            >
              <Text style={{ fontSize: 18, color: 'green' }}>
                {language === 'en' ? 'bn' : 'en'}
              </Text>
            </TouchableOpacity>
            <Icon name="exit-outline" size={30} color="red" onPress={logout} />
          </View>
        ),
      }}
    >
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AppointmentDetails"
        component={AppointmentDetails}
        options={{
          headerShown: true,
          title: 'Appointment Details',
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerShown: true,
          title: 'Edit Profile',
        }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  const { state, dispatch, logout } = useContext(DataContext)!;
  const { language } = state;

  return (
    <Tab.Navigator
      tabBar={props => (
        <BottomTabBar {...props} state={{ ...props.state, routes: props.state.routes.slice(0, 3) }} />
      )}
      screenOptions={({ route }) => ({
        headerShown: false,
        headerRight: () => (
          <View style={style.headerRightText}>
            <TouchableOpacity
              style={{ marginRight: 20 }}
              onPress={() =>
                dispatch({ type: 'LANGUAGE', payload: language === 'en' ? 'bn' : 'en' })
              }
            >
              <Text style={{ fontSize: 18, color: 'green' }}>
                {language === 'en' ? 'bn' : 'en'}
              </Text>
            </TouchableOpacity>
            <Icon name="exit-outline" size={30} color="red" onPress={logout} />
          </View>
        ),
        tabBarIcon: ({ focused, color }) => {
          let iconName = 'home';

          if (route.name === 'EmployeeList') iconName = 'reader-outline';
          if (route.name === 'AppointmentList') iconName = 'calendar-outline';
          if (route.name === 'More') iconName = 'settings-outline';

          return (
            <View style={{ marginTop: 10 }}>
              <Icon name={iconName} size={30} color={color} />
            </View>
          );
        },
        tabBarStyle: { height: 60, paddingBottom: 5 },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'red',
      })}
    >
      <Tab.Screen
        name="EmployeeList"
        component={EmployeeList}
        options={{
          title: language === 'en' ? 'Make Request' : 'আবেদন করুন',
        }}
      />
      <Tab.Screen
        name="AppointmentList"
        component={AppointmentList}
        options={{
          title: language === 'en' ? 'Appointment List' : 'অ্যাপয়েন্টমেন্ট তালিকা',
        }}
      />
      <Tab.Screen
        name="More"
        component={More}
        options={{
          title: language === 'en' ? 'Settings' : 'সেটিংস',
        }}
      />
    </Tab.Navigator>
  );
}