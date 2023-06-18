import React from "react";
import {
  StyleSheet,
  Modal,
  View,
  Pressable,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
function UploadModeModal({
  visible,
  onClose,
  onLaunchCamera,
  onLaunchImageLibrary,
}) {
  const handleModalOutsidePress = () => {
    // 모달 외부 터치 시 아무 작업도 수행하지 않음
  };
  return (
    <TouchableWithoutFeedback onPress={handleModalOutsidePress}>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <Pressable style={styles.background}>
          <View style={styles.whiteBox}>
            <Pressable
              style={styles.actionButton}
              android_ripple={{ color: "#eee" }}
              onPress={() => {
                onLaunchCamera();
                onClose();
              }}
            >
              <Icon
                name="camera-alt"
                color="#757575"
                size={24}
                style={styles.icon}
              />
              <Text style={styles.actionText}>카메라로 촬영하기</Text>
            </Pressable>
            <Pressable
              style={styles.actionButton}
              android_ripple={{ color: "#eee" }}
              onPress={() => {
                onLaunchImageLibrary();
                onClose();
              }}
            >
              <Icon
                name="photo"
                color="#757575"
                size={24}
                style={styles.icon}
              />
              <Text style={styles.actionText}>사진 선택하기</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "rgba(0,0,0,0,6)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  whiteBox: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 4,
    elevation: 2,
  },
  actionButton: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 26,
  },
});

export default UploadModeModal;
