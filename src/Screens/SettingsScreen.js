import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../Contexts/auth";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-simple-toast';
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from 'socket.io-client'

const SettingsScreen = () => {
  const [auth, setAuth] = useAuth();
  const [user, setUser] = useState([]);

  const navigation = useNavigation();

  const handlePress = async () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    AsyncStorage.clear();
    Toast.show("Logged Out Successfully!");
    navigation.navigate("Login");
  };


  return (
    <View style={styles.container}>
      <Pressable style={styles.pressable}>
        <Image
          source={{uri: auth?.user?.photo?.url}}
          height={60}
          width={60}
          style={{ borderRadius: 50 }}
        />
        <View style={{flex: 0.5, alignItems: 'center',}} >
          <View style={styles.row} >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
            }}
          >
            {auth?.user?.name}
          </Text>
          <Text>{auth?.user?.phone}</Text>
          
          </View>
        </View>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate("Profile")}
        style={styles.item}
      >
        <Text style={styles.text}>Profile <AntDesign name="user" size={20} /> </Text>
      </Pressable>
      <Pressable onPress={handlePress} style={styles.item}>
        <Text style={styles.text}>
          Logout <MaterialCommunityIcons name="power-settings" size={24} />{" "}
        </Text>
      </Pressable>
    </View>
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 5
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
    fontSize: 20
  }
});


export default SettingsScreen;
