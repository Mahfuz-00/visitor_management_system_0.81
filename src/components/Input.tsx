import React from 'react';
import { StyleSheet, TextInput, TextInputProps, ViewStyle } from 'react-native';

interface Props extends TextInputProps {
  style?: ViewStyle;
}

export function Input({ style, ...props }: Props) {
  return (
    <TextInput
      {...props}
      style={[styles.input, style]}
      placeholderTextColor="darkgray"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#e8e8e8',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    color: 'black',
  },
});