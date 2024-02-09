import { View, Text, TouchableOpacity, Image, StyleSheet, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../Contexts/auth";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";

const UsersList = ({ users }) => {
  const navigation = useNavigation();
  const [auth] = useAuth();
  const isFocused = useIsFocused();

  const [blockedUsers, setBlockedusers] = useState([]);
  const [isBlocked, setIsBlocked] = useState();
  useEffect(()=> {
    if(isFocused){
      setBlockedusers(auth?.user?.blocked);
    }
}, [isFocused]);

  return (
    <>
      {users?.item?.blocked_users.includes(auth?.user?._id) ? null : (
        <TouchableOpacity
          onPress={async () => {
            try {
              const { data } = await axios.post(
                `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/messages/create-conversation`,
                { sender: auth.user._id, receiver: users.item._id }
              );
              console.log(data.newConvo);
              navigation.navigate("Conversation", {
                name: users.item.name,
                receiver: users.item._id,
                sender: auth.user._id,
                photo: users.item?.profilePhoto?.secure_url,
                id: data.newConvo,
                blockStatus: users?.item?.blocked_users?.includes(auth.user?._id) ? "true" : "false",
                isBlocked: blockedUsers?.includes(users.item?._id) ? "true" : 'false',
                status: users.item?.Is_online === "true" ? "true" : "false",
                lastseen: users.item?.lastseen,
                user: users.item
              });
            } catch (error) {
              console.log(error.message);
            }
          }}
          style={styles.container}
        >
          {
            users?.item?.profilePhoto ? (
              <Image
            source={{
              uri: users?.item?.profilePhoto?.secure_url,
              headers: { Accept: "image/*" },
            }}
            style={styles.photo}
            width={50}
            height={50}
          />
            ) : (
              <FontAwesome onPress={() => ToastAndroid.show("No Photo Available", 2000)} style={styles.photo} name="user-circle" color={"lightgray"} size={50} />
            )
          }
          <View style={styles.content}>
            <View style={styles.row}>
              <Text numberOfLines={1} style={styles.name}>
                {users.item.name}
              </Text>
              <Text numberOfLines={1} style={styles.subTitle}>
                {users.item.phone}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 10,
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
  },
  photo: {
    borderRadius: 30,
    marginRight: 10,
    marginBottom: 12
  },
  content: {
    flex: 1,
    // backgroundColor: 'teal',
  },
  row: {
    display: "flex",
    flexDirection: "column",
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

export default UsersList;
