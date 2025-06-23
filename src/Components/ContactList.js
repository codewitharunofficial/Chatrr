import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../Contexts/auth';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';

const ContactList = ({contacts, users}) => {

  //  const [users, setUsers] = useState([]);
  //  console.log(users);

  // const searchUser = async () => {
  //   try {
  //     const { data } = await axios.get(
  //       `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/fetch-users`
  //     );
  //     setUsers(data?.users);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   searchUser();
  // }, []);


  return (
    <>
    {
      <TouchableOpacity
      
      style={styles.container}
    >
      {/* <Image
        source={{
          uri: contacts?.item?.profilePhoto?.secure_url,
          headers: { Accept: "image/*" },
        }}
        style={styles.photo}
        width={50}
        height={50}
      /> */}
      <View style={styles.content}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.name}>
            {/* {contacts.item.name} */}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
    }
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 10,
    borderBottomWidth: 1,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,
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
export default ContactList