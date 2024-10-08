import {
  ImageBackground,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Image,
  ToastAndroid,
} from "react-native";
import React, { useRef, useState } from "react";
import Message from "../Components/Message";
import InputBox from "../Components/Input/InputBox";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import axios from "axios";
import socketServcies from "../Utils/SocketServices";
import { useIsFocused } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { useAuth } from "../Contexts/auth";
import {
  Feather,
  FontAwesome,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import { BackHandler } from "react-native";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import { call } from "../Functions";
const Conversation = ({navigation}) => {

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
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [isActive, setIsActive] = useState("false");
  const [lastseen, setLastSeen] = useState("");
  const [user, setUser] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [blocked, setBlocked] = useState("");
  const [isBlocked, setIsBlocked] = useState("");

  const route = useRoute();
  // const navigation = useNavigation();

  useEffect(() => {
    const handleBackButton = () => {
      navigation.goBack();
      return true;
    }
    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions(
      { title: route.params.name },
      setReciever(route.params.receiver),
      setConvoId(route.params.id),
      setSender(route.params.sender),
      setRead(route.params.read),
      setName(route.params.name),
      setPhoto(route.params.photo),
      setIsActive(route.params.status),
      setLastSeen(route.params?.lastseen),
      setUser(route.params.user),
      setBlocked(route.params.blockStatus),
      setIsBlocked(route.params.isBlocked)
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
      setNewMessage(msg?.newMessage ? msg?.newMessage : msg?.reply);
      setRead(false);
    });
  }, []);

  // console.log(auth?.user);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: true,
      priority: Notifications.AndroidNotificationPriority,
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
            title: `New Message from ${newMessage.from.name}`,
            body: newMessage.message
              ? newMessage.message.message
              : "You May Have Unread Messages",
            priority: Notifications.AndroidNotificationPriority.MAX,
            sound: true,
            vibrate: 2,
          },
          trigger: null,
        });
      } catch (error) {
        console.log(error.message);
      }
    };
    useEffect(() => {
      if (
        newMessage?.message &&
        newMessage.message.reciever === auth.user._id
      ) {
        sendPushNotification();
      }
    }, [newMessage?.message]);
  }

  useEffect(() => {
    if (newMessage?.message) {
      getNotificationPermission();
    }
  }, [newMessage?.message]);

  const handleCall = async () => {
    await call(sender, reciever, name, auth?.user?.photo?.secure_url);
    navigation.navigate("Caller-Screen", {
      sender: sender,
      receiver: reciever,
      photo: photo,
      name: name,
    });
  };

  return (
    <>
      <SafeAreaView
        style={{
          // width: "100%",
          // height: "10%",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          backgroundColor: "lightblue",
          paddingVertical: 10,
          paddingTop: -20,
        }}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color={"white"}
          style={{ marginRight: 10 }}
          onPress={() => navigation.navigate("Home")}
        />
        {!photo ? (
          <FontAwesome
            name="user-circle"
            color={"lightgray"}
            size={50}
            style={{ marginRight: 10 }}
          />
        ) : (
          <>
            <TouchableOpacity
              onPress={async () =>
                navigation.navigate("User-Profile", {
                  params: {
                    user: user,
                  },
                })
              }
            >
              <Image
                source={{
                  uri: photo,
                }}
                style={styles.photo}
              />
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("User-Profile", {
              params: {
                user: user,
              },
            })
          }
          style={{ flex: 1, gap: 5 }}
        >
          <Text
            style={{ fontSize: 18, fontWeight: "bold", alignSelf: "center" }}
          >
            {name}
          </Text>
          {isActive === "true" ? (
            <Text
              style={{
                fontSize: 10,
                fontWeight: "normal",
                alignSelf: "center",
                color: "green",
              }}
            >
              Online
            </Text>
          ) : lastseen ? (
            <Text
              style={{
                fontSize: 10,
                fontWeight: "normal",
                alignSelf: "center",
                transform: [{ translateX: 0 }],
              }}
            >
              Last Seen {moment(lastseen).fromNow()}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 16,
                fontWeight: "normal",
                alignSelf: "center",
              }}
            >
              Offline
            </Text>
          )}
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "20%",
            alignSelf: "center",
          }}
        >
          <Ionicons onPress={() => handleCall()} name="call" size={24} color={"blue"} />
          <Feather name="video" size={24} color={"blue"} />
        </View>
      </SafeAreaView>
      <ImageBackground src="" style={styles.bg}>
        <FlatList
          data={chat.length > 0 ? chat : messages}
          maxToRenderPerBatch={10}
          renderItem={(items) => (
            <Message message={items} receiver={reciever} read={{ read }} />
          )}
          inverted
          style={styles.list}
        />
      </ImageBackground>
      {blocked === "false" && isBlocked === "false" ? (
        <InputBox reciever={reciever} convoId={convoId} sender={sender} />
      ) : (
        <Text style={{ alignSelf: "center", fontSize: 12 }}>
          {blocked === "true"
            ? "Can't Send Message To The Users You Blocked"
            : "The User Might Have Blocked You Or Isn't available anymore"}
        </Text>
      )}
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
  photo: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 10,
  },
});

export default Conversation;
