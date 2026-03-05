import React, { useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { DataContext } from '../store/GlobalState';

export function Loading() {
  const { state } = useContext(DataContext)!;
  const { loading, language } = state;

  // ✅ Don't render if not loading
  if (!loading) return null;

  const isBN = language === 'BN';

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator color="#1B5E20" size="large" />
        <Text style={styles.text}>
          {isBN ? 'লোড হচ্ছে...' : 'Loading...'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,      
    elevation: 10,     
  },
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    // Modern Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  text: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: '600',
    color: '#1B5E20', 
  },
});