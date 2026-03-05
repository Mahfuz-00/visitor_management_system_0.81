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
import { ACTIONS } from '../store/Actions';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#1B5E20',
  white: '#FFFFFF',
  text: '#2C3E50',
  lightText: '#7F8C8D',
  toggleBg: '#E8F5E9'
};

export function ForgetPassword({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isSentOtp, setIsSentOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const { state, dispatch } = useContext(DataContext)!;
  const { language } = state;
  const isBN = language === 'BN';

  const toggleLanguage = async () => {
    const newLang = isBN ? 'EN' : 'BN';
    dispatch({ type: ACTIONS.LANGUAGE, payload: newLang });
    await AsyncStorage.setItem('language', newLang);
  };

  const handleGetOTP = async () => {
    Keyboard.dismiss();
    setError('');
    if (!phone) return setError(isBN ? 'ফোন নম্বর প্রয়োজন' : 'Phone number is required');

    dispatch({ type: ACTIONS.LOADING, payload: true });
    const res = await postData('visitor/get-forgot-password-otp', { phone }, '');
    dispatch({ type: ACTIONS.LOADING, payload: false });

    if (res.errorMessage) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
      return;
    }
    
    setIsSentOtp(true);
    ToastAndroid.show(isBN ? 'ওটিপি পাঠানো হয়েছে' : 'OTP sent', ToastAndroid.LONG);
  };

  const handleVerify = async () => {
    Keyboard.dismiss();
    setError('');
    if (!otp) return setError(isBN ? 'ওটিপি প্রয়োজন' : 'OTP is required');

    dispatch({ type: ACTIONS.LOADING, payload: true });
    const res = await postData('visitor/verify-forgot-password-otp', { phone, otp }, '');
    dispatch({ type: ACTIONS.LOADING, payload: false });

    if (res.errorMessage) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
      return;
    }

    setIsVerified(true);
    ToastAndroid.show(isBN ? 'যাচাই করা হয়েছে' : 'Verified', ToastAndroid.LONG);
  };

  const handleReset = async () => {
    Keyboard.dismiss();
    setError('');
    if (!password || !confirmPassword) return setError(isBN ? 'পাসওয়ার্ড প্রয়োজন' : 'Passwords are required');
    if (password !== confirmPassword) return setError(isBN ? 'পাসওয়ার্ড মেলেনি' : 'Passwords do not match');

    dispatch({ type: ACTIONS.LOADING, payload: true });
    const res = await postData('visitor/reset-password', { phone, password, confirm_password: confirmPassword }, '');
    dispatch({ type: ACTIONS.LOADING, payload: false });

    if (res.errorMessage) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
      return;
    }

    ToastAndroid.show(isBN ? 'পাসওয়ার্ড রিসেট সফল' : 'Password reset successful', ToastAndroid.LONG);
    navigation.navigate('Login');
  };

  return (
    <AuthContainer>
      <View style={styles.topActionRow}>
        <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
          <Text style={styles.languageText}>{isBN ? 'English' : 'বাংলা'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image style={styles.logoImg} source={logo} />
          <Heading style={styles.title}>
            {isBN ? 'পাসওয়ার্ড রিসেট' : 'Reset Password'}
          </Heading>
          <Text style={styles.subtitle}>
            {isVerified 
              ? (isBN ? 'নতুন পাসওয়ার্ড সেট করুন' : 'Set your new secure password')
              : isSentOtp 
                ? (isBN ? 'আপনার ফোনে পাঠানো ওটিপি দিন' : 'Enter the OTP sent to your phone')
                : (isBN ? 'আপনার নিবন্ধিত ফোন নম্বর দিন' : 'Enter your registered phone number')
            }
          </Text>
        </View>

        <View style={styles.card}>
          <Input
            style={styles.input}
            placeholder={isBN ? 'ফোন নম্বর' : 'Phone Number'}
            value={phone}
            onChangeText={setPhone}
            editable={!isSentOtp}
            keyboardType="phone-pad"
          />

          {isSentOtp && !isVerified && (
            <>
              <Input
                style={styles.input}
                placeholder={isBN ? 'ওটিপি কোড' : 'OTP Code'}
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
              />
              <FilledButton
                title={isBN ? 'যাচাই করুন' : 'VERIFY'}
                style={styles.actionButton}
                onPress={handleVerify}
              />
            </>
          )}

          {isVerified && (
            <>
              <Input
                style={styles.input}
                placeholder={isBN ? 'নতুন পাসওয়ার্ড' : 'New Password'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Input
                style={styles.input}
                placeholder={isBN ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <FilledButton
                title={isBN ? 'পাসওয়ার্ড রিসেট করুন' : 'RESET PASSWORD'}
                style={styles.actionButton}
                onPress={handleReset}
              />
            </>
          )}

          {!isSentOtp && (
            <FilledButton
              title={isBN ? 'ওটিপি পাঠান' : 'GET OTP'}
              style={styles.actionButton}
              onPress={handleGetOTP}
            />
          )}

          <Error error={error} />
        </View>

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.backButtonAction}>
            {isBN ? 'লগইন-এ ফিরে যান' : 'Back to Login'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  topActionRow: { width: '100%', flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, marginTop: 10 },
  languageToggle: { backgroundColor: COLORS.toggleBg, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.primary },
  languageText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
  scrollContainer: { paddingBottom: 40, alignItems: 'center' },
  header: { alignItems: 'center', marginTop: 10, marginBottom: 25 },
  logoImg: { width: 80, height: 80, resizeMode: 'contain', marginBottom: 15 },
  title: { fontSize: 24, color: COLORS.primary, fontWeight: '800' },
  subtitle: { fontSize: 14, color: COLORS.lightText, marginTop: 5, textAlign: 'center', paddingHorizontal: 40 },
  card: {
    backgroundColor: COLORS.white,
    width: width * 0.9,
    borderRadius: 20,
    padding: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  input: { marginVertical: 8 },
  actionButton: { marginTop: 15, backgroundColor: COLORS.primary, height: 55, borderRadius: 12 },
  backButton: { marginTop: 30, padding: 10 },
  backButtonAction: { color: COLORS.primary, fontWeight: 'bold', fontSize: 15 }
});