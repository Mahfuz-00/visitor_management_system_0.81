import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  Text,
  ToastAndroid,
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
import style from '../styles/style';

export function ForgetPassword({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isSentOtp, setIsSentOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const { dispatch } = useContext(DataContext)!;

  const handleGetOTP = async () => {
    Keyboard.dismiss();
    setError('');
    if (!phone) return setError('Phone number is required');

    dispatch({ type: 'LOADING', payload: true });
    const res = await postData('visitor/get-forgot-password-otp', { phone }, '');
    dispatch({ type: 'LOADING', payload: false });

    if (res.errorMessage) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
      return;
    }
    if (res.errors) {
      const errorText = Object.values(res.errors).flat().join('\n');
      setError(errorText);
      return;
    }

    setIsSentOtp(true);
    ToastAndroid.show('OTP sent', ToastAndroid.LONG);
  };

  const handleVerify = async () => {
    Keyboard.dismiss();
    setError('');
    if (!otp) return setError('OTP is required');

    dispatch({ type: 'LOADING', payload: true });
    const res = await postData('visitor/verify-forgot-password-otp', { phone, otp }, '');
    dispatch({ type: 'LOADING', payload: false });

    if (res.errorMessage) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
      return;
    }
    if (res.errors) {
      const errorText = Object.values(res.errors).flat().join('\n');
      setError(errorText);
      return;
    }

    ToastAndroid.show(res.message || 'Verified', ToastAndroid.LONG);
    setIsVerified(true);
  };

  const handleReset = async () => {
    Keyboard.dismiss();
    setError('');
    if (!password || !confirmPassword) return setError('Passwords are required');
    if (password !== confirmPassword) return setError('Passwords do not match');

    dispatch({ type: 'LOADING', payload: true });
    const res = await postData('visitor/reset-password', { phone, password, confirm_password: confirmPassword }, '');
    dispatch({ type: 'LOADING', payload: false });

    if (res.errorMessage) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
      return;
    }
    if (res.errors) {
      const errorText = Object.values(res.errors).flat().join('\n');
      setError(errorText);
      return;
    }

    ToastAndroid.show(res.successMessage || 'Password reset', ToastAndroid.LONG);
    navigation.goBack();
  };

  return (
    <AuthContainer>
      <View style={style.logo}>
        <Image style={style.logoImg} source={logo} />
      </View>

      <Heading style={styles.title}>FORGOT PASSWORD</Heading>

      <Input
        style={styles.input}
        placeholder="Phone No"
        value={phone}
        onChangeText={setPhone}
        editable={!isSentOtp}
      />

      {isSentOtp && !isVerified && (
        <>
          <Input
            style={styles.input}
            placeholder="OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
          />
          <FilledButton
            title="Verify"
            style={styles.loginButton}
            onPress={handleVerify}
          />
        </>
      )}

      {isVerified && (
        <>
          <Input
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Input
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <FilledButton
            title="Reset Password"
            style={styles.loginButton}
            onPress={handleReset}
          />
        </>
      )}

      {!isSentOtp && (
        <FilledButton
          title="Get OTP"
          style={styles.loginButton}
          onPress={handleGetOTP}
        />
      )}

      <Error error={error} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={style.relatedLinkText}>Back to Login</Text>
      </TouchableOpacity>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  title: { marginVertical: 10, fontWeight: 'bold' },
  input: { marginVertical: 8 },
  loginButton: { marginVertical: 10 },
});