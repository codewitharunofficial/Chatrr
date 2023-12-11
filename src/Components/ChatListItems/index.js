import {Text, View, Image, StyleSheet} from 'react-native'

const ChatList = () => {
  return (
    <View style={styles.container}>
      <Image src='https://cdn2.vectorstock.com/i/1000x1000/98/56/cute-little-boy-cartoon-vector-21539856.jpg' style={styles.image} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.name}>Arun</Text>
          <Text numberOfLines={1} style={styles.subTitle}>12.30 P.M</Text>
        </View>
          <Text numberOfLines={2} style={styles.subTitle}>Hi There, I'm Using Whatsapp 2.0 Created by Arun. He's a good developer & actuall a more of a good developer</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 10,

    height: 70
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 10
  },
  content: {
    flex: 1,
    // backgroundColor: 'teal',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'lightgray'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1
  },
  subTitle: {
    color: 'grey'
  }

})

export default ChatList
