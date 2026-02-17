import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // or your icon lib --- IGNORE ---

export default function Notify() {
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <Icon name="ios-close-circle-outline" size={50} color="red" />
          </View>
          <View style={styles.body}>
            <Text>Body here!</Text>
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '90%',
    height: 200,
    backgroundColor: 'white',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
  },
  iconContainer: {
    top: -35,
    width: 48,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: 'green',
    paddingHorizontal: 15,
    paddingVertical: 5,
    bottom: -10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  closeText: {
    color: '#FFF',
  },
});