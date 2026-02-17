import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';

interface Props {
  name: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export function IconButton({ name, style, onPress }: Props) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Icon name={name} color={colors.primary} size={24} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {},
});