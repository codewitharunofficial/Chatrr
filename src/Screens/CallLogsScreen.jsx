import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import socketServcies from "../Utils/SocketServices";
import { useAuth } from "../Contexts/auth";
import { FlatList } from "react-native-gesture-handler";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { call } from "../Functions";

const CallLogsScreen = ({ navigation }) => {
  const [auth] = useAuth();
  const [callLogs, setCallLogs] = useState([]);

  useEffect(() => {
    socketServcies.emit("call-logs", { sender: auth?.user?._id });
    socketServcies.on("call-logs", ({ calls }) => {
      if (calls?.length > 0) {
        setCallLogs(calls);
      }
    });
  }, [auth?.user?._id]);

  const handleCall = async (participants) => {
    console.log(participants.sender === auth.user._id);
    if (participants.sender === auth?.user?._id) {
      await call(
        participants.sender,
        participants.receiver,
        participants.senderName,
        participants.senderPhoto
      );
    } else {
      await call(
        participants.receiver,
        participants.sender,
        participants.receiverName,
        participants.receiverPhoto
      );
    }
    navigation.navigate("Caller-Screen", {
      sender:
        participants.sender === auth?.user?._id
          ? participants.receiver
          : participants.sender,
      receiver:
        participants.sender === auth?.user?._id
          ? participants.sender
          : participants.receiver,
      photo:
        participants.sender === auth?.user?._id
          ? participants.receiverPhoto
          : participants.senderPhoto,
      name:
        participants.sender === auth?.user?._id
          ? participants.receiverName
          : participants.senderName,
    });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            width: "100%",
            borderWidth: StyleSheet.hairlineWidth,
            paddingVertical: 10,
            alignSelf: "center",
            flexDirection: "row",
            gap: 20,
            paddingHorizontal: 20,
            justifyContent: "center",
            height: "10%",
          }}
        >
          <Text
            style={{
              color: "royalblue",
              fontSize: 15,
              fontWeight: "bold",
              alignSelf: "center",
            }}
          >
            Call Logs
          </Text>
        </TouchableOpacity>
        {callLogs?.length > 0 ? (
          <FlatList
            contentContainerStyle={{ gap: 15 }}
            data={callLogs}
            renderItem={(items) => (
              <TouchableOpacity
                onPress={() => handleCall(items.item)}
                style={{
                  width: "100%",
                  height: "auto",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  padding: 10,
                }}
              >
                {(items.item?.sender === auth?.user?._id &&
                  items.item?.receiverPhoto) ||
                (items.item?.receiver === auth?.user?._id &&
                  items.item?.senderPhoto) ? (
                  <Image
                    source={{
                      uri:
                        items.item.sender === auth?.user?._id
                          ? items.item?.receiverPhoto
                          : items.item?.senderPhoto,
                    }}
                    style={styles.photo}
                  />
                ) : (
                  <FontAwesome
                    name="user-circle"
                    color={"lightgray"}
                    size={50}
                    style={{ marginRight: 10 }}
                  />
                )}

                <Text style={{ fontWeight: "bold", fontSize: 20, flex: 1 }}>
                  {items.item.sender === auth?.user?._id
                    ? items.item?.receiverName
                    : items.item?.senderName}
                </Text>
                {!items.item?.duration &&
                items.item.receiver === auth?.user?._id ? (
                  <TouchableOpacity>
                    <MaterialIcons name="call-missed" size={30} color={"red"} />
                  </TouchableOpacity>
                ) : !items.item?.duration &&
                  items.item.sender === auth?.user?._id ? (
                  <TouchableOpacity>
                    <MaterialIcons
                      name="call-missed-outgoing"
                      size={30}
                      color={"red"}
                    />
                  </TouchableOpacity>
                ) : items.item?.duration &&
                  items.item.sender === auth?.user?._id ? (
                  <TouchableOpacity>
                    <MaterialIcons name="call-made" size={30} color={"green"} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity>
                    <MaterialIcons
                      name="call-received"
                      size={30}
                      color={"blue"}
                    />
                  </TouchableOpacity>
                )}
                <Text style={{ color: "gray", alignSelf: "flex-end" }}>
                  {moment(items.item.date).fromNow()}
                </Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: "80%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "600", color: "black" }}>
              No Calls Found
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
  },
  text: {
    alignSelf: "center",
    fontSize: 24,
  },
  camera: {},
  camContainer: {
    width: "100%",
    height: "80%",
    justifyContent: "flex-end",
    gap: 10,
    position: "absolute",
    bottom: 20,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
});

export default CallLogsScreen;
