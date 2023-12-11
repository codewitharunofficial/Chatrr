import { View, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';


const InputBox = () => {

  const [input, setInput] = useState('');

  const onSend = () => {
    console.warn('Sending a Message', input);

    setInput('');
  }

  return (
    <View style={styles.container}>
        <AntDesign name='plus' size={24} color={'royalblue'} style={styles.plus} />

        <TextInput value={input} onChangeText={setInput}  placeholder='Type Here...' style={styles.text} />
        
      <MaterialIcons onPress={onSend} name='send' size={24} color={'white'} />
    </View>
  )
}

const styles = StyleSheet.create({
       container: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        backgroundColor: 'whitesmoke',
        padding: 5,
        paddingHorizontal: 10,
       },
       plus: {
        padding: 5,
        backgroundColor: 'royalblue',
        borderRadius: 7,
        overflow: 'hidden',
       }
       ,
       text: {
        backgroundColor: 'white',
        padding: 5,
        borderColor: 'lightgray',
        paddingHorizontal: 10,
        borderWidth: 50,
        borderWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 10,
       }
})

export default InputBox