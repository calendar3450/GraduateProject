import React, { useEffect, useState } from "react";
import { FlatList, Text, View, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../utils/common";

export default function DiagnosisListPage({ navigation }) {
  const [diagnosisList, setDiagnosisList] = useState([]);
  const [error, setError] = useState(null);

  const options = {
    timeZone: "Asia/Seoul",
    dateStyle: "short",
    timeStyle: "short",
  };

  useEffect(() => {
    // 페이지가 마운트될 때 진단 목록을 가져오기 위해 호출
    postDiagnosisList();
  }, []);

  const postDiagnosisList = async () => {
    try {
      // AsyncStorage에서 userName 가져오기
      const userName = await AsyncStorage.getItem("userName");
      let obj_userName;
      if (userName !== null) {
        const sub_userName = JSON.parse(userName);
        obj_userName = sub_userName.userName;
      } else {
        console.log("userName not found");
        navigation.replace("LoginPage");
      }
      console.log(`userName - ${obj_userName}`);

      // API 엔드포인트 호출하여 진단 목록 가져오기
      const response = await axios.post(`${API_URL}/diagnosis/findAllPetData`, {
        author: obj_userName,
      });
      const diagnosisListData = response.data.data;

      // 각 애완동물에 대한 진단 결과를 가져와 진단 목록 데이터에 추가
      const updatedDiagnosisListData = await Promise.all(
        diagnosisListData.map(async (obj) => {
          const res = await axios.post(
            `${API_URL}/diagnosis/findDiagnosisByPetId`,
            {
              petId: obj.petId,
            }
          );
          return { ...obj, diagnosisResult: res.data.data };
        })
      );
      // 업데이트된 진단 목록 데이터 설정
      setDiagnosisList(updatedDiagnosisListData);
    } catch (error) {
      setError("데이터를 불러오지 못 하였습니다.");
    }
  };

  const renderItem = ({ item }) => {
    // 각 진단 항목에 대한 컴포넌트 렌더링
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.petName}</Text>
        <Text style={styles.subtitle}>종: {item.breed}</Text>
        <Text style={styles.subtitle}>나이: {item.age}</Text>
        <Text style={styles.subtitle}>성별: {item.gender}</Text>
        <Text style={styles.subtitle}>눈의 위치: {item.eyePosition}</Text>
        <Text style={styles.subtitle}>
          진단 시간: {new Date(item.createdAt).toLocaleString("ko-KR", options)}
        </Text>
        {item.diagnosisResult && (
          <Text style={styles.subtitle}>
            진단 결과:{" "}
            {item.diagnosisResult.replace(/([^:,]+):([^,]+)/g, "$1 $2%")}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={diagnosisList}
        renderItem={renderItem}
        keyExtractor={(item) => item.petId}
      />
    </View>
  );
}

const { width, height } = Dimensions.get("window");
const ratioWidth = width / 390; // 390은 원래 코드에서 사용한 기준 너비입니다.
const ratioHeight = height / 844; // 844는 원래 코드에서 사용한 기준 높이입니다.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20 * ratioWidth,
    paddingVertical: 20 * ratioHeight,
  },
  item: {
    backgroundColor: "#f9f9f9",
    borderRadius: 5 * ratioWidth,
    padding: 10 * ratioWidth,
    marginBottom: 10 * ratioHeight,
  },
  title: {
    fontSize: 18 * ratioWidth,
    fontWeight: "bold",
    marginBottom: 5 * ratioHeight,
  },
  subtitle: {
    fontSize: 14 * ratioWidth,
    marginBottom: 3 * ratioHeight,
  },
});
