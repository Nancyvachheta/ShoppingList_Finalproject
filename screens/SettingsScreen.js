import React, { useContext, useEffect, useState } from 'react';
import {
  View, Text, Switch, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { ThemeContext } from '../ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/SettingsScreenStyle';
import Constants from 'expo-constants';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function SettingsScreen() {
  const { theme, toggleTheme, setTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const savedTheme = snap.data().theme;
          if (savedTheme) setTheme(savedTheme);
        }
      } catch (err) {
        Alert.alert('Error loading theme', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();
  }, []);

  const handleThemeToggle = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const newTheme = isDark ? 'light' : 'dark';
      await setDoc(doc(db, 'users', user.uid), { theme: newTheme }, { merge: true });
      toggleTheme();
    } catch (err) {
      Alert.alert('Theme Error', err.message);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.header, isDark && styles.headerDark]}>Settings</Text>

        <View style={styles.row}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={handleThemeToggle}
            trackColor={{ false: '#ccc', true: '#4a90e2' }}
            thumbColor={isDark ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
         <View style={styles.row}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Version: </Text>
          <Text style={[styles.label, isDark && styles.labelDark]}>2.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>App Info</Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            QuickList helps you manage shopping lists, shared lists, and your personal inventory with ease. Built using React Native and Firebase.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Developer Info</Text>
          <Text style={[styles.text, isDark && styles.textDark]}>Megh Rishikesh	Godbole</Text>
          <Text style={[styles.text, isDark && styles.textDark]}>Chandani Jayantilal Solanki</Text>
          <Text style={[styles.text, isDark && styles.textDark]}>Nancy Pankajkumar Vachheta</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}