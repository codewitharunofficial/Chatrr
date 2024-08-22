import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import Slider from '@react-native-community/slider';

const VideoPlayer = ({ route, navigation, videoUrl }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const {uri} = route.params;

  const handleDoubleTap = (direction) => {
    if (videoRef.current) {
      videoRef.current.getStatusAsync().then((status) => {
        let newPosition = status.positionMillis + (direction === 'forward' ? 10000 : -10000);
        newPosition = Math.max(0, Math.min(newPosition, status.durationMillis));
        videoRef.current.setPositionAsync(newPosition);
      });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.videoContainer} onLongPress={() => handleDoubleTap('backward')} delayLongPress={200}>
        <Video
          ref={videoRef}
          source={{ uri }}
          style={styles.video}
          resizeMode="contain"
          isMuted={isMuted}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
        <TouchableOpacity style={styles.control} onLongPress={() => handleDoubleTap('forward')} delayLongPress={200} />
      </TouchableOpacity>
      
      <Slider
        style={styles.slider}
        value={status.positionMillis || 0}
        minimumValue={0}
        maximumValue={status.durationMillis || 0}
        onValueChange={value => videoRef.current.setPositionAsync(value)}
      />
      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleMute}>
          <Text style={styles.controlText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>
        <Text style={styles.controlText}>
          {Math.floor((status.positionMillis || 0) / 1000)}s / {Math.floor((status.durationMillis || 0) / 1000)}s
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 200,
  },
  slider: {
    width: '90%',
    height: 40,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    paddingVertical: 10,
  },
  controlText: {
    color: 'white',
  },
});

export default VideoPlayer;
