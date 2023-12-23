import { View, Text, ImageBackground, StyleSheet, FlatList, } from 'react-native'
import React, { useState } from 'react'
import Message from '../Components/Message';
import InputBox from '../Components/Input/InputBox';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import axios from 'axios';
import socketServcies from '../Utils/SocketServices';
import { useIsFocused } from '@react-navigation/native';

const Conversation = () => {
  
  const [reciever, setReciever] = useState('');
  const [convoId, setConvoId] = useState('');
  const [sender, setSender] = useState('');
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState([]);
  const isFocused = useIsFocused();

  const route = useRoute();
  const navigation = useNavigation();


  useEffect(() => {
    navigation.setOptions({title: route.params.name}, setReciever(route.params.receiver), setConvoId(route.params.id), setSender(route.params.sender));
  }, [route.params.name]);



  const fetchMessages = async () => {

    try {
      const {data} = await axios.post('http://192.168.247.47:6969/api/v1/messages/fetch-messages', {sender, reciever});
    setMessages(data.messages);
    console.log(messages);
    } catch (error) {
      console.log(error.message);
    }
  }

    useEffect(() => {
      if(isFocused){
        fetchMessages();
      }
    }, [isFocused, chat, sender, reciever]);




  useEffect(() => {
    socketServcies.initializeSocket()
  }, []);


  useEffect(() => {
    socketServcies.on('recieved-message', (msg) => {
      let cloneArray = [...messages]
      setChat(cloneArray.concat(msg.newMessage));
      
    })
  }, []);
  

  return (

    <>
    <ImageBackground  src='https://img.freepik.com/premium-photo/concept-important-announcement-with-empty-speech-bubbles_185193-87043.jpg' style={styles.bg} >
      <FlatList
      data={messages}
      renderItem={(items) => <Message message={items} receiver={reciever} />}
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
      padding: 10,
      marginVertical: 10
     }
})

export default Conversation