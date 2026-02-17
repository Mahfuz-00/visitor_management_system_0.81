import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { DataContext } from '../../store/GlobalState';
import { Card } from '../../components/Card';

export default function HomeScreen() {
  const { state } = useContext(DataContext)!;
  const { auth } = state;

  return (
    <View>
      <Card style={{ marginVertical: 10, padding: 10 }}>
        <Text>Name       : {auth.user?.name || 'N/A'}</Text>
        <Text>Phone No   : {auth.user?.phone || 'N/A'}</Text>
      </Card>
    </View>
  );
}