import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import { DataContext } from '../store/GlobalState';
import style from '../styles/style';

import PendingRequest from '../screens/employee/main/PendingRequest';
import TodayAppointments from '../screens/employee/main/TodayAppointments';
import AllAppointments from '../screens/employee/main/AllAppointments';
import AppointmentDetails from '../screens/employee/main/AppointmentDetails';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export function EmployeeStackNavigator() {
  const { state, dispatch, logout } = useContext(DataContext)!;
  const { auth, language } = state;

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
        name="TabNavigator"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmployeeAppointmentDetails"
        component={AppointmentDetails}
        options={{
          headerShown: true,
          title: 'Appointment Details',
        }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  const { state, dispatch, logout } = useContext(DataContext)!;
  const { language, pendingAppointmentList } = state;

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

          if (route.name === 'PendingRequest') iconName = 'ios-clipboard-outline';
          if (route.name === 'TodayAppointments') iconName = 'reader-outline';
          if (route.name === 'AllAppointments') iconName = 'list-outline';

          return (
            <View style={{ marginTop: 10 }}>
              {route.name === 'PendingRequest' && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{pendingAppointmentList.length}</Text>
                </View>
              )}
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
        name="PendingRequest"
        component={PendingRequest}
        options={{
          title: language === 'en' ? 'Pending Request' : 'পেন্ডিং অ্যাপয়েন্টমেন্ট',
        }}
      />
      <Tab.Screen
        name="TodayAppointments"
        component={TodayAppointments}
        options={{
          title: language === 'en' ? 'Today Appointments' : 'আজকের অ্যাপয়েন্টমেন্ট',
        }}
      />
      <Tab.Screen
        name="AllAppointments"
        component={AllAppointments}
        options={{
          title: language === 'en' ? 'All Appointments' : 'সব অ্যাপয়েন্টমেন্ট',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#FFF', fontSize: 12 },
});