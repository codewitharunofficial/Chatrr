import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-simple-toast";
import axios from "axios";
import { useAuth } from "../Contexts/auth";
import { useIsFocused } from "@react-navigation/native";
import { useContacts } from "../Contexts/ContactsContext";
import { BottomModal, ModalContent } from "react-native-modals";
import StoriesCaptionImage from "../Components/Modal/StoriesCaptionImage";
import StoryViewerModal from "../Components/Modal/StoryViewerModal";
const { width, height } = Dimensions.get("window");

const UpdatesScreen = ({ navigation }) => {
  const [auth] = useAuth();
  const isFocused = useIsFocused();
  const [upload, setUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [users] = useContacts();
  const [myStory, setMyStory] = useState([]);
  const [stories, setStories] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [assets, setAssets] = useState(null);
  const [viewStories, setViewStories] = useState(false);
  const [currentStories, setCurrentStories] = useState();

  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;

  // const navigation = useNavigation();

  const handlePress = async () => {
    // try {
    //   const permission = await ImagePicker.requestCameraPermissionsAsync();
    //   if (permission.status !== "granted") {
    //     Toast.show("Sorry, Please Allow to Procceed Further");
    //   } else {
    //     const { assets } = await ImagePicker.launchCameraAsync({
    //       allowsEditing: true,
    //       mediaTypes: ImagePicker.MediaTypeOptions.All,
    //       videoMaxDuration: 30,
    //     });
    //     if (assets[0].type === "video") {
    //       Toast.show(
    //         "Video Status Will Be Updated & Will Be Deleted After 24hrs"
    //       );
    //     } else if (assets[0].type === "image") {
    //       Toast.show(
    //         "Image Status Will Be Updated & Will Be Deleted After 24hrs"
    //       );
    //     } else {
    //       Toast.show("Wait What??");
    //     }
    //   }
    // } catch (error) {
    //   console.log(error.message);
    // }
  };

  const uploadStatus = async () => {
    try {
      const libraryPermissions =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (libraryPermissions.status !== "granted") {
        Toast.show("Sorry Please Give Permissions");
      } else {
        const { assets } = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          mediaTypes: ImagePicker.MediaTypeOptions.All,
        });

        if (assets) {
          setAssets(assets[0]);
          setUpload(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getStatus = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/status/get-status/${auth?.user?._id}`
      );
      setMyStory(data?.myStatus);
    } catch (error) {
      console.log(error.message);
    }
  };

  //fetching all user's status

  const getAllStatus = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/status/get-all-status`
      );
      setStories(data?.status);
      console.log(data.status);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getStatus();
    getAllStatus();
  }, [isFocused, upload]);

  const handleStories = async () => {
    setViewStories(true);
    setCurrentStories(myStory);
  };

  const handleAllStories = async (story) => {
    setViewStories(true);
    setCurrentStories(story?.stories);
  };


  return (
    <SafeAreaView>
      <BottomModal
        swipeDirection={["down", "right"]}
        onSwiping={() => setUpload(false)}
        visible={upload}
        style={{ width: "100%", height: "100%", backgroundColor: "#000" }}
      >
        <ModalContent>
          <StoriesCaptionImage
            asset={assets}
            setUpload={setUpload}
            setUploadProgress={setUploadProgress}
            setUploading={setUploading}
            auth={auth}
          />
        </ModalContent>
      </BottomModal>
      <BottomModal
        swipeDirection={["down", "right"]}
        onSwiping={() => setViewStories(false)}
        visible={viewStories}
        style={{ width: "100%", height: "100%", backgroundColor: "#000", padding: 0}}
        overlayBackgroundColor="#000"
      >
        <ModalContent style={{width: "100%", height: "100%", padding: 0, backgroundColor: '#000'}} >
          <StoryViewerModal
            stories={currentStories}
            setViewStories={setViewStories}
            navigation={navigation}
          />
        </ModalContent>
      </BottomModal>
      {uploading && (
        <View
          style={{
            width: "100%",
            paddingVertical: 5,
            backgroundColor: "green",
          }}
        >
          <Text style={{ textAlign: "center" }}>
            {"Uploading..." + " " + uploadProgress + "%"}
          </Text>
        </View>
      )}
      <View style={styles.container}>
        <TouchableOpacity
          onPress={myStory?.length > 0 ? handleStories : uploadStatus}
          style={{
            width: "100%",
            borderWidth: StyleSheet.hairlineWidth,
            paddingVertical: 10,
            alignSelf: "center",
            flexDirection: "row",
            gap: 20,
            paddingHorizontal: 20,
          }}
        >
          {myStory?.length > 0 ? (
            <>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 0,
                  borderWidth: myStory?.length > 0 ? 3 : 0,
                  borderRadius: 100,
                  borderColor: "purple",
                }}
              >
                <Image
                  source={{ uri: auth?.user?.photo?.secure_url }}
                  width={60}
                  height={60}
                  style={{ borderRadius: 100 }}
                />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={{
                paddingHorizontal: 0,
                borderWidth: myStory?.length > 0 ? 3 : 0,
                borderRadius: 100,
                borderColor: "purple",
              }}
            >
              <Ionicons name="add-circle" size={50} color={"royalblue"} />
            </TouchableOpacity>
          )}

          <Text
            style={{
              width: "100%",
              alignSelf: "center",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {myStory?.length > 0 ? "My Status" : "Add Status"}
          </Text>
        </TouchableOpacity>
        <View
          style={{ height: 20, marginTop: 10, marginBottom: 10, marginLeft: 5 }}
        >
          <Text
            style={{ color: "royalblue", fontSize: 15, fontWeight: "bold" }}
          >
            Contact's Status
          </Text>
        </View>
        {stories?.length > 0 &&
          stories.map(
            (story) =>
              story?.author?._id !== auth.user?._id && (
                <TouchableOpacity
                  key={story?.author?._id}
                  onPress={() => handleAllStories(story)}
                  style={{
                    width: "100%",
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: 'lightgray',
                    paddingVertical: 10,
                    alignSelf: "center",
                    flexDirection: "row",
                    gap: 20,
                    paddingHorizontal: 20,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 0,
                      borderWidth: stories?.length > 0 ? 3 : 0,
                      borderRadius: 100,
                      borderColor: "purple",
                    }}
                  >
                    <Image
                      source={{ uri: story?.author?.profilePhoto?.secure_url }}
                      width={60}
                      height={60}
                      style={{ borderRadius: 100 }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      width: "100%",
                      alignSelf: "center",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {story?.author?.name}
                  </Text>
                </TouchableOpacity>
              )
          )}

        <View style={styles.camContainer}>
          <TouchableOpacity
            onPress={handlePress}
            style={{
              width: width * 0.2,
              height: height * 0.1,
              justifyContent: "center",
              backgroundColor: "#00d4ff",
              alignSelf: "flex-end",
              marginRight: 20,
              alignItems: "center",
              borderRadius: 30,
              shadowColor: "lightgray",
            }}
          >
            <FontAwesome style={styles.camera} name="camera" size={25} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={uploadStatus}
            style={{
              width: width * 0.2,
              height: height * 0.1,
              justifyContent: "center",
              backgroundColor: "#00d4ff",
              alignSelf: "flex-end",
              marginRight: 20,
              alignItems: "center",
              borderRadius: 30,
              shadowColor: "lightgray",
            }}
          >
            <Ionicons name="albums" style={styles.camera} size={25} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
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
    gap: 10,
    position: "absolute",
    bottom: 20,
  },
});

export default UpdatesScreen;
