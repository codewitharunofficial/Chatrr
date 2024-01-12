import {
  View,
  Text,
  TextInput,
  Pressable,
  ToastAndroid,
  Image,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from "../../Contexts/auth";

const EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState(false);

  //navigation

  const navigation = useNavigation();

  //context

  const [auth] = useAuth();

  const verifyOTP = async () => {
    setEmail(auth.user.email);
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/verify-otp`,
        { email, otp }
      );
      if (data?.success) {
        ToastAndroid.show(data?.message, ToastAndroid.TOP);
        setLoading(false);
        navigation.navigate("Home");
      } else {
        setLoading(true);
        ToastAndroid.show(data?.message, ToastAndroid.TOP);
        setLoading(false);
        navigation.navigate("Login");
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const requestOtp = async () => {
    setEmail(auth?.user?.email);
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/request-otp`,
        { email }
      );
      if (data?.success) {
        ToastAndroid.show("OTP Requested Successfully", ToastAndroid.TOP);
        setRequest(true);
        setLoading(false);
      } else {
        setLoading(true);
        ToastAndroid.show(data?.message, ToastAndroid.TOP);
        setLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      ToastAndroid.show(error?.message, ToastAndroid.TOP);

      setLoading(false);
    }
  };

  return (
    <View style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
      <View style={{ marginTop: 70 }}>
        <View style={styles.container}>
          <Image
            src="https://cdn-icons-png.flaticon.com/512/3032/3032932.png"
            style={styles.logo}
          />
          <Text style={styles.title}>Chatrr</Text>
        </View>

        <View style={styles.authContainer}>
          <View style={{ width: "100%", height: "20%", alignItems: "center" }}>
            <Text
              style={{
                marginTop: 20,
                fontSize: 30,
                color: "white",
                fontWeight: "bold",
                textDecorationLine: "underline",
              }}
            >
              Login
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
            {request ? (
              <Text>
                Enter the otp sent to
                <Text style={{ color: "lightgreen" }}>{auth.user.email}</Text>
              </Text>
            ) : (
              <Text>Request An OTP</Text>
            )}
            <TextInput
              required
              onChangeText={setOtp}
              placeholder="Enter OTP"
              style={styles.input}
            />
          </View>
          <View
            style={{
              width: "90%",
              height: "auto",
              alignSelf: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 15,
              justifyContent: "center",
            }}
          >
            <Pressable onPress={requestOtp} style={styles.button}>
              <Text>Request OTP</Text>
            </Pressable>
            {request ? (
              <Pressable onPress={verifyOTP} style={styles.button}>
                <Text>Verify</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </View>
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
    height: "65%",
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

export default EmailVerification;
