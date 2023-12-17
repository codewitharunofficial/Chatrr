import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
} from "react-native";
import * as Contacts from "expo-contacts";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const ContactScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [reciever, setReciever] = useState([]);

  const [users, setUsers] = useState([]);

  


  //navigate
  const navigation = useNavigation();

  const getUsers = async () => {
    const {data} = await axios.get('http://192.168.112.47:6969/api/v1/users/fetch-users');
    console.log(data);
    setUsers(data.user);
  }

  useEffect(() => {
      getUsers();
  },[])


  const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
      });
      if (data.length > 0) {
        setContacts(data);
      }
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <>
      <Text style={{ fontWeight: "bold" }}>{contacts.length}</Text>
      <FlatList
        style={{ width: "100%", padding: 20, marginTop: 50 }}
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={(items) => (
          <Pressable
            onPress={() => {setReciever(items.item.phoneNumbers[0].number); console.log(reciever); navigation.navigate('Login', {phone: items.item.phoneNumbers[0].number, name: items.item.name})} }
            key={items.item.id}
            style={{
              flexDirection: "row",
              marginHorizontal: 10,
              marginVertical: 20,
            }}
          >
            <View
              style={{
                flex: 1,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: "lightgray",
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Image
                src={
                  items.item.imageAvailable == true ? items.item.image.uri : ""
                }
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 30,
                  marginRight: 30,
                  marginBottom: 10
                }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  marginBottom: 5,
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 18, flex: 1, flexWrap: 'wrap' }}>
                  {items.item.name}
                </Text>
                <Text style={{ color: "grey" }}>
                  {items.item.phoneNumbers &&
                    items.item.phoneNumbers[0] &&
                    items.item.phoneNumbers[0].number}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </>
  );
};

export default ContactScreen;
