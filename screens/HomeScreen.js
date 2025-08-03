import { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, Modal, TextInput, Alert, } from 'react-native';
import { collection, onSnapshot, addDoc, query, where, doc, updateDoc, arrayUnion, } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/HomeScreenStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../ThemeContext';

export default function HomeScreen() {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [selectedListId, setSelectedListId] = useState(null);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const navigation = useNavigation();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'lists'),
      where('sharedWith', 'array-contains', user.email)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setLists(results);
    });
    return () => unsubscribe();
  }, []);

  const createList = async () => {
    if (!newListName.trim()) {
      Alert.alert('Error', 'List name cannot be empty');
      return;
    }
    try {
      await addDoc(collection(db, 'lists'), {
        name: newListName,
        owner: user.uid,
        sharedWith: [user.email],
        createdAt: new Date(),
      });
      setNewListName('');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to create list: ' + error.message);
    }
  };

  const openShareModal = (listId) => {
    setSelectedListId(listId);
    setShareEmail('');
    setShareModalVisible(true);
  };

  const shareList = async () => {
    if (!shareEmail.trim()) {
      Alert.alert('Error', 'Please enter an email to share with.');
      return;
    }
    try {
      const listRef = doc(db, 'lists', selectedListId);
      await updateDoc(listRef, {
        sharedWith: arrayUnion(shareEmail.trim().toLowerCase()),
      });
      Alert.alert('Success', `List shared with ${shareEmail.trim()}`);
      setShareModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to share list: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>My Shopping Lists</Text>

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listRow}>
            <TouchableOpacity
              style={styles.listItem}
              onPress={() =>
                navigation.navigate('ShoppingList', {
                  listId: item.id,
                  listName: item.name,
                })
              }
            >
              <Text style={styles.listText}>{item.name}</Text>
            </TouchableOpacity>

            <Button
              title="Share"
              onPress={() => openShareModal(item.id)}
              color="#2196F3"
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No lists found. Create one!</Text>
        }
      />

      <View style={styles.buttonWrapper}>
        <Button title="Add List" onPress={() => setModalVisible(true)} />
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="List Name"
              value={newListName}
              onChangeText={setNewListName}
              style={styles.input}
            />
            <Button title="Create List" onPress={createList} />
            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              color="gray"
            />
          </View>
        </View>
      </Modal>

      <Modal visible={shareModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ marginBottom: 8 }}>
              Share this list with (email):
            </Text>
            <TextInput
              placeholder="user@example.com"
              value={shareEmail}
              onChangeText={setShareEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Button title="Share" onPress={shareList} />
            <Button
              title="Cancel"
              onPress={() => setShareModalVisible(false)}
              color="gray"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}