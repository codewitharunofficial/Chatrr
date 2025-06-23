import { Image, StyleSheet, Text, ToastAndroid, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import moment from "moment";
import { Audio } from "expo-av";
import { useSound } from "../../Contexts/SoundContext";
import Toast from "react-native-simple-toast";

const AudioPlayer = () => {
  const { params } = useRoute();

  const [sound, setSound] = useSound();
  const [currentTrack, setCurrentTrack] = useSound();
  const [canPlay, setCanPlay] = useState(false);
  const [isPlaying, setIsPLaying] = useState(false);
  const [duration, setDuration] = useState();
  const [pause, setPause] = useState(false);
  const [position, setPosition] = useState(0);

  console.log(sound);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      {
        uri: params?.params?.file?.audio?.secure_url,
      },
      {
        shouldPlay: true,
      },
    );
    setSound(sound);
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isBuffering) {
        Toast.show("Buffering...", 3000);
      } else if (status.isPlaying) {
        sound.playAsync();
        setCanPlay(true);
        setIsPLaying(true);
        setDuration(status.durationMillis);
        setPosition(status.positionMillis);
      } else if (status.didJustFinish) {
        Toast.show("Audio Ended");
        sound.unloadAsync();
        setCanPlay(false);
        setIsPLaying(false);
      }
    });
  };

  const trackProgress = (position) => {
    const minutes = Math.floor(position/60000);
    const seconds = Math.floor((position % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0": ""}${seconds}`
  }


  useEffect(() => {
    setCurrentTrack(params.params.file);
    playSound();
  }, [params.params.file]);

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.name}>
          {params.params?.file?.audio?.original_filename}
        </Text>
      </View>
      <View style={styles.mainContainer}>
        <MaterialIcons
          name="audiotrack"
          size={100}
          color={"orange"}
          style={{ padding: 8, borderWidth: 1, borderRadius: 10 }}
        />
      </View>
      <View style={styles.sliderContainer}>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 10,
            paddingHorizontal: 10,
            marginTop: -10,
          }}
        >
          <Text>{trackProgress(position)}</Text>
          <Slider
          minimumValue={0}
            maximumValue={duration}
            value={position}
            thumbTintColor="orange"
            style={{
              color: "orange",
              flex: 1,
            }}
          />
          <Text>
            {trackProgress(duration)}
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            gap: 10,
            paddingHorizontal: 10,
          }}
        >
          <AntDesign name="banckward" />
          {isPlaying ? (
            <AntDesign
              onPress={() => {sound.pauseAsync(); setIsPLaying(false)}}
              name="pausecircle"
              size={20}
            />
          ) : (
            <AntDesign
              onPress={() => sound.playFromPositionAsync()}
              name="play"
              size={20}
            />
          )}
          <AntDesign name="forward" />
        </View>
      </View>
    </>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 40,
    backgroundColor: "lightblue",
  },
  name: {
    fontSize: 20,
    alignSelf: "center",
    verticalAlign: "middle",
  },
  mainContainer: {
    width: "100%",
    height: "80%",
    margin: 0,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  sliderContainer: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    height: 50,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
});
