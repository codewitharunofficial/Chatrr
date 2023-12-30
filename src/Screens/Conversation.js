import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  Button,
} from "react-native";
import React, { useState } from "react";
import Message from "../Components/Message";
import InputBox from "../Components/Input/InputBox";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import axios from "axios";
import socketServcies from "../Utils/SocketServices";
import { useIsFocused } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { useAuth } from "../Contexts/auth";

const Conversation = () => {
  const [reciever, setReciever] = useState("");
  const [convoId, setConvoId] = useState("");
  const [sender, setSender] = useState("");
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState([]);
  const isFocused = useIsFocused();
  const [newMessage, setNewMessage] = useState({});
  const [auth] = useAuth();
  const [pushToken, setPushToken] = useState([]);

  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions(
      { title: route.params.name },
      setReciever(route.params.receiver),
      setConvoId(route.params.id),
      setSender(route.params.sender)
    );
  }, [route.params.name]);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.post(
        "https://android-chattr-app.onrender.com/api/v1/messages/fetch-messages",
        { sender, reciever }
      );
      setMessages(data.messages);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchMessages();
    }
  }, [isFocused, sender, reciever, messages]);

  useEffect(() => {
    socketServcies.initializeSocket();
  }, []);

  useEffect(() => {
    socketServcies.on("recieved-message", (msg) => {
      let cloneArray = [...messages];
      setChat(cloneArray.concat(msg.messages));
      setNewMessage(msg.newMessage);
    });
  }, []);


  const getNotificationPermission = async () => {
    const {status} = await Notifications.requestPermissionsAsync({
      android: {},
    });

    if(status === 'granted') {
      const token = await Notifications.getExpoPushTokenAsync();
      const expoPushToken = token.data;
      setPushToken(expoPushToken);
    }
  };

    if(pushToken) {
      const sendPushNotification = async (pushToken, newMessage) => {
        try {
          await Notifications.scheduleNotificationAsync({
            content:{
              title: `New Message`,
              body: newMessage?.message
            },
            trigger: null
          });
          console.log("Notification Been Pushed Successfully");
        } catch (error) {
          console.log(error.message);
        }
      }
      useEffect(() => {
        if(auth.user._id === newMessage.reciever){

          sendPushNotification();
        }
      }, [pushToken, newMessage]);
    }



  useEffect(() => {
    if(newMessage.length > 0 && newMessage?.reciever === auth.user._id){
      getNotificationPermission();
    }
  }, [newMessage.length, newMessage?.reciever === auth.user._id]);

  
  return (
    <>
      <ImageBackground
        src="https://img.freepik.com/premium-photo/concept-important-announcement-with-empty-speech-bubbles_185193-87043.jpg"
        style={styles.bg}
      >
        <FlatList
          data={chat.length > 0 ? chat : messages}
          renderItem={(items) => (
            <Message message={items} receiver={reciever} />
          )}
          inverted
          style={styles.list}
        />
      </ImageBackground>
      <InputBox reciever={reciever} convoId={convoId} sender={sender} />
    </>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  list: {
    padding: 10,
    marginVertical: 10,
  },
});

export default Conversation;
