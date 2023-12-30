import { View, Text, StyleSheet, Pressable } from "react-native";
import moment from "moment";
import { useAuth } from "../../Contexts/auth";
import socketServcies from "../../Utils/SocketServices";
import { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import Toast from "react-native-simple-toast";

const Message = ({ message, receiver }) => {
  const [auth] = useAuth();

  const [selected, setselected] = useState("");
  const [deselect, setDeselect] = useState(false);

  const deleteMessage = async () => {
    try {
      const { data } = await axios.delete(
        `https://android-chattr-app.onrender.com/api/v1/messages/delete-message/${selected}`
      );

      if (data.success === true) {
        Toast.show(data.message);
      } else {
        Toast.show(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View
      style={{
        backgroundColor: selected ? "lightgray" : deselect === true ? "" : "",
        borderRadius: 10,
        width: "100%",
        flexDirection:
          message.item.reciever === receiver &&
          auth.user._id === message.item.sender
            ? "row-reverse"
            : "row",
        justifyContent: "space-around",
        paddingHorizontal: selected ? 8 : 0,
      }}
    >
      <View style={{ width: "100%" }}>
        <Pressable
          onLongPress={() => {
            setselected(message.item._id),
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          onPress={() => (selected ? setDeselect(true) : null)}
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
        </Pressable>
      </View>
      {selected ? (
        <MaterialIcons
          onPress={deleteMessage}
          name="delete"
          size={30}
          color={"royalblue"}
          style={{ alignSelf: "center" }}
        />
      ) : null}
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
