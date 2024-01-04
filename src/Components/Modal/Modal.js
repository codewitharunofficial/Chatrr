import { View, Text } from "react-native";
import React, { useState } from "react";

const Modal = () => {
  const [visible, setVisible] = useState(true);
  return (
    <Modal animationType="fade" transparent={false} visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 22,
        }}
      >
        <View
          style={{
            margin: 20,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text style={{color: 'black'}} >Modal</Text>
        </View>
      </View>
    </Modal>
  );
};

export default Modal;
