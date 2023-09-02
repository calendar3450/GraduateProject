import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");
const ratioWidth = width / 390; // 390은 원래 코드에서 사용한 기준 너비입니다.
const ratioHeight = height / 844; // 844는 원래 코드에서 사용한 기준 높이입니다.

export default function ProfilePage({ navigation }) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // 홈 페이지가 포커스를 받았을 때 데이터를 업데이트
      checkTokenExpiration();
    });

    return unsubscribe;
  }, [navigation]);

  //token 기간만료 체크 함수
  const checkTokenExpiration = async () => {
    const tokens = await AsyncStorage.getItem("tokens");
    if (tokens == null) {
      Alert.alert("로그인된 기록이 없습니다.", "다시 로그인해주세요.");
      await AsyncStorage.clear();
      navigation.replace("LoginPage");
    } else {
      const { refresh_token } = JSON.parse(tokens);
      if (refresh_token) {
        const decodedToken = jwtDecode(refresh_token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          Alert.alert(
            "로그인 기한 만료",
            "토큰에 기한이 만료되었습니다. 다시 로그인해주세요."
          );
          await AsyncStorage.clear();
          navigation.replace("LoginPage");
        } else {
          loadUserName();
        }
      }
    }
  };

  //AsyncStorage에 저장된 유저 네임 불러오는 함수
  const loadUserName = async () => {
    const storedUserName = await AsyncStorage.getItem("userName");
    if (storedUserName) {
      setUserName(JSON.parse(storedUserName).userName);
    } else {
      Alert.alert("실패", "로그인이 필요합니다");
      navigation.replace("LoginPage");
    }
  };

  //회원 탈퇴 페이지 이동
  const moveAccountPage = () => {
    navigation.navigate("AccountPage");
  };

  const handleLogout = async () => {
    // 로그아웃 로직
    await AsyncStorage.clear();
    navigation.replace("LoginPage");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>안녕하세요, {userName}님</Text>
      <TouchableOpacity onPress={handleLogout}>
        <LinearGradient
          style={styles.button}
          colors={["#7B68EE", "#9370DB"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.buttonText}>로그아웃</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={moveAccountPage}>
        <LinearGradient
          style={styles.button}
          colors={["#7B68EE", "#9370DB"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.buttonText}>회원 탈퇴</Text>
        </LinearGradient>
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
    marginBottom: 70 * ratioHeight,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    backgroundColor: "#7c7bad",
    borderRadius: 20,
    paddingVertical: 10,
    width: 200 * ratioWidth,
    height: 100 * ratioHeight,
    justifyContent: "center",
    marginBottom: 20 * ratioHeight,
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
