import ChatList from "../Components/ChatListItems";
import { FlatList } from "react-native";
import { useAuth } from "../Contexts/auth";
import { useEffect, useState } from "react";
import axios from "axios";

const MainScreen = () => {

  const [auth] = useAuth();
  const [chats, setChats] = useState([]);

  const id = auth?.user?._id;

  const getChats = async () => {
    try {
      console.log(id)
    const {data} = await axios.get(`https://android-chattr-app.onrender.com/api/v1/messages/chats/${id}`);
    // console.log(data);
    if(data?.success === true) {
      setChats(data);
      console.log(data);
    }
    } catch (error) {
      console.log(error.message);
    }
}

useEffect(() => {
     getChats();
}, [id]);

  return (
    <FlatList
      data={chats}
      renderItem={(items) => <ChatList chat={items} />}
      style={{backgroundColor: 'white'}}
    />
  );
};

export default MainScreen;
