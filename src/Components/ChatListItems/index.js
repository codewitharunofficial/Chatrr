import moment from "moment";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  FlatList,
  Animated,
  Modal,
  Alert,
  ToastAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/auth";
import socketServcies from "../../Utils/SocketServices";
import { useIsFocused } from "@react-navigation/native";
import { Image } from "expo-image";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContacts } from "../../Contexts/ContactsContext";

const ChatList = () => {
  const navigate = useNavigation();

  const [auth] = useAuth();
  const [chats, setChat] = useState([]);
  const [chat, setChats] = useState([]);
  const isFocused = useIsFocused();
  const [convoId, setConvoId] = useState("");
  const [messagesId, setMessagesId] = useState("");
  const [lastMessage, setLastMessage] = useState({});
  const [receiverId, setReceiverId] = useState("");
  // const [active, setActive] = useState("");
  const [blocked, setBlocked] = useState([]);
  const [contacts, setContacts] = useState();

  const [read, setRead] = useState(false);

  const id = auth?.user?._id;

  useEffect(() => {
    socketServcies.initializeSocket();
  }, []);
  
  async function getContacts(){
    const data = await AsyncStorage.getItem("contacts");
      const res = JSON.parse(data);
      setContacts(res);
  }
  useEffect(() => {
    getContacts();
  }, [isFocused]);

  useEffect(() => {
    socketServcies.on("recieved-message", (msg) => {
      let cloneArray = [...chat];
      setChats(cloneArray.concat(msg));
    });
  }, []);

  useEffect(() => {
    const handleBackButton = () => {
      BackHandler.exitApp();
      ToastAndroid.show("Exited App", 2000);
    };
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, [isFocused]);

  useEffect(() => {
    setBlocked(auth?.user?.blocked_users);
  }, [isFocused]);

  const handleSwipeLeft = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/messages/delete-convo/${convoId}`,
        {
          sender: id,
          receiver: messagesId,
        }
      );
      Toast.show(data?.message);
    } catch (error) {
      console.log(error);
    }
  };

  const getChats = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/messages/chats/${id}`
      );
      // console.log(data);
      if (data?.success === true) {
        contacts?.forEach((contact) => {
          data.chats.forEach((chat) => {
             if(chat.sender.phone === contact.phone){
               chat.sender.name = contact.name;
               chats.push(chat);
               
             } else if(chat?.receiver?.phone === contact?.phone){
               chat.receiver.name = contact.name;
               chats.push(chat);
               
             } else {
               return;
             }
           });
        
        })
        AsyncStorage.setItem("chats", JSON.stringify(chats));
      }
    } catch (error) {
      console.log(error.message);
      const data = await AsyncStorage.getItem("chats");
      const allChats = JSON.parse(data);
      // console.log("Saved Chats", allChats);
      setChat(allChats);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getChats();
      setRead(false);
    }
  }, [isFocused, chat, handleSwipeLeft, auth]);

  const setMessagesAsRead = async () => {
    try {
      if (receiverId && auth?.user._id === receiverId) {
        const { data } = await axios.post(
          `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/messages/read-message/${convoId}`,
          { lastMessage: lastMessage }
        );
        // console.log(data);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socketServcies.initializeSocket();

    socketServcies.emit("connected", auth?.user?._id);
  }, []);

  return (
    <>
      {chats?.length === 0 ? (
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ fontSize: 20 }}>No Conversations</Text>
          <View style={{ padding: 20, flexDirection: "row" }}>
            <Text style={{ fontSize: 16 }}>Start One By Tapping</Text>
            <Entypo
              name="new-message"
              color={"royalblue"}
              size={24}
              style={{ marginRight: 5 }}
            />
            <Text style={{ fontSize: 16 }}>Above</Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={(items) => (
            <Swipeable
              renderLeftActions={(progress, dragX) => {
                const trans = dragX.interpolate({
                  inputRange: [0, 50, 100, 101],
                  outputRange: [20, 0, 0, 1],
                });
                return (
                  <RectButton
                    style={{
                      justifyContent: "center",
                      paddingHorizontal: 10,
                      alignItems: "center",
                      backgroundColor: "#00d4ff",
                      borderRadius: 10,
                      height: "80%",
                      marginTop: 5,
                      width: "40%",
                    }}
                    onPress={() => {
                      setConvoId("");
                    }}
                  >
                    <Animated.Text
                      style={{ transform: [{ translateX: trans }] }}
                    >
                      <MaterialIcons
                        onPress={handleSwipeLeft}
                        name="delete"
                        size={30}
                        color={"white"}
                      />
                    </Animated.Text>
                  </RectButton>
                );
              }}
              onSwipeableOpen={(left) => {
                setConvoId(items.item._id);
                setMessagesId(
                  auth.user._id === items.item.senderId
                    ? items.item.receiverId
                    : items.item.senderId
                );
              }}
              onSwipeableClose={(right) => {
                setConvoId("");
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigate.navigate("Conversation", {
                    id: items.item?._id,
                    name:
                      (auth.user?._id === items.item.senderId &&
                        items.item?.receiver?.blocked_users?.includes(
                          auth?.user?._id
                        )) ||
                      (auth?.user?._id === items.item?.receiverId &&
                        items.item?.sender?.blocked_users?.includes(
                          auth?.user?._id
                        ))
                        ? "Chatrr User"
                        : auth.user?._id === items.item.senderId
                        ? items.item?.receiver?.name
                        : items.item?.sender?.name,
                    receiver:
                      auth.user._id === items.item.senderId
                        ? items.item.receiverId
                        : items.item.senderId,
                    sender:
                      auth.user._id === items.item.senderId
                        ? items.item.senderId
                        : items.item.receiverId,
                    read: items.item.read,
                    photo:
                      auth.user?._id === items.item.senderId
                        ? items.item.receiver?.profilePhoto?.secure_url
                        : items.item.sender?.profilePhoto?.secure_url,
                    status:
                      auth.user?._id === items.item.senderId
                        ? items.item.receiver?.Is_Online
                        : items.item.sender?.Is_Online,
                    lastseen:
                      auth.user?._id === items.item.senderId
                        ? items.item.receiver?.lastseen
                        : items.item.sender?.lastseen,
                    user:
                      auth.user?._id === items.item.senderId
                        ? items.item.receiver
                        : items.item.sender,
                    blockStatus:
                      (auth?.user?._id === items.item.senderId &&
                        blocked?.includes(items.item.receiverId)) ||
                      (auth?.user?._id === items.item.receiverId &&
                        blocked?.includes(items.item.senderId))
                        ? "true"
                        : "false",
                    isBlocked:
                      (auth?.user?._id === items.item.senderId &&
                        items.item?.receiver?.blocked_users?.includes(
                          auth.user?._id
                        )) ||
                      (auth?.user?._id === items.item.receiverId &&
                        items.item?.sender?.blocked_users?.includes(
                          auth?.user?._id
                        ))
                        ? "true"
                        : "false",
                  }),
                    setConvoId(items.item._id),
                    setLastMessage(
                      items.item?.chat[items.item.chat.length - 1]
                    ),
                    setReceiverId(items.item.receiverId);
                  setMessagesAsRead();
                }}
                style={styles.container}
              >
                {!items?.item?.receiver?.profilePhoto?.secure_url ||
                !items?.item?.sender?.profilePhoto?.secure_url ? (
                  <FontAwesome
                    name="user-circle"
                    color={"lightgray"}
                    size={50}
                    style={{ marginRight: 10 }}
                  />
                ) : (
                  <Image
                    source={{
                      uri:
                        auth.user?._id === items.item.senderId
                          ? items.item.receiver.profilePhoto?.secure_url
                          : items.item.sender.profilePhoto?.secure_url,
                    }}
                    style={styles.photo}
                  />
                )}
                <View style={styles.content}>
                  <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.name}>
                      {(auth.user?._id === items.item.senderId &&
                        items.item?.receiver?.blocked_users?.includes(
                          auth?.user?._id
                        )) ||
                      (auth?.user?._id === items.item?.receiverId &&
                        items.item?.sender?.blocked_users?.includes(
                          auth?.user?._id
                        ))
                        ? "Chatrr User"
                        : auth.user?._id === items.item.senderId
                        ? items.item?.receiver?.name
                        : items.item?.sender?.name}
                    </Text>
                    <Text numberOfLines={1} style={styles.subTitle}>
                      {items.item?.chat[items.item.chat.length - 1]?.createdAt
                        ? moment(
                            items.item?.chat[items.item.chat.length - 1]
                              ?.createdAt
                          ).fromNow()
                        : null}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      numberOfLines={2}
                      style={[styles.subTitle, { width: "80%" }]}
                    >
                      {items.item?.chat[items.item.chat.length - 1]?.message
                        ?.message
                        ? items.item?.chat[
                            items.item.chat.length - 1
                          ]?.message?.message?.slice(0, 40)
                        : auth.user?._id ===
                            items.item.chat[items.item.chat.length - 1]
                              ?.sender &&
                          items.item.chat[items.item.chat.length - 1]?.message
                            ?.asset_id
                        ? "You Sent An Attachment"
                        : auth.user?._id ===
                            items.item.chat[items.item.chat.length - 1]
                              ?.reciever &&
                          items.item.chat[items.item.chat.length - 1]?.message
                            ?.asset_id
                        ? `${items.item?.sender?.name} Sent you An Attachment`
                        : null}
                    </Text>
                    {items.item.chat[items.item.chat.length - 1]?.message
                      ?.asset_id ? (
                      <Entypo
                        style={{ marginLeft: -60, marginTop: 3 }}
                        name="attachment"
                        size={16}
                        color={"purple"}
                      />
                    ) : null}

                    {items.item?.read === false &&
                    auth.user?._id === items.item.receiverId ? (
                      <>
                        {items.item.chat.length === 0 ? null : (
                          <View
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor: "purple",
                              borderRadius: 20,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text style={{ color: "white" }}>
                              {items.item.chat?.length >= 2
                                ? items.item.chat?.length - 1
                                : items.item.chat?.length}
                            </Text>
                          </View>
                        )}
                      </>
                    ) : null}
                  </View>
                  {(items.item.senderId === auth.user?._id &&
                    items.item?.receiver?.Is_Online === "true") ||
                  (items.item.receiverId === auth.user?._id &&
                    items.item?.sender?.Is_Online === "true") ? (
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.subTitle,
                        { alignSelf: "flex-end", color: "green" },
                      ]}
                    >
                      Online
                    </Text>
                  ) : (
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.subTitle,
                        { alignSelf: "flex-end", color: "gray" },
                      ]}
                    >
                      Offline
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      )}
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
