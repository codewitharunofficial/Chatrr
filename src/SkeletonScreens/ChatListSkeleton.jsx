import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated } from "react-native";

const ChatListSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const backgroundColor = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E0E0E0", "#F5F5F5"],
  });

  return (
    <View style={styles.container}>
      {/* Profile Picture Placeholder */}
      <Animated.View style={[styles.photo, { backgroundColor }]} />

      {/* Chat Info Placeholder */}
      <View style={styles.content}>
        <View style={styles.row}>
          <Animated.View style={[styles.line, { width: "30%", backgroundColor }]} />
        </View>
        <View style={styles.bottomRow}>
          <Animated.View style={[styles.line, { width: "50%", backgroundColor }]} />
        </View>
      </View>
    </View>
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
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  bottomRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  line: {
    height: 10,
    borderRadius: 5,
  },
});
