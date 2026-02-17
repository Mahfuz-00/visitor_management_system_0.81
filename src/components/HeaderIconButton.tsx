import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from './IconButton';

interface Props {
  name: string;
  onPress?: () => void;
}

export function HeaderIconButton({ name, onPress }: Props) {
  return <IconButton name={name} style={styles.container} onPress={onPress} />;
}

const styles = StyleSheet.create({
  container: { marginRight: 16 },
});