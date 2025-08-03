// components/ListItem.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../ThemeContext'; // ✅ Make sure the path is correct

const ListItem = ({ item, onToggleChecked, onDelete }) => {
  const { theme } = useContext(ThemeContext);

  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Pressable onPress={() => onToggleChecked(item.id)} style={styles.itemRow}>
        <Ionicons
          name={item.checked ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={item.checked ? 'lightgreen' : isDark ? '#ccc' : 'gray'}
        />
        <Text
          style={[
            styles.text,
            item.checked && styles.checkedText,
            isDark && styles.textDark,
          ]}
        >
          {item.name}
        </Text>
      </Pressable>
      <Pressable onPress={() => onDelete(item.id)}>
        <Ionicons name="trash" size={20} color="red" />
      </Pressable>
    </View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  containerDark: {
    backgroundColor: '#2c2c2c',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  textDark: {
    color: '#fff',
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});
