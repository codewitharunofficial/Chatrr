import { View, TextInput, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { io } from "socket.io-client";
import axios from "axios";
import { useAuth } from "../../Contexts/auth";
import socketServcies from "../../Utils/SocketServices";
import ChatList from "../ChatListItems";
import Conversation from "../../Screens/Conversation";

const InputBox = ({ reciever , convoId, sender}) => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);

  const [auth] = useAuth();

  const qureies = {
    reciever: auth.user._id === reciever ? sender : reciever,
    sender: auth.user._id,
    message: input,
    convoId : convoId
  }


  useEffect(() => {
    socketServcies.initializeSocket()
  }, []);


  const  sendMessage = async () => {

    try {
     if(!!input) {
       socketServcies.emit('send-message', qureies);
       setInput('');
        return;
       }
       alert('Message Cannot me empty');
     
    } catch (error) {
       console.log(error.message);
    }
}



  // useEffect(() => {
  //   socketServcies.on('recieved-message', (msg) => {
  //     let cloneArray = [...chat]
  //     setChat(cloneArray.concat(msg));
  //     if(chat.length > 0) {
  //       return (
  //         <FlatList data={chat} renderItem={(items) => <Conversation messages={items} /> } />
  //       )
  //     }
  //   })
  // }, []);


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
        onPress={sendMessage}
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