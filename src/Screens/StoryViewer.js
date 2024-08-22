import { Image, StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video } from "expo-av";

const StoryViewer = ({route, navigation }) => {
  const isFocused = useIsFocused();

  const { stories } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);
  let currentStory = stories[currentIndex];

  const navigateToNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.goBack();
    }
  };

  const navigateToPreviousStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (currentStory.type === "Image") {
      const interval = setInterval(() => {
        navigateToNextStory();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [currentIndex, stories]);

  useEffect(() => {
    if (currentStory.type !== "Image" && videoRef.current) {
      videoRef.current.playAsync();
    }
  }, [currentIndex, stories]);

  return (
    <>
      <View style={{ borderBottomWidth: 3, borderBottomColor: 'green', width: progress > 0 ? `${progress}%` : 0 }} />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: "#000",
        }}
      >
        <TouchableOpacity style={styles.leftZone} onPress={() => navigateToPreviousStory()} />
        <TouchableOpacity style={styles.centerZone} onPress={() => togglePlayPause()} />
        <TouchableOpacity style={styles.rightZone} onPress={() => navigateToNextStory()} />
        <View style={styles.content}>
          {currentStory?.type === "Image" ? (
            <Image
              resizeMode="stretch"
              source={{ uri: currentStory?.status?.secure_url }}
              style={styles.image}
            />
          ) : (
            <Video
              ref={videoRef}
              source={{ uri: currentStory?.status?.secure_url }}
              style={styles.video}
              resizeMode="contain"
              shouldPlay={isPlaying}
              useNativeControls={false}
              isMuted={false}
              onPlaybackStatusUpdate={(status) => {
                setProgress(Math.floor(status.positionMillis / status.durationMillis * 100));
                if (status.didJustFinish) {
                  navigateToNextStory();
                }
              }}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default StoryViewer;

const styles = StyleSheet.create({
  leftZone: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  centerZone: {
    flex: 2,
    backgroundColor: 'transparent',
  },
  rightZone: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
