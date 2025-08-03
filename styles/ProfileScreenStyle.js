import { StyleSheet } from 'react-native';

const ProfileScreenStyle = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'top',
    padding: 24,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  titleDark: {
    color: '#ffffff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 30,
    padding: 14,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreenStyle;