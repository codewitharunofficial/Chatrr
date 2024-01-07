import { TextInput, StyleSheet, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../Contexts/auth";
import socketServcies from "../../Utils/SocketServices";
import { Audio } from "expo-av";
import * as Haptics from 'expo-haptics'
import axios from "axios";

const InputBox = ({ reciever, convoId, sender }) => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [recording, setRecording] = React.useState();
  const [uri,  setUri] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const [auth] = useAuth();

  const qureies = {
    reciever: auth.user._id === reciever ? sender : reciever,
    sender: auth.user._id,
    message: input ? input : uri,
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
          setRecording(recording);
         } catch (error) {
           console.log("Failed to Start Recording", error);
         }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false
    });

    const uri = recording.getURI();
    console.log('Recording Stopped and Stored at', uri);
    if(uri) {
      setUri(uri);
    }


      try {

        const formData = new FormData();
      if(!uri) return

      formData.append('audio', {
        name: new Date() + '_voice',
        uri: uri,
        type: 'audio/m4a'
      });
      formData.append('sender', sender)
      formData.append('receiver', reciever)
        const {data} = await axios.post(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/media/send-voice`, formData, {
          headers:{
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        });
        // console.log(data);
      } catch (error) {
        console.log(error.message);
      }
  }

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <AntDesign name="plus" size={20} color={"white"} style={styles.plus} />
      <TextInput
      keyboardAppearance="dark"
        value={input}
        onChangeText={setInput}
        placeholder="Type Here..."
        style={styles.text}
        multiline={true}
      />
    <Pressable style={{flexDirection: 'column-reverse', justifyContent: 'center', alignItems: 'center'}} >
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
        onLongPress={() => {startRecording(), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), setIsRecording(true)}}
        onPressOut={() => {stopRecording(), setIsRecording(false)}}
          style={styles.send}
          name="keyboard-voice"
          size={recording ? 24 : 20}
          color={"white"}
        />
      )}
      {
          isRecording ? (<Text>Recording...</Text>) : (null)

        }
        </Pressable>
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
    maxHeight: 80
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
