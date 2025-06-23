import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated } from "react-native";

const ProfileSkeleton = () => {
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
      <View style={styles.profileContainer}>
        <Animated.View style={[styles.profileImage, { backgroundColor }]} />
      </View>

      {/* Placeholder Content */}
      <View style={styles.content}>
        <Animated.View style={[styles.line, { height: 40, backgroundColor }]} />
        <Animated.View style={[styles.line, { height: 40, backgroundColor }]} />
        <Animated.View style={[styles.line, { height: 40, backgroundColor }]} />
      </View>
    </View>
  );
};

export default ProfileSkeleton;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "90%",
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  profileContainer: {
    alignSelf: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: "10%",
    marginTop: "15%",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  content: {
    width: "100%",
    height: "80%",
    marginTop: 80,
  },
  line: {
    width: "100%",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    marginVertical: 10,
    borderRadius: 5,
  },
});
