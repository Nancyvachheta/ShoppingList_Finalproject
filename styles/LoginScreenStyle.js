import { StyleSheet } from 'react-native';

const LoginScreenStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    marginVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  link: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default LoginScreenStyle;