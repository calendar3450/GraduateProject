import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Button, Text } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../utils/common";

export default function LoginPage({ navigation }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const userIdRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,16}$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,16}$/;

    if (!userIdRegex.test(userId) || !passwordRegex.test(password)) {
      setUserId("");
      setPassword("");
      alert("아이디와 비밀번호는 영어 대소문자와 숫자, 4~16자리만 가능합니다.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/user/login`, {
        userId,
        password,
      });
      const { access_token, refresh_token, userName } = response.data.data;

      await AsyncStorage.setItem("userName", JSON.stringify({ userName }));

      await AsyncStorage.setItem(
        "tokens",
        JSON.stringify({ access_token, refresh_token })
      );
      setUserId("");
      setPassword("");
      navigation.navigate("HomePage");
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
      <Button
        title="로그인"
        buttonStyle={styles.button}
        onPress={handleLogin}
      />
      <Button
        title="회원가입"
        buttonStyle={styles.button}
        onPress={() => navigation.navigate("SignupPage")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
  },
  button: {
    marginVertical: 10,
    backgroundColor: "#7c7bad",
    borderRadius: 10,
    width: "100%",
  },
  bottomContainer: {
    width: "100%",
    padding: 30,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
