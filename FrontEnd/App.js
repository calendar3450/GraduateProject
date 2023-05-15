import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginPage from "./screens/LoginPage";
import ImageInput from "./screens/Image";
import SignUpScreen from "./screens/SignupPage";
import PetDataPage from "./screens/PetDataPage";
import DiagnosisList from "./screens/DiagnosisListPage";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="PetDataPage" component={PetDataPage} />
        <Stack.Screen name="SignupPage" component={SignUpScreen} />
        <Stack.Screen name="ImageInput" component={ImageInput} />
        <Stack.Screen name="DiagnosisList" component={DiagnosisList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
