import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  error: string;
}

export function Error({ error }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  text: { color: 'red', fontWeight: 'bold' },
});