import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import socketServices from "../Utils/SocketServices";
import { useAuth } from "../Contexts/auth";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { call } from "../Functions";

const CallLogsScreen = ({ navigation }) => {
  const [auth] = useAuth();
  const [callLogs, setCallLogs] = useState([]);

  useEffect(() => {
    socketServices.emit("call-logs", { sender: auth?.user?._id });
    socketServices.on("call-logs", ({ calls }) => {
      if (calls?.length > 0) {
        setCallLogs(calls);
      }
    });
  }, [auth?.user?._id]);

  const handleCall = async (participants) => {
    const isSender = participants.sender === auth?.user?._id;
    await call(
      isSender ? participants.sender : participants.receiver,
      isSender ? participants.receiver : participants.sender,
      isSender ? participants.senderName : participants.receiverName,
      isSender ? participants.senderPhoto : participants.receiverPhoto
    );

    navigation.navigate("Caller-Screen", {
      sender: isSender ? participants.receiver : participants.sender,
      receiver: isSender ? participants.sender : participants.receiver,
      photo: isSender ? participants.receiverPhoto : participants.senderPhoto,
      name: isSender ? participants.receiverName : participants.senderName,
    });
  };

  const renderItem = ({ item }) => {
    const isSender = item.sender === auth?.user?._id;
    const name = isSender ? item.receiverName : item.senderName;
    const photo = isSender ? item.receiverPhoto : item.senderPhoto;
    const time = moment(item.date).fromNow();

    let icon, color;
    if (!item.duration && item.receiver === auth?.user?._id) {
      icon = "call-missed";
      color = "red";
    } else if (!item.duration) {
      icon = "call-missed-outgoing";
      color = "red";
    } else if (isSender) {
      icon = "call-made";
      color = "green";
    } else {
      icon = "call-received";
      color = "blue";
    }

    return (
      <TouchableOpacity style={styles.card} onPress={() => handleCall(item)}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.avatar} />
        ) : (
          <FontAwesome name="user-circle" size={50} color="lightgray" />
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <MaterialIcons name={icon} size={28} color={color} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Call Logs</Text>
      </View>
      {callLogs.length > 0 ? (
        <FlatList
          data={callLogs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No Calls Found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fa",
  },
  header: {
    backgroundColor: "#4169e1",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  time: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
});

export default CallLogsScreen;
