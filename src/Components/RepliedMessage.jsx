import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const RepliedMessage = ({message}) => {
  return (
    <View style={styles.container} >
        <View style={styles.messageReplied} >
      <Text style={{padding: 3, fontSize: 14, fontWeight: '400'}} >{message?.message?.message}</Text>
        </View>
        <View>
            <Text style={styles.Text} >{message?.reply}</Text>
        </View>
    </View>
  )
}

export default RepliedMessage

const styles = StyleSheet.create({
    messageReplied: {
        borderColor: 'white',
        borderWidth: StyleSheet.hairlineWidth,
        padding: 2,
        backgroundColor: 'lightblue',
        width: '100%',
        margin: 0,
    },
    container : {
        minWidth: '50%',
    },
    Text : {
        color: 'white',
        alignSelf: 'flex-end',
        marginTop: 8,
        fontSize: 14,
    }
})