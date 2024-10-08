import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  Animated,
} from "react-native";
import moment from "moment";
import { useAuth } from "../../Contexts/auth";
import { useContext, useEffect, useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import {
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import axios from "axios";
import Toast from "react-native-simple-toast";
import { Audio, ResizeMode, Video } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useNavigation } from "@react-navigation/native";
import { useSound } from "../../Contexts/SoundContext";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { useReply } from "../../Contexts/MessageContext";
import { useReplyMessage } from "../../Contexts/ReplyContext";
import RepliedMessage from "../RepliedMessage";
import { PlayerControls } from "../../Contexts/PlayerControls";
const Message = ({ message, receiver, read }) => {
  const [auth] = useAuth();

  const navigation = useNavigation();

  const [selected, setselected] = useState("");
  const [deselect, setDeselect] = useState(false);
  const [sound, setSound] = useSound();
  const {currentTrack, setCurrentTrack} = useContext(PlayerControls);
  const [url, setUrl] = useState("");
  const [canPlay, setCanPlay] = useState(false);
  const [uri, setUri] = useState("");
  const [downloaded, setDownloaded] = useState(false);
  const [filename, setFilename] = useState("");
  const [publicId, setPublicId] = useState("");
  const [status, setStatus] = useState({});
  const video = useRef(null);
  const {isPlaying, setIsPLaying} = useContext(PlayerControls);
  const [duration, setDuration] = useState();
  const [pause, setPause] = useState(false);
  const [position, setPosition] = useState(0);
  const [repliedMessage, setRepliedMessage] = useReplyMessage();
  const [isReplying, setIsReplying] = useReply();
  const [selectedMessage, setSelectedMessage] = useReply();

  async function downloadAudio() {
    console.log(url);
    const fileName = `${filename}.m4a`;
    const result = await FileSystem.downloadAsync(
      url,
      FileSystem.documentDirectory + fileName,
      {
        headers: {
          "Content-Type": "video/mp4",
        },
      }
    );
    console.log(result);
    setUri(result.uri);
    setDownloaded(true);
    saveFile(result.uri, fileName, result.headers["Content-Type"]);
  }

  async function saveFile(uri, fileName, mimetype) {
    const permissions = await MediaLibrary.requestPermissionsAsync();
    if (permissions.status != "granted") {
      return;
    }
    try {
      const assest = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync("Chatrr");
      if (album == null) {
        await MediaLibrary.createAlbumAsync("Chatrr", assest, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([assest], album, false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteMessage = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/messages/delete-message/${selected}`,
        { publicId: publicId }
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

  // const replyMessage = (id, reply) => {
  //           const 
  // }


  return (
    <View
      style={{
        backgroundColor: selected ? "lightgray" : deselect === true ? "white" : "white",
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
      <Swipeable
        containerStyle={{ width: "100%" }}
        renderLeftActions={
       (progress, dragX) => {
                const trans = dragX.interpolate({
                  inputRange: [0, 25, 100, 150],
                  outputRange: [5, 0, 0, -1],
                })
                ;
                return (
                  <RectButton
                    style={{
                      justifyContent: "center",
                      paddingHorizontal: 10,
                      alignItems: "center",
                      backgroundColor:
                        message.item.reciever === receiver &&
                        auth.user._id === message.item.sender
                          ? "#8f2fd0"
                          : "#353637",
                      borderRadius: 10,
                      height: 40,
                      marginTop: 5,
                      alignSelf: "center",
                    }}
                  >
                    <Animated.Text
                      style={{ transform: [{ translateX: trans }] }}
                    >
                      <AntDesign
                        // onPress={handleSwipeLeft}
                        name="back"
                        size={30}
                        color={"white"}
                      />
                    </Animated.Text>
                  </RectButton>
                );
              }
        }
        
        onSwipeableOpen={(left) => {
          if(left){
            setRepliedMessage(message?.item?.message);
            setIsReplying(true);
            setSelectedMessage(message?.item);
          }
        }}
      >
        <TouchableOpacity
          onLongPress={() => {
            setselected(message.item._id),
              setPublicId(message.item.message?.public_id);
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
          { message.item.message.message && message.item?.isReplied === true ? (
            <RepliedMessage message={message.item} />
          ) : message.item.message.message ? (
            <Text
              style={{
                alignSelf: "flex-start",
                marginRight: "10%",
                color: "white",
              }}
            >
              {message.item.message.message}
            </Text>
          ) : message.item.message.is_audio === true ? (
            <TouchableOpacity
              style={{
                minWidth: "50%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {!canPlay ? (
                <AntDesign
                  name="play"
                  size={20}
                  color={"white"}
                  onPress={async function playAudio() {
                    try {
                      if (sound && message.item._id === currentTrack._id) {
                        sound.playFromPositionAsync(position);
                        setCanPlay(true);
                        setPause(false);
                        sound.setOnPlaybackStatusUpdate((status) => {
                          if (status.isBuffering) {
                            Toast.show("Voice Is Loading...");
                          } else if (status.isPlaying) {
                            sound.playAsync();
                            setCanPlay(true);
                            setIsPLaying(true);
                            setDuration(
                              status.playableDurationMillis -
                                status.positionMillis
                            );
                          } else if (status.didJustFinish) {
                            Toast.show("Audio Ended");
                            sound.unloadAsync();
                            setCanPlay(false);
                            setIsPLaying(false);
                          }
                        });
                      } else {
                        setCurrentTrack(message.item);
                        const { sound } = await Audio.Sound.createAsync(
                          {
                            uri: message.item.message.secure_url,
                          },
                          {
                            shouldPlay: true,
                          }
                        );
                        setSound(sound);
                        sound.setOnPlaybackStatusUpdate((status) => {
                          if (status.isBuffering) {
                            Toast.show("Voice Is Loading...");
                          } else if (status.isPlaying) {
                            sound.playAsync();
                            setCanPlay(true);
                            setIsPLaying(true);
                            setDuration(
                              status.playableDurationMillis -
                                status.positionMillis
                            );
                          } else if (status.didJustFinish) {
                            Toast.show("Audio Ended");
                            sound.unloadAsync();
                            setCanPlay(false);
                            setIsPLaying(false);
                          }
                        });
                      }
                    } catch (error) {
                      console.log(error.message);
                    }
                  }}
                />
              ) : (
                <AntDesign
                  name="pause"
                  size={20}
                  color={"white"}
                  onPress={async function pause() {
                    await sound.pauseAsync();
                    setPause(true);
                    setCanPlay(false);
                    isPlaying(false);
                    sound.setOnPlaybackStatusUpdate((status) => {
                      if (status.positionMillis) {
                        setPosition(status.positionMillis);
                      }
                    });
                  }}
                />
              )}
              <Text style={{ color: "white", marginHorizontal: 3 }}>
                {isPlaying ? "Playing..." : pause ? "Paused" : "Audio"}
              </Text>
              <Text style={{ color: "white", fontSize: 10, margin: 5 }}>
                {isPlaying
                  ? `${Math.round(duration / 1000)}s`
                  : `${Math.round(message.item.message.duration)}s`}
              </Text>
            </TouchableOpacity>
          ) : message.item.message.format === "png" ||
            message.item.message.format === "jpg" ||
            message.item.message.format === "jpeg" ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Image-Viewer", {
                  params: {
                    image: message.item.message.secure_url,
                  },
                })
              }
              style={{
                width: 200,
                height: 300,
                borderRadius: 10,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: "gray",
                marginTop: -5,
              }}
            >
              <Image
                source={{ uri: message.item.message.secure_url }}
                resizeMode="stretch"
                style={{ borderRadius: 10, width: "100%", height: "100%" }}
              />
              <Text style={styles.time}>
                {moment(message.item.createdAt).format("hh:mm")}
              </Text>
            </TouchableOpacity>
          ) : message.item.message.is_audio === false &&
            message.item.message.format === "mp4" ? (
            <View style={{ width: 200, height: 200 }}>
              <Video
                resizeMode="cover"
                ref={video}
                shouldPlay={false}
                useNativeControls={true}
                onPlaybackStatusUpdate={(status) => setStatus(status)}
                source={{ uri: message.item.message.secure_url }}
                style={{
                  flex: 1,
                  alignSelf: "stretch",
                }}
              />
            </View>
          ) : null}

          <Text style={styles.time}>
            {moment(message.item.createdAt).format("hh:mm")}
          </Text>
        </TouchableOpacity>
        {auth.user._id === message.item.sender &&
        message.index === 0 &&
        read.read === true ? (
          <Text
            style={{
              alignSelf: "flex-end",
              color: "black",
              fontSize: 10,
              marginRight: 10,
            }}
          >
            Seen
          </Text>
        ) : null}
      </Swipeable>
      {selected ? (
        <MaterialIcons
          onPress={() => {
            deleteMessage();
          }}
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
