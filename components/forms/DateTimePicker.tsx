import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  minimumDate?: Date;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  minimumDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date and time';
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleSelect = () => {
    // In a real app, this would show the native date picker
    // For this demo, we'll just set a date 2 days from now at noon
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 2);
    newDate.setHours(12, 0, 0, 0);
    onChange(newDate);
  };

  const handleClear = () => {
    onChange(null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={handleSelect}
      >
        <View style={styles.pickerContent}>
          <Calendar size={20} color={Colors.light.primary} />
          <Text style={styles.dateText}>{formatDate(value)}</Text>
        </View>
        
        <Clock size={20} color={Colors.light.textSecondary} />
      </TouchableOpacity>
      
      {value && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
        >
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.white,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 16,
  },
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 8,
  },
  clearButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  clearText: {
    fontFamily: 'SF-Pro-Text-Medium',
    fontSize: 14,
    color: Colors.light.primary,
  },
});