import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  ToastAndroid,
  Keyboard,
  Dimensions,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Heading } from '../components/Heading';
import { Input } from '../components/Input';
import { FilledButton } from '../components/FilledButton';
import { Error } from '../components/Error';
import { AuthContainer } from '../components/AuthContainer';
import { DataContext } from '../store/GlobalState';
import { postData } from '../utils/fetchData';
import logo from '../assets/logo.png';
// ✅ Import ACTIONS to fix the "Cannot find name" error
import { ACTIONS } from '../store/Actions'; 

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#1B5E20',
  white: '#FFFFFF',
  text: '#2C3E50',
  lightText: '#7F8C8D',
  toggleBg: '#E8F5E9'
};

export function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { state, dispatch } = useContext(DataContext)!;
  const { language } = state;
  const isBN = language === 'BN';

  // ✅ Language Toggle Function
  const toggleLanguage = async () => {
    const newLang = isBN ? 'EN' : 'BN';
    dispatch({ type: ACTIONS.LANGUAGE, payload: newLang });
    await AsyncStorage.setItem('language', newLang);
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setError('');

    if (!phone || !password) {
      return setError(isBN ? 'ফোন এবং পাসওয়ার্ড প্রয়োজন' : 'Phone and password required');
    }

    dispatch({ type: ACTIONS.LOADING, payload: true });
    const res = await postData('visitor/login', { phone, password });
    dispatch({ type: ACTIONS.LOADING, payload: false });

    if (res.errorMessage) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
      return;
    }
    
    if (res.errors) {
      const errorText = Object.values(res.errors).flat().join('\n');
      setError(errorText);
      return;
    }

    const user = {
      user: res.data.user,
      token: res.data.token,
      roles: res.data.roles?.[0] || 'Visitor',
    };

    await AsyncStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: ACTIONS.AUTH, payload: user });
    ToastAndroid.show(isBN ? 'স্বাগতম' : 'Welcome Back', ToastAndroid.SHORT);
  };

  return (
    <AuthContainer>
      {/* ✅ Language Switcher */}
      <View style={styles.topActionRow}>
        <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
          <Text style={styles.languageText}>{isBN ? 'English' : 'বাংলা'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image style={styles.logoImg} source={logo} />
        </View>

        <View style={styles.headerTextContainer}>
          <Heading style={styles.title}>
            {isBN ? 'ভিজিটর লগইন' : 'Visitor Login'}
          </Heading>
          <Text style={styles.subtitle}>
            {isBN ? 'আপনার ই-পাস ব্যবহার করতে লগইন করুন' : 'Enter your credentials to access your e-Pass'}
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            style={styles.input}
            placeholder={isBN ? 'ফোন নম্বর' : 'Phone Number'}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Input
            style={styles.input}
            placeholder={isBN ? 'পাসওয়ার্ড' : 'Password'}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity 
            onPress={() => navigation.navigate('ForgetPassword')}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPasswordText}>
                {isBN ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
            </Text>
          </TouchableOpacity>

          <Error error={error} />

          <FilledButton 
            title={isBN ? 'লগইন' : 'LOGIN'} 
            style={styles.loginButton} 
            onPress={handleSubmit} 
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.signupRow}>
            <Text style={styles.noAccountText}>
                {isBN ? 'অ্যাকাউন্ট নেই? ' : "Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
              <Text style={styles.signupText}>{isBN ? 'নিবন্ধন করুন' : 'Sign Up'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>{isBN ? 'অথবা' : 'OR'}</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={styles.employeeBtn}
            onPress={() => navigation.navigate('EmployeeLogin')}
          >
            <Text style={styles.employeeBtnText}>
                {isBN ? 'এমপ্লয়ী পোর্টাল লগইন' : 'Employee Portal Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  topActionRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 10,
    zIndex: 10, // Ensure it stays clickable
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
  scrollContainer: { paddingBottom: 40 },
  logoContainer: { alignItems: 'center', marginTop: 10, marginBottom: 20 },
  logoImg: { width: 100, height: 100, resizeMode: 'contain' },
  headerTextContainer: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, color: COLORS.primary, fontWeight: '800' },
  subtitle: { fontSize: 14, color: COLORS.lightText, marginTop: 5, textAlign: 'center', paddingHorizontal: 20 },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  input: { marginVertical: 10 },
  forgotPasswordContainer: { alignSelf: 'flex-end', marginVertical: 10 },
  forgotPasswordText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  loginButton: { marginTop: 20, backgroundColor: COLORS.primary, height: 55, borderRadius: 15 },
  footer: { marginTop: 30, alignItems: 'center', paddingHorizontal: 20 },
  signupRow: { flexDirection: 'row', marginBottom: 25 },
  noAccountText: { color: COLORS.text, fontSize: 15 },
  signupText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 15 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', width: '80%', marginBottom: 25 },
  line: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  dividerText: { marginHorizontal: 10, color: '#BDC3C7', fontSize: 12, fontWeight: 'bold' },
  employeeBtn: { borderWidth: 1.5, borderColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 15, width: '100%', alignItems: 'center' },
  employeeBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
});