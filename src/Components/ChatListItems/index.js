import moment from 'moment';
import {Text, View, Image, StyleSheet} from 'react-native'

const ChatList = ({ chat }) => {
  return (
    <View style={styles.container}>
      <Image src={chat.item.user?.image} style={styles.photo} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.name}>{chat.item?.user?.name}</Text>
          <Text numberOfLines={1} style={styles.subTitle}>{moment(chat.item?.lastMessage?.createdAt).fromNow()}</Text>
        </View>
          <Text numberOfLines={2} style={styles.subTitle}>{chat.item?.lastMessage?.text}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 10,
    height: 70,
  },
  photo: {
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
