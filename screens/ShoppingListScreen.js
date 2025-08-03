import { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, Modal, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../styles/ShoppingListScreenStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../ThemeContext';

const categories = [
  { label: 'General', value: 'general' },
  { label: 'Groceries', value: 'groceries' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Pharmacy', value: 'pharmacy' },
];

export default function ShoppingListScreen({ route, navigation }) {
  const listId = route?.params?.listId;
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
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

  const groupedItems = categories.reduce((acc, cat) => {
    const catItems = items.filter(i => i.category === cat.value);
    if (catItems.length > 0) {
      acc.push({ category: cat.label, items: catItems });
    }
    return acc;
  }, []);

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
      <ScrollView>
        {groupedItems.map(({ category, items }) => (
          <View key={category} style={{ marginBottom: 20 }}>
            <Text style={[styles.label, isDark && styles.titleDark]}>{category}:</Text>
            {items.map(item => (
              <TouchableOpacity
                key={item.id}
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
            ))}
          </View>
        ))}
      </ScrollView>

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
              autoFocus
            />

            <TouchableOpacity
              onPress={() => setCategoryDropdownVisible(!categoryDropdownVisible)}
              style={[styles.dropdownToggle, isDark && styles.dropdownToggleDark]}
            >
              <Text style={[styles.dropdownText, isDark && styles.dropdownTextDark]}>
                Category: {categories.find(c => c.value === category)?.label || 'Select'}
              </Text>
              <Ionicons name={categoryDropdownVisible ? 'chevron-up' : 'chevron-down'} size={20} color={isDark ? 'white' : 'black'} />
            </TouchableOpacity>

            {categoryDropdownVisible && (
              <View style={[styles.dropdownList, isDark && styles.dropdownListDark]}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat.value}
                    onPress={() => {
                      setCategory(cat.value);
                      setCategoryDropdownVisible(false);
                    }}
                    style={[styles.dropdownItem, cat.value === category && styles.dropdownItemSelected]}
                  >
                    <Text style={[styles.dropdownItemText, cat.value === category && styles.dropdownItemTextSelected]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Button title="Add" onPress={addItem} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}