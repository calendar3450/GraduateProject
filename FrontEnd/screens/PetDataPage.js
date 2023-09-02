import React, { useState } from "react";
import {
  View,
  Text,
  Keyboard,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { API_URL } from "../utils/common";

const { height } = Dimensions.get("window");
const ratioHeight = height / 844; // 844는 원래 코드에서 사용한 기준 높이입니다.

export default function PetDataPage({ navigation }) {
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [eyePosition, setEyePosition] = useState("");

  const handleCreatePet = async () => {
    const tokens = await AsyncStorage.getItem("tokens");
    let accessToken;
    if (tokens !== null) {
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
      alert("시스템 오류 다시 로그인해주시기 바랍니다.");
      navigation.replace("LoginPage");
    }
    try {
      const response = await axios.post(
        `${API_URL}/diagnosis/petData`,
        {
          petName: `${petName}`,
          breed: `${breed}`,
          age: parseInt(age),
          eyePosition: `${eyePosition}눈`,
          gender: `${gender}`,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const { petId } = response.data.data;
      await AsyncStorage.setItem("petId", JSON.stringify({ petId }));
      setAge("");
      setBreed("");
      setPetName("");
      navigation.replace("ImageInputPage");
    } catch (error) {
      setAge("");
      setBreed("");
      setPetName("");
      Alert.alert("입력 정보 오류", "반려동물 정보 등록을 다시 시도해주세요.");
    }
  };

  const handleGenderSelect = (selected) => {
    setGender(selected);
  };

  const handleEyePositionSelect = (selected) => {
    setEyePosition(selected);
  };

  const handlePress = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <Text style={styles.greeting}>
          진단할 반려견의 정보를 입력하여주세요!
        </Text>
        <TextInput
          style={styles.input}
          placeholder="펫이름"
          value={petName}
          onChangeText={setPetName}
        />
        <TextInput
          style={styles.input}
          placeholder="견종"
          value={breed}
          onChangeText={setBreed}
        />
        <TextInput
          keyboardType="number-pad"
          style={styles.input}
          placeholder="나이"
          value={age}
          onChangeText={setAge}
        />
        <View style={styles.selectContainer}>
          <TouchableOpacity
            style={[
              styles.selectButton,
              gender === "수컷" ? styles.ButtonSelected : null,
            ]}
            onPress={() => handleGenderSelect("수컷")}
          >
            <Text style={styles.selectButtonText}>수컷</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectButton,
              gender === "암컷" ? styles.ButtonSelected : null,
            ]}
            onPress={() => handleGenderSelect("암컷")}
          >
            <Text style={styles.selectButtonText}>암컷</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.selectContainer}>
          <TouchableOpacity
            style={[
              styles.selectButton,
              eyePosition === "왼쪽" ? styles.ButtonSelected : null,
            ]}
            onPress={() => handleEyePositionSelect("왼쪽")}
          >
            <Text style={styles.selectButtonText}>왼쪽눈</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectButton,
              eyePosition === "오른쪽" ? styles.ButtonSelected : null,
            ]}
            onPress={() => handleEyePositionSelect("오른쪽")}
          >
            <Text style={styles.selectButtonText}>오른쪽눈</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleCreatePet}>
          <Text style={styles.buttonText}>반려동물 정보 등록하기</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  greeting: {
    fontSize: 20,
    marginBottom: 40 * ratioHeight,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    backgroundColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 10,
    width: "95%",
    height: 80 * ratioHeight,
    marginBottom: 30 * ratioHeight,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: "95%",
    height: 50 * ratioHeight,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10 * ratioHeight,
  },
  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectButton: {
    flex: 1,
    padding: 20,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#ccc",
  },
  selectButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  ButtonSelected: {
    backgroundColor: "#7c7bad",
  },
});
