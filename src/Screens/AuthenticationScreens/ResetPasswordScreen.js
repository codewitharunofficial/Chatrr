import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../Contexts/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";

const ResetPasswordScreen = () => {
  //states

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [request, setRequest] = useState(false);
  const [loading, setLoading] = useState(false);

  //navigation

  const navigation = useNavigation();

  //context

  const [auth, setAuth] = useAuth();

  const requestOtp = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/reset-password-request`,
        { email }
      );
      console.log(data);
      if (data?.success) {
        ToastAndroid.show(data?.message, ToastAndroid.TOP);
        setRequest(true);
        setLoading(false);
      } else {
        ToastAndroid.show(data?.message, ToastAndroid.TOP);
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/reset-password`,
        { email, otp, password }
      );
      console.log(data);
      if (data?.success) {
        ToastAndroid.show(data?.message, ToastAndroid.TOP);
        navigation.navigate("Home");
        setRequest(true);
        setLoading(false);
      } else {
        ToastAndroid.show(data?.message, ToastAndroid.TOP);
        navigation.navigate("Reset-Password");
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      {loading === true ? (
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
            style={{ alignSelf: "center", backgroundColor: "transparent" }}
          />
        </View>
      ) : (
        <View
          style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}
        >
          <View style={{ marginTop: 70 }}>
            <View style={styles.container}>
              <Image
                src="https://cdn-icons-png.flaticon.com/512/3032/3032932.png"
                style={styles.logo}
              />
              <Text style={styles.title}>Chatrr</Text>
            </View>

            <View style={styles.authContainer}>
              <View
                style={{ width: "100%", height: "20%", alignItems: "center" }}
              >
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 30,
                    color: "white",
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                >
                  Reset-Password
                </Text>
              </View>
              <ScrollView style={{ height: "100%" }}>
                <View
                  style={{
                    width: "90%",
                    height: "100%",
                    alignItems: "center",
                    alignSelf: "center",
                    justifyContent: "center",
                    gap: 25,
                  }}
                >
                  {request ? (
                    <>
                      <TextInput
                        onChangeText={setOtp}
                        required
                        placeholder="Enter OTP"
                        style={styles.input}
                      />
                      <TextInput
                        required
                        onChangeText={setPassword}
                        placeholder="Enter New Password"
                        style={styles.input}
                      />
                    </>
                  ) : (
                    <TextInput
                      onChangeText={setEmail}
                      required
                      placeholder="Enter You Email"
                      style={styles.input}
                    />
                  )}
                </View>
              </ScrollView>
              <View
                style={{
                  width: "90%",
                  height: "auto",
                  alignSelf: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 15,
                  justifyContent: "center",
                  marginBottom: 70,
                }}
              >
                <TouchableOpacity onPress={requestOtp} style={[styles.button]}>
                  <Text>Request OTP</Text>
                </TouchableOpacity>
                {request ? (
                  <>
                    <TouchableOpacity onPress={resetPassword} style={[styles.button]}>
                      <Text>Submit & Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                      <Text onPress={() => navigation.navigate("Login")}>
                        Log In
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: 100,
    backgroundColor: "royalblue",
    borderBottomLeftRadius: 20,
    alignSelf: "center",
    marginTop: 50,
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
    height: "68%",
    backgroundColor: "royalblue",
    borderBottomLeftRadius: 20,
    alignSelf: "center",
    marginTop: 50,
    borderTopRightRadius: 20,
    flexDirection: "column",
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
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 10,
  },
});

export default ResetPasswordScreen;
