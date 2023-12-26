import { View, Text, StyleSheet, Image, Pressable, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../Contexts/auth';
import { AntDesign } from '@expo/vector-icons';

const ContactList = ({contacts}) => {

  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  




  

  return (
   <>

    <Pressable
            key={contacts.item.id}
            style={{
              flexDirection: "row",
              marginHorizontal: 10,
              marginVertical: 20,
            }}
          >
            <View
              style={{
                flex: 1,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: "lightgray",
                flexDirection: "row",
                aligncontacts: "center",
              }}
            >
              <Image
                src={
                  contacts.item.imageAvailable == true ? contacts.item.image.uri : ""
                }
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 30,
                  marginRight: 30,
                  marginBottom: 10,
                }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  marginBottom: 5,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    flex: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {contacts.item.name}
                </Text>
                <Text style={{ color: "grey" }}>
                  {contacts.item.phoneNumbers &&
                    contacts.item.phoneNumbers[0] &&
                    contacts.item.phoneNumbers[0].number}
                </Text>
              </View>
            </View>
          </Pressable>
          </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 10,
    borderBottomWidth: 1,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  name: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
  },
  subTitle: {
    color: "grey",
  },
});
export default ContactList