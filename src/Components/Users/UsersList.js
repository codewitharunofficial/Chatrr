import { View, Text, Pressable, Image, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../Contexts/auth'
import axios from 'axios'

const UsersList = ({ users }) => {

    const navigation = useNavigation();



  return (
    <Pressable
              onPress={ async () => {
                try {
                  const { data } = await axios.post(
                    "https://android-chattr-app.onrender.com/api/v1/messages/create-conversation",
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
                source={{ uri: users?.item?.profilePhoto?.url }}
                style={styles.photo}
              />
              <View style={styles.content}>
                <View style={styles.row}>
                  <Text numberOfLines={1} style={styles.name}>
                    {users.item.name}
                  </Text>
                </View>
              </View>
            </Pressable>
  )
}

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

export default UsersList