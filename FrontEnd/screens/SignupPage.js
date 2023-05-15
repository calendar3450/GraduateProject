import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { API_URL } from "../utils/common";

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
      alert("아이디와 비밀번호는 영어 대소문자와 숫자, 4~16자리만 가능합니다.");
      return;
    }
    // 회원가입 처리
    try {
      const response = await axios.post(`${API_URL}/user/signUp`, {
        userId: `${id}`,
        userName: `${userName}`,
        password: `${password}`,
      });
      alert("회원가입 성공!!");
      setId("");
      setPassword("");
      setUsername("");
      setConfirmPassword("");
      navigation.navigate("LoginPage");
    } catch (error) {
      setId("");
      setPassword("");
      setUsername("");
      setConfirmPassword("");
      console.log(error.response.data);
      alert("회원가입이 실패하였습니다.");
    }
  };

  return (
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
    marginBottom: 30,
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#007AFF",
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
