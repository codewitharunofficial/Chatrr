import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Image,
  ToastAndroid,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Message from "../Components/Message";
import InputBox from "../Components/Input/InputBox";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import socketServices from "../Utils/SocketServices";
import { useIsFocused } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { useAuth } from "../Contexts/auth";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { BackHandler } from "react-native";
import moment from "moment";
import { call } from "../Functions";
import { useReply, useReplyMessage } from "../Contexts/ReplyContext";

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
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [isActive, setIsActive] = useState("false");
  const [lastseen, setLastSeen] = useState("");
  const [user, setUser] = useState({});
  const [blocked, setBlocked] = useState("");
  const [isBlocked, setIsBlocked] = useState("");
  const [repliedMessage, setRepliedMessage] = useReplyMessage();
  const [isReplying, setIsReplying] = useReply();

  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    const handleBackButton = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: route.params.name,
      headerShown: false,
    });
    setReciever(route.params.receiver);
    setConvoId(route.params.id);
    setSender(route.params.sender);
    setRead(route.params.read);
    setName(route.params.name);
    setPhoto(route.params.photo);
    setIsActive(route.params.status);
    setLastSeen(route.params?.lastseen);
    setUser(route.params.user);
    setBlocked(route.params.blockStatus);
    setIsBlocked(route.params.isBlocked);
  }, [route.params]);

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
    socketServices.on("recieved-message", (msg) => {
      let cloneArray = [...messages];
      setChat(cloneArray.concat(msg.messages));
      setNewMessage(msg?.newMessage ? msg?.newMessage : msg?.reply);
      setRead(false);
    });
    return () => socketServices.off("recieved-message");
  }, [messages]);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: true,
      priority: Notifications.AndroidNotificationPriority,
    }),
  });

  const getNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync({ android: {} });
    if (status === "granted") {
      const token = await Notifications.getExpoPushTokenAsync();
      setPushToken(token.data);
    }
  };

  const sendPushNotification = async () => {
    if (!pushToken) return;
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `New Message from ${newMessage.from.name}`,
          body: newMessage.message?.message || "You May Have Unread Messages",
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
    if (newMessage?.message && newMessage.message.reciever === auth.user._id) {
      sendPushNotification();
    }
  }, [newMessage?.message]);

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
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerUserInfo}
          onPress={() => navigation.navigate("User-Profile", { params: { user } })}
        >
          {photo ? (
            <Image
              source={{ uri: photo }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <FontAwesome name="user" size={24} color="white" />
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={[
              styles.userStatus,
              { color: isActive === "true" ? "#a5d6a7" : "#bbdefb" }
            ]}>
              {isActive === "true" ? "Online" : lastseen ? `Last seen ${moment(lastseen).fromNow()}` : "Offline"}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleCall} style={styles.actionButton}>
            <Ionicons name="call" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="video" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Area with Gradient Background */}
      <View style={styles.chatContainer}>
        <View style={styles.gradientBackground} />
        <FlatList
          data={chat.length > 0 ? chat : messages}
          maxToRenderPerBatch={10}
          renderItem={(items) => (
            <Message message={items} receiver={reciever} read={{ read }} />
          )}
          inverted
          contentContainerStyle={styles.messageList}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>


      <View style={styles.inputContainer}>
        {blocked === "false" && isBlocked === "false" ? (
          <InputBox reciever={reciever} convoId={convoId} sender={sender} />
        ) : (
          <Text style={styles.blockedMessage}>
            {blocked === "true"
              ? "Can't send messages to users you've blocked"
              : "This user might have blocked you or isn't available"}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4169e1",
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerUserInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#87a1e8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  userStatus: {
    fontSize: 12,
  },
  headerActions: {
    flexDirection: "row",
    gap: 15,
  },
  actionButton: {
    padding: 5,
  },
  chatContainer: {
    flex: 1,
    position: "relative",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f0f4f8",
    opacity: 0.95,
    shadowColor: "#4169e1",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  messageList: {
    padding: 10,
    paddingBottom: 20,
  },
  inputContainer: {
    backgroundColor: "white",
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  blockedMessage: {
    textAlign: "center",
    color: "#d32f2f",
    fontSize: 14,
    padding: 10,
  },
});

export default Conversation;