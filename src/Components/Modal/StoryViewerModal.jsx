import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Video } from "expo-av";
import ViewStoriesTopBar from "../ViewStoriesTopBar";

const StoryViewerModal = ({ stories, setViewStories, navigation }) => {
  const storiesCount = new Array(stories?.length);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);
  let currentStory = stories[currentIndex];

  const navigateToNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setViewStories(false);
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
      // videoRef.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const togglePlayResume = () => {
    if (!isPlaying) {
      videoRef?.current?.playAsync();
    } else {
    }
  };

  useEffect(() => {
    if (currentStory.type === "Image") {
      const interval = setInterval(() => {
        navigateToNextStory();
        setProgress(interval);
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
      <View
        style={{
          width: `100%`,
          borderBottomWidth: 2,
          borderBottomColor: "white",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {storiesCount.length > 0 &&
          storiesCount.map((story, index) => (
            <View
              key={index}
              style={{
                borderBottomWidth: 2,
                borderBottomColor: "green",
                width: progress > 0 ? `${progress}%` : 0,
              }}
            />
          ))}
      </View>
      <ViewStoriesTopBar setViewStories={setViewStories} navigation={navigation} />
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: "#000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <TouchableOpacity
            style={styles.leftZone}
            onPress={() => navigateToPreviousStory()}
          ></TouchableOpacity>
          <TouchableOpacity
            style={styles.centerZone}
            onPressIn={() => togglePlayPause()}
            onPressOut={() => togglePlayResume()}
          />
          <TouchableOpacity
            style={styles.rightZone}
            onPress={() => navigateToNextStory()}
          />
        </View>
        <View style={styles.content}>
          {currentStory?.type === "Image" ? (
            <Image
              resizeMode="center"
              source={{ uri: currentStory?.status?.secure_url }}
              style={styles.image}
            />
          ) : (
            <Video
              ref={videoRef}
              source={{ uri: currentStory?.status?.secure_url }}
              style={styles.video}
              resizeMode="stretch"
              shouldPlay={isPlaying}
              useNativeControls={false}
              isMuted={false}
              onPlaybackStatusUpdate={(status) => {
                setProgress(
                  Math.floor(
                    (status.positionMillis / status.durationMillis) * 100
                  )
                );
                if (status.didJustFinish) {
                  navigateToNextStory();
                }
              }}
            />
          )}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "400",
              color: "white",
              position: "absolute",
              bottom: 20,
              alignSelf: "center",
              textAlign: "center",
            }}
          >
            {currentStory?.caption}
          </Text>
        </View>
      </View>
    </>
  );
};

export default StoryViewerModal;

const styles = StyleSheet.create({
  leftZone: {
    width: "33%",
    height: "100%",
    backgroundColor: "transparent",
  },
  centerZone: {
    width: "33%",
    height: "100%",
    backgroundColor: "transparent",
  },
  rightZone: {
    width: "33%",
    height: "100%",
    backgroundColor: "transparent",
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  video: {
    width: "100%",
    height: "40%",
  },
});
