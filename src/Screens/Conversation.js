import { View, Text, ImageBackground, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import messages from '../../assets/WhatsApp - Asset Bundle/assets/data/messages.json'
import Message from '../Components/Message';
import InputBox from '../Components/Input/InputBox';

const Conversation = () => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : 'height'} >
    <ImageBackground  src='https://img.freepik.com/premium-photo/concept-important-announcement-with-empty-speech-bubbles_185193-87043.jpg' style={styles.bg} >
      <FlatList
      data={messages}
      renderItem={(item) => <Message message={item} />}
      inverted
      style={styles.list}
      />
      <InputBox/>
    </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
     bg: {
        flex: 1,
     },
     list: {
      padding: 10
     }
})

export default Conversation