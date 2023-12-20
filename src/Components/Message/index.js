import { View, Text, StyleSheet } from 'react-native'
import moment from 'moment'


const Message = ({message}) => {

  return (
    <View style={[styles.container, {
        backgroundColor: message.item.user.role === 'sender' ? '#DCF8C5' : 'white',
        alignSelf: message.item.user.id === 'sender' ? 'flex-end' : 'flex-start',
    }]}>
      <Text>{message.item.text}</Text>
      <Text style={styles.time}>{moment(message.item.createdAt).fromNow()}</Text>

    </View>
  )
}

const styles = StyleSheet.create({
     container: {
        backgroundColor: 'white',
        alignSelf: 'flex-start',
        margin: 5,
        padding: 10,
        borderRadius: 5,
        maxWidth: '80%',
     },
    time: {
        color: 'green',
        alignSelf: 'flex-end',
    }
})

export default Message