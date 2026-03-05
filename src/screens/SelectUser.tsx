import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataContext } from '../store/GlobalState';
import { ACTIONS } from '../store/Actions';
import iconLogin from '../assets/iconLogin.png';
import iconRegistartion from '../assets/iconRegistartion.png';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#1B5E20',
  white: '#FFFFFF',
  text: '#2C3E50',
  lightGray: '#E0E0E0',
  toggleBg: '#E8F5E9'
};

export default function SelectUser({ navigation }: any) {
  const { state, dispatch } = useContext(DataContext)!;
  const { language } = state;
  const isBN = language === 'BN';

  const toggleLanguage = async () => {
    const newLang = isBN ? 'EN' : 'BN';
    dispatch({ type: ACTIONS.LANGUAGE, payload: newLang });
    await AsyncStorage.setItem('language', newLang);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Language Toggle Header */}
      <View style={styles.topActionRow}>
        <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
          <Text style={styles.languageText}>{isBN ? 'English' : 'বাংলা'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.headerTitle}>
          {isBN ? 'স্বাগতম' : 'Welcome'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {isBN ? 'অনুগ্রহ করে একটি অপশন নির্বাচন করুন' : 'Please select an option to continue'}
        </Text>

        {/* Login Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.cardButton}
          onPress={() => navigation.navigate('Login')}
        >
          <View style={styles.iconCircle}>
            <Image style={styles.icon} source={iconLogin} />
          </View>
          <Text style={styles.buttonText}>{isBN ? 'লগইন' : 'Login'}</Text>
        </TouchableOpacity>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>{isBN ? 'অথবা' : 'OR'}</Text>
          <View style={styles.orLine} />
        </View>

        {/* Registration Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.cardButton, styles.regButton]}
          onPress={() => navigation.navigate('Registration')}
        >
          <View style={[styles.iconCircle, styles.regIconCircle]}>
            <Image style={styles.icon} source={iconRegistartion} />
          </View>
          <Text style={[styles.buttonText, styles.regButtonText]}>
            {isBN ? 'নিবন্ধন' : 'Registration'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  topActionRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  languageToggle: {
    backgroundColor: COLORS.toggleBg,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  languageText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 40,
    textAlign: 'center',
  },
  cardButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 25,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  regButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  regIconCircle: {
    backgroundColor: COLORS.toggleBg,
  },
  icon: { 
    height: 35, 
    width: 35, 
    resizeMode: 'contain',
    tintColor: undefined // Keep original colors or use tintColor: '#FFF' if needed
  },
  buttonText: { 
    fontSize: 22, 
    color: COLORS.white, 
    fontWeight: '700',
    letterSpacing: 0.5 
  },
  regButtonText: {
    color: COLORS.primary,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 25,
  },
  orLine: {
    backgroundColor: COLORS.lightGray,
    height: 1,
    flex: 1,
  },
  orText: {
    paddingHorizontal: 15,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#BDC3C7',
  },
});