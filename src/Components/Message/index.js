import { View, Text, StyleSheet } from "react-native";
import moment from "moment";
import { useAuth } from "../../Contexts/auth";
import socketServcies from "../../Utils/SocketServices";
import { useEffect, useState } from "react";

const Message = ({ message, receiver }) => {
  const [auth] = useAuth();
  const [chats, setChats] = useState([]);
  
  useEffect(() => {
    socketServcies.initializeSocket()
  }, []);


  useEffect(() => {
    socketServcies.on('recieved-message', (msg) => {
      let cloneArray = [...chats]
      setChats(cloneArray.concat(msg));
    })
  }, []);

  
  return (
    
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            message.item.reciever === receiver &&
            auth.user._id === message.item.sender
              ? "#DCF8C5"
              : "white",

          alignSelf:
            message.item.reciever === receiver &&
            auth.user._id === message.item.sender
              ? "flex-end"
              : "flex-start",
        },
      ]}
    >
          
              <Text>{message.item.message}</Text>

      <Text style={styles.time}>
        {moment(message.item.createdAt).fromNow()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    margin: 5,
    padding: 10,
    borderRadius: 5,
    maxWidth: "80%",
  },
  time: {
    color: "green",
    alignSelf: "flex-end",
  },
});

export default Message;
