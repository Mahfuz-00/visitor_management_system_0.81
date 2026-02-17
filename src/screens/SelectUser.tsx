import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import iconLogin from '../assets/iconLogin.png';
import iconRegistartion from '../assets/iconRegistartion.png';

export default function SelectUser({ navigation }: any) {
  return (
    <LinearGradient
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 0 }}
      colors={['#FFFFFF', '#ABBAAB']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Image style={styles.icon} source={iconLogin} />
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Registration')}
        >
          <Image style={styles.icon} source={iconRegistartion} />
          <Text style={styles.buttonText}>Registration</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 30,
    paddingHorizontal: 40,
    alignItems: 'center',
    width: '80%',
    borderRadius: 8,
    marginVertical: 20,
    backgroundColor: '#334455',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: { height: 100, width: 100 },
  buttonText: { fontSize: 26, color: '#FFF' },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginVertical: 10,
  },
  orLine: {
    backgroundColor: 'black',
    height: 2,
    flex: 1,
  },
  orText: {
    paddingHorizontal: 10,
    fontSize: 24,
  },
});