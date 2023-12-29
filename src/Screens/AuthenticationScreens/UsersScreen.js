import { View, TextInput, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Contexts/auth';
import axios from 'axios';
import UsersList from '../../Components/Users/UsersList';
import { AntDesign } from '@expo/vector-icons';

const UsersScreen = () => {


    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
  const [auth] = useAuth();

    const searchUser = async () => {
        try {
          const { data } = await axios.get(
            `http://192.168.82.47:6969/api/v1/users/search-user/${search}`
          );
          setUsers(data?.searchedResults);
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {
        searchUser();
      }, [search]);
    

  return (
  <>
    <View
        style={{
          width: "100%",
          height: "10%",
          marginTop: 20,
          marginBottom: 5,
          justifyContent: "space-between",
          flexDirection: "row",
          paddingHorizontal: 20,
        }}
      >
        <TextInput
          onChangeText={setSearch}
          placeholder="Search user..."
          editable={true}
          style={{
            height: "80%",
            width: "85%",
            backgroundColor: "whitesmoke",
            alignSelf: "center",
            borderRadius: 10,
            paddingHorizontal: 10,
          }}
        ></TextInput>
        <AntDesign name="search1" size={30} style={{ alignSelf: "center" }} />
      </View> 


    <FlatList
    data={users}
    renderItem={(items) => <UsersList users={items} />}
    />
    </>
  )
}

export default UsersScreen