import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'

const CallLayoutTwo = ({endCall, answerCall, offer}) => {
    // console.log(offer);
  return (
    <View
        style={{
          width: "90%",
          height: "30%",
          alignSelf: "center",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          onPress={() => answerCall(offer)}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "green",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="call" color={"white"} size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={endCall}
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
  )
}

export default CallLayoutTwo

const styles = StyleSheet.create({})