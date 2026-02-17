import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { Heading } from '../components/Heading';
import { Input } from '../components/Input';
import { FilledButton } from '../components/FilledButton';
import { Error } from '../components/Error';
import { AuthContainer } from '../components/AuthContainer';
import { DataContext } from '../store/GlobalState';
import { postData } from '../utils/fetchData';
import logo from '../assets/logo.png';
import style from '../styles/style';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function VerifyRegistrationScreen({ route, navigation }: any) {
  const [phone] = useState(route.params.phone);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const { dispatch } = useContext(DataContext)!;

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e: any) => {
        e.preventDefault();
        Alert.alert(
          'Cancel verification?',
          'You cannot access your account without verifying. Discard changes?',
          [
            { text: "Don't leave", style: 'cancel' },
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }),
    [navigation]
  );

  const handleSubmit = async () => {
    setError('');
    if (!otp) return setError('OTP is required');

    dispatch({ type: 'LOADING', payload: true });
    const res = await postData('visitor/verify/visitor', { phone, otp }, '');
    dispatch({ type: 'LOADING', payload: false });

    if (res.errorMessage) {
      ToastAndroid.show('Failed!', ToastAndroid.LONG);
      return;
    }
    if (res.errors) {
      const errorText = Object.values(res.errors).flat().join('\n');
      setError(errorText);
      return;
    }

    ToastAndroid.show(res.message || 'Verified', ToastAndroid.LONG);

    const user = {
      user: res.data.user,
      token: res.data.token,
    };

    await AsyncStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'AUTH', payload: user });
  };

  return (
    <LinearGradient colors={['#000000', '#FFAA00']} style={styles.gradient}>
      <AuthContainer>
        <View style={style.logo}>
          <Image style={style.logoImg} source={logo} />
        </View>

        <Heading style={styles.title}>Verify Registration</Heading>

        <Input
          style={styles.input}
          placeholder="Phone No"
          value={phone}
          editable={false}
        />

        <Input
          style={styles.input}
          placeholder="OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
        />

        <FilledButton
          title="Verify and Login"
          style={styles.loginButton}
          onPress={handleSubmit}
        />

        <Error error={error} />

        <TouchableOpacity
          onPress={() =>
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            )
          }
        >
          <Text style={style.relatedLinkText}>Go Back!</Text>
        </TouchableOpacity>
      </AuthContainer>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  title: { marginVertical: 20, fontWeight: 'bold' },
  input: { marginVertical: 8 },
  loginButton: { marginVertical: 10 },
  gradient: { flex: 1 },
});