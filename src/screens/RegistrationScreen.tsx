import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  ToastAndroid,
  ScrollView,
  Dimensions,
  Keyboard,
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

export function RegistrationScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { state, dispatch } = useContext(DataContext)!;
  const { language } = state;
  const isBN = language === 'BN';

  const toggleLanguage = async () => {
    const newLang = isBN ? 'EN' : 'BN';
    dispatch({ type: ACTIONS.LANGUAGE, payload: newLang });
    await AsyncStorage.setItem('language', newLang);
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setError('');

    if (!name || !phone || !email || !password || !confirmPassword) {
      return setError(isBN ? 'সবগুলো ঘর পূরণ করুন' : 'Please fill all fields');
    }

    if (password !== confirmPassword) {
      return setError(isBN ? 'পাসওয়ার্ড মেলেনি' : 'Passwords do not match');
    }

    const formData = {
      name,
      phone,
      email,
      password,
      confirm_password: confirmPassword,
    };

    dispatch({ type: 'LOADING', payload: true });
    const res = await postData('visitor/register', formData, '');
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

    ToastAndroid.show(isBN ? 'নিবন্ধন সফল' : 'Registered successfully', ToastAndroid.LONG);
    navigation.navigate('VerifyRegistration', { phone });
  };

  return (
    <AuthContainer>
      {/* Language Toggle */}
      <View style={styles.topActionRow}>
        <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
          <Text style={styles.languageText}>{isBN ? 'English' : 'বাংলা'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image style={styles.logoImg} source={logo} />
          <Heading style={styles.title}>
            {isBN ? 'ভিজিটর নিবন্ধন' : 'Visitor Registration'}
          </Heading>
          <Text style={styles.subtitle}>
            {isBN ? 'আপনার ই-পাস অ্যাকাউন্ট তৈরি করুন' : 'Create your account for digital e-Pass'}
          </Text>
        </View>

        <View style={styles.card}>
          <Input
            style={styles.input}
            placeholder={isBN ? 'পূর্ণ নাম' : 'Full Name'}
            value={name}
            onChangeText={setName}
          />

          <Input
            style={styles.input}
            placeholder={isBN ? 'ফোন নম্বর' : 'Phone Number'}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Input
            style={styles.input}
            placeholder={isBN ? 'ইমেইল' : 'Email Address'}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            style={styles.input}
            placeholder={isBN ? 'পাসওয়ার্ড' : 'Password'}
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

          <Error error={error} />

          <FilledButton
            title={isBN ? 'নিবন্ধন করুন' : 'REGISTER'}
            style={styles.registerButton}
            onPress={handleSubmit}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isBN ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? ' : 'Already have an account? '}
          </Text>
          <TouchableOpacity onPress={() => navigation.pop()}>
            <Text style={styles.signInLink}>{isBN ? 'লগইন করুন' : 'Sign In'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  topActionRow: { width: '100%', flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, marginTop: 10 },
  languageToggle: { backgroundColor: COLORS.toggleBg, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.primary },
  languageText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
  scrollContainer: { paddingBottom: 40, alignItems: 'center' },
  header: { alignItems: 'center', marginTop: 10, marginBottom: 20 },
  logoImg: { width: 70, height: 70, resizeMode: 'contain', marginBottom: 10 },
  title: { fontSize: 24, color: COLORS.primary, fontWeight: '800' },
  subtitle: { fontSize: 14, color: COLORS.lightText, marginTop: 5, textAlign: 'center' },
  card: {
    backgroundColor: COLORS.white,
    width: width * 0.9,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  input: { marginVertical: 6 },
  registerButton: { marginTop: 15, backgroundColor: COLORS.primary, height: 55, borderRadius: 12 },
  footer: { flexDirection: 'row', marginTop: 25, paddingBottom: 20 },
  footerText: { color: COLORS.text, fontSize: 15 },
  signInLink: { color: COLORS.primary, fontWeight: 'bold', fontSize: 15 }
});