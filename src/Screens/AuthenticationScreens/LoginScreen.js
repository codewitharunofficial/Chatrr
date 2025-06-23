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
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";

const LoginScreen = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const navigation = useNavigation();
  const [auth, setAuth] = useAuth();

  const value = { phone, password };

  const logIn = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/login`,
        { ...value }
      );
      if (data?.success) {
        ToastAndroid.show(data?.message, ToastAndroid.TOP);
        setAuth({ ...auth, user: data.user });
        if (!data.user.emailStatus || data.user.emailStatus !== "Verified") {
          navigation.navigate("Email-Verification-2", {
            params: { email: data?.user?.email },
          });
        } else {
          navigation.navigate("Home");
        }
        AsyncStorage.setItem("auth", JSON.stringify(data));
        AsyncStorage.setItem("LoggedIn", "true");
        AsyncStorage.setItem("token", data.token);
        setLoading(false);
      } else {
        ToastAndroid.show(data?.message, ToastAndroid.TOP);
        setLoading(false);
        navigation.navigate("Login");
      }
    } catch (error) {
      ToastAndroid.show(error.message, 3000);
      setLoading(false);
    }
  };

  return loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Image source={require('../../../assets/Chatrr.png')} style={styles.logo} />
        <Text style={styles.headerTitle}>Chatrr</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.loginTitle}>Welcome Back 👋</Text>

        <View style={styles.inputWrapper}>
          <FontAwesome name="phone" size={20} color="#888" />
          <TextInput
            onChangeText={setPhone}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrapper}>
          <MaterialIcons name="password" size={20} color="#888" />
          <TextInput
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={!show}
            placeholderTextColor="#999"
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShow(!show)}>
            <Feather name={show ? "eye-off" : "eye"} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={logIn}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Reset-Password")}
        >
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.signupRow}>
          <Text style={{ color: "#555" }}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signupText}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingVertical: 60,
    backgroundColor: "#f4f7fc",
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f7fc",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#007AFF",
  },
  formContainer: {
    width: "85%",
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  inputWrapper: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  loginBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    color: "#007AFF",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signupText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});

export default LoginScreen;
