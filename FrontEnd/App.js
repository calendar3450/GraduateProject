import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginPage from "./screens/LoginPage";
import ImageInputPage from "./screens/ImagePage";
import SignUpPage from "./screens/SignupPage";
import PetDataPage from "./screens/PetDataPage";
import DiagnosisListPage from "./screens/DiagnosisListPage";
import HomePage from "./screens/HomePage";
import OnboardingPage from "./screens/OnboardingPage";
import NoneMemberPage from "./screens/NoneMemberPage";
import { IconButton } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import React from "react";

const Stack = createStackNavigator();

function App() {
  React.useEffect(() => {
    const hideSplashScreen = async () => {
      await SplashScreen.preventAutoHideAsync();
      // 3초간 대기
      setTimeout(async () => {
        await SplashScreen.hideAsync();
      }, 3000);
    };

    hideSplashScreen();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="OnboardingPage" component={OnboardingPage} />
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
        <Stack.Screen name="NoneMemberPage" component={NoneMemberPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
