import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import IdPage from './screens/IdPage';
import ImageInput from './screens/Image';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="IdPage" component={IdPage} />
        <Stack.Screen name="ImageInput" component={ImageInput} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;