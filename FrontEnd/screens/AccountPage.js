import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { API_URL } from "../utils/common";

export default function AccountPage({ navigation }) {
  const [password, setPassword] = useState("");

  const handleWithdrawal = async () => {
    // 회원 탈퇴 로직을 구현하는 함수
    // 탈퇴 성공 후 필요한 동작 수행 (기본 화면으로 이동)

    // AsyncStorage에서 토큰을 가져옴
    const tokens = await AsyncStorage.getItem("tokens");
    let accessToken;
    if (tokens !== null) {
      // 토큰이 유효한지 확인하고 만료되었을 경우 갱신
      const { access_token } = JSON.parse(tokens);
      const decodedToken = jwtDecode(access_token);

      try {
        // 토큰이 만료되었는지 확인
        if (decodedToken.exp < Date.now() / 1000) {
          // 토큰이 만료되었을 경우
          const { refresh_token } = JSON.parse(tokens);
          const response = await axios.get(`${API_URL}/user/getAccessToken`, {
            headers: {
              Authorization: `Bearer ${refresh_token}`,
            },
          });
          const { access_token } = response.data.data;
          await AsyncStorage.setItem(
            "tokens",
            JSON.stringify({ access_token, refresh_token })
          );
          accessToken = access_token;
        } else {
          accessToken = access_token;
        }
      } catch (error) {
        console.log(error.response.data);
      }
    } else {
      // 토큰이 없을 경우 에러 메시지를 표시하고 로그인 페이지로 이동
      alert("시스템 오류 다시 로그인해주시기 바랍니다.");
      navigation.replace("LoginPage");
    }

    try {
      // 사용자 계정 삭제를 위해 서버 API 호출
      const response = await axios.post(
        `${API_URL}/user/deleteUser`,
        {
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const result = response.data.data;
      await AsyncStorage.clear(); // AsyncStorage를 비움 (저장된 데이터 삭제)
      navigation.navigate("OnboardingPage"); // Onboarding 페이지로 이동
    } catch (error) {
      console.log(error);
      alert("아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>주의하세요!</Text>
      <Text style={styles.label}>
        한번 삭제된 회원 정보는 복구가 불가능합니다.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleWithdrawal}>
        <Text style={styles.buttonText}>회원 탈퇴</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width, height } = Dimensions.get("window");
const ratio = width / 390; // 390은 원래 코드에서 사용한 기준 너비입니다.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20 * ratio,
  },
  title: {
    fontSize: 32 * ratio,
    fontWeight: "bold",
    marginBottom: 20 * ratio,
  },
  label: {
    fontSize: 18 * ratio,
    marginBottom: 10 * ratio,
  },
  input: {
    width: "100%",
    height: 40 * ratio,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 20 * ratio,
    paddingHorizontal: 10 * ratio,
  },
  button: {
    width: "100%",
    backgroundColor: "#7c7bad",
    paddingVertical: 10 * ratio,
    alignItems: "center",
    borderRadius: 5 * ratio,
  },
  buttonText: {
    color: "white",
    fontSize: 18 * ratio,
    fontWeight: "bold",
  },
});
