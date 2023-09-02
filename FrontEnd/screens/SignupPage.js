import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import axios from "axios";
import { API_URL } from "../utils/common";

const { height } = Dimensions.get("window");
const ratioHeight = height / 844; // 844는 원래 코드에서 사용한 기준 높이입니다.

const SignUpPage = ({ navigation }) => {
  const [id, setId] = useState("");
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const idRegex = /^[a-zA-Z0-9]{4,16}$/;
  const passwordRegex = /^[a-zA-Z0-9]{4,16}$/;

  const handleSignUp = async (id, userName, password) => {
    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!idRegex.test(id) || !passwordRegex.test(password)) {
      setId("");
      setPassword("");
      setConfirmPassword("");
      Alert.alert(
        "실패",
        "아이디와 비밀번호는 영어 대소문자와 숫자, 4~16자리만 가능합니다."
      );
      return;
    }
    // 회원가입 처리
    try {
      const response = await axios.post(`${API_URL}/user/signUp`, {
        userId: `${id}`,
        userName: `${userName}`,
        password: `${password}`,
      });
      setId("");
      setPassword("");
      setUsername("");
      setConfirmPassword("");
      navigation.replace("LoginPage");
    } catch (error) {
      setId("");
      setPassword("");
      setUsername("");
      setConfirmPassword("");
      console.log(error.response.data);
      Alert.alert("실패", "회원가입이 실패하였습니다.");
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="ID"
          autoCapitalize="none"
          onChangeText={(value) => setId(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="UserName"
          autoCapitalize="none"
          onChangeText={(value) => setUsername(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(value) => setPassword(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={true}
          onChangeText={(value) => setConfirmPassword(value)}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSignUp(id, userName, password)}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30 * ratioHeight,
  },
  input: {
    width: "80%",
    height: 50 * ratioHeight,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20 * ratioHeight,
  },
  button: {
    width: "80%",
    height: 50 * ratioHeight,
    backgroundColor: "#7c7bad",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SignUpPage;
