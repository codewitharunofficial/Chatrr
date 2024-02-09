import { useRoute } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import VideoPlayer from "expo-video-player";
import Slider from "@react-native-community/slider";
import { useRef } from "react";
import { Text, View } from "react-native";

const VideoPlayers = () => {

    const video = useRef(null);

    const route = useRoute();

    const {uri} = route?.params?.params;

  return (
    <>
    <Video
    resizeMode="contain"
    ref={video}
    shouldPlay={false}
    useNativeControls={true}
    onPlaybackStatusUpdate={status => setStatus(()=> status)}
      source={{ uri: message.item.message.secure_url }}
      style={{
        flex: 1,
        alignSelf: 'stretch'
      }}
    />
      </>
  );
};
export default VideoPlayers;
