import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-simple-toast';

const UpdatesScreen = () => {


    const handlePress = async () => {

        const permission = await ImagePicker.requestCameraPermissionsAsync();
        

        if(permission.status !== 'granted'){
            Toast.show("Sorry, Please Allow to Procceed Further");
        } else {
            const res = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                mediaTypes: ImagePicker.MediaTypeOptions.All
            });
            console.log(res);
        }

    }


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Updates</Text>
      <View style={styles.camContainer}>
        <Pressable
        onPress={handlePress}
          style={{
            width: "20%",
            height: "15%",
            justifyContent: "center",
            backgroundColor: "#00d4ff",
            alignSelf: "flex-end",
            marginRight: 20,
            alignItems: "center",
            borderRadius: 30,
            shadowColor: "lightgray",
            
          }}
        >
          <FontAwesome style={styles.camera} name="camera" size={20} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  text: {
    alignSelf: "center",
    fontSize: 24,
  },
  camera: {},
  camContainer: {
    width: "100%",
    height: "80%",
    justifyContent: "flex-end",
  },
});

export default UpdatesScreen;
