import moment from "moment";
import { Text, Pressable, Image, StyleSheet, View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/auth";
import socketServcies from "../../Utils/SocketServices";
import { useIsFocused } from "@react-navigation/native";

const ChatList = () => {

  const navigate = useNavigation();

  const [auth] = useAuth();
  const [chats, setChat] = useState([]);
  const [chat, setChats] = useState([]);
  const isFocused = useIsFocused();

  const id = auth?.user?._id;


  useEffect(() => {
    socketServcies.initializeSocket()
  }, []);


  useEffect(() => {
    socketServcies.on('recieved-message', (msg) => {
      let cloneArray = [...chat]
      setChats(cloneArray.concat(msg));
    })
  }, []);

  const getChats = async () => {
    try {
      const { data } = await axios.get(
        `http://192.168.161.47:6969/api/v1/messages/chats/${id}`
      );
      // console.log(data);
      if (data?.success === true) {
        setChat(data.chats);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if(isFocused){
      getChats();
    }
  }, [isFocused]);

  // console.log(chat[0]);

  return (
    <>
    <FlatList
    data={chats}
    renderItem={(items) => (
      
      <Pressable
      onPress={() =>
        navigate.navigate("Conversation", {
          id: items.item._id,
          name: auth.user._id === items.item.senderId ? items.item?.receiver.name : items.item.sender.name,
          receiver: auth.user._id === items.item.senderId ? items.item.receiver._id : items.item.sender._id,
          sender: auth.user._id === items.item.senderId ? items.item.senderId : items.item.receiver._id
        })
      }
      style={styles.container}
    >
      <Image
        source={{uri: auth.user._id === items.item.senderId ? items.item.receiver.profilePhoto.url : items.item.sender.profilePhoto.url}}
        style={styles.photo}
      />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.name}>
            {auth.user._id === items.item.senderId ? items.item?.receiver.name : items.item.sender.name}
          </Text>
          <Text numberOfLines={1} style={styles.subTitle}>
            {moment(items.item?.chat[0]?.updatedAt).fromNow()}
          </Text>
        </View>
          <Text style={styles.subTitle} >{items.item?.chat[0]?.message}</Text>
        
        <Text numberOfLines={2} style={styles.subTitle}>
        </Text>
      </View>
    </Pressable>
    )}
    />
         
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,
    // backgroundColor: 'teal',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  name: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
  },
  subTitle: {
    color: "grey",
  },
});

export default ChatList;
