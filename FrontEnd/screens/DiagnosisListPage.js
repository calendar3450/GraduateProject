import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { styles } from "../utils/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../utils/common";

export default function DiagnosisListPage({ navigation }) {
  const [diagnosisList, setDiagnosisList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // fetch the diagnosis list from your API
    postDiagnosisList();
  }, []);

  const postDiagnosisList = async () => {
    try {
      const userName = await AsyncStorage.getItem("userName");
      let obj_userName;
      if (userName !== null) {
        const sub_userName = JSON.parse(userName);
        obj_userName = sub_userName.userName;
      } else {
        console.log("userName not found");
      }
      console.log(`userName - ${obj_userName}`);
      // call your API endpoint to get the diagnosis list
      const response = await axios.post(`${API_URL}/diagnosis/findPetData`, {
        author: obj_userName,
      });
      const diagnosisListData = response.data.data;

      // get the diagnosis results for each pet and add it to the diagnosis list data
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

      // set the updated diagnosis list data
      setDiagnosisList(updatedDiagnosisListData);
    } catch (error) {
      setError("데이터를 불러오지 못 하였습니다.");
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.petName}</Text>
        <Text style={styles.subtitle}>종: {item.breed}</Text>
        <Text style={styles.subtitle}>나이: {item.age}</Text>
        <Text style={styles.subtitle}>성별: {item.gender}</Text>
        {item.diagnosisResult && (
          <Text style={styles.subtitle}>진단 결과: {item.diagnosisResult}</Text>
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
