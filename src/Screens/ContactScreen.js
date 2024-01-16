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
import { FlashList } from "@shopify/flash-list/src";

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
      
      <FlashList
        contentContainerStyle={{ padding: 20, }}
        data={contacts}
        renderItem={(items) =>  <ContactList contacts={items} /> }
        estimatedItemSize={100}
      />

  );
};



export default ContactScreen;
