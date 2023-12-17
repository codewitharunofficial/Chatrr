import ChatList from "../Components/ChatListItems";
import chats from "../../assets/WhatsApp - Asset Bundle/assets/data/chats.json";
import { FlatList } from "react-native";
import { useAuth } from "../Contexts/auth";

const MainScreen = () => {

  const [auth] = useAuth();

  return (
    <FlatList
      data={chats}
      renderItem={(item) => <ChatList chat={item} />}
      style={{backgroundColor: 'white'}}
    />
  );
};

export default MainScreen;
