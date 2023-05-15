import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
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
      accessToken = access_token;
      console.log(accessToken);
    } else {
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
      setGender("");
      setPetName("");
      navigation.navigate("ImageInput");
    } catch (error) {
      console.log(error.response.data);
      setAge("");
      setBreed("");
      setGender("");
      setPetName("");
      alert("반려동물 정보 등록 실패!");
    }
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
      <TextInput
        style={styles.input}
        placeholder="성별"
        value={gender}
        onChangeText={setGender}
      />
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
});
