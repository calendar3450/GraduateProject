import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F8F8",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: "Helvetica Neue",
    fontWeight: "600",
    color: "#333333",
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Helvetica Neue",
    fontWeight: "400",
    color: "#666666",
  },
});
