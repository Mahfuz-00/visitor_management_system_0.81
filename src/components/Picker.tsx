import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface CustomPickerProps {
  label?: string;
  selectedValue: any;
  onValueChange: (value: any) => void;
  items: any[];
  placeholder?: string;
  containerStyle?: ViewStyle;
  disabled?: boolean;
}

export const CustomPicker = ({
  label,
  selectedValue,
  onValueChange,
  items,
  placeholder,
  containerStyle,
  disabled
}: CustomPickerProps) => {

  // Helper to capitalize first letter
  const capitalize = (str: string) => {
    if (!str) return '';
    const text = str.toString();
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.pickerBorder, disabled && { opacity: 0.5 }]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          dropdownIconColor="green"
          enabled={!disabled}
          style={styles.nativePicker}
          mode='dialog'
          // Fixes the internal item styling for the dialog list
          itemStyle={{ backgroundColor: 'white', color: 'black' }}
        >
          {placeholder && (
            <Picker.Item 
              label={placeholder} 
              value="" 
              color="black" 
              style={{ backgroundColor: 'white' }} 
            />
          )}
          {items.map((item, i) => {
            const labelText = item.name || item;
            const valueKey = item.id || item.name || item;
            
            return (
              <Picker.Item
                key={i}
                label={labelText} 
                value={valueKey}
                color="black"
                style={{ backgroundColor: 'white' }}
              />
            );
          })}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 4,
    marginLeft: 2,
  },
  pickerBorder: {
    backgroundColor: 'white', 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 48, // Fixed height for the visible box
    justifyContent: 'center',
    overflow: 'hidden', // Clips the "grey" edges of the native component
  },
  nativePicker: {
    width: '100%',
    color: 'black',
    backgroundColor: 'transparent',
    ...Platform.select({
      android: {
        height: 60, // Larger than container to prevent text clipping
        marginTop: -2, // Pulls the text up to center it vertically
        marginLeft: -5, // Aligns text better with the left border
      },
    }),
  },
});