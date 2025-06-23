import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  ToastAndroid,
  BackHandler,
} from "react-native";
import * as Contacts from "expo-contacts";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../Contexts/auth";
import UsersList from "../Components/Users/UsersList";
import { useContacts } from "../Contexts/ContactsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import Toast from 'react-native-simple-toast';

const ContactScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useContacts();
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [matchedContacts, setMatchedContacts] = useContacts();
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();

  useEffect(() => {
    const handleBackButton = () => {
      navigation.navigate("Chats");
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const getSavedContacts = async () => {
      const data = await AsyncStorage.getItem("savedContacts");
      const res = JSON.parse(data);
      if (res?.length > 0) {
        setMatchedContacts(res);
      }
    };
    getSavedContacts();
  }, []);

  const getContacts = async () => {
    setLoading(true);
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({});
      if (data.length > 0) {
        const allContacts = data.sort((a, b) => a.name.localeCompare(b.name));
        setContacts(allContacts);
      }
    }
    setLoading(false);
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
          const sorted = data.users?.sort((a, b) => a.name.localeCompare(b.name));
          setUsers(sorted);
          AsyncStorage.setItem("savedContacts", JSON.stringify(data?.users));
        }
      } else {
        Toast.show("Loading Contacts", 2000);
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
  }, [users]);

  const renderContactItem = ({ item }) => {
    if (item?.phone === auth?.user?.phone) return null;

    return (
      <TouchableOpacity style={styles.contactCard} onPress={() => console.log(item)}>
        {item?.imageAvailable ? (
          <Image
            source={{ uri: item?.image?.uri, headers: { Accept: "image/*" } }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <FontAwesome name="user" size={24} color="#fff" />
          </View>
        )}
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item?.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() => ToastAndroid.show("Inviting Contacts Will Be Available Soon...", 2000)}
        >
          <Text style={styles.inviteText}>Invite</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
     
      {loading ? (
        <View style={styles.loadingContainer}>
          <FontAwesome name="spinner" size={40} color="#4169e1" style={styles.spinner} />
          <Text style={styles.loadingText}>Loading Contacts...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {(users?.length > 0 || matchedContacts?.length > 0) && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Contacts on Chatrr</Text>
              </View>
              <FlashList
                data={users?.length > 0 ? users : matchedContacts}
                renderItem={(items) => <UsersList users={items} />}
                estimatedItemSize={91}
                contentContainerStyle={styles.flashListContent}
              />
            </>
          )}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Contacts</Text>
          </View>
          <FlashList
            data={contacts}
            renderItem={renderContactItem}
            estimatedItemSize={80}
            contentContainerStyle={styles.flashListContent}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  header: {
    backgroundColor: "#4169e1",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4169e1",
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 15,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4169e1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  inviteButton: {
    backgroundColor: "#e8f5e9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  inviteText: {
    color: "#2e7d32",
    fontSize: 14,
    fontWeight: "500",
  },
  flashListContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: "#4169e1",
  },
});

export default ContactScreen;