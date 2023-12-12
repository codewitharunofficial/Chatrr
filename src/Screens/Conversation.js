import { View, Text, ImageBackground, StyleSheet, FlatList, } from 'react-native'
import React from 'react'
import messages from '../../assets/WhatsApp - Asset Bundle/assets/data/messages.json'
import Message from '../Components/Message';
import InputBox from '../Components/Input/InputBox';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

const Conversation = () => {


  const route = useRoute();
  const navigation = useNavigation();


  useEffect(() => {
    navigation.setOptions({title: route.params.name })
  }, [route.params.name])


  return (

    <>
    <ImageBackground  src='https://img.freepik.com/premium-photo/concept-important-announcement-with-empty-speech-bubbles_185193-87043.jpg' style={styles.bg} >
      <FlatList
      data={messages}
      renderItem={(item) => <Message message={item} />}
      inverted
      style={styles.list}
      />
    </ImageBackground>
      <InputBox/>
      </>
    
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