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
  greeting: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    backgroundColor: "#7c7bad",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
