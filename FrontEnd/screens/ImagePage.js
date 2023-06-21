import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  Platform,
  ActionSheetIOS,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../utils/common";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import UploadModeModal from "../utils/modal";
import { LinearGradient } from "expo-linear-gradient";
import { manipulateAsync } from "expo-image-manipulator";

export default function ImageInputPage({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [hasCameraPermission, setCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted");
    };

    const focusListener = navigation.addListener("focus", () => {
      modalOpen();
    });

    requestCameraPermission();

    return () => {
      focusListener.remove();
    };
  }, [navigation]);

  const modalOpen = () => {
    if (Platform.OS === "android") {
      setCameraModalVisible(true);
    } else {
      setCameraModalVisible(true);
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["카메라로 촬영하기", "사진 선택하기", "취소"],
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            startCamera();
          } else if (buttonIndex === 1) {
            pickImage();
          }
        }
      );
    }
  };

  const startCamera = () => {
    setShowCamera(true);
  };

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const cropImage = async (photo) => {
    if (!photo) {
      return;
    }

    const cropWidth = photo.width / 2; // 크롭 영역의 너비
    const cropHeight = photo.height / 2.5; // 크롭 영역의 높이

    const originX = Math.max((photo.width - cropWidth) / 2, 0);
    const originY = Math.max((photo.height - cropHeight) / 2, 0);

    if (
      originX + cropWidth > photo.width ||
      originY + cropHeight > photo.height
    ) {
      console.log("크롭 영역이 원본 이미지를 벗어납니다.");
      return photo; // 크롭 영역이 원본 이미지를 벗어나는 경우 처리
    }

    const croppedImage = await manipulateAsync(
      photo.uri,
      [
        {
          crop: {
            originX,
            originY,
            width: cropWidth,
            height: cropHeight,
          },
        },
      ],
      { compress: 1, format: "jpeg" }
    );
    return croppedImage;
  };

  const takePicture = async () => {
    if (camera && isCameraReady) {
      const photo = await camera.takePictureAsync();
      console.log("사진의 크기:", photo.width, "x", photo.height);
      setImage(photo);
      const croppedImg = await cropImage(photo);
      uploadImage(croppedImg);
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

    if (!result.canceled) {
      setImage(result);
      uploadImage(result);
      setCameraModalVisible(false);
    }
  };

  const uploadImage = async (photo) => {
    setIsLoading(true);

    const petId = await AsyncStorage.getItem("petId");
    let obj_petId;
    if (petId !== null) {
      obj_petId = JSON.parse(petId);
    } else {
      console.log("petId not found");
    }

    let formData = new FormData();

    formData.append("image", {
      uri: photo.uri,
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
      const passedData = response.data.data.result;
      navigation.replace("DiagnosisResultPage", { result: passedData });
    } catch (error) {
      setIsLoading(false);
      console.log(error.response.data);
      Alert.alert(
        "진단 실패",
        "진단에 실패하였습니다. 펫 정보를 다시 입력한 후 진단을 시작하세요!"
      );
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
    <View style={styles.container}>
      {showCamera ? (
        <Camera
          style={styles.cameraContainer}
          type={Camera.Constants.Type.back}
          ref={(ref) => setCamera(ref)}
          onCameraReady={onCameraReady}
        >
          <View style={styles.camera}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={takePicture}
            ></TouchableOpacity>
          </View>
          <View
            style={[
              styles.squareOverlay,
              {
                top: windowHeight * 0.3,
                left: windowWidth * 0.3,
                width: windowWidth * 0.7,
                height: windowHeight * 0.3,
              },
            ]}
          >
            <View style={styles.squareInnerOverlay}>
              <Text style={styles.titleText}>안구 범위</Text>
            </View>
          </View>
        </Camera>
      ) : (
        <UploadModeModal
          visible={cameraModalVisible}
          onClose={() => setCameraModalVisible(false)}
          onLaunchCamera={startCamera}
          onLaunchImageLibrary={pickImage}
        />
      )}

      {showCamera && (
        <View style={styles.bottomView}>
          <LinearGradient
            style={StyleSheet.absoluteFill}
            colors={["#7B68EE", "#9370DB"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
          >
            <TouchableOpacity onPress={takePicture}>
              <Ionicons
                name="camera"
                size={80}
                color="white"
                style={styles.cameraIcon}
              />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 0.8,
    width: "100%",
  },
  camera: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    borderRadius: 10,
  },
  cameraButton: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  squareOverlay: {
    position: "absolute",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "white",
    borderRadius: 200,
    transform: [{ translateX: -50 }, { translateY: -100 }],
    justifyContent: "center",
    alignItems: "center",
  },
  squareInnerOverlay: {
    width: "80%",
    height: "80%",
    backgroundColor: "transparent",
    borderStyle: "dashed",
    borderWidth: 2,
    borderRadius: 200,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomView: {
    position: "absolute",
    width: "100%",
    height: "30%",
    bottom: 0,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cameraIcon: {
    paddingTop: 80,
    marginBottom: 10,
    alignSelf: "center",
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  modalView: {
    width: "70%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    width: "40%",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
