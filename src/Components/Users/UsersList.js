import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../Contexts/auth";
import axios from "axios";

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
        <Pressable
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
                id: data.newConvo,
              });
            } catch (error) {
              console.log(error.message);
            }
          }}
          style={styles.container}
        >
          <Image
            source={{
              uri: users?.item?.profilePhoto?.secure_url,
              headers: { Accept: "image/*" },
            }}
            style={styles.photo}
            width={50}
            height={50}
          />
          <View style={styles.content}>
            <View style={styles.row}>
              <Text numberOfLines={1} style={styles.name}>
                {users.item.name}
              </Text>
            </View>
          </View>
        </Pressable>
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

export default UsersList;
