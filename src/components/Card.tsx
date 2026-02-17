import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface Props {
  style?: ViewStyle;
  children: ReactNode;
  onPress?: () => void;
}

export function Card({ style, children, onPress }: Props) {
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 0 },
    elevation: 1,
  },
});