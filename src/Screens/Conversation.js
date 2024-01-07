import { ImageBackground, StyleSheet, FlatList } from "react-native";
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
import Modal from "../Components/Modal/Modal";

const Conversation = () => {
  const [reciever, setReciever] = useState("");
  const [convoId, setConvoId] = useState("");
  const [sender, setSender] = useState("");
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState([]);
  const isFocused = useIsFocused();
  const [newMessage, setNewMessage] = useState([]);
  const [auth] = useAuth();
  const [pushToken, setPushToken] = useState([]);
  const [read, setRead] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions(
      { title: route.params.name },
      setReciever(route.params.receiver),
      setConvoId(route.params.id),
      setSender(route.params.sender),
      setRead(route.params.read)
    );
  }, [route.params.name]);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/messages/fetch-messages`,
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

  //marking messages as seen

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: true
    }),
  });

  const getNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync({
      android: {},
    });

    if (status === "granted") {
      const token = await Notifications.getExpoPushTokenAsync();
      const expoPushToken = token.data;
      setPushToken(expoPushToken);
    }
  };

  if (pushToken) {
    const sendPushNotification = async () => {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `New Message`,
            body: newMessage.message ? newMessage.message.message : 'Unread Message from Arun',
            priority: Notifications.AndroidNotificationPriority,
            sound: true,
            vibrate: 2
          },
          trigger: null,
        });
      } catch (error) {
        console.log(error.message);
      }
    };
    useEffect(() => {
      if(newMessage?.message && newMessage.message.reciever === auth.user._id){
        sendPushNotification();
      }
    }, [newMessage?.message]);
  }


  useEffect(() => {
    if(newMessage?.message){
      getNotificationPermission();
    }
  }, [newMessage?.message]);


  return (
    <>
      <ImageBackground src="" style={styles.bg}>
        <FlatList
          data={chat.length > 0 ? chat : messages}
          renderItem={(items) => (
            <Message message={items} receiver={reciever} read={{read}} />
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
    backgroundColor: "white",
  },
  list: {
    padding: 10,
    marginVertical: 10,
  },
});

export default Conversation;
