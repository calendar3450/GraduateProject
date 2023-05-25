import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { API_URL } from "../utils/common";

export default function PetDataPage({ navigation }) {
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     // 홈 페이지가 포커스를 받았을 때 데이터를 업데이트
  //     //loadUserName();
  //   });

  //   return unsubscribe;
  // }, [navigation]);

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
          console.log("access_token 기간 만료 재발급 시행");
        } else {
          accessToken = access_token;
        }
      } catch (error) {
        console.log(error.response.data);
      }
    } else {
      alert("시스템 오류 다시 로그인해주시기 바랍니다.");
      navigation.navigate("LoginPage");
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
      alert("반려동물 정보 등록 성공!");
      setAge("");
      setBreed("");
      setPetName("");
      navigation.navigate("ImageInputPage");
    } catch (error) {
      console.log(error.response.data);
      setAge("");
      setBreed("");
      setPetName("");
      alert("반려동물 정보 등록 실패!");
    }
  };

  const handleGenderSelect = (selected) => {
    setGender(selected);
  };

  return (
    <View style={styles.container}>
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
      <Button title="반려동물 정보 등록" onPress={handleCreatePet} />
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
  input: {
    width: "100%",
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
    marginTop: 10,
  },
  genderButton: {
    flex: 1,
    padding: 20,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#ccc",
  },
  genderButtonText: {
    color: "black", // 원하는 색상으로 변경해주세요
    fontSize: 16, // 원하는 글꼴 크기로 변경해주세요
    fontWeight: "bold", // 원하는 글꼴 굵기로 변경해주세요
    textAlign: "center",
  },
  genderButtonSelected: {
    backgroundColor: "#007AFF",
  },
});
