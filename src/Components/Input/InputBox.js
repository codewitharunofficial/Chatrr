import { View, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const InputBox = () => {
  const [input, setInput] = useState("");

  const onSend = () => {
    console.warn("Sending a Message", input);

    setInput("");
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <AntDesign name="plus" size={20} color={"white"} style={styles.plus} />

      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Type Here..."
        style={styles.text}
      />

      <MaterialIcons
        style={styles.send}
        onPress={onSend}
        name="send"
        size={20}
        color={"white"}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'whitesmoke',
    padding: 10,
  },
  text: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'lightgray',
  },
  plus: {
    backgroundColor: 'royalblue',
    padding: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: 'center',
    marginRight: 7,
  },
  send: {
    backgroundColor: 'royalblue',
    padding: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: 'center',
    marginLeft: 7,
  }
});

export default InputBox