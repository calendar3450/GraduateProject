import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { API_URL } from "../utils/common";

export default function PetDataPage({ navigation }) {
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

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
      Alert.alert("성 공!", "진단 화면으로 전환됩니다.");
      setAge("");
      setBreed("");
      setPetName("");
      navigation.navigate("ImageInputPage");
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

  return (
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
        style={styles.input}
        placeholder="나이"
        value={age}
        onChangeText={setAge}
      />
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "수컷" ? styles.genderButtonSelected : null,
          ]}
          onPress={() => handleGenderSelect("수컷")}
        >
          <Text style={styles.genderButtonText}>수컷</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "암컷" ? styles.genderButtonSelected : null,
          ]}
          onPress={() => handleGenderSelect("암컷")}
        >
          <Text style={styles.genderButtonText}>암컷</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.button]} onPress={handleCreatePet}>
        <Text style={styles.buttonText}>반려동물 정보 등록하기</Text>
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
  },
  greeting: {
    fontSize: 20,
    marginBottom: 40,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    backgroundColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 10,
    width: "95%",
    height: 80,
    marginBottom: 30,
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
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  genderButton: {
    flex: 1,
    padding: 20,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#ccc",
  },
  genderButtonText: {
    color: "white", // 원하는 색상으로 변경해주세요
    fontSize: 16, // 원하는 글꼴 크기로 변경해주세요
    fontWeight: "bold", // 원하는 글꼴 굵기로 변경해주세요
    textAlign: "center",
  },
  genderButtonSelected: {
    backgroundColor: "#7c7bad",
  },
});
