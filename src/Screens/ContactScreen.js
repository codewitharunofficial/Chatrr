import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  ToastAndroid,
} from "react-native";
import * as Contacts from "expo-contacts";
import { useEffect, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../Contexts/auth";
import ContactList from "../Components/ContactList";
import { FlashList } from "@shopify/flash-list/src";
import UsersList from "../Components/Users/UsersList";
const ContactScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  // const [registeredContacts, setRegisteredContacts] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [auth] = useAuth();

  //navigate
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({});
      if (data.length > 0) {
        setContacts(data);
      }
    }
  };

  useEffect(() => {
    const getPhoneNumbers = async () => {
      contacts.forEach((contact) => {
        if (contact.phoneNumbers) {
          contact.phoneNumbers.forEach((phone) => {
            phoneNumbers.push(phone.number);
          });
        }
      });
      if (phoneNumbers.length > 0) {
        const { data } = await axios.post(
          `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/fetch-users`,
          phoneNumbers
        );
        if (data) {
          setUsers(data?.users);
        }
      } else {
        console.log("No Phone Numbers Found");
      }
    };
    if (phoneNumbers.length < 1) {
      getPhoneNumbers();
    }
  }, [contacts]);

  useEffect(() => {
    if (contacts.length < 1) {
      getContacts();
    }
  }, [isFocused]);

  return (
    <>
      {
        users.length > 0 ? (
          <ScrollView
        scrollEnabled={true}
        contentContainerStyle={{ width: "100%", height: "auto" }}
      >
        <View style={{ alignItems: "center", width: "100%", marginTop: 10 }}>
          <Text
            style={{ fontSize: 14, fontWeight: "bold", color: "royalblue" }}
          >
            Contacts On Chatrr
          </Text>
        </View>
        <View style={{ width: "100%", height: "auto" }}>
          <FlashList
            contentContainerStyle={{ paddingVertical: 20 }}
            data={users}
            renderItem={(items) => <UsersList users={items} />}
            estimatedItemSize={100}
          />
        </View>
        <ScrollView
          scrollEnabled={true}
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
            marginTop: 10,
            height: "auto",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "royalblue",
              marginBottom: 10,
            }}
          >
            Contacts
          </Text>
          {contacts.length > 0 &&
            contacts.map((contact, index) => (
              <TouchableOpacity onPress={() => console.log(contact)} key={index} style={styles.container}>
                {contact?.imageAvailable ? (
                  <Image
                    source={{
                      uri: contact?.image?.uri,
                      headers: { Accept: "image/*" },
                    }}
                    style={styles.photo}
                    width={50}
                    height={50}
                  />
                ) : (
                  <FontAwesome
                    onPress={() =>
                      ToastAndroid.show("No Photo Available", 2000)
                    }
                    style={styles.photo}
                    name="user-circle"
                    color={"lightgray"}
                    size={50}
                  />
                )}
                <View style={styles.content}>
                  <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.name}>
                      {contact?.name}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    ToastAndroid.show(
                      "Inviting Contacts Will Be Available Soon...",
                      2000
                    )
                  }
                >
                  <Text style={{ color: "green", margin: 3 }}>Invite</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </ScrollView>
        ) : (
          <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}} >
            <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "royalblue",
              marginBottom: 10,
            }}
          >
            Fetching...
          </Text>
          </View>
        )
      }
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
    gap: 10,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 10,
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  row: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    flex: 1,
  },
  subTitle: {
    color: "grey",
  },
});

export default ContactScreen;
