import {createContext, useContext, useState} from 'react';

const MessageContext = createContext();

const MessageProvider = ({children}) => {

const [isReplying, setIsReplying] = useState(false);
const [repliedMessage, setRepliedMessage] = useState();
const [selectedMessage, setSelectedMessage] = useState({});

return(

    <MessageContext.Provider value={[isReplying, setIsReplying, selectedMessage, setSelectedMessage, repliedMessage, setRepliedMessage]} >
         {children}
    </MessageContext.Provider>

);
}

const useReply = () => useContext(MessageContext);

export {MessageProvider, useReply}