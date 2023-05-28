import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
export default function HomePage({ navigation }) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // 홈 페이지가 포커스를 받았을 때 데이터를 업데이트
      loadUserName();
      checkTokenExpiration();
    });

    return unsubscribe;
  }, [navigation]);

  const checkTokenExpiration = async () => {
    const tokens = await AsyncStorage.getItem("tokens");
    const { refresh_token } = JSON.parse(tokens);
    if (refresh_token) {
      const decodedToken = jwtDecode(refresh_token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        await AsyncStorage.clear();
        navigation.navigate("LoginPage");
      }
    }
  };

  const loadUserName = async () => {
    const storedUserName = await AsyncStorage.getItem("userName");
    if (storedUserName) {
      setUserName(JSON.parse(storedUserName).userName);
    } else {
      alert("로그인이 필요합니다");
      navigation.navigate("LoginPage");
    }
  };

  const handleStartDiagnosis = () => {
    // 진단 시작 로직
    navigation.navigate("PetDataPage");
  };

  const handleLogout = async () => {
    // 로그아웃 로직
    await AsyncStorage.clear();
    //await AsyncStorage.removeItem("userName");
    console.log("AsyncStorage 데이터가 모두 삭제되었습니다.");
    navigation.navigate("LoginPage");
  };

  const handleViewHistory = () => {
    // 진단 기록 보기 로직
    navigation.navigate("DiagnosisListPage");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>안녕하세요, {userName}님</Text>
      <TouchableOpacity style={styles.button} onPress={handleStartDiagnosis}>
        <Text style={styles.buttonText}>진단 시작하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleViewHistory}>
        <Text style={styles.buttonText}>진단 기록</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  greeting: {
    fontSize: 32,
    marginBottom: 70,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    backgroundColor: "#7c7bad",
    borderRadius: 20,
    paddingVertical: 10,
    width: 200,
    height: 100,
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
