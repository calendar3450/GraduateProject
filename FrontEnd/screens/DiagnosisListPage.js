import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../utils/common";

export default function DiagnosisListPage({ navigation }) {
  const [diagnosisList, setDiagnosisList] = useState([]);
  const [dataLength, setDataLength] = useState("");
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState("");
  const [error, setError] = useState(null);

  let pageCount = 1;

  const options = {
    timeZone: "Asia/Seoul",
    dateStyle: "short",
    timeStyle: "short",
  };

  useEffect(() => {
    loadUserName();
  }, []);

  //유저 네임 불러오기
  const loadUserName = async () => {
    // AsyncStorage에서 userName 가져오기
    const userName = await AsyncStorage.getItem("userName");
    if (userName !== null) {
      setAuthor(JSON.parse(userName).userName);
      postPetData(JSON.parse(userName).userName);
    } else {
      console.log("userName not found");
      navigation.replace("LoginPage");
    }
  };

  const onEndReached = () => {
    if (!loading) {
      if (dataLength > 1 && dataLength % 10 == 0) {
        pageCount++;
        postPetData(author);
      }
    } else {
      return;
    }
  };

  //page에 불러올 데이터 10개 로딩
  const postPetData = async (userName) => {
    setLoading(true);
    // API 엔드포인트 호출하여 진단 목록 가져오기
    const response = await axios.post(`${API_URL}/diagnosis/findAllPetData`, {
      author: userName,
      page: pageCount,
      pageSize: 10,
    });
    setDataLength(response.data.data.length);
    postDiagnosisList(response.data.data);
  };

  const postDiagnosisList = async (diagnosisListData) => {
    try {
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
      setDiagnosisList(diagnosisList.concat(updatedDiagnosisListData));
      setLoading(false);
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
      {diagnosisList.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>진단 기록이 없습니다</Text>
        </View>
      )}
      <FlatList
        data={diagnosisList}
        onEndReached={onEndReached}
        onEndReachedThreshold={1}
        renderItem={renderItem}
        keyExtractor={(item) => item.petId}
        ListFooterComponent={loading && <ActivityIndicator />}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#7c7bad",
    fontSize: 32 * ratioWidth,
    fontWeight: "bold",
    textAlign: "center",
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
