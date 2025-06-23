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
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignupScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // NEW
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !phone || !password) {
      ToastAndroid.show("All fields are required", ToastAndroid.TOP);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/create-user`,
        {
          name: username,
          email,
          phone,
          password,
        }
      );
      if (data?.success) {
        ToastAndroid.show(data?.message, ToastAndroid.TOP);
        AsyncStorage.setItem("auth", JSON.stringify(data));
        AsyncStorage.setItem("isLogged", "true");
        navigation.navigate("Email-Verification");
      } else {
        ToastAndroid.show(data?.message, ToastAndroid.TOP);
      }
    } catch (error) {
      ToastAndroid.show(error.message, 3000);
    } finally {
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
        <Image
          source={require("../../../assets/Chatrr.png")}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Chatrr</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.signupTitle}>Create Your Account ✨</Text>

        <View style={styles.inputWrapper}>
          <FontAwesome name="user" size={20} color="#888" />
          <TextInput
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor="#999"
            style={styles.input}
          />
        </View>

        {/* EMAIL INPUT */}
        <View style={styles.inputWrapper}>
          <MaterialIcons name="email" size={20} color="#888" />
          <TextInput
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
            style={styles.input}
          />
        </View>

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
          <MaterialIcons name="lock" size={20} color="#888" />
          <TextInput
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#999"
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={{ color: "#555" }}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}> Login</Text>
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
  signupTitle: {
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
  signupBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  signupText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  loginLink: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});

export default SignupScreen;
