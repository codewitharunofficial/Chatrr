import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCSessionDescription,
  RTCIceCandidate,
} from "react-native-webrtc";
import socketServcies from "../../Utils/SocketServices";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../../Contexts/auth";
import CallLayoutOne from "../../Components/CallLayoutOne";
import CallLayoutTwo from "../../Components/CallLayoutTwo";

const ReceiverScreen = ({ route, navigation }) => {
  const [auth] = useAuth();
  const { peerId, profilePhoto, callId } = route.params;
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [offer, setOffer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [onSpeaker, setOnSpeaker] = useState(false);
  const [mute, setMute] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const pc = useRef(null);

  useEffect(() => {
    const setupWebRTC = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setLocalStream(stream);

        pc.current = new RTCPeerConnection(configuration);

        if (pc.current) {
          stream.getTracks().forEach((track) => {
            pc.current.addTrack(track, stream);
          });

          pc.current.onicecandidate = (event) => {
            if (event.candidate) {
              setIsConnecting(true);
              socketServcies.emit("ice-candidate", {
                candidate: event.candidate,
                peerId: peerId,
              });
            }
          };

          pc.current.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
          };
        } else {
          console.log("Peer Connection wasn't initialized correctly");
        }
      } catch (error) {
        console.error("Error setting up WebRTC:", error);
      }
    };

    setupWebRTC();

    socketServcies.on("offer", async ({ offer, receiver }) => {
      try {
        if (receiver === auth?.user?._id && offer) {
          setOffer(offer);
        }
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    });

    socketServcies.on("ice-candidate", async ({ candidate, receiver }) => {
      try {
        if (candidate && receiver === auth?.user?._id) {
          await pc.current?.addIceCandidate(new RTCIceCandidate(candidate));
          setConnected(true);
        }
      } catch (error) {
        console.error("Error handling ICE candidate:", error);
      }
    });

    socketServcies.on("end-call", () => {
      try {
        setAnswered(false);
        setConnected(false);
        setIsConnecting(false);
        if (pc.current) {
          pc.current.close();
        }
        if (localStream) {
          localStream.getTracks().forEach((track) => track.stop());
        }
        setLocalStream(null);
        setRemoteStream(null);
        navigation.goBack();
      } catch (error) {
        console.error("Error ending call:", error);
      }
    });

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
  }, [peerId]);

  const answerCall = async () => {
    try {
      setAnswered(true);
      if (offer && pc.current) {
        await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.current.createAnswer();
        if (answer) {
          await pc.current?.setLocalDescription(answer);
          socketServcies.emit("answer-call", {
            peerId: peerId,
            answer: answer,
            callId: callId,
          });
          setConnected(true);
        }
      }
    } catch (error) {
      console.error("Error answering call:", error);
    }
  };

  const endCall = () => {
    try {
      setAnswered(false);
      setConnected(false);
      setIsConnecting(false);
      socketServcies.emit("end-call", { ended: true, callId: callId });
      if (pc.current) {
        pc.current.close();
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      setLocalStream(null);
      setRemoteStream(null);
      navigation.goBack();
    } catch (error) {
      console.error("Error ending call:", error);
    }
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
          source={{ uri: profilePhoto }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text>
          {isConnecting
            ? "Connecting..."
            : connected
            ? "Connected"
            : "Incoming Call..."}
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
      {answered ? (
        <CallLayoutOne
          setOnSpeaker={setOnSpeaker}
          onSpeaker={onSpeaker}
          setMute={setMute}
          mute={mute}
          endCall={endCall}
          localStream={localStream}
        />
      ) : (
        <CallLayoutTwo
          answerCall={answerCall}
          offer={offer}
          endCall={endCall}
        />
      )}
    </View>
  );
};

export default ReceiverScreen;
