import { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import styles from '../styles/ProfileScreenStyle';
import { ThemeContext } from '../ThemeContext';

export default function ProfileScreen() {
  const user = auth.currentUser;
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editName, setEditName] = useState(false);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setPhone(data.phone || '');
          setFullName(data.fullName || '');
        }
      } catch (err) {
        Alert.alert('Error loading profile', err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        phone,
        fullName
      }, { merge: true });
      Alert.alert('Saved', 'Profile updated!');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      Alert.alert('Logout Error');
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>My Profile</Text>
        <Text style={[styles.label, isDark && styles.titleDark]}>Email:</Text>
        <Text style={[styles.value, isDark && styles.titleDark]}>{user?.email}</Text>

        <Text style={[styles.label, isDark && styles.titleDark]}>Last Login:</Text>
        <Text style={[styles.value, isDark && styles.titleDark]}>
          {user?.metadata?.lastSignInTime
            ? new Date(user.metadata.lastSignInTime).toLocaleString()
            : 'N/A'}
        </Text>

        <Text style={[styles.label, isDark && styles.titleDark]}>Full Name:</Text>
        {editName ? (
          <View style={styles.row}>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              placeholder="Enter full name"
            />
            <TouchableOpacity onPress={() => setEditName(false)}>
              <Ionicons name="checkmark-outline" size={24} color="green" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.row}>
            <Text style={[styles.value, isDark && styles.titleDark]}>{fullName || 'No name set'}</Text>
            <TouchableOpacity onPress={() => setEditName(true)}>
              <Ionicons name="create-outline" size={20} />
            </TouchableOpacity>
          </View>
        )}

        <Text style={[styles.label, isDark && styles.titleDark]}>Phone:</Text>
        {editPhone ? (
          <View style={styles.row}>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
            <TouchableOpacity onPress={() => setEditPhone(false)}>
              <Ionicons name="checkmark-outline" size={24} color="green" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.row}>
            <Text style={[styles.value, isDark && styles.titleDark]}>{phone || 'No phone number'}</Text>
            <TouchableOpacity onPress={() => setEditPhone(true)}>
              <Ionicons name="create-outline" size={20} />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Profile</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}
