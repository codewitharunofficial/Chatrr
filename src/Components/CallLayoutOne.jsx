import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';

const CallLayoutOne = ({setOnSpeaker, onSpeaker, setMute, mute, endCall, localStream }) => {
  return (
    <>
    <View
        style={{
          width: "100%",
          height: "15%",
          dislay: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            localStream
              .getAudioTracks()
              .forEach((track) => (track.enabled = !track.enabled));
              setMute(!mute);
          }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: `${mute ? "gray" : "lightgray"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="mic-off" color={"white"} size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setOnSpeaker(!onSpeaker)}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: `${onSpeaker ? "gray" : "lightgray"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AntDesign name="sound" color={"white"} size={30} />
        </TouchableOpacity>
      </View>
        <View
        style={{
          width: "100%",
          height: "15%",
          dislay: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {endCall}}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "red",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcons name="call-end" color={"white"} size={30} />
        </TouchableOpacity>
      </View>
    </>
  )
}

export default CallLayoutOne

const styles = StyleSheet.create({})