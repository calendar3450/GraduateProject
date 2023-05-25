import React, { useState } from "react";
import { Button, Image, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Django_API_URL } from "../utils/common";

export default function NoneMemberPage({ navigation }) {
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
    let formData = new FormData();

    formData.append("img", {
      uri: uri,
      type: "multipart/form-data",
      name: "image_test",
    });

    try {
      const response = await axios.post(
        `${Django_API_URL}/diagnosis/nonemember_dog/`,
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
      console.log(response.data.result);
      alert(`진단결과: ${response.data.result}!`);
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
