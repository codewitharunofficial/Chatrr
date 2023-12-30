import { TextInput, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../Contexts/auth";
import socketServcies from "../../Utils/SocketServices";
import { Audio } from "expo-av";
import * as Haptics from 'expo-haptics'

const InputBox = ({ reciever, convoId, sender }) => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [sound, setSound] = React.useState();

  const [auth] = useAuth();

  const qureies = {
    reciever: auth.user._id === reciever ? sender : reciever,
    sender: auth.user._id,
    message: input,
    convoId: convoId,
  };

  useEffect(() => {
    socketServcies.initializeSocket();
  }, []);

  const sendMessage = async () => {
    try {
      if (!!input) {
        socketServcies.emit("send-message", qureies);
        setInput("");
        return;
      }
      alert("Message Cannot me empty");
    } catch (error) {
      console.log(error.message);
    }
  };


  async function startRecording() {
    console.log("Starting Recording");
         try {
          await Audio.requestPermissionsAsync();
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            playThroughEarpieceAndroid: true
          });
          console.log("Starting Recording...");
          const {recording} = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
          setSound(recording);
         } catch (error) {
           console.log("Failed to Start Recording", error);
         }
  }

  async function stopRecording() {
    setSound(undefined);
    await sound.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false
    });

    const uri = sound.getURI();
    console.log('Recording Stopped and Stored at', uri);
  }

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <AntDesign name="plus" size={20} color={"white"} style={styles.plus} />
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Type Here..."
        style={styles.text}
      />

      {input ? (
        <MaterialIcons
          style={styles.send}
          onPress={sendMessage}
          name="send"
          size={20}
          color={"white"}
        />
      ) : (
        <MaterialIcons
        onPressIn={() => {startRecording, Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}
        onPressOut={stopRecording}
          style={styles.send}
          name="keyboard-voice"
          size={20}
          color={"white"}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    padding: 10,
  },
  text: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
  },
  plus: {
    backgroundColor: "royalblue",
    padding: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: "center",
    marginRight: 7,
  },
  send: {
    backgroundColor: "royalblue",
    padding: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: "center",
    marginLeft: 7,
  },
});

export default InputBox;
