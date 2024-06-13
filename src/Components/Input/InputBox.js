import {
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../Contexts/auth";
import socketServcies from "../../Utils/SocketServices";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-simple-toast";
import * as MediaLibrary from "expo-media-library";
import * as DocumentPicker from "expo-document-picker";
import SelectedFileScreen from "../../Screens/SelectedFileScreen";
import { useNavigation } from "@react-navigation/native";
import { useReply } from "../../Contexts/MessageContext";
import { useReplyMessage } from "../../Contexts/ReplyContext";

const InputBox = ({ reciever, convoId, sender }) => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [recording, setRecording] = React.useState();
  const [uri, setUri] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [select, setSelect] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [auth] = useAuth();
  const [repliedMessage] = useReplyMessage();
  const [isReplying, setIsReplying] = useReply();
  const [selectedMessage] = useReply();


  const navigator = useNavigation();

  const qureiesForNewMessage = {
    reciever: auth.user._id === reciever ? sender : reciever,
    sender: auth.user._id,
    message: input ? input : uri,
    convoId: convoId,
  };


  const qureiesForReply = {
    reciever: auth.user._id === reciever ? sender : reciever,
    sender: auth.user._id,
    message : repliedMessage,
    reply: input ? input : uri,
    convoId: convoId,
  };

  useEffect(() => {
    socketServcies.initializeSocket();
  }, []);
// console.log(repliedMessage)

  const sendMessage = async () => {
    try {
      if (!!input) {
        socketServcies.emit("send-message", qureiesForNewMessage);
        setInput("");
        return;
      }
      alert("Message Cannot me empty");
    } catch (error) {
      console.log(error.message);
    }
  };

  const reply = async () => {
    try {
      if (!!input) {
        socketServcies.emit("reply-message", qureiesForReply);
        setInput("");
        setIsReplying(!isReplying);
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
        playThroughEarpieceAndroid: true,
      });
      Toast.show("Starting Recording...");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      console.log("Failed to Start Recording", error);
      Toast.show("Failed to Start Recording", error);
    }
  }

  async function stopRecording() {
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording.getURI();
    console.log("Recording Stopped and Stored at", uri);
    setRecording(undefined);

    try {
      const formData = new FormData();
      if (!uri) return;

      formData.append("audio", {
        name: new Date() + "_voice",
        uri: uri,
        type: "audio/m4a",
      });
      formData.append("sender", sender);
      formData.append("receiver", reciever);

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/media/send-voice`,
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log(data);
      if (data) {
        Toast.show(data?.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  //sending photo

  const sendPhoto = async () => {
    const granted = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (granted.status !== "granted") {
      Toast.show("Sorry, Please Allow to Procceed Further");
      return;
    } else {
      const { assets } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });

      if(assets?.length > 0) {
        navigator.navigate("Caption", {
          params: {
            uri: assets[0]?.uri,
            type: assets[0]?.type,
            name: assets[0]?.fileName,
            sender: sender,
            reciever: reciever
          }
        });
      }
    }
  };

  //send Video Attachment

  const sendVideo = async () => {
    const granted = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (granted.status !== "granted") {
      Toast.show("Sorry, Please Allow to Procceed Further");
      return;
    } else {
      const { assets } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
      });

      try {
        const formdata = new FormData();
        if (assets === null) {
          return;
        } else {
          formdata.append("video", {
            name: new Date() + "_video",
            uri: assets[0].uri,
            type: "video/mp4",
          });

          formdata.append("sender", sender);
          formdata.append("reciever", reciever);

          const { data } = await axios.post(
            `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/media/send-video`,
            formdata,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (data?.success) {
            Toast.show(data?.message);
          } else {
            Toast.show(data?.message);
          }
        }
      } catch (error) {
        Toast.show(error.message + ", " + "Please Try Again");
        console.log(error.message);
      }
    }
  };


  const sendAudio = async () => {
    const granted = await MediaLibrary.requestPermissionsAsync();
    if (granted.status !== "granted") {
      Toast.show("Sorry, Please Allow to Procceed Further");
      return;
    } else {
      const { assets } = await DocumentPicker.getDocumentAsync();

      if(assets?.length > 0) {
        navigator.navigate("Caption", {
          params: {
            uri: assets[0]?.uri,
            type: assets[0]?.mimeType,
            name: assets[0]?.name,
            sender: sender,
            reciever: reciever
          }
        });
      }
    }
  };

  // console.log(isReplying);

  return (
    <>
      {select ? (
        <View
          style={{
            width: "90%",
            height: "30%",
            backgroundColor: "rgba(18, 115, 212, 1)",
            alignSelf: "center",
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              height: "40%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            <View>
              <View style={styles.icons}>
                <MaterialIcons onPress={sendAudio} name="audiotrack" size={50} color={"orange"} />
              </View>
              <Text style={{ marginLeft: 10 }}>Audio</Text>
            </View>
            <View>
              <View style={[styles.icons, { padding: 10, borderRadius: 40 }]}>
                <FontAwesome
                  onPress={sendPhoto}
                  name="photo"
                  size={40}
                  color={"lightgreen"}
                />
              </View>
              <Text style={{ marginLeft: 10 }}>Gallery</Text>
            </View>
            <View>
              <View style={[styles.icons, { padding: 10, borderRadius: 40 }]}>
                <Feather onPress={sendVideo} name="video" size={40} color={"white"} />
              </View>
              <Text style={{ marginLeft: 10 }}>Videos</Text>
            </View>
          </View>
          <View
            style={{
              width: "90%",
              height: "50%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            <View>
              <View
                style={[
                  styles.icons,
                  { padding: 10, borderRadius: 40, alignItems: "center" },
                ]}
              >
                <Ionicons name="document" size={40} color={"white"} />
              </View>
              <Text style={{ marginLeft: 10 }}>Others</Text>
            </View>
            <View>
              <View style={[styles.icons, { padding: 10, borderRadius: 40 }]}>
                <Entypo name="camera" size={40} color={"#ffa8d7"} />
              </View>
              <Text style={{ marginLeft: 10 }}>Camera</Text>
            </View>
            <View>
              <View style={[styles.icons, { padding: 10, borderRadius: 40 }]}>
                <Entypo name="location" size={40} color={"green"} />
              </View>
              <Text style={{ marginLeft: 8 }}>Location</Text>
            </View>
          </View>
        </View>
      ) : null}
      
          {
            isReplying && (
              <View style={{backgroundColor: 'lightblue', width: '95%', height: 60, alignSelf: 'center', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, borderWidth: StyleSheet.hairlineWidth, borderColor: 'gray'}} >
       <Entypo onPress={() => {setIsReplying(!isReplying)}} name="circle-with-cross" size={20} color={'black'} style={{position: 'absolute', right: -3, top: -6}} />
     <Text style={{fontSize: 18, color: 'white'}} >{selectedMessage?.message?.message}</Text>
      </View>
            )
          }
       
      <SafeAreaView edges={["bottom"]} style={styles.container}>
        <TouchableOpacity onPress={() => (!select ? setSelect(true) : setSelect(false))} style={styles.plus}>
          <AntDesign
            onPress={() => (!select ? setSelect(true) : setSelect(false))}
            name="plus"
            size={20}
            color={"white"}
            style={{ transform: [{ rotate: select ? "-135deg" : "0deg" }] }}
          />
        </TouchableOpacity>
        <TextInput
          keyboardAppearance="dark"
          value={input}
          onChangeText={setInput}
          placeholder="Type Here..."
          style={styles.text}
          multiline={true}
        />
        <TouchableOpacity
          style={{
            flexDirection: "column-reverse",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {input ? (
            <MaterialIcons
              style={styles.send}
              onPress={() => {isReplying ? reply() : sendMessage()}}
              name="send"
              size={20}
              color={"white"}
            />
          ) : (
            <MaterialIcons
              onLongPress={() => {
                startRecording(),
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
                  setIsRecording(true);
              }}
              onPressOut={() => {
                stopRecording(), setIsRecording(false), setRecording();
              }}
              style={styles.send}
              name="keyboard-voice"
              size={recording ? 24 : 20}
              color={"white"}
            />
          )}
          {isRecording ? <Text>Recording...</Text> : null}
        </TouchableOpacity>
      </SafeAreaView>
    </>
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
    maxHeight: 80,
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
  icons: {
    borderWidth: 1,
    padding: 3,
    borderRadius: 30,
    alignItems: "center",
  },
});

export default InputBox;
