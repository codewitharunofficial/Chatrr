import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import moment from "moment";
import { useAuth } from "../../Contexts/auth";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import Toast from "react-native-simple-toast";
import { Audio } from "expo-av";
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from "@react-navigation/native";
const Message = ({ message, receiver, read }) => {
  const [auth] = useAuth();

  const navigation = useNavigation();

  const [selected, setselected] = useState("");
  const [deselect, setDeselect] = useState(false);
  const [sound, setSound] = useState();
  const [url, setUrl] = useState("");
  const [play, setPlay] = useState(false);
  const [canPlay, setCanPlay] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uri, setUri] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const [filename, setFilename] = useState('');


  async function downloadAudio() {
    console.log(url);
    const fileName = `${filename}.m4a`;
    const result = await FileSystem.downloadAsync(url, FileSystem.documentDirectory + fileName, {
      headers: {
        'Content-Type': 'video/mp4'
      }
    }); 
    console.log(result);
    setUri(result.uri);
    setDownloaded(true);
    saveFile(result.uri, fileName, result.headers['Content-Type']);
  };

  async function saveFile(uri, fileName, mimetype) {
        const permissions = await MediaLibrary.requestPermissionsAsync();
        if(permissions.status != 'granted'){
          return;
        }
        try {
          const assest = await MediaLibrary.createAssetAsync(uri);
          const album = await MediaLibrary.getAlbumAsync('Chatrr');
          if(album == null){
            await MediaLibrary.createAlbumAsync('Chatrr', assest, false);
          } else{
            await MediaLibrary.addAssetsToAlbumAsync([assest], album, false);
          }
        } catch (error) {
          console.log(error)
        }
  }


  const playAudio = async () => {
    try {
      const loadAudio = async () => {

     const album = await MediaLibrary.getAlbumAsync('Chatrr');
     if(album) {
         const file = await MediaLibrary.getAssetInfoAsync(`${filename}.m4a`);
         console.log(file);
     }

        const { sound } = await Audio.Sound.createAsync(
          { uri: uri },
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
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/messages/delete-message/${selected}`
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
                  ? "#8f2fd0"
                  : "#353637",

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
          ) : message.item.message.format === "mp4" ? (
            <Pressable style={{ minWidth: "50%", flexDirection: 'row' }}>
              {
                downloaded ? (
                  canPlay ? 
                    (<AntDesign
                      name="play"
                      size={20}
                      color={"white"}
                      onPress={() => {setFilename(message.item.message.original_filename),playAudio();}}
                    />) : (
                      <AntDesign
                      name="pause"
                      size={20}
                      color={"white"}
                      onPress={() => {pause()}}
                    />
                    )
                ) : (
                  <MaterialCommunityIcons onPress={() => {setUrl(message.item.message?.secure_url), setFilename(message.item.message.original_filename), downloadAudio()}} name="download" size={20} color={'white'} /> 
                )
              }
             <MaterialCommunityIcons name="waveform" size={20} color={'white'} />
             <MaterialCommunityIcons name="waveform" size={20} color={'white'} />
             <MaterialCommunityIcons name="waveform" size={20} color={'white'} />
             <MaterialCommunityIcons name="waveform" size={20} color={'white'} />
             <MaterialCommunityIcons name="waveform" size={20} color={'white'} />
             <Text style={{color: 'white', fontSize: 10, margin: 5}} >{parseInt(message.item.message?.duration).toLocaleString('en-IN')} Secs</Text>
            </Pressable>
          ) : message.item.message.format === "png" || message.item.message.format === "jpg" || message.item.message.format === "jpeg" ? (
               <Pressable onPress={() => navigation.navigate("Image-Viewer", {
                params: {
                  image: message.item.message.secure_url
                }
               }) } style={{width: 200, height: 150, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: 'gray', marginTop: -5}} >
                <Image source={{uri: message.item.message.secure_url}} width={200} height={150} style={{borderRadius: 10}} />
               </Pressable>
          ) : null }

          <Text style={styles.time}>
            {moment(message.item.createdAt).format("hh:mm")}
          </Text>
        </Pressable>
        {
            auth.user._id === message.item.sender && message.index === 0 && read.read === true ? (<Text style={{alignSelf: 'flex-end', color: 'black', fontSize: 10, marginRight: 10}} >Seen</Text>) : null
          }
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
    color: "lightgreen",
    alignSelf: "flex-end",
    fontSize: 10,
  },
});

export default Message;
