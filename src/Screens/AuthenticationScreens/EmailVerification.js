import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from "../../Contexts/auth";

const EmailVerification = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params.params;
  const [auth] = useAuth();

  const verifyOTP = async () => {
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
        ToastAndroid.show(data?.message, ToastAndroid.TOP);
        setLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const requestOtp = async () => {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.mainContainer}
    >
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/3032/3032932.png" }}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Chatrr</Text>
      </View>

      <View style={styles.authCard}>
        <Text style={styles.loginTitle}>Email Verification</Text>

        <View style={styles.contentContainer}>
          <Text style={styles.infoText}>
            {request ? (
              <>
                Enter OTP sent to{" "}
                <Text style={styles.emailText}>{auth.user.email}</Text>
              </>
            ) : (
              "Please request an OTP to verify your email"
            )}
          </Text>

          {request && (
            <TextInput
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter OTP"
              style={styles.input}
              keyboardType="numeric"
              maxLength={6}
              placeholderTextColor="#999"
            />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={requestOtp}
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading && !request ? "Requesting..." : "Request OTP"}
              </Text>
            </TouchableOpacity>

            {request && (
              <TouchableOpacity
                onPress={verifyOTP}
                style={[styles.button, loading && styles.buttonDisabled]}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Verifying..." : "Verify"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#4169e1",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
    fontStyle: "italic",
  },
  authCard: {
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  loginTitle: {
    fontSize: 28,
    color: "#4169e1",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  contentContainer: {
    alignItems: "center",
    gap: 20,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  emailText: {
    color: "#4169e1",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#4169e1",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#87a1e8",
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EmailVerification;