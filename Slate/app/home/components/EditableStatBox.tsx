import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardTypeOptions,
  StyleSheet,
  Dimensions,
} from 'react-native';
import SimpleInputModal from './Modals/SimpleInputModal';


const { width: screenWidth, } = Dimensions.get('window');

interface EditableStatBoxProps {
  label: string;
  value: string;
  title: string;
  onConfirmValue: (newValue: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
}

const EditableStatBox: React.FC<EditableStatBoxProps> = ({
  label,
  value,
  title,
  onConfirmValue,
  placeholder = '',
  keyboardType = 'default',
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleConfirm = () => {
    if (!isNaN(Number(tempValue)) && tempValue.trim() !== '') {
      onConfirmValue(tempValue);
    } else {
      console.warn(`Invalid ${label} input`);
      onConfirmValue('0'); // fallback default
    }
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.statBox} onPress={() => {
        setTempValue(value);
        setModalVisible(true);
      }}>
        <Text style={styles.statValueSmall}>{value}</Text>
        <Text style={styles.statLabelSmall}>{label}</Text>
      </TouchableOpacity>

      <SimpleInputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
        value={tempValue}
        onChangeText={setTempValue}
        title={title}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </>
  );
};

export default EditableStatBox;


const styles = StyleSheet.create({

  statBox: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statValueSmall: {
    fontSize: screenWidth * 0.055,
    color: 'white',
    fontWeight: '400',
  },
  statLabelSmall: {
    fontSize: screenWidth * 0.035,
    color: 'white',
    marginTop: 4,
  },

});