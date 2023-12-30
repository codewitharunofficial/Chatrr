import moment from "moment";
import { Text, Pressable, StyleSheet, View, FlatList, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/auth";
import socketServcies from "../../Utils/SocketServices";
import { useIsFocused } from "@react-navigation/native";
import {Image} from 'expo-image';
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Toast from 'react-native-simple-toast';
import { BackHandler } from "react-native";

const ChatList = () => {

  const navigate = useNavigation();

  const [auth] = useAuth();
  const [chats, setChat] = useState([]);
  const [chat, setChats] = useState([]);
  const isFocused = useIsFocused();
  const [convoId, setConvoId] = useState('');
  const [messagesId, setMessagesId] = useState('');

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

  useEffect(() => {
    const handleBackButton = () => true;
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return() => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    }
  }, []);

  const handleSwipeLeft = async () => {
    try {
    const {data} = await axios.post(`https://android-chattr-app.onrender.com/api/v1/messages/delete-convo/${convoId}`, {
            sender: id,
            receiver: messagesId
          });
      console.log(data);
      Toast.show(data?.message);
      
    } catch (error) {
      console.log(error);
    }
  }

  const getChats = async () => {
    try {
      const { data } = await axios.get(
        `https://android-chattr-app.onrender.com/api/v1/messages/chats/${id}`
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
  }, [isFocused, chat, handleSwipeLeft]);

  

  return (
    <>
    <FlatList
    data={chats}
    renderItem={(items) => (
      <Swipeable renderLeftActions={(progress, dragX) => {
        const trans = dragX.interpolate({
          inputRange: [0, 50, 100, 101],
          outputRange: [-20, 0, 0, 1]
        });
        return (
          <RectButton style={{justifyContent: 'center', paddingHorizontal: 30, alignItems: 'center', paddingBottom: 10, backgroundColor: 'red', }} onPress={() => {setConvoId('');}} >
            <Animated.Text style={{transform: [{translateX: trans}]}} >
               <MaterialIcons onPress={handleSwipeLeft} name="delete" size={30} color={'white'} />
            </Animated.Text>

          </RectButton>
        )
      }} onSwipeableOpen={(left) => {setConvoId(items.item._id); setMessagesId(auth.user._id === items.item.senderId ? items.item.receiverId : items.item.senderId)}} onSwipeableClose={(right) => {setConvoId('');}} >
      <Pressable
      onPress={() =>
        navigate.navigate("Conversation", {
          id: items.item._id,
          name: auth.user._id === items.item.senderId ? items.item?.receiver.name : items.item.sender.name,
          receiver: auth.user._id === items.item.senderId ? items.item.receiverId : items.item.senderId,
          sender: auth.user._id === items.item.senderId ? items.item.senderId : items.item.receiverId
        })
      }
      style={styles.container}
    >
      {
        !items?.item?.receiver?.profilePhoto?.secure_url || !items?.item?.sender?.profilePhoto?.secure_url ? (
          <FontAwesome name="user-circle" color={"lightgray"} size={50} style={{marginRight:10}} />
        ) : (
          <Image
        source ={{uri: auth.user._id === items.item.senderId ? items.item.receiver.profilePhoto?.secure_url : items.item.sender.profilePhoto?.secure_url}}

        style={styles.photo}

      />
        )
      }
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
    </Swipeable>
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
