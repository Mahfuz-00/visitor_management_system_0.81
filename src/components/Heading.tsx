import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextStyle, TextProps } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface Props extends TextProps {
  children: ReactNode;
  style?: TextStyle;
}

export function Heading({ children, style, ...props }: Props) {
  const { colors } = useTheme();
  return (
    <Text {...props} style={[styles.text, { color: 'green' }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 24 },
});