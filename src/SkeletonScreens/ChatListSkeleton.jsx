import { StyleSheet, View } from "react-native";
import React from "react";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
  Shine,
} from "rn-placeholder";

const ChatListSkeleton = () => {
  return (
    <Placeholder Animation={Fade}>
      <View style={[styles.container]}>
        <PlaceholderMedia style={styles.photo} />
        <View style={styles.content}>
          <View style={styles.row}>
            <PlaceholderLine width={30} />
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <PlaceholderLine width={50} />
            </View>
        </View>
      </View>
    </Placeholder>
  );
};

export default ChatListSkeleton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  name: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
  },
  subTitle: {
    color: "grey",
  },
});
