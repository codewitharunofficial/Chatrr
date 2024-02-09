import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { useAuth } from "../Contexts/auth";
import { useNavigation } from "@react-navigation/native";

const AccountSettingScreen = () => {
  const [auth] = useAuth();
  const navigation = useNavigation();


  return (
    <View style={{ height: "100%", width: "100%", padding: 10 }}>
      <View style={{ width: "100%" }}>
        <TouchableOpacity
        onPress={() => navigation.navigate("delete-account", {
          params: {
            id: auth.user?._id,
            name: auth?.user?.name
          }
        })}
          style={{
            backgroundColor: "whitesmoke",
            padding: 20,
            borderBottomWidth: 1,
            flexDirection: "row", gap: 10, alignItems: 'center'
          }}
        >
          <Text style={{ color: "red", }}>Delete-Account</Text>
          <AntDesign name="deleteuser" size={24} color={'red'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountSettingScreen;
