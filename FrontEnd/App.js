import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginPage from "./screens/LoginPage";
import ImageInputPage from "./screens/ImagePage";
import SignUpPage from "./screens/SignupPage";
import PetDataPage from "./screens/PetDataPage";
import DiagnosisListPage from "./screens/DiagnosisListPage";
import HomePage from "./screens/HomePage";
import { IconButton } from "react-native-paper";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="PetDataPage" component={PetDataPage} />
        <Stack.Screen name="SignupPage" component={SignUpPage} />
        <Stack.Screen name="ImageInputPage" component={ImageInputPage} />
        <Stack.Screen
          name="DiagnosisListPage"
          component={DiagnosisListPage}
          options={({ navigation }) => ({
            title: "Diagnosis List",
            headerRight: () => (
              <IconButton
                icon="home"
                onPress={() => navigation.navigate("HomePage")}
              />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
