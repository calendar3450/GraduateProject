import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../utils/common";
import { CommonActions } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function LoginPage({ navigation }) {
  const [userId, setUserId] = useState(""); // 사용자 아이디 상태값
  const [password, setPassword] = useState(""); // 비밀번호 상태값
  const [error, setError] = useState(""); // 에러 메시지 상태값

  const resetNavigationStack = () => {
    // 네비게이션 스택 초기화 함수
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "OnboardingPage" }], // 초기화 후 처음으로 보여줄 화면
      })
    );
  };

  const handleLogin = async () => {
    const userIdRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,16}$/; // 아이디 정규식
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,16}$/; // 비밀번호 정규식

    if (!userIdRegex.test(userId) || !passwordRegex.test(password)) {
      // 아이디 또는 비밀번호가 정규식과 일치하지 않을 경우
      setUserId("");
      setPassword("");
      alert("아이디와 비밀번호는 영어 대소문자와 숫자, 4~16자리만 가능합니다.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/user/login`, {
        userId,
        password,
      }); // 로그인 API 호출

      const { access_token, refresh_token, userName } = response.data.data;

      await AsyncStorage.setItem("userName", JSON.stringify({ userName })); // 사용자 이름을 AsyncStorage에 저장

      await AsyncStorage.setItem(
        "tokens",
        JSON.stringify({ access_token, refresh_token }) // 액세스 토큰과 리프레시 토큰을 AsyncStorage에 저장
      );
      setUserId("");
      setPassword("");
      resetNavigationStack(); // 네비게이션 스택 초기화
    } catch (error) {
      console.log(error);
      setUserId("");
      setPassword("");
      setError("아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="아이디"
          value={userId}
          onChangeText={setUserId}
          autoCapitalize="none"
          autoCompleteType="username"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
          autoCompleteType="password"
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SignupPage")}
      >
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("NoneMemberPage")}
      >
        <Text style={styles.buttonText}>비회원</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: windowWidth * 0.05,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: windowHeight * 0.012,
  },
  input: {
    height: windowHeight * 0.059,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: windowWidth * 0.026,
    padding: windowWidth * 0.026,
  },
  button: {
    marginVertical: windowHeight * 0.012,
    backgroundColor: "#7c7bad",
    borderRadius: windowWidth * 0.051,
    justifyContent: "center",
    height: windowHeight * 0.036,
    width: windowWidth * 0.385,
  },
  buttonText: {
    color: "#fff",
    fontSize: windowWidth * 0.043,
    fontWeight: "bold",
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: windowHeight * 0.012,
  },
});
