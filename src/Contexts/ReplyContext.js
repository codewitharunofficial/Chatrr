import {createContext, useContext, useState} from 'react';

const ReplyContext = createContext();

const ReplyProvider = ({children}) => {

const [repliedMessage, setRepliedMessage] = useState();
return(

    <ReplyContext.Provider value={[repliedMessage, setRepliedMessage]} >
         {children}
    </ReplyContext.Provider>

);
}

const useReplyMessage = () => useContext(ReplyContext);

export {ReplyProvider, useReplyMessage}