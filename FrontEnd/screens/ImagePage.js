import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../utils/common";
import Modal from "react-native-modal";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

export default function ImageInputPage({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState("");
  const [hasCameraPermission, setCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const previewRef = useRef(null);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const squareWidth = windowWidth * 0.7;
  const squareHeight = windowHeight * 0.4;
  const squareTop = windowHeight * 0.3;
  const squareLeft = windowWidth * 0.3;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted");
    })();
  }, []);

  const startCamera = () => {
    setShowCamera(true);
  };

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const takePicture = async () => {
    if (camera && isCameraReady) {
      const photo = await camera.takePictureAsync();
      setImage(photo.uri);
      uploadImage(photo.uri);
    }
  };

  const pickImage = async () => {
    setShowCamera(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    setIsLoading(true);

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

      setIsLoading(false);
      setDiagnosisResult(response.data.data.result);
      setModalVisible(true);
    } catch (error) {
      setIsLoading(false);
      alert(
        "진단에 실패하였습니다. 펫 정보를 다시 입력한 후 진단을 시작하세요!"
      );
      navigation.navigate("PetDataPage");
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!hasCameraPermission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>카메라에 접근하지 못 하였습니다.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {showCamera ? (
        <Camera
          style={{ flex: 0.8, width: "100%" }}
          type={Camera.Constants.Type.back}
          ref={(ref) => setCamera(ref)}
          onCameraReady={onCameraReady}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              flexDirection: "row",
              borderRadius: 10,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                alignSelf: "flex-end",
                alignItems: "center",
              }}
              onPress={takePicture}
            ></TouchableOpacity>
          </View>
          <View
            style={{
              position: "absolute",
              borderWidth: 2,
              borderColor: "white",
              borderRadius: 10,
              top: squareTop,
              left: squareLeft,
              transform: [{ translateX: -50 }, { translateY: -100 }],
              width: squareWidth,
              height: squareHeight,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                borderStyle: "dashed",
                borderWidth: 2,
                borderRadius: 10,
                borderColor: "white",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                안구 범위
              </Text>
            </View>
          </View>
        </Camera>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <TouchableOpacity
            style={{
              width: "50%",
              backgroundColor: "#7c7bad",
              padding: 10,
              borderRadius: 10,
              marginBottom: 20,
            }}
            onPress={startCamera}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              On Camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "50%",
              backgroundColor: "#7c7bad",
              padding: 10,
              borderRadius: 10,
              marginBottom: 20,
            }}
            onPress={pickImage}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Select an image
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {showCamera && (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "30%",
            bottom: 0,
            backgroundColor: "#ccc",
            alignItems: "center",
            justifyContent: "center",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <TouchableOpacity onPress={takePicture}>
            <Ionicons name="camera" size={80} color="white" />
          </TouchableOpacity>
        </View>
      )}
      <Modal
        style={{ justifyContent: "center", alignItems: "center" }}
        isVisible={isModalVisible}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            상위 3개 진단 결과
          </Text>
          <View style={{ borderBottomColor: "black", borderBottomWidth: 1 }} />
          <Text
            style={{
              textAlign: "center",
              padding: 10,
              fontSize: 18,
              marginBottom: 20,
            }}
          >
            {diagnosisResult}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#ccc",
              padding: 10,
              marginLeft: 60,
              marginRight: 60,
              borderRadius: 10,
            }}
            onPress={() => {
              setModalVisible(false);
              navigation.replace("HomePage");
            }}
          >
            <Text style={{ fontSize: 16, textAlign: "center", color: "white" }}>
              확인
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
