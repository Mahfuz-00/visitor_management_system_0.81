import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';

interface CustomPickerProps {
  label: string;
  placeholder?: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: { id: string; name: string }[];
  icon?: string;         
  showChevron?: boolean;  
}

export default function CustomPicker({
  label,
  placeholder = "Select",
  selectedValue,
  onValueChange,
  items,
  icon = "",     
  showChevron = true,      
}: CustomPickerProps) {
  const [show, setShow] = useState(false);

  // For Android, we use a ref to programmatically open the picker
  const pickerRef = React.useRef<any>(null);

  const selectedLabel = items.find(item => item.id === selectedValue)?.name || placeholder;

  const handlePress = () => {
    if (Platform.OS === 'android') {
      // Trigger the Android Dialog
      pickerRef.current?.focus();
    } else {
      setShow(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.input} onPress={handlePress}>
        {icon && <Icon name={icon} size={18} color="green" style={{ marginRight: 8 }} />}
        
        <Text style={styles.valueText} numberOfLines={1}>
          {selectedLabel}
        </Text>

        {/* This shows the dropdown icon at the right */}
        {showChevron && <Icon name="chevron-down" size={18} color="#888" />}
      </TouchableOpacity>

      {/* Android Implementation - Hidden Picker that triggers Dialog */}
      {Platform.OS === 'android' && (
        <View style={{ height: 0, width: 0, opacity: 0 }}>
          <Picker
            ref={pickerRef}
            selectedValue={selectedValue}
            onValueChange={(value) => {
              onValueChange(value);
            }}
            mode="dialog" // Ensures it opens as a popup dialog
            prompt={label} // Title of the dialog
          >
            <Picker.Item label={placeholder} value="" enabled={false} />
            {items.map((item) => (
              <Picker.Item key={item.id} label={item.name} value={item.id} />
            ))}
          </Picker>
        </View>
      )}

      {/* iOS - Bottom Wheel Modal remains the same */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={show}
          transparent
          animationType="slide"
          onRequestClose={() => setShow(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>

              <Picker
                selectedValue={selectedValue}
                onValueChange={onValueChange}
                style={styles.iosPicker}
                itemStyle={styles.iosItem}
              >
                <Picker.Item label={placeholder} value="" />
                {items.map((item) => (
                  <Picker.Item key={item.id} label={item.name} value={item.id} />
                ))}
              </Picker>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45,
  },
  valueText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  cancelText: { fontSize: 17, color: '#007AFF' },
  doneText: { fontSize: 17, color: '#007AFF', fontWeight: '600' },
  iosPicker: {
    height: 220,
    backgroundColor: '#FFF',
  },
  iosItem: {
    fontSize: 18,
  },
});