import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { CurrencyInput } from '@/components/forms/CurrencyInput';
import { DateTimePicker } from '@/components/forms/DateTimePicker';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  filters: any;
  type: 'housekeeper' | 'request';
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  filters,
  type,
}) => {
  const [minRate, setMinRate] = useState(filters.minRate ? `$${filters.minRate}` : '');
  const [maxRate, setMaxRate] = useState(filters.maxRate ? `$${filters.maxRate}` : '');
  const [location, setLocation] = useState(filters.location || '');
  const [date, setDate] = useState<Date | null>(filters.date || null);

  const handleApply = () => {
    // Parse rate values
    const parsedMinRate = minRate ? parseFloat(minRate.replace(/[^0-9.]/g, '')) : 0;
    const parsedMaxRate = maxRate ? parseFloat(maxRate.replace(/[^0-9.]/g, '')) : 1000;
    
    onApply({
      minRate: parsedMinRate,
      maxRate: parsedMaxRate,
      location,
      date,
    });
  };

  const handleReset = () => {
    setMinRate('');
    setMaxRate('');
    setLocation('');
    setDate(null);
    
    onApply({
      minRate: 0,
      maxRate: 1000,
      location: '',
      date: null,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Price Range (hourly)</Text>
              
              <View style={styles.rateContainer}>
                <View style={styles.rateInput}>
                  <Text style={styles.rateLabel}>Min</Text>
                  <CurrencyInput
                    style={styles.input}
                    value={minRate}
                    onChangeValue={setMinRate}
                    placeholder="$0"
                  />
                </View>
                
                <View style={styles.rateSeparator} />
                
                <View style={styles.rateInput}>
                  <Text style={styles.rateLabel}>Max</Text>
                  <CurrencyInput
                    style={styles.input}
                    value={maxRate}
                    onChangeValue={setMaxRate}
                    placeholder="$1000"
                  />
                </View>
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Any location"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            {type === 'request' && (
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Date</Text>
                <DateTimePicker
                  value={date}
                  onChange={setDate}
                  minimumDate={new Date()}
                />
                <Text style={styles.helperText}>
                  Filter requests by specific date
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontFamily: 'SF-Pro-Text-Semibold',
    fontSize: 18,
    color: Colors.light.text,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'SF-Pro-Text-Medium',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 12,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateInput: {
    flex: 1,
  },
  rateLabel: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  rateSeparator: {
    width: 16,
  },
  input: {
    fontFamily: 'SF-Pro-Text-Regular',
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  helperText: {
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  resetButton: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    fontFamily: 'SF-Pro-Text-Medium',
    fontSize: 16,
    color: Colors.light.text,
  },
  applyButton: {
    flex: 2,
    backgroundColor: Colors.light.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontFamily: 'SF-Pro-Text-Medium',
    fontSize: 16,
    color: Colors.light.white,
  },
});

export default FilterModal;