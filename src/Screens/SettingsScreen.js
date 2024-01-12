import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../Contexts/auth";
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import socketServcies from "../Utils/SocketServices";

const SettingsScreen = () => {
  const [auth, setAuth] = useAuth();
  const [user, setUser] = useState([]);
  const [userId, setUserId] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const isFocused = useIsFocused();

  const navigation = useNavigation();

  const getAdminDetails = async () => {
    setUserId(auth.user?._id);
    try {
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/get-user/${userId}`
      );
      if (data.success === true) {
        setProfilePhoto(data?.user?.profilePhoto?.secure_url);
        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getAdminDetails();
    }
  }, [isFocused, userId]);

  const handlePress = async () => {
    socketServcies.initializeSocket();
    socketServcies.emit('log-out',  auth.user?._id);
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    AsyncStorage.clear();
    Toast.show("Logged Out Successfully!");
    navigation.navigate("Login");
  };

  const handleBackButton = () => {
    navigation.goBack()
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, [isFocused]);

  return (
    <>
      {!user ? (
        <View
          style={{
            width: "100%",
            height: "100%",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <ActivityIndicator
            aria-valuetext="Chatrr is Loading..."
            size={"large"}
            color={"royalblue"}
            style={{ alignSelf: "center" }}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Pressable style={styles.pressable}>
            {profilePhoto ? (
              <Image
                source={
                  profilePhoto ? profilePhoto : auth?.user?.photo?.secure_url
                }
                height={60}
                width={60}
                style={{ borderRadius: 50 }}
              />
            ) : (
              <FontAwesome name="user-circle" color={"lightgray"} size={60} />
            )}

            <View style={{ flex: 0.5, alignItems: "center" }}>
              <View style={styles.row}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                  }}
                >
                  {user?.name}
                </Text>
                <Text>{user?.phone}</Text>
              </View>
            </View>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Profile")}
            style={styles.item}
          >
            <Text style={styles.text}>
              Profile <AntDesign name="user" size={20} />{" "}
            </Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Account-Settings")} style={styles.item}>
            <Text style={styles.text}>
              Account <Ionicons name="settings" size={20} />
            </Text>
          </Pressable>
          <Pressable onPress={handlePress} style={styles.item}>
            <Text style={styles.text}>
              Logout <MaterialCommunityIcons name="power-settings" size={24} />{" "}
            </Text>
          </Pressable>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "95%",
    alignSelf: "center",
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "whitesmoke",
  },
  pressable: {
    width: "100%",
    height: "13%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  item: {
    width: "100%",
    alignSelf: "flex-start",
    height: "10%",
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: "flex-start",
    justifyContent: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 20,
  },
});

export default SettingsScreen;
