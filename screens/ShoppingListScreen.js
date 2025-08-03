import { useEffect, useState, useContext } from 'react';
import {
  View, Text, FlatList, TextInput, Button, Modal,
  TouchableOpacity, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../styles/ShoppingListScreenStyle';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../ThemeContext';

export default function ShoppingListScreen({ route, navigation }) {
  const listId = route?.params?.listId;
  const listName = route?.params?.listName || 'Shopping List';
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState('general');

  useEffect(() => {
    if (!listId) return;

    const fetchItems = async () => {
      try {
        const snapshot = await getDocs(collection(db, `lists/${listId}/items`));
        const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(itemsData);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [listId]);

  const addItem = async () => {
    if (!newItem.trim()) {
      Alert.alert('Error', 'Item name cannot be empty.');
      return;
    }
    try {
      const docRef = await addDoc(collection(db, `lists/${listId}/items`), {
        name: newItem,
        checked: false,
        category,
      });
      setItems([...items, { id: docRef.id, name: newItem, checked: false, category }]);
      setNewItem('');
      setCategory('general');
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const deleteItem = async (item) => {
    try {
      await deleteDoc(doc(db, `lists/${listId}/items/${item.id}`));
      setItems(items.filter(i => i.id !== item.id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleItem = async (item) => {
    try {
      await updateDoc(doc(db, `lists/${listId}/items/${item.id}`), {
        checked: !item.checked,
      });
      setItems(items.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i));
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  if (!listId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No list selected.</Text>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, item.checked && styles.checkedItem]}
            onPress={() => toggleItem(item)}
            onLongPress={() =>
              Alert.alert(
                'Delete Item',
                `Are you sure you want to delete "${item.name}"?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => deleteItem(item) }
                ]
              )
            }
          >
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 30,
          backgroundColor: '#2196F3',
          padding: 18,
          borderRadius: 50,
          elevation: 4,
        }}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Enter item name"
              value={newItem}
              onChangeText={setNewItem}
              style={styles.input}
            />

            <Picker
              selectedValue={category}
              onValueChange={(value) => setCategory(value)}
              style={styles.picker}
            >
              <Picker.Item label="General" value="general" />
              <Picker.Item label="Groceries" value="groceries" />
              <Picker.Item label="Electronics" value="electronics" />
              <Picker.Item label="Clothing" value="clothing" />
              <Picker.Item label="Pharmacy" value="pharmacy" />
            </Picker>

            <Button title="Add" onPress={addItem} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
