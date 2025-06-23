import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../Contexts/auth";
import socketServices from "../../Utils/SocketServices";
import {
  StreamCall,
  StreamVideo,
  useStreamVideoClient,
  CallContent,
  StreamTheme,
} from "@stream-io/video-react-native-sdk";
import { CallLayoutOne } from "../../Components/CallLayoutOne";
import { CallLayoutTwo } from "../../Components/CallLayoutTwo";

const ReceiverScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { peerId, profilePhoto, callId } = route.params;
  const [auth] = useAuth();
  const client = useStreamVideoClient();

  const [call, setCall] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const initCall = async () => {
      if (!client || !auth?.user?._id) return;

      const newCall = client.call("default", callId);
      setCall(newCall);

      // Listen to when caller ends the call
      socketServices.on("end-call", () => {
        endCall();
      });

      // Join the call
      await newCall.join({ create: true });
      setConnected(true);
    };

    initCall();

    return () => {
      socketServices.off("end-call");
      endCall();
    };
  }, [client]);

  const answerCall = async () => {
    if (!call) return;
    try {
      setIsConnecting(true);
      await call.join();
      setAnswered(true);
      setIsConnecting(false);
      setConnected(true);
    } catch (err) {
      console.error("Error answering call:", err);
    }
  };

  const endCall = async () => {
    if (call) {
      await call.leave();
    }
    socketServices.emit("end-call", { ended: true, callId: callId });
    setAnswered(false);
    setConnected(false);
    setIsConnecting(false);
    navigation.goBack();
  };

  return (
    <StreamTheme>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
          <Text style={styles.statusText}>
            {isConnecting
              ? "Connecting..."
              : connected
              ? "Connected"
              : "Incoming Call..."}
          </Text>
        </View>

        {call && answered && (
          <StreamCall call={call}>
            <CallContent />
            <CallLayoutOne
              endCall={endCall}
              mute={false}
              setMute={() => {}}
              onSpeaker={false}
              setOnSpeaker={() => {}}
            />
          </StreamCall>
        )}

        {!answered && (
          <CallLayoutTwo
            answerCall={answerCall}
            offer={true}
            endCall={endCall}
          />
        )}
      </View>
    </StreamTheme>
  );
};

export default ReceiverScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});
