import { View, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { io } from "socket.io-client";
import axios from "axios";
import { useAuth } from "../../Contexts/auth";

const InputBox = ({ reciever }) => {
  const [input, setInput] = useState("");

  const [auth] = useAuth();

  const qureies = {
    reciever: reciever,
    sender: auth.user._id,
    message: input
  }

  const onSend = () => {

    const  sendMessage = async () => {

         try {

          const {data} = await axios.post(`https://android-chattr-app.onrender.com/api/v1/messages/send-message`, qureies);
          console.log(data);
          setInput("");
          
         } catch (error) {
            console.log(error.message);
         }

    }

    
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