// components/AddItemModal.js
import React, { useState } from 'react';
import { Modal, View, TextInput, Button, StyleSheet } from 'react-native';

const AddItemModal = ({ visible, onClose, onAddItem }) => {
  const [itemName, setItemName] = useState('');

  const handleAdd = () => {
    if (itemName.trim()) {
      onAddItem(itemName.trim());
      setItemName('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <TextInput
            placeholder="Enter item name"
            value={itemName}
            onChangeText={setItemName}
            style={styles.input}
          />
          <Button title="Add Item" onPress={handleAdd} />
          <Button title="Cancel" onPress={onClose} color="gray" />
        </View>
      </View>
    </Modal>
  );
};

export default AddItemModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
});
