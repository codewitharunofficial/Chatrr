import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  Fade,
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
} from "rn-placeholder";

const ProfileSkeleton = () => {
  return (
    <Placeholder Animation={Fade}>
      <View
        style={{
          width: "100%",
          height: "90%",
          alignSelf: "center",
          marginTop: 20,
          borderRadius: 10,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            display: "flex",
            width: "40%",
            height: "20%",
            alignSelf: "center",
            borderRadius: 60,
            marginBottom: "10%",
            marginTop: "15%",
            alignItems: "center",
          }}
        >
          <PlaceholderMedia
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        </View>
          <View style={{ width: "100%", height: "80%", marginTop: 80 }}>
            <View style={styles.TouchableOpacity} >
             <PlaceholderLine  height={40} />
            </View>
            <View style={styles.TouchableOpacity} >
             <PlaceholderLine  height={40} />
            </View>
            <View style={styles.TouchableOpacity} >
             <PlaceholderLine  height={40} />
            </View>
          </View>
      </View>
    </Placeholder>
  );
};

export default ProfileSkeleton;

const styles = StyleSheet.create({
    TouchableOpacity: {
        width: "100%",
        height: "auto",
        alignItems: "center",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        marginVertical: 10
    }
});
