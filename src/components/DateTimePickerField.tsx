import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DateTimePickerFieldProps {
  label: string;
  value: Date;
  mode: 'date' | 'time';
  onChange: (date: Date) => void;
  onClose: () => void; 
}

export default function DateTimePickerField({
  value,
  mode,
  onChange,
  onClose,
}: DateTimePickerFieldProps) {
  
  if (Platform.OS === 'ios') {
    return (
      /* The white box is now encapsulated here */
      <View style={styles.iosPickerContainer}>
        <View style={styles.pickerHeader}>
          <Text style={styles.pickerLabel}>{mode === 'date' ? 'Select Date' : 'Select Time'}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
        <DateTimePicker
          value={value}
          mode={mode}
          display="spinner"
          onChange={(event, selectedDate) => {
            if (selectedDate) onChange(selectedDate);
          }}
          textColor="black"
        />
      </View>
    );
  }

  // Android: No View container at all, just the headless picker
  return (
    <DateTimePicker
      value={value}
      mode={mode}
      display="default"
      onChange={(event, selectedDate) => {
        onClose(); 
        if (event.type === 'set' && selectedDate) {
          onChange(selectedDate);
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  iosPickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20, // Rounded for centered look
    paddingBottom: 10,
    width: '100%',
    overflow: 'hidden'
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  doneText: { 
    fontSize: 17, 
    color: '#007AFF', 
    fontWeight: '600' 
  },
});