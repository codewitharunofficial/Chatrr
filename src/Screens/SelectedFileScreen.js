import { BackHandler, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import IfAudio from "./IfAudio";
import IfImage from "./IfImage";
import IfVideo from "./ifVideo";

const SelectedFileScreen = ({ navigation, route }) => {
  // const route = useRoute();

  const {file} = route?.params;
  const {states} = route.params;

  console.log(states);

  // const navigator = useNavigation();

  // useEffect(() => {
  //     const handleBackButton = () => navigator.addListener(history.back);
  //     BackHandler.addEventListener("hardwareBackPress", handleBackButton);
  //     return () => {
  //       BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
  //     };
  //   }, []);

  return (
    <View style={{ width: "100%", height: "100%" }}>
      {file && file?.type === "image" ? (
        <IfImage
          uri={file.uri}
          type={file.type}
          name={file.name ? file.name : null}
          sender={file.sender ? file.sender : null}
          reciever={file.reciever ? file.reciever : null}
          setUpload={states.setUpload}
          setUploadProgress={states.setUploadProgress}
          setUploading={states.setUploading}
        />
      ) : file.type === "video" ? (
        <IfVideo uri={file.uri} />
      ) : (
        <IfAudio
          name={file?.name}
          uri={file?.uri}
          type={file?.type}
          sender={file.sender}
          reciever={file.reciever}
        />
      )}
    </View>
  );
};

export default SelectedFileScreen;

const styles = StyleSheet.create({});
