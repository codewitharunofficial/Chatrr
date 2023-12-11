import ChatList from "../Components/ChatListItems";
import chats from "../../assets/WhatsApp - Asset Bundle/assets/data/chats.json";
import { FlatList } from "react-native";

const MainScreen = () => {
  return (
    <FlatList
      data={chats}
      renderItem={(item) => <ChatList chat={item} />}
    />
  );
};

export default MainScreen;
