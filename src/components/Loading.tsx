import React, { useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { DataContext } from '../store/GlobalState';

export function Loading() {
  const { state } = useContext(DataContext)!;
  const { loading } = state;

  if (!loading) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator color="black" />
          <Text style={styles.text}>Loading...</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '500',
  },
});