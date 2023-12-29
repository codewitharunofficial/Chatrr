import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import * as Contacts from "expo-contacts";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { useAuth } from "../Contexts/auth";
import ContactList from "../Components/ContactList";

const ContactScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [convoId, setConvoId] = useState('');

  const [auth] = useAuth();
  


  //navigate
  const navigation = useNavigation();

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
  });

 
  return (
    <>
      {/* <View
        style={{
          width: "100%",
          height: "10%",
          marginTop: 20,
          marginBottom: 5,
          justifyContent: "space-between",
          flexDirection: "row",
          paddingHorizontal: 20,
        }}
      >
        <TextInput
          onChangeText={setSearch}
          placeholder="Search user..."
          editable={true}
          style={{
            height: "80%",
            width: "85%",
            backgroundColor: "whitesmoke",
            alignSelf: "center",
            borderRadius: 10,
            paddingHorizontal: 10,
          }}
        ></TextInput>
        <AntDesign name="search1" size={30} style={{ alignSelf: "center" }} />
      </View>
      {users.length > 0 ? (
        <FlatList
          style={{
            width: "70%",
            height: "20%",
            marginTop: 5,
            marginBottom: 20,
            marginLeft: 20,
            borderRadius: 20,
          }}
          data={users}
          renderItem={(items) => (
            
            <Pressable
              onPress={ async () => {
                try {
                  const { data } = await axios.post(
                    "http://192.168.82.47:6969/api/v1/messages/create-conversation",
                    { sender: auth.user._id, receiver: items.item._id }
                  );
                  console.log(data.newConvo);
                  navigation.navigate("Conversation", {
                    name: items.item.name,
                    receiver: items.item._id,
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
                source={{ uri: items?.item?.profilePhoto?.secure_url }}
                style={styles.photo}
              />
              <View style={styles.content}>
                <View style={styles.row}>
                  <Text numberOfLines={1} style={styles.name}>
                    {items.item.name}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        /> */}
      {/* ) : null}

      <Text style={{ fontWeight: "bold", alignSelf: 'center', justifyContent: 'center' }}> Total {contacts.length} contacts found </Text> */}
      
      <FlatList
        style={{ width: "100%", padding: 20, marginTop: 0 }}
        data={contacts}
        renderItem={(items) =>  <ContactList contacts={items} /> }
      />
    </>
  );
};



export default ContactScreen;
