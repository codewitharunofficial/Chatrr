import ChatList from "../Components/ChatListItems";
import { FlatList } from "react-native";
import { useAuth } from "../Contexts/auth";
import { useEffect, useState } from "react";
import axios from "axios";

const MainScreen = () => {

  const [auth] = useAuth();
  const [chats, setChats] = useState([]);

  const getChats = async () => {
      const {data} = axios.get(`http://192.168.161.47:6969/api/v1/messages/get-all-chats/${auth.user._id}`);
      console.log(data);
  }

  useEffect(() => {
       getChats
  }, [auth.user._id]);

  return (
    <FlatList
      data={chats}
      renderItem={(item) => <ChatList chat={item} />}
      style={{backgroundColor: 'white'}}
    />
  );
};

export default MainScreen;
