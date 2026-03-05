import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
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

  // REUSABLE CUSTOM HEADER TO FIX EXTRA SPACE
  const CustomHeader = ({ navigation, title }: any) => (
    <View style={localStyles.customHeaderContainer}>
      {/* LEFT: BACK BUTTON */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
        <Icon name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      {/* CENTER: TITLE */}
      <Text style={localStyles.headerTitleText}>{title}</Text>

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
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />

      <Stack.Screen
        name="AppointmentDetails"
        component={AppointmentDetails}
        options={{
          headerShown: true,
          header: ({ navigation }) => (
            <CustomHeader
              navigation={navigation}
              title={language === 'EN' ? 'Appointment Details' : 'অ্যাপয়েন্টমেন্ট বিবরণ'}
            />
          ),
        }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerShown: true,
          header: ({ navigation }) => (
            <CustomHeader
              navigation={navigation}
              title={language === 'EN' ? 'Edit Profile' : 'প্রোফাইল এডিট'}
            />
          ),
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
      tabBar={(props) => (
        <BottomTabBar
          {...props}
          state={{ ...props.state, routes: props.state.routes.slice(0, 3) }}
        />
      )}
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStatusBarHeight: 0, // Works for Tabs
        headerStyle: {
          height: 60,
          backgroundColor: '#FFF',
          elevation: 2,
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
        tabBarIcon: ({ color }) => {
          let iconName = 'settings-outline';
          if (route.name === 'EmployeeList') iconName = 'reader-outline';
          else if (route.name === 'AppointmentList') iconName = 'calendar-outline';

          return <Icon name={iconName} size={30} color={color} />;
        },
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
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'red',
      })}
    >
      <Tab.Screen
        name="EmployeeList"
        component={EmployeeList}
        options={{ title: language === 'EN' ? 'Make Request' : 'আবেদন করুন' }}
      />
      <Tab.Screen
        name="AppointmentList"
        component={AppointmentList}
        options={{ title: language === 'EN' ? 'Appointment List' : 'অ্যাপয়েন্টমেন্ট তালিকা' }}
      />
      <Tab.Screen
        name="More"
        component={More}
        options={{ title: language === 'EN' ? 'Settings' : 'সেটিংস' }}
      />
    </Tab.Navigator>
  );
}

const localStyles = StyleSheet.create({
  customHeaderContainer: {
    height: 60,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 3,
    justifyContent: 'space-between',
    // Ensures no space at the very top of Android
    marginTop: 0, 
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginLeft: 10,
  },
});