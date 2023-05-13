import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';

export default function App() {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('');
  const [birth, setBirth] = useState('');

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('breed', breed);
    formData.append('gender', gender);
    formData.append('birth', birth);

    const response = await fetch('http://localhost:5000/submit-form', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('Form submitted successfully!');
    } else {
      console.log('Error submitting form');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Information</Text>

      <View style={styles.inputContainer}>
        <Fontisto name="paw" size={26} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="이름"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <AntDesign name="pushpin" size={28} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="품종"
          value={breed}
          onChangeText={setBreed}
        />
      </View>

      <View style={styles.inputContainer}>
        <AntDesign name="heart" size={28} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="성별"
          value={gender}
          onChangeText={setGender}
        />
      </View>

      <View style={styles.inputContainer}>
        <AntDesign name="notification" size={28} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="생일"
          value={birth}
          onChangeText={setBirth}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>등  록</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 0.8,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
