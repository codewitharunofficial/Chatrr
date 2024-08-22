import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
} from "react-native-webrtc";
import socketServcies from "../../Utils/SocketServices";
import {
  AntDesign,
  Feather,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";

const CallerScreen = ({ route, navigation }) => {
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const { receiver, photo, name, sender } = route.params;
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const pc = useRef(null);

  const [onSpeaker, setOnSpeaker] = useState(false);
  const [mute, setMute] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callId, setCallId] = useState(null);

  useEffect(() => {
    const setupWebRTC = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setLocalStream(stream);

        pc.current = new RTCPeerConnection(configuration);

        stream.getTracks().forEach((track) => {
          pc.current.addTrack(track, stream);
        });

        pc.current.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
        };

        pc.current.onicecandidate = (event) => {
          if (event.candidate) {
            socketServcies.emit("ice-candidate", {
              candidate: event.candidate,
              receiver,
            });
          }
        };

        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        socketServcies.emit("offer", { offer: offer, receiver: receiver });

        socketServcies.on(
          "call-answered",
          async ({ answer, peerId, callId }) => {
            if (peerId === sender) {
              await pc.current.setRemoteDescription(
                new RTCSessionDescription(answer)
              );
              setCallId(callId);
              setConnected(true);
            }
          }
        );

        socketServcies.on("ice-candidate", async ({ candidate }) => {
          if (candidate) {
            await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

        socketServcies.on("end-call", () => {
          if (pc.current) {
            pc.current.close();
          }
          if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
          }
          setLocalStream(null);
          setRemoteStream(null);
          setConnected(false);
          setIsConnecting(false);
          navigation.goBack();
        });
      } catch (error) {
        console.error("Error setting up WebRTC:", error);
      }
    };

    setupWebRTC();

    return () => {
      if (pc.current) {
        pc.current.close();
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      setLocalStream(null);
      setRemoteStream(null);
    };
  }, [receiver]);

  const endCall = () => {
    socketServcies.emit("end-call", { ended: true, callId: callId });
    if (pc.current) {
      pc.current.close();
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    setLocalStream(null);
    setRemoteStream(null);
    setConnected(false);
    setIsConnecting(false);
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
        <Text>
          {isConnecting
            ? "Connecting..."
            : connected
            ? "Connected"
            : "Calling..."}
        </Text>
      </View>
      {localStream && (
        <RTCView
          streamURL={localStream.toURL()}
          style={{ width: 100, height: 50, marginBottom: 10 }}
        />
      )}
      {remoteStream && (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={{ width: 100, height: 50, marginBottom: 10 }}
        />
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          padding: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            localStream
              .getAudioTracks()
              .forEach((track) => (track.enabled = !track.enabled));
            setMute(!mute);
          }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: mute ? "gray" : "lightgray",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Feather name="mic-off" color={"white"} size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setOnSpeaker(!onSpeaker)}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: onSpeaker ? "gray" : "lightgray",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AntDesign name="sound" color={"white"} size={30} />
        </TouchableOpacity>
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
