import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppTabs from './AppTabs';
import ShoppingListScreen from '../screens/ShoppingListScreen';

const Stack = createNativeStackNavigator();

export default function MainAppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppTabs} />
      <Stack.Screen
        name="ShoppingList"
        component={ShoppingListScreen}
        options={({ route }) => ({
          headerShown: true,
          title: route.params?.listName || 'Shopping List',
        })}
      />
    </Stack.Navigator>
  );
}