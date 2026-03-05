import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  Keyboard,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Heading } from '../components/Heading';
import { Input } from '../components/Input';
import { FilledButton } from '../components/FilledButton';
import { Error } from '../components/Error';
import { AuthContainer } from '../components/AuthContainer';
import { DataContext } from '../store/GlobalState';
import { postData } from '../utils/fetchData';
import { ACTIONS } from '../store/Actions';
import logo from '../assets/logo.png';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#1B5E20',
  white: '#FFFFFF',
  text: '#2C3E50',
  lightText: '#7F8C8D',
  toggleBg: '#E8F5E9'
};

export function VerifyRegistrationScreen({ route, navigation }: any) {
  const [phone] = useState(route.params.phone);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const { state, dispatch } = useContext(DataContext)!;
  const { language } = state;
  const isBN = language === 'BN';

  const toggleLanguage = async () => {
    const newLang = isBN ? 'EN' : 'BN';
    dispatch({ type: ACTIONS.LANGUAGE, payload: newLang });
    await AsyncStorage.setItem('language', newLang);
  };

  // ✅ Multi-language Alert for back navigation
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      e.preventDefault();
      Alert.alert(
        isBN ? 'যাচাইকরণ বাতিল করবেন?' : 'Cancel verification?',
        isBN 
          ? 'যাচাই না করে আপনি আপনার অ্যাকাউন্টে প্রবেশ করতে পারবেন না। ফিরে যেতে চান?' 
          : 'You cannot access your account without verifying. Discard changes?',
        [
          { text: isBN ? 'থাকুন' : "Don't leave", style: 'cancel' },
          {
            text: isBN ? 'বাতিল করুন' : 'Discard',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });
    return unsubscribe;
  }, [navigation, isBN]);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setError('');
    if (!otp) return setError(isBN ? 'ওটিপি প্রয়োজন' : 'OTP is required');

    dispatch({ type: 'LOADING', payload: true });
    const res = await postData('visitor/verify/visitor', { phone, otp }, '');
    dispatch({ type: 'LOADING', payload: false });

    if (res.errorMessage) {
      ToastAndroid.show(isBN ? 'ব্যর্থ হয়েছে!' : 'Failed!', ToastAndroid.LONG);
      return;
    }
    
    if (res.errors) {
      const errorText = Object.values(res.errors).flat().join('\n');
      setError(errorText);
      return;
    }

    ToastAndroid.show(isBN ? 'যাচাই সফল' : 'Verified Successfully', ToastAndroid.SHORT);

    const user = {
      user: res.data.user,
      token: res.data.token,
    };

    await AsyncStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'AUTH', payload: user });
  };

  return (
    <AuthContainer>
      {/* Language Toggle */}
      <View style={styles.topActionRow}>
        <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
          <Text style={styles.languageText}>{isBN ? 'English' : 'বাংলা'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Image style={styles.logoImg} source={logo} />
        <Heading style={styles.title}>
          {isBN ? 'নিবন্ধন যাচাইকরণ' : 'Verify Registration'}
        </Heading>
        <Text style={styles.subtitle}>
          {isBN 
            ? `${phone} নম্বরে পাঠানো ওটিপি কোডটি লিখুন` 
            : `Enter the OTP code sent to ${phone}`}
        </Text>
      </View>

      <View style={styles.card}>
        <Input
          style={styles.input}
          placeholder={isBN ? 'ফোন নম্বর' : 'Phone No'}
          value={phone}
          editable={false}
        />

        <Input
          style={styles.input}
          placeholder={isBN ? 'ওটিপি কোড' : 'OTP Code'}
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
        />

        <Error error={error} />

        <FilledButton
          title={isBN ? 'যাচাই এবং লগইন' : 'VERIFY AND LOGIN'}
          style={styles.loginButton}
          onPress={handleSubmit}
        />
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            })
          )
        }
      >
        <Text style={styles.backText}>
          {isBN ? 'লগইন-এ ফিরে যান' : 'Back to Login'}
        </Text>
      </TouchableOpacity>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  topActionRow: { width: '100%', flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, marginTop: 10 },
  languageToggle: { backgroundColor: COLORS.toggleBg, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.primary },
  languageText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
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
  loginButton: { marginTop: 20, backgroundColor: COLORS.primary, height: 55, borderRadius: 12 },
  backButton: { marginTop: 30, padding: 10 },
  backText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 15 },
});