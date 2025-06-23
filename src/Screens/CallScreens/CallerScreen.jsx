import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import {
  useCall,
  useStreamVideoClient,
  StreamCall,
  CallControls,
} from "@stream-io/video-react-native-sdk";

const CallerScreen = ({ route, navigation }) => {
  const { receiver, photo, name, sender } = route.params;

  const [connected, setConnected] = useState(false);
  const [call, setCall] = useState(null);
  const client = useStreamVideoClient();

  useEffect(() => {
    const startCall = async () => {
      try {
        const newCall = client.call("default", `${sender}-${receiver}`);
        await newCall.join();
        setCall(newCall);

        newCall.on("call.connected", () => {
          setConnected(true);
        });

        newCall.on("call.ended", () => {
          setConnected(false);
          navigation.goBack();
        });
      } catch (error) {
        console.error("Stream Call Error:", error);
        navigation.goBack();
      }
    };

    startCall();

    return () => {
      if (call) {
        call.leave();
      }
    };
  }, []);

  const endCall = async () => {
    if (call) {
      await call.leave();
      setCall(null);
    }
    navigation.goBack();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "lightblue",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 30 }}>
        <Image
          source={{ uri: photo }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text>{connected ? "Connected" : "Calling..."}</Text>
      </View>

      {call && (
        <StreamCall call={call}>
          <CallControls audioOnly />
        </StreamCall>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          padding: 20,
        }}
      >
        {/* Mute/Unmute is handled by CallControls */}
        <TouchableOpacity
          onPress={endCall}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "red",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="call-end" color={"white"} size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CallerScreen;
