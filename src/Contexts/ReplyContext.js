import { createContext, useContext, useState } from "react";

const ReplyContext = createContext();

const ReplyProvider = ({ children }) => {
    const [repliedMessage, setRepliedMessage] = useState(null);
    const [isReplying, setIsReplying] = useState(false);

    return (
        <ReplyContext.Provider value={{ repliedMessage, setRepliedMessage, isReplying, setIsReplying }}>
            {children}
        </ReplyContext.Provider>
    );
};

const useReplyMessage = () => {
    const context = useContext(ReplyContext);
    if (!context) throw new Error("useReplyMessage must be used within a ReplyProvider");
    return [context.repliedMessage, context.setRepliedMessage];
};

const useReply = () => {
    const context = useContext(ReplyContext);
    if (!context) throw new Error("useReply must be used within a ReplyProvider");
    return [context.isReplying, context.setIsReplying];
};

export { ReplyProvider, useReplyMessage, useReply };