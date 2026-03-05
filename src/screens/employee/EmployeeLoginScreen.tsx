import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Keyboard,
  ToastAndroid,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Heading } from '../../components/Heading';
import { Input } from '../../components/Input';
import { FilledButton } from '../../components/FilledButton';
import { Error } from '../../components/Error';
import { AuthContainer } from '../../components/AuthContainer';
import { DataContext } from '../../store/GlobalState';
import { postData } from '../../utils/fetchData';
import logo from '../../assets/logo.png';
import { ACTIONS } from '../../store/Actions';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#1B5E20',
  white: '#FFFFFF',
  text: '#2C3E50',
  lightText: '#7F8C8D',
  toggleBg: '#E8F5E9'
};

export function EmployeeLoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { state, dispatch } = useContext(DataContext)!;
  const { language } = state;
  const isBN = language === 'BN';

  const toggleLanguage = async () => {
    const newLang = isBN ? 'EN' : 'BN';

    // ✅ Must use ACTIONS.LANGUAGE to match your Reducer
    dispatch({ type: ACTIONS.LANGUAGE, payload: newLang });

    // Save it so it stays BN after the user closes the app
    await AsyncStorage.setItem('language', newLang);
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setError('');
    if (!phone || !password) {
      return setError(isBN ? 'আইডি এবং পাসওয়ার্ড প্রয়োজন' : 'Employee ID and password required');
    }

    dispatch({ type: 'LOADING', payload: true });
    const res = await postData('employee/login', { emp_id: phone, password });
    dispatch({ type: 'LOADING', payload: false });

    if (res.errorMessage) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
      return;
    }

    const user = {
      user: res.data.user,
      token: res.data.token,
      roles: res.data.user?.roles?.[0]?.name || 'Employee'
    };

    await AsyncStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'AUTH', payload: user });
  };

  return (
    <AuthContainer>
      {/* ✅ Language Switcher Header */}
      <View style={styles.topActionRow}>
        <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
          <Text style={styles.languageText}>{isBN ? 'English' : 'বাংলা'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image style={styles.logoImg} source={logo} />
          <Heading style={styles.title}>{isBN ? 'এমপ্লয়ী পোর্টাল' : 'Employee Portal'}</Heading>
          <Text style={styles.subtitle}>
            {isBN ? 'শুধুমাত্র অনুমোদিত কর্মীদের জন্য' : 'Authorized Personnel Access Only'}
          </Text>
        </View>

        <View style={styles.card}>
          <Input
            style={styles.input}
            placeholder={isBN ? 'এমপ্লয়ী আইডি / ফোন' : 'Employee ID / Phone'}
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
          <Error error={error} />
          <FilledButton
            title={isBN ? 'লগইন করুন' : 'LOGIN'}
            style={styles.loginButton}
            onPress={handleSubmit}
          />
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backButtonText}>{isBN ? 'এমপ্লয়ী নন? ' : 'Not an Employee? '}</Text>
          <Text style={styles.backButtonAction}>{isBN ? 'ভিজিটর লগইন' : 'Visitor Login'}</Text>
        </TouchableOpacity>
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
  scrollContainer: { paddingBottom: 40, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  logoImg: { width: 90, height: 90, resizeMode: 'contain', marginBottom: 15 },
  title: { fontSize: 26, color: COLORS.primary, fontWeight: '800' },
  subtitle: { fontSize: 14, color: COLORS.lightText, marginTop: 5 },
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
  input: { marginVertical: 10 },
  loginButton: { marginTop: 20, backgroundColor: COLORS.primary, height: 55, borderRadius: 12 },
  backButton: { flexDirection: 'row', marginTop: 30, padding: 10 },
  backButtonText: { color: COLORS.text, fontSize: 15 },
  backButtonAction: { color: COLORS.primary, fontWeight: 'bold', fontSize: 15 }
});