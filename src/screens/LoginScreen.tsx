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

export function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { dispatch } = useContext(DataContext)!;

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setError('');

    if (!phone || !password) return setError('Phone and password required');

    dispatch({ type: 'LOADING', payload: true });
    const res = await postData('visitor/login', { phone, password }, '');
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

    ToastAndroid.show(res.message || 'Login successful', ToastAndroid.LONG);

    const user = {
      user: res.data.user,
      token: res.data.token,
      roles: res.data.roles?.[0] || '',
    };

    await AsyncStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'AUTH', payload: user });
  };

  return (
    <AuthContainer>
      <View style={style.logo}>
        <Image style={style.logoImg} source={logo} />
      </View>

      <Heading style={styles.title}>VISITOR'S LOGIN</Heading>

      <Input
        style={styles.input}
        placeholder="Phone No"
        value={phone}
        onChangeText={setPhone}
      />

      <Input
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <FilledButton title="Login" style={styles.loginButton} onPress={handleSubmit} />

      <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
        <Text style={style.relatedLinkText}>Forgot Password</Text>
      </TouchableOpacity>

      <Error error={error} />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.signupBtn}
          onPress={() => navigation.navigate('Registration')}
        >
          <Text style={styles.btnText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupBtn}
          onPress={() => navigation.navigate('EmployeeLogin')}
        >
          <Text style={styles.btnText}>Employee Login</Text>
        </TouchableOpacity>
      </View>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  title: { marginVertical: 10, fontWeight: 'bold' },
  input: { marginVertical: 8 },
  loginButton: { marginVertical: 10 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  signupBtn: {
    backgroundColor: 'green',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnText: { color: 'white', fontWeight: 'bold' },
});