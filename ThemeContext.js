import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const updateFirebaseTheme = async (newTheme) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { theme: newTheme }, { merge: true });
      } catch (error) {
        console.error('Error saving theme to Firebase:', error.message);
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    updateFirebaseTheme(newTheme);
  };

  useEffect(() => {
    const fetchTheme = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists() && snap.data().theme) {
            setTheme(snap.data().theme);
          }
        } catch (error) {
          console.error('Error fetching theme from Firebase:', error.message);
        }
      }
    };

    fetchTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}