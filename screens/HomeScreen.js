import { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, ScrollView, } from 'react-native';
import { collection, onSnapshot, addDoc, query, where, doc, updateDoc, arrayUnion, deleteDoc, getDocs, getDoc, } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/HomeScreenStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function HomeScreen() {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [selectedListId, setSelectedListId] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [loadingTheme, setLoadingTheme] = useState(true);

  const { theme, setTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const navigation = useNavigation();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const loadTheme = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const savedTheme = snap.data().theme;
          if (savedTheme) {
            setTheme(savedTheme);
          }
        }
      } catch (err) {
        console.warn('Failed to load user theme:', err.message);
      } finally {
        setLoadingTheme(false);
      }
    };
    loadTheme();
  }, [user]);

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
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const users = usersSnap.docs.map(d => {
          const data = d.data();
          return {
            uid: d.id,
            email: data.email,
            name: data.fullName || '',
          };
        });

        setAllUsers(users);
      } catch (err) {
        console.warn('Failed to load users:', err.message);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = allUsers.filter(u => u.email !== user.email)
    .filter(u => {
      const email = u.email || '';
      const name = u.name || '';
      const search = userSearch.toLowerCase();

      return email.toLowerCase().includes(search) || name.toLowerCase().includes(search);
    });

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

  const deleteList = async (listId) => {
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'lists', listId));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete list: ' + error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const openShareModal = (listId) => {
    setSelectedListId(listId);
    setShareEmail('');
    setUserSearch('');
    setShareModalVisible(true);
  };

  const shareList = async () => {
    if (!shareEmail.trim()) {
      Alert.alert('Error', 'Please select a user to share with.');
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

  if (loadingTheme) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>
        My Shopping Lists
      </Text>

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

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => openShareModal(item.id)}
                style={{ padding: 6 }}
              >
                <MaterialIcons
                  name="share"
                  size={24}
                  color={isDark ? '#ccc' : '#2196F3'}
                />
              </TouchableOpacity>

              {user.uid === item.owner && (
                <TouchableOpacity
                  onPress={() => deleteList(item.id)}
                  style={{ padding: 6 }}
                >
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, isDark && { color: '#aaa' }]}>
            No lists found. Create one!
          </Text>
        }
      />

      {/* Floating Add button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          backgroundColor: '#4CAF50',
          borderRadius: 50,
          padding: 10,
          elevation: 5,
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <MaterialIcons name="add-circle" size={50} color="white" />
      </TouchableOpacity>

      {/* Create List Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="List Name"
              value={newListName}
              onChangeText={setNewListName}
              style={styles.input}
              autoFocus
            />
            <View style={{ marginVertical: 6 }}>
              <TouchableOpacity onPress={createList}>
                <Text style={styles.modalButtonText}>Create List</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={[styles.modalButtonText, { color: 'gray' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={shareModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ marginBottom: 8 }}>Share this list with:</Text>

            <TextInput
              placeholder="Search user by email or name"
              value={userSearch}
              onChangeText={setUserSearch}
              style={styles.input}
              autoCapitalize="none"
            />

            <ScrollView style={{ maxHeight: 150, marginBottom: 8 }}>
              {filteredUsers.length === 0 && (
                <Text style={{ color: '#555', textAlign: 'center', padding: 10 }}>
                  No users found
                </Text>
              )}
              {filteredUsers.map((u) => (
                <TouchableOpacity
                  key={u.uid}
                  style={{
                    padding: 10,
                    backgroundColor: u.email === shareEmail ? '#2196F3' : 'transparent',
                    borderRadius: 6,
                    marginBottom: 4,
                  }}
                  onPress={() => setShareEmail(u.email)}
                >
                  <Text style={{ color: u.email === shareEmail ? 'white' : '#000' }}>
                    {u.name ? `${u.name} (${u.email})` : u.email}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity onPress={shareList}>
              <Text style={styles.modalButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShareModalVisible(false)}>
              <Text style={[styles.modalButtonText, { color: 'gray' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}