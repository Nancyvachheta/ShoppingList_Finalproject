import { StyleSheet } from 'react-native';

const SettingsScreenStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  headerDark: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#000',
  },
  labelDark: {
    color: '#fff',
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  sectionTitleDark: {
    color: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  textDark: {
    color: '#ccc',
  },
  dropdownToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
  },

  dropdownToggleDark: {
    borderColor: '#555',
  },

  dropdownText: {
    fontSize: 16,
    color: 'black',
  },

  dropdownTextDark: {
    color: 'white',
  },

  dropdownList: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    maxHeight: 150,
    backgroundColor: 'white',
  },

  dropdownListDark: {
    borderColor: '#555',
    backgroundColor: '#222',
  },

  dropdownItem: {
    padding: 10,
  },

  dropdownItemSelected: {
    backgroundColor: '#2196F3',
  },

  dropdownItemText: {
    fontSize: 16,
  },

  dropdownItemTextSelected: {
    color: 'white',
  },
});

export default SettingsScreenStyle;