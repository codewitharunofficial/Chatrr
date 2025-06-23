import { View, Text, StyleSheet, Button } from 'react-native'
import {AntDesign, MaterialIcons} from '@expo/vector-icons'

const ChatHeader = () => {
  return (
    <View  style={styles.container}>

    <AntDesign  name='back' size={24} color={'blue'} />

    <View style={styles.user} >
        <Text style={styles.name}>Arun</Text>
        <Text style={styles.time}>Last Seen 12:30 PM</Text>
    </View>
    
    <AntDesign name='info' size={24} color={'blue'} />
      
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    name: {
        fontWeight: 'bold'
    }
})

export default ChatHeader