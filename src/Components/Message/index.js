import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import moment from "moment";
import { useAuth } from "../../Contexts/auth";
import { useContext, useEffect, useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import axios from "axios";
import Toast from "react-native-simple-toast";
import { Audio, Video, ResizeMode } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useNavigation } from "@react-navigation/native";
import { useSound } from "../../Contexts/SoundContext";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { useReplyMessage, useReply } from "../../Contexts/ReplyContext";
import RepliedMessage from "../RepliedMessage";
import { PlayerControls } from "../../Contexts/PlayerControls";

const Message = ({ message, receiver, read }) => {
  const [auth] = useAuth();
  const navigation = useNavigation();
  const swipeableRef = useRef(null);

  const [selected, setSelected] = useState("");
  const [sound, setSound] = useSound();
  const {
    isPlaying,
    setIsPlaying,
    currentSound,
    setCurrentSound,
    position,
    setPosition,
    duration,
    setDuration,
  } = useContext(PlayerControls);

  const [uri, setUri] = useState("");
  const [canPlay, setCanPlay] = useState(false);
  const [pause, setPause] = useState(false);
  const [filename, setFilename] = useState("");
  const [publicId, setPublicId] = useState("");
  const [status, setStatus] = useState({});
  const [repliedMessage, setRepliedMessage] = useReplyMessage();
  const [isReplying, setIsReplying] = useReply();
  const [selectedMessage, setSelectedMessage] = useReply();

  const videoRef = useRef(null);

  const { item } = message;
  const isSender = item.reciever === receiver && auth.user._id === item.sender;

  useEffect(() => {
    if (item?.message?.secure_url) {
      setFilename(item._id);
    }
  }, [item]);

  const downloadAudio = async () => {
    const fileName = `${filename}.m4a`;
    const result = await FileSystem.downloadAsync(
      item.message.secure_url,
      FileSystem.documentDirectory + fileName
    );
    setUri(result.uri);
    saveFile(result.uri, fileName);
  };

  const saveFile = async (uri, fileName) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") return;

    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync("Chatrr");
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync("Chatrr", asset, false);
      }
      Toast.show("Audio saved to Chatrr album");
    } catch (error) {
      console.log("File save error:", error);
    }
  };

  const deleteMessage = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/messages/delete-message/${selected}`,
        { publicId }
      );
      Toast.show(data.message);
      setSelected("");
    } catch (error) {
      Toast.show("Failed to delete message");
    }
  };

  const playAudio = async () => {
    try {
      if (sound && item._id === currentSound?._id && !pause) {
        await sound.playAsync();
        setCanPlay(true);
        setIsPlaying(true);
        setPause(false);
      } else {
        if (sound) await sound.unloadAsync();

        setCurrentSound(item);
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: item.message.secure_url },
          { shouldPlay: true },
          handlePlaybackStatus
        );

        setSound(newSound);
        setCanPlay(true);
        setIsPlaying(true);
        setPause(false);
        newSound.setOnPlaybackStatusUpdate(handlePlaybackStatus);
      }
    } catch (error) {
      Toast.show("Audio playback failed");
    }
  };

  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
      setPause(true);
    }
  };

  const handlePlaybackStatus = (status) => {
    if (status.isBuffering) return Toast.show("Loading...");
    if (status.didJustFinish) {
      sound?.unloadAsync();
      setIsPlaying(false);
      setPause(false);
      setPosition(0);
    } else {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
    }
  };

  const renderLeftAction = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

    const opacity = dragX.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [0, 0.7, 1],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.actionContainer}>
        <RectButton
          style={[styles.actionButton, styles.replyButton]}
          onPress={() => {
            setRepliedMessage(item.message);
            setSelectedMessage(message?.reply ? message.reply : message.message);
            console.log(message);
            setIsReplying(true);

            swipeableRef.current?.close();
          }}
        >
          <Animated.View style={{ opacity, transform: [{ scale }] }}>
            <MaterialCommunityIcons name="reply" size={20} color="#fff" />
          </Animated.View>
        </RectButton>
        <RectButton
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => {
            deleteMessage();
            swipeableRef.current?.close();
          }}
        >
          <Animated.View style={{ opacity, transform: [{ scale }] }}>
            <MaterialIcons name="delete" size={20} color="#fff" />
          </Animated.View>
        </RectButton>
      </View>
    );
  };

  const isImage = ["png", "jpg", "jpeg"].includes(item.message?.format);
  const isVideo = item.message?.format === "mp4" && item.message.is_audio === false;
  const isAudio = item.message?.is_audio === true;

  return (
    <View
      style={[
        styles.messageWrapper,
        {
          flexDirection: isSender ? "row-reverse" : "row",
          backgroundColor: selected || isReplying ? "#e5e5ea" : "transparent",
        },
      ]}
    >
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={renderLeftAction}
        onSwipeableWillOpen={() =>
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
        friction={1.5}
        overshootFriction={6}
      >
        <TouchableOpacity
          onLongPress={() => {
            setSelected(item._id);
            setPublicId(item.message?.public_id);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          onPress={() => selected && setSelected("")}
          style={[
            styles.messageBubble,
            {
              backgroundColor: isSender ? "#DCF8C6" : "#FFFFFF",
              borderTopLeftRadius: isSender ? 10 : 0,
              borderBottomLeftRadius: isSender ? 10 : 0,
              borderTopRightRadius: isSender ? 0 : 10,
              borderBottomRightRadius: isSender ? 0 : 10,
            },
          ]}
        >
          {/* Replied */}
          {item.isReplied && <RepliedMessage message={item} />}

          {/* Text */}
          {(item.message.message && !item.isReplied) && (
            <Text style={[styles.messageText, { color: isSender ? "#000" : "#000" }]}>
              {item.message.message}
            </Text>
          )}

          {/* Audio */}
          {isAudio && (
            <View style={styles.audioContainer}>
              <TouchableOpacity
                onPress={canPlay ? pauseAudio : playAudio}
                style={styles.audioButton}
              >
                <AntDesign
                  name={canPlay ? "pause" : "play"}
                  size={18}
                  color={isSender ? "#34C759" : "#007AFF"}
                />
              </TouchableOpacity>
              <View style={styles.audioProgress}>
                <Text style={[styles.audioStatus, { color: isSender ? "#000" : "#000" }]}>
                  {isPlaying ? "Playing..." : pause ? "Paused" : "Voice Message"}
                </Text>
                <Text style={styles.audioDuration}>
                  {Math.round(duration || item.message.duration || 0) / 1000}s
                </Text>
              </View>
              <TouchableOpacity onPress={downloadAudio} style={styles.audioButton}>
                <MaterialIcons
                  name="download"
                  size={18}
                  color={isSender ? "#34C759" : "#007AFF"}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Image */}
          {isImage && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Image-Viewer", {
                  params: { image: item.message.secure_url },
                })
              }
              style={styles.imageContainer}
            >
              <Image
                source={{ uri: item.message.secure_url }}
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}

          {/* Video */}
          {isVideo && (
            <View style={styles.videoContainer}>
              <Video
                ref={videoRef}
                source={{ uri: item.message.secure_url }}
                style={styles.video}
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                onPlaybackStatusUpdate={setStatus}
              />
            </View>
          )}

          {/* Timestamp & Seen */}
          <View style={styles.footer}>
            <Text style={styles.timestamp}>
              {moment(item.createdAt).format("h:mm A")}
            </Text>
            {auth.user._id === item.sender && message.index === 0 && read.read && (
              <MaterialIcons
                name="done-all"
                size={14}
                color={read.read ? "#34C759" : "#999"}
                style={styles.seenIcon}
              />
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>

      {selected && (
        <TouchableOpacity onPress={deleteMessage} style={styles.deleteIcon}>
          <MaterialIcons name="delete" size={20} color="#FF3B30" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageWrapper: {
    // width: "100%",
    minWidth: "80%",
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "100%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 2,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 6,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    width: "100%",
  },
  audioButton: {
    padding: 6,
    borderRadius: 20,
  },
  audioProgress: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 8,
  },
  audioStatus: {
    fontSize: 14,
    fontWeight: "400",
  },
  audioDuration: {
    fontSize: 12,
    color: "#666",
  },
  imageContainer: {
    width: 180,
    height: 180,
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  videoContainer: {
    width: 180,
    height: 180,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#000",
    marginVertical: 4,
  },
  video: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 2,
    marginRight: 4,
  },
  timestamp: {
    fontSize: 11,
    color: "#666",
    marginRight: 4,
  },
  seenIcon: {
    marginLeft: 2,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: 100,
    height: "100%",
    marginRight: 8,
  },
  actionButton: {
    width: 50,
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 4,
  },
  replyButton: {
    backgroundColor: "#007AFF",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    marginLeft: 4,
  },
  deleteIcon: {
    padding: 6,
    backgroundColor: "#FFF",
    borderRadius: 20,
    elevation: 1,
    marginHorizontal: 6,
  },
});

export default Message;