import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface Props {
  title: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export function FilledButton({ title, style, onPress }: Props) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.container, style, { backgroundColor: 'green' }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
});