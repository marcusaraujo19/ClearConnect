import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import Colors from '@/constants/Colors';

interface CurrencyInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeValue: (value: string) => void;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChangeValue,
  style,
  ...props
}) => {
  const handleChangeText = (text: string) => {
    // Remove all non-digit characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    
    // Only allow one decimal point
    const parts = cleaned.split('.');
    let formatted = parts[0];
    
    if (parts.length > 1) {
      formatted += '.' + parts[1].substring(0, 2);
    }
    
    // Format with dollar sign
    if (formatted) {
      formatted = '$' + formatted;
    }
    
    onChangeValue(formatted);
  };

  // Remove $ for display in the input
  const displayValue = value.replace(/^\$/, '');

  return (
    <TextInput
      style={[styles.input, style]}
      keyboardType="decimal-pad"
      value={displayValue}
      onChangeText={handleChangeText}
      placeholder="0.00"
      placeholderTextColor={Colors.light.textSecondary}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 16,
    color: Colors.light.text,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
  },
});