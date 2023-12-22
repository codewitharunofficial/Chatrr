import { View, Text, ImageBackground, StyleSheet, FlatList, } from 'react-native'
import React, { useState } from 'react'
import messages from '../../assets/WhatsApp - Asset Bundle/assets/data/messages.json'
import Message from '../Components/Message';
import InputBox from '../Components/Input/InputBox';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

const Conversation = ({messages}) => {
  
  const [reciever, setReciever] = useState('');
  const [convoId, setConvoId] = useState('');
  const [sender, setSender] = useState('');

  const route = useRoute();
  const navigation = useNavigation();


  useEffect(() => {
    navigation.setOptions({title: route.params.name}, setReciever(route.params.receiver), setConvoId(route.params.id), setSender(route.params.sender));
  }, [route.params.name]);



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
      <InputBox reciever={reciever} convoId={convoId} sender={sender} />
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