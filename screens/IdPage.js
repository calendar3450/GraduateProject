import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function IdPage({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const user = await AsyncStorage.getItem(username);
    if (user !== null && JSON.parse(user).password === password) {
      alert('로그인 성공!');
    } else {
      alert('아이디 또는 비밀번호가 틀렸습니다.');
    }
  };

  const handleSignUp = async () => {
    const user = { username, password };
    await AsyncStorage.setItem(username, JSON.stringify(user));
    alert('회원가입이 완료되었습니다.');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Button title="로그인" onPress={handleLogin} />
      <Button title="다음 화면" onPress={() => navigation.navigate('ImageInput')} />
      <Button title="회원가입" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
});
