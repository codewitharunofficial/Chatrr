import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video } from "expo-av";

const StoryViewer = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { stories } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [progress, setProgress] = useState(0); 
  const currentStory = stories[currentIndex];

  const navigateToNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // clearInterval(intervalId);
      navigation.navigate("Home");
    }
  };

  useEffect(() => {
    const interval = setInterval(
      () => {
        navigateToNextStory();
      },
      currentStory.type === "Image"
        ? 5000
        : Math.floor(currentStory?.status?.duration) * 1000
    );

    return () => clearInterval(interval);
  }, [currentIndex, stories]);

  console.log(progress);

  return (
    <>
    <View style={{borderBottomWidth: 3, borderBottomColor: 'green', width: progress > 0 ? `${progress}%` : 0}} />
    <View
      style={{
        paddingVertical: 20,
        height: "100%",
        width: "100%",
        backgroundColor: "#000",
      }}
    >
      {currentStory?.type === "Image" ? (
        <Image
          resizeMode="stretch"
          source={{ uri: currentStory?.status?.secure_url }}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <Video
          source={{ uri: currentStory?.status?.secure_url }}
          style={{ flex: 1, alignSelf: "stretch" }}
          resizeMode="contain"
          shouldPlay={true}
          useNativeControls={false}
          isMuted={false}
          onPlaybackStatusUpdate={(status) => setProgress(Math.floor(status.positionMillis / status.durationMillis * 100))}
        />
      )}
    </View>
    </>
  );
};

export default StoryViewer;

const styles = StyleSheet.create({});
