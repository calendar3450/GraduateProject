import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
const { width, height } = Dimensions.get("window");
const ratioWidth = width / 390; // 390은 원래 코드에서 사용한 기준 너비입니다.
const ratioHeight = height / 844; // 844는 원래 코드에서 사용한 기준 높이입니다.
export default function GuidePage({ navigation }) {
  return (
    //이 곳에 진단 가이드 페이지를 만들어 주시면 됩니다!
   <ScrollView contentContainerStyle= {styles.container}>
    <View style={styles.container}>
    <Text style={styles.title}>진단 가이드</Text>
    <View style={styles.contentContainer}>
      <Image
        source={require('../assets/guide1.png')}
        style={{ 
          alignItems: 'center',
          width:160,
          height:80,
          resizeMode: "contain",
          marginRight: 10,
          marginLeft: 30,}}
      />
      <Text style={styles.contentText}>
      1. 서비스 선택 화면에서{"\n"}'안구 진단' 버튼을 클릭해주세요.
      </Text>
    </View>
    <Text style={{
        
        alignItems: 'center',
        marginTop: 15,
        marginLeft: 15,
        fontSize: 14,
        fontWeight: 'bold',
      }}>
        2. '카메라로 촬영하기' 또는 '사진 선택하기'{"\n"}버튼을 클릭해주세요. 그 후 화면에 보이는 안구 범위에 {"\n"}맞춰 촬영해주세요.
      </Text>
    <View style={styles.contentContainer}>
    <Image
        source={require('../assets/Diagnosis1.jpg')}
        
      style={{
        
        marginTop: 10,
        width: 160,
        height: 300,
        resizeMode: 'contain',
      }}
      />
       <Image
        source={require('../assets/Diagnosis2.jpg')}
        style={{
         
          marginLeft: 10,
          width: 160,
          height: 300,
          resizeMode: 'contain',
        }}
      />
    </View>
    <View style={styles.contentContainer}>
    <Image
        source={require('../assets/result.jpg')}
        
      style={{
        resizeMode: 'contain',
        marginLeft: 30,
        marginTop: 10,
        width: 160,
        height: 300,
        resizeMode: 'contain',
      }}/>
    <Text style={{
      flex: 1,
      fontSize: 14,
      fontWeight: "bold",
      textAlign: "right",
      marginTop: -200,
      marginRight: 40,
      }}>
        3. 촬영이 완료되면 AI가{"\n"}이미지를 분석해 {"\n"}체크 결과를 보여 드려요
      </Text>

    </View>
  </View>
  </ScrollView>
  );
 

    
}














const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingTop: 80,
  },
  flatListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title:{
    fontSize: 32,
    color: "#7c7bad",
    fontWeight: "bold",
    textAlign: "left",
    marginRight: 160 * ratioWidth,
    marginLeft: -20 * ratioHeight,
    marginTop: -100,
    
  },
  image:{
    flex: 0.6,
    width:150,
    height:150,
    resizeMode: "contain",
    marginRight: '50%',
  },
  contentText:{
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 10,
    marginRight: 40,

  },
  contentContainer:{
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
});
