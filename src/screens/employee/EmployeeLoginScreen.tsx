import React, { useContext, useState } from 'react';
import { StyleSheet, View, Image, Keyboard, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Heading } from '../../components/Heading';
import { Input } from '../../components/Input';
import { FilledButton } from '../../components/FilledButton';
import { Error } from '../../components/Error';
import { AuthContainer } from '../../components/AuthContainer';
import { DataContext } from '../../store/GlobalState';
import { postData } from '../../utils/fetchData';
import logo from '../../assets/logo.png';
import style from '../../styles/style';

export function EmployeeLoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { dispatch } = useContext(DataContext)!;

  const handleSubmit = async (phone: string, password: string) => {
    Keyboard.dismiss();
    setError('');
    if (!phone || !password) return setError('Phone or password required');

    const formData = { emp_id: phone, password };
    dispatch({ type: 'LOADING', payload: true });

    const res = await postData('employee/login', formData, '');
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

    ToastAndroid.show(res.message, ToastAndroid.LONG);

    const user = { user: res.data.user, token: res.data.token };
    await AsyncStorage.setItem('user', JSON.stringify(user));

    dispatch({
      type: 'AUTH',
      payload: { user: user.user, token: user.token },
    });
  };

  return (
    <AuthContainer>
      <View style={style.logo}>
        <Image style={style.logoImg} source={logo} />
      </View>

      <Heading style={styles.title}>EMPLOYEE'S LOGIN</Heading>

      <Input
        style={styles.input}
        placeholder="Employee ID"
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

      <FilledButton
        title="Login"
        style={styles.loginButton}
        onPress={() => handleSubmit(phone, password)}
      />

      <Error error={error} />
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  title: { marginVertical: 10, fontWeight: 'bold' },
  input: { marginVertical: 8 },
  loginButton: { marginVertical: 10 },
});