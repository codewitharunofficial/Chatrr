import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../Contexts/auth";

const ViewStoriesTopBar = ({setViewStories, navigation}) => {

    const [auth] = useAuth();
    // const navigation = useNavigation();


  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "10%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        backgroundColor: "transparent",
        paddingVertical: 10,
        paddingTop: -20,
      }}
    >
      <Ionicons
        name="arrow-back"
        size={24}
        color={"white"}
        style={{ marginRight: 10 }}
        onPress={() => setViewStories(false)}
      />
      {!auth?.user?.photo ? (
          <FontAwesome
            name="user-circle"
            color={"lightgray"}
            size={50}
            style={{ marginRight: 10 }}
          />
        ) : (
          <>
            <TouchableOpacity
              onPress={async () =>
                navigation?.navigate("User-Profile", {
                  params: {
                    user: auth.user,
                  },
                })
              }
            >
              <Image
                source={{
                  uri: auth?.user?.photo?.secure_url,
                }}
                style={styles.photo}
              />
            </TouchableOpacity>
          </>
        )}
         <TouchableOpacity
          onPress={() =>
            navigation?.navigate("User-Profile", {
              params: {
                user: auth.user,
              },
            })
          }
          style={{ flex: 1, gap: 5 }}
        >
          <Text
            style={{ fontSize: 18, fontWeight: "bold", alignSelf: "center", color: 'white' }}
          >
            {auth?.user?.name}
          </Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ViewStoriesTopBar;

const styles = StyleSheet.create({
    photo: {
        width: 50,
        height: 50,
        borderRadius: 30,
        marginRight: 10,
      },
});
