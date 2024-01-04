import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import moment from "moment";
import { useAuth } from "../../Contexts/auth";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import Toast from "react-native-simple-toast";
import { Audio } from "expo-av";
import * as FileSystem from 'expo-file-system';
const Message = ({ message, receiver }) => {
  const [auth] = useAuth();

  const [selected, setselected] = useState("");
  const [deselect, setDeselect] = useState(false);
  const [sound, setSound] = useState();
  const [url, setUrl] = useState("");
  const [play, setPlay] = useState(false);
  const [canPlay, setCanPlay] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uri, setUri] = useState('');


  async function downloadAudio() {
    const fileName = 'voice.m4a';
    const result = await FileSystem.downloadAsync(url, FileSystem.documentDirectory + fileName); 
    console.log(result);
    setUri(result.uri);
    saveFile(result.uri, fileName, result.headers["Content-Type"]);
  };

  async function saveFile(uri, fileName, mimetype) {
        if(Platform.OS === 'android') {
          const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
          if(permissions.granted) {
            const base64 = await FileSystem.readAsStringAsync(uri, {encoding: FileSystem.EncodingType.Base64});

            await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, mimetype).then(async(uri) => {
              await FileSystem.writeAsStringAsync(uri, base64, {encoding: FileSystem.EncodingType.Base64});
            })
            .catch(e => {
              console.log(e)
            })
          }
        }
  }


  const playAudio = async () => {
    try {
      const loadAudio = async () => {
        const { sound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: true }
        );
        setSound(sound);
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setCanPlay(true);
          } else {
            setLoading(true);
            setCanPlay(false);
          }
        });
      };

      loadAudio();

      if (canPlay === true) {
        await sound.playAsync();
        if (sound) {
          sound.unloadAsync();
          setCanPlay(false);
          setUrl("");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const pause = async () => {
    await sound.pauseAsync();
    setCanPlay(false);
  };

  const deleteMessage = async () => {
    try {
      const { data } = await axios.delete(
        `http://192.168.82.47:6969/api/v1/messages/delete-message/${selected}`
      );

      if (data.success === true) {
        Toast.show(data.message);
      } else {
        Toast.show(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View
      style={{
        backgroundColor: selected ? "lightgray" : deselect === true ? "" : "",
        borderRadius: 10,
        width: "100%",
        flexDirection:
          message.item.reciever === receiver &&
          auth.user._id === message.item.sender
            ? "row-reverse"
            : "row",
        justifyContent: "space-around",
        paddingHorizontal: selected ? 8 : 0,
      }}
    >
      <View style={{ width: "100%" }}>
        <Pressable
          onLongPress={() => {
            setselected(message.item._id),
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          onPress={() => (selected ? setDeselect(true) : null)}
          style={[
            styles.container,
            {
              backgroundColor:
                message.item.reciever === receiver &&
                auth.user._id === message.item.sender
                  ? "purple"
                  : "#000",

              alignSelf:
                message.item.reciever === receiver &&
                auth.user._id === message.item.sender
                  ? "flex-end"
                  : "flex-start",
            },
          ]}
        >
          {message.item.message.message ? (
            <Text
              style={{
                alignSelf: "flex-start",
                marginRight: "10%",
                color: "white",
              }}
            >
              {message.item.message.message}
            </Text>
          ) : (
            <Pressable style={{ minWidth: "50%", flexDirection: 'row' }}>
              {canPlay === false ? (
                <AntDesign
                  name="pause"
                  size={20}
                  color={"white"}
                  onPress={pause}
                />
              ) : (
                <AntDesign
                  name="play"
                  size={20}
                  color={"white"}
                  onPress={() => {
                    setUrl(message.item.message?.secure_url), downloadAudio();
                  }}
                />
              )}
             <MaterialCommunityIcons name="waveform" size={20} color={'white'} />
             <MaterialCommunityIcons name="waveform" size={20} color={'white'} />
             <MaterialCommunityIcons name="waveform" size={20} color={'white'} />
             <MaterialCommunityIcons name="waveform" size={20} color={'white'} />
             <MaterialCommunityIcons name="waveform" size={20} color={'white'} />
             <Text style={{color: 'white', fontSize: 10, margin: 5}} >{parseInt(message.item.message?.duration).toLocaleString('en-IN')} Secs</Text>
            </Pressable>
          )}

          <Text style={styles.time}>
            {moment(message.item.createdAt).format("hh:mm")}
          </Text>
        </Pressable>
      </View>
      {selected ? (
        <MaterialIcons
          onPress={deleteMessage}
          name="delete"
          size={30}
          color={"royalblue"}
          style={{ alignSelf: "center" }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    margin: 5,
    padding: 10,
    borderRadius: 5,
    maxWidth: "80%",
  },
  time: {
    color: "green",
    alignSelf: "flex-end",
    fontSize: 10,
  },
});

export default Message;
