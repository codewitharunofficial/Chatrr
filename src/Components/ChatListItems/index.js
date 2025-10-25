import moment from "moment";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  FlatList,
  Animated,
  ToastAndroid,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/auth";
import socketServices from "../../Utils/SocketServices";
import { useIsFocused } from "@react-navigation/native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChatListSkeleton from "../../SkeletonScreens/ChatListSkeleton";
import {
  sendPushNotification,
  sendPushNotificationForIncomingCall,
} from "../../Functions";
import { Options } from "../../Contexts/options";
import * as Updates from "expo-updates";
import { useTheme } from "../../Contexts/Theme";

const ChatList = () => {
  const [auth] = useAuth();
  const [chats, setChat] = useState([]);
  const [chat, setChats] = useState([]);
  const isFocused = useIsFocused();
  const [convoId, setConvoId] = useState("");
  const [messagesId, setMessagesId] = useState("");
  const [lastMessage, setLastMessage] = useState({});
  const [receiverId, setReceiverId] = useState("");
  const [blocked, setBlocked] = useState([]);
  const [savedChats, setSavedChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const { options, setOptions } = useContext(Options);
  const { width } = Dimensions.get("window");
  const [theme] = useTheme();
  const [read, setRead] = useState(false);
  const [opened, setOpened] = useState(false);
  const navigation = useNavigation();
  const id = auth?.user?._id;

  let dummy = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    socketServices.initializeSocket();
    socketServices.emit("connected", auth?.user?._id);
    return () => socketServices.off();
  }, []);

  useEffect(() => {
    socketServices.on("recieved-message", (msg) => {
      setChats((prevChats) => [...prevChats, msg]);
    });
    return () => socketServices.off("recieved-message");
  }, []);

  useEffect(() => {
    const handleBackButton = () => {
      BackHandler.exitApp();
      ToastAndroid.show("Exited App", 2000);
    };
    const backhandler = BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => backhandler.remove();
  }, [isFocused]);


  useEffect(() => {
    setBlocked(auth?.user?.blocked_users);
  }, [isFocused]);

  const handleSwipeLeft = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/messages/delete-convo/${convoId}`,
        { sender: id, receiver: messagesId }
      );
      Toast.show(data?.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socketServices.on("incoming-call", ({ sender, senderPhoto, name, receiver, callId }) => {
      if (receiver === id) {
        navigation.navigate("Receiver-Screen", { peerId: sender, profilePhoto: senderPhoto, callId });
        sendPushNotificationForIncomingCall(name, senderPhoto);
      }
    });
  }, []);

  async function getSavedChats() {
    setLoading(true);
    try {
      const data = JSON.parse(await AsyncStorage.getItem("chats")) || [];
      if (data)
        return data;
    } catch (error) {
      console.log("Error loading saved chats:", error);
    }
    setLoading(false);
  }


  const getChats = async () => {
    setLoading(true);
    const data = await getSavedChats();
    setChat(data);
    try {
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/messages/chats/${id}`
      );
      if (data?.success) {
        setChat(data?.chats);
        AsyncStorage.setItem("chats", JSON.stringify(data.chats));
      }
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
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
        await axios.post(
          `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/messages/read-message/${convoId}`,
          { lastMessage }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function checkUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          Toast.show("New update available! Restarting...");
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.log("Update check failed:", error);
      }
    }
    checkUpdates();
  }, []);

  const renderChatItem = ({ item }) => (
    <Swipeable
      renderLeftActions={(progress, dragX) => {
        const trans = dragX.interpolate({
          inputRange: [0, 25, 100, 101],
          outputRange: [-20, 0, 0, 1],
        });
        return (
          <RectButton
            style={styles.deleteButton}
            onPress={() => setConvoId("")}
          >
            <Animated.View style={{ transform: [{ translateX: trans }] }}>
              <MaterialIcons name="delete" size={24} color="white" onPress={handleSwipeLeft} />
            </Animated.View>
          </RectButton>
        );
      }}
      onSwipeableOpen={(left) => {
        setOpened(true);
        setConvoId(item._id);
        setMessagesId(auth.user._id === item.senderId ? item.receiverId : item.senderId);
      }}
      onSwipeableClose={() => {
        setOpened(false);
        setConvoId("");
      }}
    >
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() => {
          navigation.navigate("Conversation", {
            id: item._id,
            name: (auth.user?._id === item.senderId && item?.receiver?.blocked_users?.includes(auth?.user?._id)) ||
              (auth?.user?._id === item?.receiverId && item?.sender?.blocked_users?.includes(auth?.user?._id))
              ? "Chatrr User"
              : auth.user?._id === item.senderId ? item?.receiver?.name : item?.sender?.name,
            receiver: auth.user._id === item.senderId ? item.receiverId : item.senderId,
            sender: auth.user._id === item.senderId ? item.senderId : item.receiverId,
            read: item.read,
            photo: auth.user?._id === item.senderId ? item.receiver?.profilePhoto?.secure_url : item.sender?.profilePhoto?.secure_url,
            status: auth.user?._id === item.senderId ? item.receiver?.Is_Online : item.sender?.Is_Online,
            lastseen: auth.user?._id === item.senderId ? item.receiver?.lastseen : item.sender?.lastseen,
            user: auth.user?._id === item.senderId ? item.receiver : item.sender,
            blockStatus: (auth?.user?._id === item.senderId && blocked?.includes(item.receiverId)) ||
              (auth?.user?._id === item.receiverId && blocked?.includes(item.senderId)) ? "true" : "false",
            isBlocked: (auth?.user?._id === item.senderId && item?.receiver?.blocked_users?.includes(auth.user?._id)) ||
              (auth?.user?._id === item.receiverId && item?.sender?.blocked_users?.includes(auth.user?._id)) ? "true" : "false",
          });
          setConvoId(item._id);
          setLastMessage(item?.chat[item.chat.length - 1]);
          setReceiverId(item.receiverId);
          setMessagesAsRead();
        }}
      >
        <View style={styles.avatarContainer}>
          {(!item?.receiver?.profilePhoto?.secure_url && !item?.sender?.profilePhoto?.secure_url) ? (
            <View style={styles.avatarPlaceholder}>
              <FontAwesome name="user" size={24} color="white" />
            </View>
          ) : (
            <Image
              source={{ uri: auth.user?._id === item.senderId ? item.receiver?.profilePhoto?.secure_url : item.sender?.profilePhoto?.secure_url }}
              style={styles.avatar}
            />
          )}
          {(item.senderId === auth.user?._id && item?.receiver?.Is_Online === "true") ||
            (item.receiverId === auth.user?._id && item?.sender?.Is_Online === "true") ? (
            <View style={styles.onlineIndicator} />
          ) : null}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>
              {(auth.user?._id === item.senderId && item?.receiver?.blocked_users?.includes(auth?.user?._id)) ||
                (auth?.user?._id === item?.receiverId && item?.sender?.blocked_users?.includes(auth?.user?._id))
                ? "Chatrr User"
                : auth.user?._id === item.senderId ? item?.receiver?.name : item?.sender?.name}
            </Text>
            <Text style={styles.timestamp}>
              {item?.chat[item.chat.length - 1]?.createdAt ? moment(item?.chat[item.chat.length - 1]?.createdAt).fromNow() : ""}
            </Text>
          </View>

          <View style={styles.messagePreview}>
            <Text style={styles.messageText} numberOfLines={1}>
              {item?.chat[item.chat.length - 1]?.message?.message
                ? item?.chat[item.chat.length - 1]?.message?.message.slice(0, 40)
                : auth.user?._id === item.chat[item.chat.length - 1]?.sender && item.chat[item.chat.length - 1]?.message?.asset_id
                  ? "You sent an attachment"
                  : auth.user?._id === item.chat[item.chat.length - 1]?.reciever && item.chat[item.chat.length - 1]?.message?.asset_id
                    ? "Attachment received"
                    : ""}
            </Text>
            {item.chat[item.chat.length - 1]?.message?.asset_id && (
              <Entypo name="attachment" size={14} color="#7e57c2" style={styles.attachmentIcon} />
            )}
            {item?.read === false && auth.user?._id === item.receiverId && item.chat.length > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>
                  {item.chat?.length >= 2 ? item.chat?.length - 1 : item.chat?.length}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      {!loading && savedChats.length < 1 && chats.length < 1 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Conversations Yet</Text>
          <TouchableOpacity
            style={styles.startChatButtonEmpty}
            onPress={() => navigation.navigate("Contacts")}
          >
            <Text style={styles.startChatText}>Start a Chat</Text>
            <MaterialCommunityIcons name="message-plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ) : loading && chats.length < 1 && savedChats.length < 1 ? (
        <FlatList
          data={dummy}
          renderItem={() => <ChatListSkeleton />}
          contentContainerStyle={styles.skeletonList}
        />
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.chatList}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Contacts")}
      >
        <MaterialCommunityIcons name="message-plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  chatList: {
    padding: 10,
  },
  chatCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    marginVertical: 5,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4169e1",
    justifyContent: "center",
    alignItems: "center",
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4caf50",
    position: "absolute",
    bottom: 2,
    right: 2,
    borderWidth: 2,
    borderColor: "white",
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#757575",
  },
  messagePreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  messageText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  attachmentIcon: {
    marginRight: 4,
  },
  unreadBadge: {
    backgroundColor: "#4169e1",
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  unreadCount: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#ef5350",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "90%",
    borderRadius: 12,
    marginVertical: 5,
    marginLeft: 10,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4169e1",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  startChatButtonEmpty: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4169e1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
  },
  startChatText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  skeletonList: {
    padding: 10,
  },
});

export default ChatList;