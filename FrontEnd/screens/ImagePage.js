import React, { useState } from "react";
import { Button, Image, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../utils/common";

export default function ImageInputPage({ navigation }) {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const petId = await AsyncStorage.getItem("petId");
    let obj_petId;
    if (petId !== null) {
      obj_petId = JSON.parse(petId);
      console.log(obj_petId);
    } else {
      console.log("petId not found");
    }

    let formData = new FormData();

    formData.append("image", {
      uri: uri,
      type: "multipart/form-data",
      name: "image_test",
    });
    formData.append("petId", `${obj_petId.petId}`);

    try {
      const response = await axios.post(
        `${API_URL}/diagnosis/diagnosisImg`,
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          transformRequest: (data, headers) => {
            return data;
          },
        }
      );
      console.log(response.data.data);
      alert(`진단결과: ${response.data.data.result}!`);
      navigation.navigate("HomePage");
    } catch (error) {
      console.log(error.response.data);
      alert("진단에 실패하였습니다 다시 시도해주세요!");
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="진단할 이미지 파일을 선택하시오." onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
    </View>
  );
}
