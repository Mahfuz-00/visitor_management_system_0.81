import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
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
  const { language } = state;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // This makes the header look consistent across all screens
        headerTitleAlign: 'center',
        // 🔴 RED = stack header background
        headerStyle: {
          backgroundColor: 'red',
        },
        headerRight: () => (
          <View style={style.headerRightText}>
            <TouchableOpacity
              style={{ marginRight: 20 }}
              onPress={() =>
                dispatch({
                  type: 'LANGUAGE',
                  payload: language === 'EN' ? 'BN' : 'EN',
                })
              }
            >
              <Text style={{ fontSize: 18, color: 'green', fontWeight: 'bold' }}>
                {language === 'EN' ? 'BN' : 'EN'}
              </Text>
            </TouchableOpacity>
            <Icon name="exit-outline" size={30} color="red" onPress={logout} />
          </View>
        ),
      }}
    >
      <Stack.Screen name="TabNavigator" component={TabNavigator} />

      <Stack.Screen
        name="EmployeeAppointmentDetails"
        component={AppointmentDetails}
        options={{
          headerShown: true,
          // Using a custom header function to bypass the native Android padding
          header: ({ navigation }) => (
            <View style={{
              height: 60,
              backgroundColor: '#FFF',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 15,
              elevation: 3,
              justifyContent: 'space-between',
              // Ensures it starts exactly at the top
              marginTop: 0,
            }}>
              {/* LEFT: BACK BUTTON */}
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
                <Icon name="arrow-back" size={28} color="#333" />
              </TouchableOpacity>

              {/* CENTER: TITLE */}
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1, textAlign: 'center', marginLeft: 10 }}>
                {language === 'EN' ? 'Appointment Details' : 'অ্যাপয়েন্টমেন্ট বিবরণ'}
              </Text>

              {/* RIGHT: LANGUAGE & LOGOUT */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  style={{ marginRight: 15 }}
                  onPress={() =>
                    dispatch({
                      type: 'LANGUAGE',
                      payload: language === 'EN' ? 'BN' : 'EN',
                    })
                  }
                >
                  <Text style={{ fontSize: 18, color: 'green', fontWeight: 'bold' }}>
                    {language === 'EN' ? 'BN' : 'EN'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={logout}>
                  <Icon name="exit-outline" size={28} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )
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
      tabBar={(props) => (
        <BottomTabBar
          {...props}
          state={{ ...props.state, routes: props.state.routes.slice(0, 3) }}
        />
      )}
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitleAlign: 'left',
        // FIX: Remove extra top space by setting status bar height to 0
        headerStatusBarHeight: 0,
        headerStyle: {
          height: 60,
          backgroundColor: '#FFF',
          elevation: 2,
          shadowOpacity: 0.1,
        },
        headerRight: () => (
          <View style={style.headerRightText}>
            <TouchableOpacity
              style={{ marginRight: 20 }}
              onPress={() =>
                dispatch({
                  type: 'LANGUAGE',
                  payload: language === 'EN' ? 'BN' : 'EN',
                })
              }
            >
              <Text style={{ fontSize: 18, color: 'green', fontWeight: 'bold' }}>
                {language === 'EN' ? 'BN' : 'EN'}
              </Text>
            </TouchableOpacity>
            <Icon name="exit-outline" size={30} color="red" onPress={logout} />
          </View>
        ),
        // FIX: Handling the icon and label spacing
        tabBarIcon: ({ color, focused }) => {
          let iconName: string = 'list';
          if (route.name === 'PendingRequest') iconName = 'clipboard-outline';
          else if (route.name === 'TodayAppointments') iconName = 'reader-outline';
          else if (route.name === 'AllAppointments') iconName = 'list-outline';

          return (
            <View style={styles.iconWrapper}>
              {route.name === 'PendingRequest' && pendingAppointmentList?.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{pendingAppointmentList.length}</Text>
                </View>
              )}
              <Icon name={iconName} size={26} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'red',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: 'bold',
          marginBottom: 5,
        },
        tabBarStyle: {
          height: 60,
          backgroundColor: '#FFF',
          paddingBottom: 5,
        },
      })}
    >
      <Tab.Screen
        name="PendingRequest"
        component={PendingRequest}
        options={{
          title: language === 'EN' ? 'Pending Appointments' : 'পেন্ডিং অ্যাপয়েন্টমেন্ট',
        }}
      />
      <Tab.Screen
        name="TodayAppointments"
        component={TodayAppointments}
        options={{
          title: language === 'EN' ? 'Today Appointments' : 'আজকের অ্যাপয়েন্টমেন্ট',
        }}
      />
      <Tab.Screen
        name="AllAppointments"
        component={AllAppointments}
        options={{
          title: language === 'EN' ? 'All Appointments' : 'সবগুলো অ্যাপয়েন্টমেন্ট',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'red',
    borderColor: 'white',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});