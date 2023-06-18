import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const ratioWidth = width / 390; // 390은 원래 코드에서 사용한 기준 너비입니다.
const ratioHeight = height / 844; // 844는 원래 코드에서 사용한 기준 높이입니다.

export default function OnboardingPage({ navigation }) {
  const myImage = require("../assets/diagnosis_eye.png");

  //로컬에 저장된 토큰을 꺼내와 만료기간을 확인
  const checkTokenExpiration = async () => {
    const tokens = await AsyncStorage.getItem("tokens");
    if (tokens == null) {
      navigation.navigate("NoneMemberPage");
    } else {
      const { refresh_token } = JSON.parse(tokens);
      if (refresh_token) {
        const decodedToken = jwtDecode(refresh_token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          await AsyncStorage.clear();
          navigation.navigate("LoginPage");
        } else {
          navigation.navigate("PetDataPage");
        }
      }
    }
  };

  const handleDiagnosisList = () => {
    //검사 이력 페이지 이동
    navigation.navigate("DiagnosisListPage");
  };

  const handleProfilePage = () => {
    //프로필 페이지 이동
    navigation.navigate("ProfilePage");
  };

  const handleGuidePage = () => {
    //프로필 페이지 이동
    navigation.navigate("GuidePage");
  };

  const data = [
    { id: "1", title: "반려견 진단" },
    { id: "2", title: "안구 진단", onPress: checkTokenExpiration },
    { id: "3" },
    {
      id: "4",
      title: "진단 이력",
      onPress: handleDiagnosisList,
    },
    { id: "5", title: "진단 가이드", onPress: handleGuidePage },
  ];

  const renderItem = ({ item, index }) => {
    if (index === 0) {
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{item.title}</Text>
        </View>
      );
    } else if (index === 2) {
      // 첫 번째 버튼인 경우 두 개의 버튼으로 분할하여 렌더링
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <TouchableOpacity onPress={handleProfilePage}>
            <LinearGradient
              style={styles.rowButton}
              colors={["#7B68EE", "#9370DB"]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialCommunityIcons
                name="account"
                size={64}
                color="white"
                style={{
                  alignSelf: "center",
                }}
              ></MaterialCommunityIcons>
              <Text
                style={{
                  color: "#fff",
                  padding: 5,
                  fontSize: 32,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                프로필
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity>
            <LinearGradient
              style={styles.rowButton}
              colors={["#7B68EE", "#9370DB"]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.rowButtonText}>채팅 상담</Text>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: 10,
                }}
              >
                준비중입니다...
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    } else if (index === 1) {
      return (
        <TouchableOpacity onPress={item.onPress}>
          <LinearGradient
            style={styles.button}
            colors={["#7B68EE", "#9370DB"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
          >
            <Image source={myImage} style={styles.buttonImage} />
            <Text style={styles.buttonText}>{item.title}</Text>
            <Text style={styles.smallText}>10가지 안구 질환 진단</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    } else if (index === 3) {
      return (
        <TouchableOpacity style={styles.button} onPress={item.onPress}>
          <LinearGradient
            style={styles.button}
            colors={["#7B68EE", "#9370DB"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonText}>{item.title}</Text>
            <Text style={styles.smallText}>진단 이력을 한눈에!</Text>
            <MaterialCommunityIcons
              name="clipboard-text-multiple-outline"
              size={64}
              color="white"
              style={styles.icon}
            />
          </LinearGradient>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.button} onPress={item.onPress}>
          <LinearGradient
            style={styles.button}
            colors={["#7B68EE", "#9370DB"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonText}>{item.title}</Text>
            <Text style={styles.smallText}>진단 방식 설명서</Text>
            <Ionicons
              name="newspaper-outline"
              size={64}
              color="white"
              style={styles.icon}
            />
          </LinearGradient>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  flatListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rowButton: {
    backgroundColor: "#7c7bad",
    borderRadius: 20,
    paddingVertical: 10,
    width: 155 * ratioWidth,
    height: 150 * ratioHeight,
    marginRight: 5 * ratioWidth,
    marginLeft: 5 * ratioWidth,
    marginBottom: 10 * ratioHeight,
    padding: 10,
    justifyContent: "center",
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    width: 320 * ratioWidth,
    height: 130 * ratioHeight,
    marginBottom: 10 * ratioHeight,
    justifyContent: "center",
  },
  icon: {
    position: "absolute",
    alignSelf: "flex-end",
    paddingRight: 30 * ratioWidth,
  },
  buttonImage: {
    position: "absolute",
    alignSelf: "flex-end",
    padding: 10,
    width: 150 * ratioWidth,
    height: 170 * ratioHeight,
  },
  rowButtonText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 32,
    marginLeft: 30 * ratioWidth,
    fontWeight: "bold",
    textAlign: "left",
  },
  smallText: {
    position: "relative",
    color: "white",
    marginTop: 10 * ratioHeight,
    marginLeft: 30 * ratioWidth,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "left",
  },
  titleContainer: {
    width: "100%",
    marginBottom: 30 * ratioHeight,
  },
  titleText: {
    fontSize: 32,
    color: "#7c7bad",
    fontWeight: "bold",
    textAlign: "left",
    marginRight: 160 * ratioWidth,
  },
});
