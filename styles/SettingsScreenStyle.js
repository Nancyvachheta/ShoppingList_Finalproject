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
});

export default SettingsScreenStyle;
