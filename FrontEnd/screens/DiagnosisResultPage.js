import React from "react";
import { View, StyleSheet, FlatList, Text, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Svg, Rect, Text as SvgText } from "react-native-svg";

export default function DiagnosisResultPage({ navigation, route }) {
  // route.params에서 result를 추출하여 사용
  const { result } = route.params;

  // result 객체의 키와 값 추출
  const extracted_keys = Object.keys(result);
  const extracted_values = Object.values(result);

  // 진단 결과를 표시할 데이터 배열
  const data = [
    { id: "1", title: "안구 진단 결과" },
    { id: "2", title: "상위 3개 진단 확률을 보여줍니다." },
    {
      id: "3",
      title: extracted_keys[0],
      probability: extracted_values[0],
    },
    {
      id: "4",
      title: extracted_keys[1],
      probability: extracted_values[1],
    },
    {
      id: "5",
      title: extracted_keys[2],
      probability: extracted_values[2],
    },
  ];

  // 각 항목을 렌더링하는 함수
  const renderItem = ({ item, index }) => {
    if (index === 0) {
      // 첫 번째 항목은 제목을 표시하는 컴포넌트
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{item.title}</Text>
        </View>
      );
    } else if (index === 1) {
      // 두 번째 항목은 부제목을 표시하는 컴포넌트
      return (
        <View style={styles.subheadingContainer}>
          <Text style={styles.subheadingText}>{item.title}</Text>
        </View>
      );
    } else {
      // 나머지 항목은 진단 결과를 시각적으로 표현하는 컴포넌트
      const barWidth = `${item.probability / 1.5}%`;
      return (
        <View style={styles.blockContainer}>
          <LinearGradient
            style={styles.blockGradient}
            colors={["#7B68EE", "#9370DB"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.barContainer}>
              <Text style={styles.barTitle}>{item.title}</Text>
              <Text style={styles.barPercentage}>{item.probability}%</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10 * ratioWidth,
                marginLeft: 20 * ratioWidth,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 10 * ratioWidth,
                  right: 105 * ratioWidth,
                  bottom: 0,
                  backgroundColor: "#e6e6e6",
                  borderRadius: 20 * ratioWidth,
                }}
              />
              <Svg width="100%" height={20 * ratioHeight}>
                <Rect
                  width={barWidth}
                  height={20 * ratioHeight}
                  rx={10 * ratioWidth}
                  ry={10 * ratioWidth}
                  fill="#483D8B"
                />
              </Svg>
            </View>
          </LinearGradient>
        </View>
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
        scrollEnabled={false}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  flatListContainer: {
    flex: 1,
    top: 60,
    alignItems: "center",
  },
  titleContainer: {
    width: "100%",
    marginBottom: 20 * ratioHeight,
  },
  titleText: {
    fontSize: 32 * ratioWidth,
    color: "#7c7bad",
    fontWeight: "bold",
    textAlign: "left",
    marginRight: 135 * ratioWidth,
  },
  subheadingContainer: {
    width: "100%",
    marginBottom: 30 * ratioHeight,
  },
  subheadingText: {
    fontSize: 20 * ratioWidth,
    color: "#7c7bad",
    fontWeight: "bold",
    textAlign: "left",
    marginRight: 50 * ratioWidth,
  },
  blockContainer: {
    borderRadius: 20 * ratioWidth,
    width: 320 * ratioWidth,
    height: 130 * ratioHeight,
    marginBottom: 30 * ratioHeight,
  },
  blockGradient: {
    borderRadius: 20 * ratioWidth,
    paddingVertical: 10 * ratioHeight,
    flex: 1,
    justifyContent: "center",
  },
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10 * ratioWidth,
    marginLeft: 20 * ratioWidth,
    marginBottom: 10 * ratioHeight,
  },
  barTitle: {
    marginRight: 10 * ratioWidth,
    fontSize: 24 * ratioWidth,
    color: "#fff",
    fontWeight: "bold",
  },
  barPercentage: {
    fontSize: 32 * ratioWidth,
    color: "#fff",
    fontWeight: "bold",
  },
});
