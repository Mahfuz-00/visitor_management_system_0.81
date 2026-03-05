import React from 'react';
import { StyleSheet, TextInput, TextInputProps, ViewStyle, Platform } from 'react-native';

interface Props extends TextInputProps {
  style?: ViewStyle;
}

export function Input({ style, ...props }: Props) {
  return (
    <TextInput
      // ✅ Force single line and disable scrolling behavior
      multiline={false}
      numberOfLines={1}
      scrollEnabled={false}
      // ✅ Standardize behavior across devices
      {...props}
      placeholderTextColor="darkgray"
      style={[styles.input, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#e8e8e8',
    width: '100%',
    paddingHorizontal: 15,
    borderRadius: 8,
    color: 'black',
    // ✅ This is the key for Android to prevent text from being "draggable" inside the box
    textAlignVertical: 'center',
    // ✅ Ensure height is strictly controlled (Adjust 48 to match your UI)
    height: 48,
    ...Platform.select({
      ios: {
        paddingVertical: 0, // Removes internal iOS padding that can cause offset
      },
      android: {
        paddingVertical: 0,
      }
    })
  },
});