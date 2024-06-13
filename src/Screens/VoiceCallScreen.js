// App.js
import React, { Component } from 'react';
// import { useRoute } from '@react-navigation/native';
// import {ZegoUIKitPrebuiltCall, ONE_ON_ONE_VOICE_CALL_CONFIG} from '@zegocloud/zego-uikit-prebuilt-call-rn'
import { StyleSheet, View } from 'react-native';

export default function VoiceCallPage(props) {

    const route = useRoute();

    console.log(route.params?.user);

    // const {userID, name, callID, } = route.params?.user

    const appSign = '534f1cbec9bed50e6fdce71498d4960617badfb7b50aee4c1646c7926abf7974'
    const appID = '2035777999'
    return (
        <View style={styles.container}>
            {/* <ZegoUIKitPrebuiltCall
                appID={appID}
                appSign={appSign}
                userID={userID} // userID can be something like a phone number or the user id on your own user system. 
                userName={name}
                callID={callID} // callID can be any unique string. 

                config={{
                    // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
                    ...ONE_ON_ONE_VOICE_CALL_CONFIG,
                    onOnlySelfInRoom: () => { props.navigation.navigate('Chats') },
                    onHangUp: () => { props.navigation.navigate('Chats') },
                }}
            /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%"
    }
})