import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  ToastAndroid,
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
import style from '../styles/style';

export function RegistrationScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { dispatch } = useContext(DataContext)!;

  const handleSubmit = async () => {
    setError('');

    if (!name || !phone || !email || !password || !confirmPassword) {
      return setError('Please fill all fields');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
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
      ToastAndroid.show('Failed!', ToastAndroid.LONG);
      return;
    }

    if (res.errors) {
      const errorText = Object.values(res.errors).flat().join('\n');
      setError(errorText);
      return;
    }

    ToastAndroid.show(res.message || 'Registered', ToastAndroid.LONG);

    navigation.navigate('VerifyRegistration', { phone });
  };

  return (
    <AuthContainer>
      <View style={style.logo}>
        <Image style={style.logoImg} source={logo} />
      </View>

      <Heading style={styles.title}>VISITOR'S REGISTRATION</Heading>

      <ScrollView style={{ width: '100%' }}>
        <Input
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />

        <Input
          style={styles.input}
          placeholder="Phone No"
          value={phone}
          onChangeText={setPhone}
        />

        <Input
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

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
          title="Register"
          style={styles.loginButton}
          onPress={handleSubmit}
        />

        <Error error={error} />

        <TouchableOpacity
          onPress={() => navigation.pop()}
          style={{ alignItems: 'center', marginBottom: 20 }}
        >
          <Text style={style.relatedLinkText}>Or Sign In!</Text>
        </TouchableOpacity>
      </ScrollView>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: 10, fontWeight: 'bold' },
  input: { marginVertical: 8 },
  loginButton: { marginVertical: 10 },
});