import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";
import React from "react";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import client from "../../Components/utils/client";
import axios from "axios";
import { useAuth } from "../../Contexts/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import toast from "react-hot-toast";

const SignUpScreen = () => {
  //navigation
  const navigation = useNavigation();

  //states

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [auth, setAuth] = useAuth();

  //user

  const value = {
    name,
    password,
    phone,
    email,
  };

  const signUp = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/create-user`,
        { ...value }
      );
      if (data?.success) {
        ToastAndroid.show(data?.message, ToastAndroid.TOP);
        setAuth({
          ...auth,
          user: data.user,
          token: data.token,
        });

        AsyncStorage.setItem("auth", JSON.stringify(data));
        AsyncStorage.setItem("isLogged", "true");
        navigation.navigate("Email-Verification");
      } else {
        ToastAndroid.show(data?.message, ToastAndroid.TOP);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ScrollView>
      <View style={{ paddingBottom: 60, marginTop: 60 }}>
        <View style={styles.container}>
          <Image
            src="https://cdn-icons-png.flaticon.com/512/3032/3032932.png"
            style={styles.logo}
          />
          <Text style={styles.title}>Chatrr</Text>
        </View>
        <View style={styles.authContainer}>
          <View style={{ width: "100%", height: "18%", alignItems: "center" }}>
            <Text
              style={{
                marginTop: 16,
                fontSize: 30,
                color: "white",
                fontWeight: "bold",
                textDecorationLine: "underline",
              }}
            >
              SignUp
            </Text>
          </View>
          <View
            style={{
              width: "90%",
              height: "auto",
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center",
              gap: 25,
              paddingVertical: 12,
            }}
          >
            <TextInput
              onChangeText={setPhone}
              required
              placeholder="Enter Your Phone Number"
              style={styles.input}
            />
            <TextInput
              onChangeText={setName}
              required
              placeholder="Enter Your Name"
              style={styles.input}
            />

            <TextInput
              onChangeText={setPassword}
              required
              secureTextEntry={true}
              placeholder="Enter Your Password"
              style={styles.input}
            />
            <TextInput
              onChangeText={setEmail}
              required
              placeholder="Enter Your Email Address"
              style={styles.input}
            />
          </View>
          <View
            style={{
              width: "90%",
              height: 50,
              alignSelf: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 15,
              justifyContent: "center",
              marginTop: -7,
            }}
          >
            <TouchableOpacity onPress={signUp} style={styles.button}>
              <Text>SignUp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.button}
            >
              <Text>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: 100,
    backgroundColor: "royalblue",
    borderBottomLeftRadius: 20,
    alignSelf: "center",
    marginTop: 40,
    borderTopRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
  logo: {
    height: 50,
    width: 50,
  },
  authContainer: {
    width: "90%",
    height: "70%",
    backgroundColor: "royalblue",
    borderBottomLeftRadius: 20,
    alignSelf: "center",
    marginTop: 50,
    borderTopRightRadius: 20,
    flexDirection: "column",
    paddingBottom: 50,
  },
  input: {
    backgroundColor: "white",
    width: "90%",
    padding: 5,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#00d4ff",
    width: "30%",
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 10,
  },
});

export default SignUpScreen;
