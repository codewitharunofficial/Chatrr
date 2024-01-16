import { TextInput, StyleSheet, Text, Pressable, View, Animated } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, Entypo, EvilIcons, Feather, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../Contexts/auth";
import socketServcies from "../../Utils/SocketServices";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-simple-toast';

const InputBox = ({ reciever, convoId, sender }) => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [recording, setRecording] = React.useState();
  const [uri, setUri] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [select, setSelect] = useState(false);
  const [image, setImage] = useState('');

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
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording.getURI();
    console.log("Recording Stopped and Stored at", uri);
    if (uri) {
      setUri(uri);
    }

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
    } catch (error) {
      console.log(error.message);
    }
  }

  //sending photo

  const sendPhoto = async () => {

      
    const granted = await ImagePicker.requestMediaLibraryPermissionsAsync();


     if(granted.status !== 'granted' ) {
      Toast.show("Sorry, Please Allow to Procceed Further")
     } else {

    const {assets} = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    
          try {

            // setImage(assets[0].uri);

           const formdata = new FormData();
           if(!assets){
            return;
           } else {
            formdata.append('photo', {
              name: new Date() + '_image',
              uri: assets[0].uri,
              type: 'image/jpg'
             });
             
             formdata.append('sender', sender);
             formdata.append('reciever', reciever);
             
             
             const {data} = await axios.post(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/media/send-photo/`, formdata, {
              headers:{
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
              }
             });
               
               if(data?.success === true){
                  Toast.show(data?.message);
               } else {
                  Toast.show(data?.message);
               }
           }
           
   
          } catch (error) {
              console.log(error.message);
              Toast.show(error.message + ", " + "Please Try Again");
          }
        }
  };

  return (
    <>
      {
        select ? (
        <View style={{width: '90%', height: '30%', backgroundColor: 'rgba(18, 115, 212, 0.8)', alignSelf: 'center', borderRadius: 10, alignItems: 'center', justifyContent: 'center', }} >
          <View style={{width: '90%', height: '40%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', alignItems: 'center'}} >
              <View>
            <View style={styles.icons} >
          <MaterialIcons name="audiotrack" size={50} color={'orange'} />
          </View>
          <Text style={{marginLeft: 10}} >Audio</Text>
          </View>
          <View>
            <View style={[styles.icons, {padding: 10, borderRadius: 40}]} >
        <FontAwesome onPress={sendPhoto} name="photo" size={40} color={'lightgreen'} />
        </View>
        <Text style={{marginLeft: 10}} >Gallery</Text>

          </View>
          <View>
        <View  style={[styles.icons, {padding: 10, borderRadius: 40}]} >
        <Feather name="video" size={40} color={'white'} />
        </View>
        <Text style={{marginLeft: 10}} >Videos</Text>
          </View>
        </View>
        <View style={{width: '90%', height: '50%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', alignItems: 'center'}} >
          <View>
            <View style={[styles.icons, {padding: 10, borderRadius: 40, alignItems: "center"}]} >
        <Ionicons name="document" size={40} color={'white'} />
        </View>
        <Text style={{marginLeft: 10}} >Others</Text>
        </View>
        <View>
          <View style={[styles.icons, {padding: 10, borderRadius: 40}]} >
        <Entypo name="camera" size={40} color={'#ffa8d7'} />
        </View>
        <Text style={{marginLeft: 10}} >Camera</Text>
        </View>
        <View>
          <View style={[styles.icons, {padding: 10, borderRadius: 40}]} >
        <Entypo name="location" size={40} color={'green'} />
        </View>
        <Text style={{marginLeft: 8}}>Location</Text>
        </View>
        </View>
      </View>) : null
      }
      <SafeAreaView edges={["bottom"]} style={styles.container}>
        <Pressable style={styles.plus} >
        <AntDesign onPress={() => !select ? setSelect(true) : setSelect(false)} name="plus" size={20} color={"white"} style={{transform: [{rotate: select ? '-135deg' : '0deg'}]}} />
        </Pressable>
        <TextInput
          keyboardAppearance="dark"
          value={input}
          onChangeText={setInput}
          placeholder="Type Here..."
          style={styles.text}
          multiline={true}
        />
        <Pressable
          style={{
            flexDirection: "column-reverse",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
              onLongPress={() => {
                startRecording(),
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
                  setIsRecording(true);
              }}
              onPressOut={() => {
                stopRecording(), setIsRecording(false);
              }}
              style={styles.send}
              name="keyboard-voice"
              size={recording ? 24 : 20}
              color={"white"}
            />
          )}
          {isRecording ? <Text>Recording...</Text> : null}
        </Pressable>
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
    alignItems: 'center'
  }
});

export default InputBox;
