import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function OnboardingPage({ navigation }) {
  const handleMember = () => {
    //회원 페이지 이동
    navigation.navigate("HomePage");
  };

  const handllNoneMember = () => {
    //비회원 페이지 이동
    navigation.navigate("NoneMemberPage");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleMember}>
        <Text style={styles.buttonText}>회원</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handllNoneMember}>
        <Text style={styles.buttonText}>비회원</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  button: {
    backgroundColor: "#7c7bad",
    borderRadius: 20,
    paddingVertical: 10,
    width: 200,
    height: 100,
    marginBottom: 30,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
});
